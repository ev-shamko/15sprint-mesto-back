const express = require('express');
const mongoose = require('mongoose'); // ODM пакет для взаимодействия с mongoDB
const helmet = require('helmet'); // проставляет заголовки для безопасности: set HTTP response headers
const bodyParser = require('body-parser'); // внимание! обязателен! И ниже его app.use -аем дважды
const cookieParser = require('cookie-parser'); // читает куки и разбирает полученную строку в объект

const { PORT = 3000 } = process.env;
const app = express();
app.use(helmet()); // рекомендуется использовать как можно раньше
const { auth } = require('./middlewares/auth');

// эти две строчки обязательные. Они собираюют из пакетов объект req.body
// без них req.body = undefined
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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

// app.use('/register', notokenAuth);
app.use('/', notokenAuth);

// добавляем авторизационный миддлвэр
// всем роутам ниже этой строчки будет добавляться токен для авторизации в req.user._id
app.use(auth);

// задействуем роуты для юзеров и карточек
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

// роут для плохого запроса в адресной строке
// в качестве аргумента передаём "/" - именно так обозначаем всё что не /users и не /cards
app.use('/', (req, res) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден. Возможно, вы обращаетесь к фронтенду, который в данной итерации отключён' });
});

/* ********************************************* */

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
