const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const sendEmail = require('../utils/sendEmail');
const asyncHandler = require('../middleware/async');
const saveCookie = require('../middleware/token');
const AppError = require('../utils/appError');

const User = require('../models/User');

// Register a user
exports.register = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    return next(new AppError('User already exists.', 400));
  }
  //if user doesn't exist create one
  user = new User({
    name,
    email,
    password,
  });

  //hash the password
  const salt = await bcrypt.genSalt(10);
  //password plain-text to hash
  user.password = await bcrypt.hash(password, salt);
  await user.save();

  saveCookie(user, res);
});

// login user
exports.login = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, password } = req.body;

  let user = await User.findOne({ name });
  if (!user) {
    return next(new AppError('Invalid Credentials', 400));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new AppError('Invalid Credentials', 400));
  }

  saveCookie(user, res);
});

// Log user out / clear cookie
exports.logout = asyncHandler(async (req, res, next) => {
  res.clearCookie('token');

  res.status(200).json({
    success: true,
    data: {},
  });
});

// Forgot password
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).json({ msg: 'There is no user with that email' });
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. 
  In order to reset your password, please visit this link: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });

    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    console.log(err);
    user.getResetPasswordToken = undefined;
    user.getResetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return res.status(500).json({ msg: 'Email could not be sent' });
  }
});

// Reset password
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).send('Invalid token');
  }

  // Set new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  saveCookie(user, res);
});
