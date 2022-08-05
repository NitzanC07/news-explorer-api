const Article = require('../models/article');
const { ErrorHandler } = require('../helpers/error');

const getArticles = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const articles = await Article.find({ owner });
    res.status(200).send(articles);
    return articles;
  } catch (err) {
    console.log('Error in getArticles: ', err);
    return next(new ErrorHandler(500, 'Somthing went wrong.'));
  }
};

const createNewArticle = async (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  try {
    const owner = req.user._id;
    const newArticle = await Article.create({
      keyword, title, text, date, source, link, image, owner,
    });
    res.status(201).send(newArticle);
    return newArticle;
  } catch (err) {
    if (err.name === 'ValidationError') {
      console.log(`Error in createNewArticle: ${err}`);
      return next(new ErrorHandler(400, `${err.name}: Somthing wrong with the input.`));
    }
    console.log(`Error in createNewArticle: ${err}`);
    return next(new ErrorHandler(500, `${err.name}: Somthing wrong with the server.`));
  }
};

const selectedArticle = async (req, res, next) => {
  const articleId = req.params.article_id;
  try {
    const article = await Article.findById(articleId);
    if (!article) {
      return next(new ErrorHandler(404, 'An article not found.'));
    }
    res.status(200).send(article);
    return article;
  } catch (err) {
    if (err.name === 'CastError') {
      console.log('Error in selectedArticle, status 400: ', err.name);
      return next(new ErrorHandler(400, `${err.name}: Something wrong with the input.`));
    }
    console.log('Error in selectedArticle, status 500: ', err.name);
    return next(new ErrorHandler(500, 'Somthing went wrong with the server.'));
  }
};

const deleteArticle = async (req, res, next) => {
  const articleId = req.params.article_id;
  try {
    const article = await Article.findById(articleId).select('+owner');
    if (article === null) {
      return next(new ErrorHandler(404, 'Article id isn\'t found.'));
    }
    if (article.owner !== req.user._id) {
      return next(new ErrorHandler(403, 'Unathouraized: you are not article\'s owner.'));
    }
    await Article.findByIdAndDelete(articleId);
    res.status(200).send({ message: `Article id ${articleId} was deleted.` });
    return { message: `Article id ${articleId} was deleted.` };
  } catch (err) {
    if (err.name === 'CastError') {
      console.log('Error in deleteArticle function: ', err.name);
      return next(new ErrorHandler(400, `${err}: Somthing went wrong with the input.`));
    }
    console.log('Error in deleteArticle function: ', err.name);
    return next(new ErrorHandler(500, `${err}: Somthing went wrong with the server.`));
  }
};

const savedArticle = async (req, res, next) => {
  const articleId = req.params.article_id;
  try {
    const article = await Article.findByIdAndUpdate(
      articleId,
      { $addToSet: { savedUsers: req.user._id } },
      { new: true },
    );
    if (article === null) {
      return next(new ErrorHandler(404, 'Article id isn\'t found.'));
    }
    res.status(200).send({ message: `Article ${articleId} was liked.` });
    return { message: `Article ${articleId} was liked.` };
  } catch (err) {
    if (err.name === 'CastError') {
      console.log('Error in SavedAritcle function: ', err.name);
      return next(new ErrorHandler(400, `${err.name}: Somthing went wrong with the input.`));
    }
    console.log('Error in SavedAritcle function: ', err);
    return next(new ErrorHandler(500, `${err.name}: Somthing went wrong with the server.`));
  }
};

const unsavedArticle = async (req, res, next) => {
  const articleId = req.params.article_id;
  try {
    const article = await Article.findByIdAndUpdate(
      articleId,
      { $pull: { savedUsers: req.user._id } },
      { new: true },
    );
    if (article === null) {
      return next(new ErrorHandler(404, 'Article id isn\'t found.'));
    }
    res.status(200).send({ message: `Article ${articleId} was disliked.` });
    return { message: `Article ${articleId} was disliked.` };
  } catch (err) {
    if (err.name === 'CastError') {
      console.log('Error in unsavedArticle function: ', err);
      return next(new ErrorHandler(400, `${err.name}: Somthing went wrong with the input.`));
    }
    console.log('Error in unsavedArticle function: ', err);
    return next(new ErrorHandler(500, `${err.name}: Somthing went wrong with the server.`));
  }
};

module.exports = {
  getArticles,
  deleteArticle,
  createNewArticle,
  selectedArticle,
  savedArticle,
  unsavedArticle,
};
