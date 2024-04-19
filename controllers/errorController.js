module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode;
  err.status = err.status;
  err.message = err.message;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
