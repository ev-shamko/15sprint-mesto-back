// здесь будут роуты для регистрации и залогинивания, потому что они не требуют токена
const notokenAuth = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUser, login } = require('../controllers/users');
const regExpImgUrl = require('../middlewares/img-regexp');

// *** POST .../signup
// Залогиниться (сначала валидируем Joi)
notokenAuth.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);

// *** POST .../signin
// Создать нового пользователя (сначала валидируем Joi)
notokenAuth.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
      avatar: Joi.string().required().pattern(regExpImgUrl),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser,
);

module.exports = notokenAuth;

/*
Пример корректного body для регистрации:

POST .../signup
{
    "name": "User WithPassword",
    "about": "Some userinfo",
    "avatar": "https://my.site/ava123.jpg",
    "email": "testuser@yandex.ru",
    "password": "12345678"
}

Пример запроса для залогинивания:

POST .../signin

{
    "email": "testuser@yandex.ru",
    "password": "12345678"
}
*/
