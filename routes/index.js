const router = require('express').Router();
const { addUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateLogin, validateAddUser } = require('../middlewares/validation');
const NotFoundError = require('../errors/NotFoundError');
const userRouter = require('./users');
const movieRouter = require('./movies');

router.post('/signin', validateLogin, login);
router.post('/signup', validateAddUser, addUser);
router.use(auth);
router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
