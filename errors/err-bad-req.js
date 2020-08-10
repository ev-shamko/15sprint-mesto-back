// наш собственный конструктор ошибки наследует от стандартной ошибки Error
// затем он выставляет свойство statusCode
// затем конструктор можно импортировать в другие места и использовать вместе с инструкцией throw
// для проставления статуса 400 и нужного сообщения об ошибке (message)

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = BadRequestError;
