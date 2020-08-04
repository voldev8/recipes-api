const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getUser } = require('../controllers/users');

router.route('/').get(auth, getUser);

module.exports = router;
