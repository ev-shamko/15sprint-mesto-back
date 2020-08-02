Проектная работа №15
=====
### Cервер на express для сервиса Mesto с подключённой mongoDB. Подготовка к деплою.

#### Ссылки:
* IP
* http
* https

#### Используемые технологии:
* JS
* итд
*

#### Внимание:
Сервер предназначен для заливки на Ubuntu, но разрабатывается на Windows.
В настройках локального репозитория обычно отключена автокоррекция окончания строки:
```
git config --local core.autocrlf false
```
В связи с этим на Github в некоторых коммитах будут файлы с CRLF. 
Проблемы с тем, что на облачном сервере ничего не работает, могут бысть связаны именно с CRLF/LF.

#### Как запустить:
1.	Клонируйте репозиторий
2.	$ npm i
3.	Запустите локальной сервер одной из этих команд:
```
$ npm run start
$ npm run dev      (тут будет hot reload)
```


#### Что умеет сервер:

#### v.0.0.4 (тут можно сделать историю версий)

* это Node.js приложение подключается к серверу Mongo по адресу mongodb://localhost:27017/mestodb Поднимать сервер $ mongod необходимо самостоятельно.
* можно взаимодействовать с коллекцией users в вашей локальной бд. Вы можете:
```
- создать нового пользователя в бд или залогиниться через POST-запрос (требуется корректный req.body)
- получить полный список юзеров: GET localhost:3000/users
- получить информацию о конкретном юзере по его _id через GET localhost:3000/users/_id
```
* приложение умеет отправлять и читать куки (JWT). Без наличия куки, получаемых при авторизации, вы не сможете использовать все потрясающие возожности нашего великолепного сервиса и полноценно взаимодействовать с базой данных :)

* можно взаимодействовать с коллекцией cards в бд, но только если вы залогинены. Вы можете:
```
- получить полный список карточек: GET localhost:3000/cards
- добавить новую карточку (Mesto .place_card) в бд через POST-запрос (требуется корректный req.body)
- удалить карточку по её _id через DELETE-запрос на адрес localhost:3000/cards/_id - но только если вы сами создали эту карточку
```


* GET localhost:3000 – вы получите ошибку 404, т.к. в данной итерации фронтенд отлючён. Сейчас можно взаимодействовать только с бд
* на неожиданные GET-запросы по адресу localhost:3000/* также вернётся ответ 404
