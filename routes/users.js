const userRouter = require('express').Router();

const {
  validateUpdateProfileInfo,
} = require('../middlewares/validation');

const {
  getCurrentUser,
  updateProfileInfo,
} = require('../controllers/users');

userRouter.get('/me', getCurrentUser);
userRouter.patch('/me', validateUpdateProfileInfo, updateProfileInfo);

module.exports = userRouter;
