const errorMiddleware = (err, req, res, next) => {
  let statusCode = res.statusCode ? res.statusCode : 500;
  statusCode = err.name === "ReportError" ? err.status : statusCode;
  res.status(statusCode);

  res.set('Content-Type', 'application/json');
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
    cause: process.env.NODE_ENV === "development" && err.name === "ReportError" ? err.cause : null,
  });
};

module.exports = errorMiddleware;
