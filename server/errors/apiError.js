const { getReasonPhrase } = require("http-status-codes");

class ApiError extends Error {
  constructor(message, statusCode, errors) {
    super(message);

    this.statusCode = statusCode;
    this.status = getReasonPhrase(statusCode);
    this.errors = errors;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
