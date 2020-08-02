// создаём роутер на экспрессе
const cardsRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getAllCards, createCard, deleteCard } = require('../controllers/cards');
const regExpImgUrl = require('../middlewares/img-regexp');

// *** GET http://localhost:3000/cards + куки
// Получение всех карточек. Без Joi: достаточно авторизации - токена в куки
cardsRouter.get('/', getAllCards);

// *** POST http://localhost:3000/cards + body {}
// Создание новой карточки (сначала валидируем Joi)
cardsRouter.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(regExpImgUrl),
    }),
  }),
  createCard,
);

// *** DELETE http://localhost:3000/cards/:cardId + куки
// Удаление карточки по её id (сначала валидируем Joi)
cardsRouter.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex(),
    }),
  }),
  deleteCard,
);

module.exports = cardsRouter;

/* Пример тела запроса для создания новой карточки:

POST http://localhost:3000/cards (плюс авторизационный токен)
{
    "name": "10101010",
    "link": "http://some.some/pic.jpg"
}

*/
