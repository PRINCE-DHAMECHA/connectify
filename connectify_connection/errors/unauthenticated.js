const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./customApi.js");

class UnAuthenticatedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = UnAuthenticatedError;
