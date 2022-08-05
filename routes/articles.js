const express = require('express');
const {
  celebrate,
  Joi,
} = require('celebrate');

const router = express.Router();
const {
  getArticles,
  createNewArticle,
  selectedArticle,
  deleteArticle,
  savedArticle,
  unsavedArticle,
} = require('../controllers/article');

/** Every path begin with: /articles/... */

router.get('/', getArticles);

router.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().uri().required(),
    image: Joi.string().uri().required(),
    savedUsers: Joi.array()
  }),
}), createNewArticle);

router.get('/:article_id', selectedArticle);

router.delete('/:article_id', celebrate({
  params: Joi.object().keys({
    article_id: Joi.string().hex().length(24),
  }),
}), deleteArticle);

router.put('/:article_id/saved', celebrate({
  params: Joi.object().keys({
    article_id: Joi.string().hex().length(24),
  }),
}), savedArticle);

router.delete('/:article_id/unsaved', celebrate({
  params: Joi.object().keys({
    article_id: Joi.string().hex().length(24),
  }),
}), unsavedArticle);

module.exports = router;
