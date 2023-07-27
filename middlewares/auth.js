const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  console.log('Заголовки пришедшие на сервер: ', req.headers);

  console.log(authorization);

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('При авторизации произошла ошибка. Токен не передан или передан не в том формате.');
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, `${NODE_ENV === 'production' ? JWT_SECRET : '999'}`);
  } catch (err) {
    throw new UnauthorizedError('При авторизации произошла ошибка. Переданный токен некорректен.');
  }

  req.user = payload;
  next();
};
