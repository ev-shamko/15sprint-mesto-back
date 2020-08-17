const notokenAuth = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUser, login } = require('../controllers/users');

// Создать нового пользвателя  -->  POST .../signup
notokenAuth.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      name: Joi.string().required().min(2).max(30),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser,
);

// Авторизироваться  -->  POST .../signin
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

module.exports = notokenAuth;
