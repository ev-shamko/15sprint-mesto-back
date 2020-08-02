// здесь будут роуты для регистрации и залогинивания, потому что они не требуют токена
const notokenAuth = require('express').Router();
const { createUser, login } = require('../controllers/users');

notokenAuth.post('/signin', login);
notokenAuth.post('/signup', createUser);

module.exports = notokenAuth;

/*
Пример корректного body для регистрации:

POST http://localhost:3000/signup
{
    "name": "User WithPassword",
    "about": "Some userinfo",
    "avatar": "https://my.site/ava123.jpg",
    "email": "testuser@yandex.ru",
    "password": "12345"
}

Пример запроса для залогинивания:

POST http://localhost:3000/signin

{
    "email": "testuser@yandex.ru",
    "password": "12345"
}
*/
