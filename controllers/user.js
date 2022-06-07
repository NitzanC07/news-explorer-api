const { ErrorHandler } = require('../helpers/error.js');
const User = require('../models/user');

/** Function for get the whole list of the users from data base. */
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('+password');
    res.status(200).send(users);
    return users;
  } catch (err) {
    console.log('Error in getUsers: ', err);
    return next(ErrorHandler(500, 'Somthing went wrong.'));
  }
};

/** Function for select specific user from the data base. */
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return next(ErrorHandler(404, 'User ID not found.'));
    }
    res.status(200).send(user);
    return user;
  } catch (err) {
    if (err.name === 'CastError') {
      console.log('Error in getUserById, status 400: ', err.name);
      return next(ErrorHandler(400, `${err.name}: Something wrong with the input.`));
    }
    console.log('Error in getUserById, status 500: ', err.name);
    return next(ErrorHandler(500, 'Somthing went wrong with the server.'));
  }
};

module.exports = {
  getUsers,
  getCurrentUser,
};
