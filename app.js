const express = require('express');
const mongoose = require('mongoose'); // ODM пакет для взаимодействия с mongoDB
const helmet = require('helmet'); // проставляет заголовки для безопасности: set HTTP response headers
const bodyParser = require('body-parser'); // внимание! обязателен! И ниже его app.use -аем дважды
const cookieParser = require('cookie-parser'); // читает куки и разбирает полученную строку в объект
const { errors } = require('celebrate'); // тестирует запросы в роут '/' и работает с ошибками от celebrate

const NotFoundError = require('./errors/err-not-found'); // здесь мы ожидаем только 404 или дефолтную 500 ошибку

const { PORT = 3000 } = process.env;
const app = express();
app.use(helmet()); // рекомендуется использовать как можно раньше
const { auth } = require('./middlewares/auth');

// эти две строчки обязательные. Они собираюют из пакетов объект req.body
// без них req.body = undefined
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// без этого пакета сервер не сможет работать с куки и вся авторизация накроется ошибкой
app.use(cookieParser());

/* **************** Соединение с локальной БД ********************** */

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true, // убираем бесячее сообщение в консоли
});

/* **************** РОУТЫ ********************** */

// импорт роутов для работы с карточками, с базой юзеров, для залогинивания/регистрации
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const notokenAuth = require('./routes/userauth');

app.use('/', notokenAuth);

// добавляем авторизационный миддлвэр
// всем роутам ниже этой строчки будет добавляться токен для авторизации в req.user._id
app.use(auth);

// задействуем роуты для юзеров и карточек
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

// роут для плохого запроса в адресной строке
// в качестве аргумента передаём "/" - именно так обозначаем всё что не /users и не /cards
app.use('/', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден. Возможно, вы обращаетесь к отключённому фронтенду или к несуществующей странице'));
});

/*  ********* Обработчик ошибок ******* */

// говорим серверу, чтобы вот этим он обрабатывал ошибки, создаваемые модулем celebrate
// блин, я вообще не понимаю, как именно сюда приходят ошибки от celebrate, грустно :(
app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // в next передаём экземпляр ошибки, чтобы она попала в ответ:
  // если у ошибки нет статуса, выставляем 500 и считаем произошедшее ошибкой сервера
  const { statusCode = 500, message } = err;

  // если в других модулях вызывается next() с аргументом-ошибкой,
  // то в этот обработчик приходит запрос уже со статусом и сообщением
  // иначе стандартно возвращаем статус 500 (это поведение описано строчкой выше)
  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
});

/* ********************************************* */

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
