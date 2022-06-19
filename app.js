const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimiter = require('express-rate-limit');
const cors = require('cors');
const {
  errors,
} = require('celebrate');
const {
  ErrorHandler,
  customErrorHandler,
} = require('./helpers/error');
const {
  requestLogger,
  errorLogger,
} = require('./middleware/logger');
require('dotenv').config();

const app = express();

const limiter = rateLimiter({
  windowMs: 10 * 60 * 1000, // 10 minutes.
  max: 50, // Maximum of 100 requeset from each IP to the server.
})

const { PORT = 3000 } = process.env;
const usersRouter = require('./routes/users');
const articlesRouter = require('./routes/articles');
const {
  createUser,
  loginUser,
} = require('./controllers/auth');
const {
  auth,
} = require('./middleware/auth');

const allowedOrigins = [
  'http://146.148.67.231:3000',
  'http://localhost:3000',
  'https://nitzan-final-project.students.nomoreparties.sbs',
  'https://www.nitzan-final-project.students.nomoreparties.sbs',
  'https://api.nitzan-final-project.students.nomoreparties.sbs',
];

mongoose.connect('mongodb://localhost:27017/newsExplorer');

app.use(helmet());
app.use(bodyParser.json());
app.use(limiter);
app.use(cors());
app.options(allowedOrigins, cors());

app.use(requestLogger);

/** Unathuorized routes */
app.post('/signup', createUser);
app.post('/signin', loginUser);

app.use(auth);

/** Athuorized routes */
app.use('/users', usersRouter);
app.use('/articles', articlesRouter);

app.use(errorLogger);
app.use(errors());
app.use(() => {
  throw new ErrorHandler(404, 'The requested resource was not found.');
});

app.use((err, req, res, next) => {
  customErrorHandler(err, res);
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
