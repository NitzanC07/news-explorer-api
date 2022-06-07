const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const {
  errors,
} = require('celebrate');
const {
  ErrorHandler,
  customErrorHandler,
} = require('./helpers/error');

require('dotenv').config();

const app = express();
const { PORT = 3000 } = process.env;

const usersRouter = require('./routes/users');

const allowedOrigins = [
  'http://localhost:3000',
];

mongoose.connect('mongodb://localhost:27017/newsExplorer', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.options(allowedOrigins, cors());

// app.post('/signup', createUser);

app.use('/users', usersRouter);
// app.use('/articles', articlesRouter);

app.use(errors());
app.use(() => {
  throw new ErrorHandler(404, 'The requested resource was not found.');
});

app.use((err, req, res, next) => {
  customErrorHandler(err, res);
});

app.listen(PORT, () => {
  console.log(`App listening to port ${PORT}.`);
});
