/* **************** Импорт модулей ********************** */

require('dotenv').config();
const express = require('express');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser'); // обязателен! читает куки и разбирает полученную строку в объект
const mongoose = require('mongoose'); //
const helmet = require('helmet'); // проставляет заголовки HTTP
const bodyParser = require('body-parser'); // обязателен!
const { requestLogger, errorLogger } = require('./middlewares/logger'); // импортируется последним!

/* **************** Сервер ********************* */

const { PORT = 3000 } = process.env;
const app = express();
app.use(helmet()); // рекомендуется использовать как можно раньше

// без этих двух строчек req.body = undefined
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// без этого пакета сервер не сможет работать с куки и вся авторизация накроется ошибкой
app.use(cookieParser());
app.use(requestLogger); // логгер реквестов подключаем выше всех обработчиков роутов

/* **************** Соединение с локальной БД ********************** */

mongoose.connect('mongodb://localhost:27017/newsExplorerDB', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true, // убираем бесячее сообщение в консоли
});

/* **************** РОУТЫ ********************** */

const notokenAuth = require('./routes/auth');
const usersRouter = require('./routes/users');
const articlesRouter = require('./routes/articles');
const serverIternalError = require('./errors/err-server');
const NotFoundError = require('./errors/err-not-found'); // ошибка 404 для плохого запроса
const { auth } = require('./middlewares/auth');

// тестовый роут, роняет сервер. Проверяем, как сервер потом сам поднимется.
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', notokenAuth); // создание нового пользователя и авторизация для получения токена

// добавляем авторизационный миддлвэр:
// всем роутам ниже этой строчки будет добавляться токен для авторизации в req.user._id
app.use(auth);

app.use('/', usersRouter);
app.use('/', articlesRouter);

// роут для плохого запроса в адресной строке
// в качестве аргумента передаём "/" - именно так обозначаем всё что не /users и не /cards
app.use('/', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден. Возможно, вы обращаетесь к отключённому фронтенду или к несуществующей странице'));
});

/*  ********* Обработчик ошибок ******* */

app.use(errorLogger); // подключаем логгер ошибок выше всех ошибок
app.use(errors()); // обработчик ошибок celebrate, подключаем именно тут

// ошибка 500. Этот код обрабатывает все "неучтённые" ошибки
app.use(serverIternalError);

/* ********************************************* */

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
