const jwt = require("jsonwebtoken");
const ApiError = require("../errors/apiError");
const asyncWrapper = require("./asyncWrapper");
const User = require("../models/user.model");

exports.protect = asyncWrapper(async (req, res, next) => {
  // const authHeader = req.headers.authorization;
  // const token =
  //   authHeader && authHeader.startsWith("Bearer ") && authHeader.split(" ")[1];
  const { accessToken } = req.cookies;

  if (!accessToken) {
    throw new ApiError("Please log in to get access", 401);
  }

  const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS);

  const user = await User.findById(decoded.userId);
  if (!user) {
    throw new ApiError(
      "The user belonging to this token no longer exists",
      401
    );
  }

  if (user.changedPassword(decoded.iat)) {
    throw new ApiError(
      "User recently changed password. Please login again",
      401
    );
  }

  user.refreshJWT(user, req, res);

  req.user = user;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        "You do not have permission to perform this action",
        403
      );
    }
    next();
  };
