const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./customApi.js");

class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = NotFoundError;
