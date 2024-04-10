const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./customApi.js");
class InternalServerError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = InternalServerError;
