// регулярное выражение для валидации ссылки на картинку для карточки.
// Начинается на http:// или https://  --- затем адрес --- заканчивается на что-то типа /pic123.jpg (обязательно слеш, затем буквы и/или цифры, точка, формат из 3+ букв)
// Подробнее рассмотреть регулярку можно на https://extendsclass.com/regex-tester.html
const regExpImgUrl = /^(http:\/\/|https:\/\/)(www\.)?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|\w+\d*-*\w*\d*-*\w*\d*(\.\w+|:\d{2,5}))((\.\w+)*|(:\d{2,5})?)(\/\w*\W*)*(\/((\w|\d)(\w|\d)*)\.\w{3,})$/;

module.exports = regExpImgUrl;
