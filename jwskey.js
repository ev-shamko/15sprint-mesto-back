// В этом модуле содержится невероятно секретный ключ подписи
// Он используется модулем 'jsonwebtoken', который создаёт JWS-токен
// и верифицирует его (т.е. расшифровывает обратно для авторизации из кук без ввода пароля)
const jwsKey = 'very-strong-secret-key';

module.exports = jwsKey;
