const jwt = require('jsonwebtoken');
const jwsKey = require('../jwskey');
const AuthorizationError = require('../errors/err-auth'); // подключаем конструктор ошибки 401

// это миддлвара для авторизации пользователя (проверка JWT)
module.exports.auth = (req, res, next) => {
  if (!req.cookies.jwt) { // если токена нет в заголовке запроса
    return next(new AuthorizationError('Необходима авторизация. В заголовке запроса не пришёл токен.'));
  }
  const token = req.cookies.jwt;

  let payload; // объявляем переменную для пэйлоуда токена в этой области видимости

  try {
    // это верификация токена: метод jwt.verify вернёт пейлоуд токена, если тот прошёл проверку
    payload = jwt.verify(token, jwsKey);
  } catch (err) {
    return next(new AuthorizationError('Необходима авторизация. Токен не прошёл проверку. Попробуйте залогиниться повторно'));
  }

  // верефицированный токен записываем в заголовок
  // записываем в объект запроса пейлоуд токена, благодаря чему
  // следующие за app.use(auth) запросы будут авторизированы
  req.user = payload;

  return next();
};
