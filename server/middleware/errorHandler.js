const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const ApiError = require("../errors/apiError");

const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new ApiError(message, StatusCodes.BAD_REQUEST);
};

const handleDuplicateFieldsError = (err, req) => {
  const keyName = Object.keys(err.keyValue)[0];
  const message = `Duplicate field value: ${err.keyValue[keyName]}`;
  const errors = [
    {
      key: keyName,
      msg: `${req.model} with this ${keyName} already exists. Please use another ${keyName}!`,
    },
  ];
  return new ApiError(message, StatusCodes.BAD_REQUEST, errors);
};

const handleValidationError = (err) => {
  const errors = [];
  Object.keys(err.errors).map((el) =>
    errors.push({ key: el, msg: err.errors[el].message })
  );
  return new ApiError("Validation failed", StatusCodes.BAD_REQUEST, errors);
};

const handleJWTError = () =>
  new ApiError("Invalid token. Please log in again", StatusCodes.UNAUTHORIZED);

const handleJWTExpiredError = () =>
  new ApiError(
    "Your token has expired. Please log in again",
    StatusCodes.UNAUTHORIZED
  );

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  if (err.name === "CastError") error = handleCastError(err);
  if (err.code === 11000) error = handleDuplicateFieldsError(err, req);
  if (err.name === "ValidationError") error = handleValidationError(err);
  if (err.name === "JsonWebTokenError") error = handleJWTError();
  if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

  error.statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  error.status = error.status || ReasonPhrases.INTERNAL_SERVER_ERROR;
  error.message = error.message || err.message;

  if (process.env.NODE_ENV === "development") {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      errors: error.errors,
      error: err,
      stack: err.stack,
    });
  } else if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      errors: error.errors,
    });
  } else {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: "Something went wrong please try again later",
    });
  }
};

module.exports = errorHandler;
