/* ***************** ИМПОРТЫ ************************* */

const bcrypt = require('bcryptjs'); // модуль для хеширования пароля
const jwt = require('jsonwebtoken'); // создаёт JSON Web Token
const User = require('../models/user'); // модель пишем с заглавной буквы
const jwtDevKey = require('../jwskey'); // этот ключ используется только когда NODE_ENV !== "production"

// импорт собственных конструкторов ошибок 400, 401, 404
const BadRequestError = require('../errors/err-bad-req');
const AuthorizationError = require('../errors/err-auth');
// const NotFoundError = require('../errors/err-not-found');

const { NODE_ENV, JWT_SECRET } = process.env; // на проде у нас JWT_SECRET, а не jwtDevKey

/* ******************************************************* */

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send({
      email: user.email,
      name: user.name,
    }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    email, name, password,
  } = req.body;

  // чтобы не хэшировать пустую строку вместо пароля
  if (!password || password.length < 8) {
    throw new BadRequestError('Ошибка регистрации: вы не ввели пароль, либо он короче 8 символов.');
  }

  bcrypt.hash(password, 10) // 10 - это длина соли перед паролем
    .then((hash) => {
      // cоздаём нового пользователя
      User.create({
        email, name, password: hash,
      })
      // и после успешного создания возвращаем сообщение о том, что всё создалось
        .then((user) => {
          res.status(201).send({
            message: 'Новый пользователь успешно создан',
            data: {
              _id: user._id,
              email: user.email,
              name: user.name,
            },
          });
        })
        // но если новый пользователь не был создан по юзер-схеме, то возвращаем ошибку
        .catch((err) => {
          if (err.name === 'ValidationError') {
            // здесь обоработаем только 1 ошибку валидации: нарушение уникальности email
            // из объекта ошибки валидации достаём свойства err.errors.email и err.errors.email.kind
            // объект ошибки валидации создан плагином mongoose-unique-validator (в ./models/users)
            if (err.errors.email && err.errors.email.kind === 'unique') {
              // console.log(err); // можно посмотреть объект ошибки от плагина
              throw new BadRequestError('Ошибка! Пользователь с таким email уже есть, поэтому новый пользователь не был создан');
            } else {
              // обработка прочих ошибок валидации
              throw new BadRequestError('При создании нового пользователя произошла ошибка валидации. Проверьте правильность отправляемых в req.body данных');
            }
          } else {
            next(err);
          }
        })
        .catch(next);
    })
    .catch(next); // стандартная ошибка 500; эквивалентно .catch(err => next(err));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Данные пользователя введены не полность. Необходимы и email и пароль, чтобы авторизироваться');
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // в пейлоуд токена записываем только _id !
      const token = jwt.sign(
        { _id: user._id },
        (NODE_ENV === 'production' ? JWT_SECRET : jwtDevKey), // если мы на проде (найден .env файл), то будет использоваться ключ из JWT_SECRET
        { expiresIn: '7d' },
      );

      // отправляем токен браузеру. Браузер сохранит токен в куках
      console.log(`User ${user._id} is logging in`);
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true, // по рекомендации из задания, чтобы куки было не прочесть через JS
          sameSite: true, // отдаёт куки только родному домену, если браузер поддерживает эту фичу
        })
        .send({ message: 'Вы успешно залогинились' })
        .end();
    })
    .catch(() => {
      next(new AuthorizationError('Ошибка аутентификации. Что-то не так с логином и/или паролем'));
    });
};
