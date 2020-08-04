const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const asyncHandler = require('../middleware/async');
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
    return res.status(400).json({ msg: 'User already exists' });
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

// Auth user & get token
exports.login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(res.status(400).json({ errors: errors.array() }));
  }

  const { name, password } = req.body;

  let user = await User.findOne({ name });
  if (!user) {
    return next(res.status(400).json({ msg: 'Invalid Credentials' }));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(res.status(400).json({ msg: 'Invalid Credentials' }));
  }

  saveCookie(user, res);
});

// helper function to save cookies
const saveCookie = (user, res) => {
  //object we want to send in token
  const payload = {
    user: {
      id: user.id,
    },
  };
  if (!payload) return res.status(500).send('Something went wrong');

  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn: '30 days',
    },
    (err, token) => {
      if (err) throw err;

      const options = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
      };

      if (process.env.NODE_ENV === 'production') {
        options.secure = true;
      }

      res
        .status(200)
        .cookie('token', token, options)
        .json({ success: true, token });
    }
  );
};
