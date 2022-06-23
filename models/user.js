const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Creating template for user information.
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Guest',
    minlength: 2,
    maxlength: 30,
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    select: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: /[\w.-]+@[\w.-]+/ig,
    },
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        /** When the user not found in DB */
        return Promise.reject(new Error('Incorrect email or password'));
      }
      /** When the user found in DB */
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            /** When the password not equal to the password that storage in DB */
            return Promise.reject(new Error('Incorrect email or password'));
          }

          /** When the password is correct return user to controller. */
          return user;
        });
    });
};

// Creating a model and export it for user information.
module.exports = mongoose.model('user', userSchema);
