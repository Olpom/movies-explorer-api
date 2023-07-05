const moviesRouter = require('express').Router();
const {
  createMovie,
  getMovie,
  deleteMovie,
} = require('../controllers/movies');

const {
  movieIdValidator, movieValidator,
} = require('../middlewares/validation');

moviesRouter.post('/', movieValidator, createMovie);
moviesRouter.get('/', getMovie);
moviesRouter.delete('/:_id', movieIdValidator, deleteMovie);

module.exports = moviesRouter;
