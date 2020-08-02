const bcrypt = require('bcryptjs'); // модуль для хеширования пароля
const jwt = require('jsonwebtoken'); // создаёт JSON Web Token
const User = require('../models/user'); // модель пишем с заглавной буквы
const jwsKey = require('../jwskey');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(400).send({ message: err.message }));
  // на будущее: надо думать лучше про то, какой статус ошибки нужно выставлять
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((userFound) => {
      if (!userFound) {
        return res.status(404).send({
          message: `Пользователя с id${req.params.userId} нет в базе данных`,
        });
      }
      return res.send(userFound); // если всё нормально нашлось, возвращаем юзердату
    })
    .catch((err) => res.status(400).send({ message: err.message }));
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt
    .hash(password, 10) // 10 - это длина соли перед паролем
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })) // в это месте prettier форматирует хрень: ломает код, ставя запятую между скобками. WTF?
    .then((user) => {
      res.status(201).send({ _id: user._id, email: user.email });
    })
    .catch((err) => res.status(400).send({ message: err.message }));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => { // если аутентификация прошла успешно, вернётся объект пользователя
      // в пейлоуд токена записываем только _id
      const token = jwt.sign({ _id: user._id }, jwsKey, { expiresIn: '7d' });
      // отправляем токен браузеру. Браузер сохранит токен в куках
      console.log(`User ${user._id} is logging in`);
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true, // по рекомендации из задания, чтобы куки было не прочесть через JS
          sameSite: true, // отдаёт куки только родному домену, если браузер поддерживает фичу
        })
        .end();
    })
    .catch((err) => {
      res.status(401).send({ message: err.message }); // ошибка аутентификации
    });
};
