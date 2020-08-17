const usersRouter = require('express').Router();
const { getUserInfo } = require('../controllers/users');

// Запросить информацию о себе (авторизированном пользователе) --> GET .../users/me (+токен)
usersRouter.get(
  '/users/me',
  getUserInfo,
);

module.exports = usersRouter;
