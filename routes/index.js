const express = require('express');

const indexRoutes = express();
const usersRouter = require('./users');
const articlesRouter = require('./articles');

indexRoutes.use('/users', usersRouter);
indexRoutes.use('/articles', articlesRouter);

module.exports = indexRoutes;
