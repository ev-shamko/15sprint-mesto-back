/* ***************** ИМПОРТЫ ************************* */

const Card = require('../models/card');

// импорт собственных конструкторов ошибок 400, 401, 404
const BadRequestError = require('../errors/err-bad-req');
const AuthorizationError = require('../errors/err-auth');
const NotFoundError = require('../errors/err-not-found');

/* ******************************************************* */

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    // когда на сервере произошла ошибка в обработке GET-запроса списка всех карточек:
    .catch(next); // тут будет status 500 и message: 'На сервере произошла ошибка'
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  // теперь в owner записывается инфа из токена, добавляемая в req.user._id
  Card.create({ name, link, owner: req.user._id })
    .then((newCard) => res.send({ message: 'Новая карточка успешно создана:', data: newCard }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Ошибка валидации при создании новой карточки. Проверьте тело POST запроса и корректность вводимых данных');
      } else {
        next(err);
      }
    })
    .catch(next); // стандартная ошибка 500; эквивалентно .catch(err => next(err));
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Не найдена карточка с id ${req.params.cardId}`);
      }

      // если user._id из куки не равен id создателя карточки
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) {
        throw new AuthorizationError(`Вы не можете удалить карточку id ${req.params.cardId}, т.к. её создали не вы`);
      }
      res.send({ message: 'Эта карточка успешно удалена:', data: card });
      return card.remove();
    })
    .catch(next); // стандартная ошибка 500; эквивалентно .catch(err => next(err));
};
