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

const date = new Date();

router.get('/', getArticles);
router.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string()
      .required()
      .min(2).max(30),
    title: Joi.string()
      .required()
      .min(2).max(30),
    text: Joi.string()
      .required()
      .min(2),
    date: Joi.string()
      .required(),
    source: Joi.string()
      .required()
      .min(2).max(30),
    link: Joi.string()
      .uri()
      .required(),
    image: Joi.string()
      .uri()
      .required(),
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
