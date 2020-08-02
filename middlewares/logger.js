// Модуль для создания логов
// Будем логировать только запросы к серверу и происходящие на нём ошибки

const winston = require('winston');
const expressWinston = require('express-winston');

// создадим логгер запросов
const requestLogger = expressWinston.logger({
  // настраиваем, куда писать лог
  transports: [
    new winston.transports.File({ filename: 'request.log' }),
    // можно добавить транспорты для вывода логов в консоль или в сторонние сервисы аналитики
  ],
  format: winston.format.json(),
});

// логгер ошибок
const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: 'error.log' })],
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
};
