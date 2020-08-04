const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  let token;
  //req.header('x-auth-token');
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    //Set token from Bearer token in header***
    token = req.headers.authorization.split(' ')[1];
  }
  //Set token from cookie***
  // else if(req.cookies.token) {
  //   token = req.cookies.token
  // }

  if (!token) return res.status(401).json({ msg: 'No token, auth denied' });

  try {
    let decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decodedToken.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'token is not valid' });
  }
};
