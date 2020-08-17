const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // будет сигналить, если нарушается unique: true у поля
const bcrypt = require('bcryptjs'); // модуль хеширует пароли
const validator = require('validator'); // модуль для валидации мыла в нашей схеме

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: (props) => `${props.value} некорректный email!`,
    },
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  password: {
    type: String,
    required: true,
    minlength: 8, // мб ещё ввести макс.ограничение?
    select: false, // по умолчанию хеш пароля юзера не вернётся из базы
    // но в случае аутентификации хеш пароля будет нужен
  },
});

// этот метод схемы пользователя проверяет почту и пароль.
// если что-то не совпало, возвращает в ответе объект с сообщением об ошибке
// если совпало, возвращает user, из которого мы потом слепим токен авторизации
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
этот плагин выдаёт читабельный объект ошибки, если какое-то поле схемы со свойством unique='true'
не прошло валидацию. Посмотреть ошибку можно, сделав console.log(err) в ./controllers/users.js
в методе login в том месте, где мы обрабатываем ошибку валидации
*/
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', userSchema);
