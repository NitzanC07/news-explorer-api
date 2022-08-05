const validator = require('validator');
const mongoose = require('mongoose');

// const date = new Date();

// Creating template for user information.
const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: [validator.isURL, "Incorrect link URL."],
  },
  image: {
    type: String,
    required: true,
    validate: [validator.isURL, "Incorrect image URL."],
    },
  owner: {
    type: String,
    select: false,
  },
  savedUsers: {
    type: Array,
    default: [],
  },
});

// Creating a model and export it for user information.
module.exports = mongoose.model('article', articleSchema);
