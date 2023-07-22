const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  /*
  console.log(authorization);
  */
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Authorization required');
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, `${NODE_ENV === 'production' ? JWT_SECRET : '948'}`);
  } catch (err) {
    throw new UnauthorizedError('Invalid token');
  }

  req.user = payload;
  next();
};
