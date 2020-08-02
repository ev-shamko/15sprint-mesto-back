// кастомный конструктор ошибки, наследует от класса Error
// и выставляет нужный statusCode
// затем ипортируем класс в другие модули для проставления статуса ошибки и нужного message

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = ForbiddenError;
