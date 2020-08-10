// наш собственный конструктор ошибки 404 наследует от стандартной ошибки Error
// затем он выставляет свойство statusCode
// затем конструктор можно импортировать в другие места и использовать вместе с инструкцией throw

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
