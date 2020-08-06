const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth');

router.route('/register').post(
  //express-validator checks
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  register
);

router
  .route('/login')
  .post(
    [
      check('name', 'Please include a username').exists(),
      check('password', 'Password is required').exists(),
    ],
    login
  );

router.get('/logout', logout);

router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;
