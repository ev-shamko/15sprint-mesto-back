const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // будет сигналить, если нарушается unique: true у поля
const bcrypt = require('bcryptjs'); // модуль хеширует пароли
const validator = require('validator'); // этот модуль реализует валидацию. Можно переписать валидацию url аватара
const regExpImgUrl = require('../middlewares/img-regexp');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    // кастомная валидация ссылки на аватар
    validate: {
      validator: (url) => regExpImgUrl.test(url), // Пришедший url проверяется регуляркой
      message: (props) => `${props.value} - это некорректный url для аватара. Пример корректного url: https://my.site/ava123.jpg`,
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: (props) => `${props.value} некорректный email!`,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false, // по умолчанию хеш пароля юзера не вернётся из базы
    // но в случае аутентификации хеш пароля будет нужен
  },
});

// добавим метод findUserByCredentials схеме пользователя:
// он делает проверку почты и пароля частью схемы пользователя, Карл!
// принимает на вход почту и пароль - возвращает объект пользователя или ошибку
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password') // this — это модель User
    .then((user) => {
      if (!user) { // если не нашёлся пользователь, то отклоняем промис
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      // если пользователь нашёлся, сравниваем хеши паролей:
      // bcrypt принимает на вход пароль и его хеш, считает хеш 1 и сравнивает с хешем 2
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user; // user находится в области видимости .then, поэтому user доступен
        });
    });
};

/*
этот плагин выдаёт читабельную ошибку, если какое-то поле со свойством unique='true'
не прошло валидацию. Посмотреть ошибку можно, сделав console.log(err) в ./controllers/users.js
в методе login в том месте, где мы обрабатываем ошибку валидации
*/
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', userSchema);
