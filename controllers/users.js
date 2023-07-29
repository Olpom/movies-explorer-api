const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../ models/user');
const { STATUS_CODES } = require('../utils/constants');
const NotFoundError = require('../utils/errors/NotFoundError');
const BadRequestError = require('../utils/errors/BadRequestError');
const ConflictError = require('../utils/errors/ConflictError');

// Контроллер POST для регистрации
const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  if (!password) {
    return next(new BadRequestError('Требуется ввод пароля'));
  }

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then(() => res.status(STATUS_CODES.CREATED)
      .send({
        data: {
          name,
          email,
        },
      }))
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('При регистрации пользователя произошла ошибка'));
      }
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с таким email уже существует'));
      }
      return next(err);
    });
};

// Контроллер POST для авторизации
const login = (req, res, next) => {
  const { email, password } = req.body;
  const { JWT_SECRET } = process.env;

  console.log('JWT_SECRET:', JWT_SECRET);
  console.log('Processing /signin request');

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

// Контроллер GET для текущего юзера
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.status(STATUS_CODES.OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Введены неверные данные'));
      }
      return next(err);
    });
};

// Контроллер PATCH для обновления информации о юзере
const updateUserProfile = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(STATUS_CODES.OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('При обновлении профиля произошла ошибка'));
      }
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с таким email уже существует'));
      }
      return next(err);
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUserProfile,
};
