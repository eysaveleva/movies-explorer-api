const { ERROR_DEFAULT_CODE } = require('../config/config');

module.exports.errorCatcher = ((err, req, res, next) => {
  const { statusCode = ERROR_DEFAULT_CODE, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === ERROR_DEFAULT_CODE
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});