const jwt = require('jsonwebtoken');
const { ErrorHandler } = require('../helpers/error');

function auth(req, res, next) {
  const { authorization } = req.headers;
  // console.log("authorization", authorization);

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new ErrorHandler(403, 'Authorization required'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(
      token,
      process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    return next(new ErrorHandler(403, 'Authorization required'));
  }

  req.user = payload;
  next();
  return req.user;
}

module.exports = {
  auth,
};
