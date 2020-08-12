const jwt = require('jsonwebtoken');
const jwtDevKey = require('../jwskey'); // этот ключ используется только когда NODE_ENV !== "production"
const AuthorizationError = require('../errors/err-auth'); // подключаем конструктор ошибки 401

const { NODE_ENV, JWT_SECRET } = process.env; // на проде у нас JWT_SECRET, а не jwtDevKey

// это миддлвара для авторизации пользователя (проверка JWT)
module.exports.auth = (req, res, next) => {
  if (!req.cookies.jwt) { // если токена нет в заголовке запроса
    return next(new AuthorizationError('Необходима авторизация. В заголовке запроса не пришёл токен.'));
  }
  const token = req.cookies.jwt;

  let payload; // объявляем переменную для пэйлоуда токена в этой области видимости

  try {
    // это верификация токена: метод jwt.verify вернёт пейлоуд токена, если тот прошёл проверку
    payload = jwt.verify(
      token,
      (NODE_ENV === 'production' ? JWT_SECRET : jwtDevKey), // если мы на проде и на месте .env файл, то будет использоваться ключ из JWT_SECRET
    );
  } catch (err) {
    return next(new AuthorizationError('Необходима авторизация. Токен не прошёл проверку. Попробуйте залогиниться повторно'));
  }

  // верефицированный токен записываем в заголовок
  // записываем в объект запроса пейлоуд токена, благодаря чему
  // следующие за app.use(auth) запросы будут авторизированы
  req.user = payload;

  return next();
};
