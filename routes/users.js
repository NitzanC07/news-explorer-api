const express = require('express');

const router = express.Router();

router.get('/', getUsers);
router.get('/me', getCurrentUser);