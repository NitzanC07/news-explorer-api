const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ErrorHandler } = require('../helpers/error');
const User = require('../models/user');

/** Creating new user (register) to data base. With route '/users/register'. */
const createUser = async (req, res, next) => {
  const { email, password, username } = req.body;
  try {
    bcrypt.hash(password, 10)
      .then((hash) => User.create({
        username: username,
        email: email,
        password: hash,
      }))
      .then((user) => {
        res.status(201).send({
          username: user.username,
          email: user.email,
        });
      })
      .catch((err) => {
        if (err.name === 'MongoServerError') {
          next(new ErrorHandler(409, `${err.name}: User already exists.`));
        } else {
          next(new ErrorHandler(401, `${err.name}: Email or password are missing.`));
        }
      });
  } catch (err) {
    if (err.name === 'ValidationError') {
      console.log('Error in createUser, status 400: ', err);
      next(new ErrorHandler(400, `${err.name}: Something wrong with the input.`));
    } else {
      console.log('Error in createUser, status 500: ', err.name);
      next(new ErrorHandler(500, `${err}: Somthing went wrong with the server.`));
    }
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.status(200).json(token);
    })
    .catch((err) => {
      next(new ErrorHandler(401, `Incorrect email or password: ${err}.`));
    });
};

module.exports = {
  createUser,
  loginUser,
};
