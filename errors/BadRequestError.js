const { ERROR_CODE } = require('../config/constans');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE;
  }
}

module.exports = BadRequestError;
