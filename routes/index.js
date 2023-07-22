const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const {
  signinValidator,
  signupValidator,
} = require('../middlewares/validation');
const NotFoundError = require('../utils/errors/NotFoundError');

// Обработчики POST-запросов signin/signup
router.post('/signin', signinValidator, login);
router.post('/signup', signupValidator, createUser);

// руты миддлвэры только для авторизованных пользователей
router.use('/users', auth, usersRouter);
router.use('/movies', auth, moviesRouter);

router.all('/*', (req, res, next) => {
  next(new NotFoundError('Page does not exist'));
});

module.exports = router;
