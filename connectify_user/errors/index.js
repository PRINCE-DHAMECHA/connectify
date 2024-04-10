const BadRequestError = require("./badRequest.js");
const UnAuthenticatedError = require("./unauthenticated.js");
const NotFoundError = require("./notFound.js");
const InternalServerError = require("./serverError.js");
module.exports = {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
  InternalServerError,
};
