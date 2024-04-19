class apiError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`;
    startWith("4") ? "Failed" : "Error";

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = apiError;
