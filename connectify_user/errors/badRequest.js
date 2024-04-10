const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./customApi.js");

class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = BadRequestError;
