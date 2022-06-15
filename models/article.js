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
    validate: {
      validator: /^http(s)?:\/{2}(w{3}.)?[\w-]+.\w+/ig,
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: /^http(s)?:\/{2}(w{3}.)?[\w-]+.\w+/ig,
    },
  },
  owner: {
    type: String,
    select: false,
  },
});

// Creating a model and export it for user information.
module.exports = mongoose.model('article', articleSchema);
