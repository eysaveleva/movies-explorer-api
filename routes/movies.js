const movieRouter = require('express').Router();

const {
  validateAddMovie,
  validateDeleteMovie,
} = require('../middlewares/validation');

const {
  addMovie,
  getMovies,
  deleteMovie,
} = require('../controllers/movies');

movieRouter.get('/', getMovies);
movieRouter.post('/', validateAddMovie, addMovie);
movieRouter.delete('/:_id', validateDeleteMovie, deleteMovie);

module.exports = movieRouter;
