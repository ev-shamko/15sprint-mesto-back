const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // модуль хеширует пароли
const validator = require('validator'); // этот модуль реализует валидацию. Можно переписать валидацию url аватара

// регулярное выражение для валидации ссылки на аватар юзера.
// Начинается на http:// или https://  --- затем адрес --- заканчивается на что-то типа /ava123.jpg (обязательно слеш, затем буквы и/или цифры, точка, формат из 3+ букв)
// Подробнее рассмотреть регулярку можно на https://extendsclass.com/regex-tester.html
const regExpImgUrl = /^(http:\/\/|https:\/\/)(www\.)?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|\w+\d*-*\w*\d*-*\w*\d*(\.\w+|:\d{2,5}))((\.\w+)*|(:\d{2,5})?)(\/\w*\W*)*(\/((\w|\d)(\w|\d)*)\.\w{3,})$/;

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

module.exports = mongoose.model('user', userSchema);
