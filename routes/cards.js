// создаём роутер на экспрессе
const cardsRouter = require('express').Router();

const { getAllCards, createCard, deleteCard } = require('../controllers/cards');

cardsRouter.get('/', getAllCards);
cardsRouter.post('/', createCard);
cardsRouter.delete('/:cardId', deleteCard);

module.exports = cardsRouter;
