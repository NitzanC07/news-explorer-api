const express = require('express');
const {
  celebrate,
  Joi,
} = require('celebrate');

const router = express.Router();
const {
  getUsers,
  getCurrentUser,
} = require('../controllers/user');

/** Every path begin with: /users/... */
router.get('/', getUsers);
router.get('/me', getCurrentUser);

module.exports = router;
