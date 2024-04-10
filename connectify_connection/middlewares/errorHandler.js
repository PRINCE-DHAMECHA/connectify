const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnAuthenticatedError,
} = require("../errors");

const errorHandler = (err, req, res, next) => {
  if (err instanceof BadRequestError) {
    res.status(err.statusCode).json({ msg: err.message });
  } else if (err instanceof UnAuthenticatedError) {
    res.status(err.statusCode).json({ msg: err.message });
  } else if (err instanceof NotFoundError) {
    res.status(StatusCodes.NOT_FOUND).json({ msg: err.message });
  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message });
  }
};

module.exports = errorHandler;
