const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getUser,
  updateDetails,
  updatePassword,
} = require('../controllers/users');

router.route('/').get(auth, getUser);
router.route('/update').put(auth, updateDetails);
router.route('/updatepassword').put(auth, updatePassword);

module.exports = router;
