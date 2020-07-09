const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");

const checkToken = (req, res, next) => {
  //getting token from header of request
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error();
    }
    const decodedToken = jwt.verify(token, "SECRET_KEY");
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (error) {
    return next(new HttpError("Authentication failed", 403));
  }
};

module.exports = checkToken;
