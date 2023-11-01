const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  RIGHT_CODE,
  CREATED_CODE,
  SALT_COUNT,
  KEY,
  NODE_ENV,
  JWT_SECRET,
} = require('../config/constans');

const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь с таким id не найден');
    })
    .then((user) => {
      res.status(RIGHT_CODE).send(user);
    })
    .catch(next);
};

module.exports.addUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, SALT_COUNT)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(CREATED_CODE).send({
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные пользователя'));
      } if (err.code === 11000) {
        return next(new ConflictError('Такой пользователь уже существует'));
      }
      return next(err);
    });
};

module.exports.updateProfileInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: 'true', runValidators: true })
    .orFail(() => {
      throw new NotFoundError('Пользователь с указанным _id не найден');
    })
    .then((user) => {
      res.status(RIGHT_CODE).send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError(`Пользователь с email: ${email} уже зарегистрирован`));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : KEY, { expiresIn: '7d' });
      res.status(RIGHT_CODE).send({ token });
    })
    .catch(next);
};
