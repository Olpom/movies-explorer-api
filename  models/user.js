const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [isEmail],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  console.log(`Looking for user with email: ${email}`);

  return this.findOne({ email })
    .select('+password')
    .then((document) => {
      if (!document) {
        return Promise.reject(
          new UnauthorizedError('Вы ввели неправильный логин или пароль'),
        );
      }
      /*
      console.log('User found, comparing passwords');
      */
      return bcrypt.compare(password, document.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorizedError('Вы ввели неправильный логин или пароль'),
          );
        }

        console.log('Passwords match, login successful');

        const user = document.toObject();
        delete user.password;
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
