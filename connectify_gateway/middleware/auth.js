const { StatusCodes } = require("http-status-codes");

const auth = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Not Authorized!!!!" });
  }
};

module.exports = { auth };
