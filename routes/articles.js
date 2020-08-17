const articlesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createArticle, getAllArticles, deleteArticle } = require('../controllers/articles');

articlesRouter.post(
  '/articles',
  celebrate({
    body: Joi.object().keys({
      title: Joi.string().required(),
      text: Joi.string().required(),
      date: Joi.string().required(),
      source: Joi.string().required(),
      link: Joi.string().required(),
      image: Joi.string().required(),
      keyword: Joi.string().required(),
    }),
  }),
  createArticle,
);

articlesRouter.get(
  '/articles',
  getAllArticles,
);

articlesRouter.delete(
  '/articles/:articleId',
  celebrate({
    params: Joi.object().keys({
      articleId: Joi.string().length(24).hex(),
    }),
  }),
  deleteArticle,
);

module.exports = articlesRouter;
