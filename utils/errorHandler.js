const mongoose = require('mongoose');
const { STATUS_CODES } = require('./constants');

module.exports = (err, req, res, next) => {
  // Если ошибка является ошибкой валидации mongoose
  if (err instanceof mongoose.Error.ValidationError) {
    // Собираем детальные сообщения об ошибках
    const errorMessages = Object.values(err.errors).map((error) => error.message);
    return res
      .status(400)
      .send({ message: 'Не пройдена валидация Mongoose', errors: errorMessages });
  }

  const {
    statusCode = STATUS_CODES.SERVER_ERROR,
    message,
  } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === STATUS_CODES.SERVER_ERROR ? '500 На сервере произошла ошибка' : message,
    });

  console.error(err.stack);

  return next();
};
