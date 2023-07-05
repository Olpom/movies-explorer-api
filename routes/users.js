const usersRouter = require('express').Router();
const {
  getCurrentUser,
  updateUserProfile,
} = require('../controllers/users');

const {
  userProfileValidator,
} = require('../middlewares/validation');

usersRouter.get('/me', getCurrentUser);
usersRouter.get('/me', userProfileValidator, updateUserProfile);

module.exports = usersRouter;
