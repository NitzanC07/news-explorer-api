const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const limiter = require('./helpers/limiter');
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

const { PORT = 3000 } = process.env;
const indexRoutes = require('./routes/index');
const {
  createUser,
  loginUser,
} = require('./controllers/auth');
const {
  auth,
} = require('./middleware/auth');

const allowedOrigins = [
  'http://146.148.67.231:3000',
<<<<<<< HEAD
=======
  'http://localhost:3000',
  'https://nitzan-final-project.students.nomoreparties.sbs',
  'https://www.nitzan-final-project.students.nomoreparties.sbs',
  'https://api.nitzan-final-project.students.nomoreparties.sbs',
>>>>>>> 9da25735320d8629c180b533db4de1d88b984bb0
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
app.use('/', indexRoutes);

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
