const mongoose = require('mongoose');
const regExpImgUrl = require('../middlewares/img-regexp');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    // кастомная валидация ссылки на аватар
    validate: {
      validator: (url) => regExpImgUrl.test(url), // Пришедший url проверяется регуляркой
      message:
        'Вы предоставили неправильный url иллюстрации. Пример корректного url: https://my.site/pic123.jpg',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId, // сюда запишется ссылка на создателя карточки
    required: true,
    ref: 'user', // это обязательно
  },
  likes: { // пока функционал лайков не реализован
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
