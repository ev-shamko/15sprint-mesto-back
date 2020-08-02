const usersRouter = require('express').Router();
const { getAllUsers, getUserById } = require('../controllers/users');

usersRouter.get('/', getAllUsers);
usersRouter.get('/:userId', getUserById);

module.exports = usersRouter;
