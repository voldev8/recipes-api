const User = require('../models/User');

// Get logged in user
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // we don't return the password
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
