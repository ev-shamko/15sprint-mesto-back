const Card = require('../models/card');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка в обработке GET-запроса списка всех карточек' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  // теперь в owner записывается инфа из токена, добавляемая в req.user._id
  Card.create({ name, link, owner: req.user._id })
    .then((newCard) => res.send({ data: newCard }))
    .catch((err) => res.status(400).send({ message: err.message }));
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      console.log(`You're willing to delete this card: ${JSON.stringify(req.params)}`);
      console.log(`Your req.user._id = ${req.user._id}`);
      console.log(`And card.owner id = ${card.owner}`);

      // если user._id из куки не равен id создателю карточки
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) {
        return res.status(401).send({ message: `Вы не можете удалить карточку id=${req.params.cardId}, т.к. её создали не вы` });
      }
      res.send({ message: 'Эта карточка успешно удалена:', data: card });
      return card.remove();
    })
    // если карточка не найдена, уже удалена или др. плохой запрос
    .catch((err) => res.status(404).send({ message: err.message }));
};
