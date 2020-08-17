const mongoose = require('mongoose');
const validator = require('validator'); // модуль для валидации

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    // minlength?
  },
  text: {
    type: String,
    required: true,
    // minlength?
  },
  date: { // дата СТАТЬИ
    type: Date,
    required: true,
    // ? default - а что там будет возвращать api новостей в плане даты?
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (urlToImage) => validator.isURL(urlToImage),
      message: (props) => `${props.value} некорректная ссылка на оригинал статьи`,
    },
    // ! это поле можно сделать уникальным потом
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (urlToImage) => validator.isURL(urlToImage),
      message: (props) => `${props.value} некорректная ссылка на изображение для статьи`,
    },
  },
  keyword: {
    type: String,
    required: true,
    minlength: 2,
    // minlength?
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId, // сюда запишется ссылка на создателя карточки
    required: true,
    ref: 'user',
    // select: false, // хз как удалять статью с этой настройкой
  },
});

module.exports = mongoose.model('article', articleSchema);
