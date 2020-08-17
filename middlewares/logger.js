// Логироуются: 1) запросы к серверу; 2) происходящие на нём ошибки

const winston = require('winston');
const expressWinston = require('express-winston');
const fs = require('fs');
const path = require('path');

const logsDirectory = './logs';

// если нет папки ./logs, то она будет создана
if (!fs.existsSync(logsDirectory)) {
  console.log('Haven`t found logs directory. Creating a new one');
  fs.mkdirSync(logsDirectory);
}

// создадим логгер запросов
const requestLogger = expressWinston.logger({
  // настраиваем, куда писать лог
  transports: [
    new winston.transports.File({ filename: path.join(logsDirectory, '/request.log') }),
    // можно добавить транспорты для вывода логов в консоль или в сторонние сервисы аналитики
  ],
  format: winston.format.json(),
});

// логгер ошибок
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: path.join(logsDirectory, 'error.log') }),
  ],
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
};
