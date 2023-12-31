const Movie = require('../ models/movie');
const { STATUS_CODES } = require('../utils/constants');
const NotFoundError = require('../utils/errors/NotFoundError');
const BadRequestError = require('../utils/errors/BadRequestError');
const ForbiddenError = require('../utils/errors/ForbiddenError');

// Контроллер POST для создания нового фильма
const createMovie = (req, res, next) => Movie.create(
  {
    ...req.body,
    owner: req.user._id,
  },
)
  .then((newMovie) => {
    console.log('POST /movies', newMovie);
    res.status(STATUS_CODES.CREATED).send({ newMovie });
  })
  .catch((err) => {
    console.log('POST /movies error', err);
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Incorrect data entered when creating new movie'));
    }
    return next(err);
  });

// Контроллер GET для сохраненных фильмов
const getMovie = (req, res, next) => Movie.find(
  { owner: req.user._id },
)
  .then((movies) => {
    console.log('GET /movies', movies);
    res.status(STATUS_CODES.OK).send({ data: movies });
  })
  .catch((err) => {
    console.log('GET /movies error', err);
    next(err);
  });

// Контроллер DELETE для удаления сохранненного фильма
const deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Movie not found');
      }
      // проверяем, является ли текущий пользователь владельцем фильма
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('You do not have permission to delete this movie');
      }
      Movie.deleteOne({ _id: req.params._id })
        .then(() => {
          console.log('DELETE /movies', req.params._id);
          res.send({ message: 'Movie deleted successfully' });
        })
        .catch(next);
    })
    .catch((err) => {
      console.log('DELETE /movies error', err);
      if (err.name === 'CastError') {
        return next(new BadRequestError('Incorrect search data entered'));
      }
      return next(err);
    });
};

module.exports = {
  createMovie,
  getMovie,
  deleteMovie,
};
