const mongoose = require('mongoose');

// регулярное выражение для валидации ссылки на картинку для карточки.
// Начинается на http:// или https://  --- затем адрес --- заканчивается на что-то типа /pic123.jpg (обязательно слеш, затем буквы и/или цифры, точка, формат из 3+ букв)
// Подробнее рассмотреть регулярку можно на https://extendsclass.com/regex-tester.html
const regExpImgUrl = /^(http:\/\/|https:\/\/)(www\.)?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|\w+\d*-*\w*\d*-*\w*\d*(\.\w+|:\d{2,5}))((\.\w+)*|(:\d{2,5})?)(\/\w*\W*)*(\/((\w|\d)(\w|\d)*)\.\w{3,})$/;

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
