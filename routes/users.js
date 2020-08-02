const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getAllUsers, getUserById } = require('../controllers/users');

// *** GET http://localhost:3000/users/  + куки
// Получение данных всех зарегистрированных юзеров
// Здесь не будет валидации через Joi, т.к. авторизационного токена достаточно
usersRouter.get('/', getAllUsers);

// *** GET http://localhost:3000/users/:userId  + куки
// Получить данные конкретного пользователя по его _id
usersRouter.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24).hex(),
    }),
  }),
  getUserById,
);

module.exports = usersRouter;
