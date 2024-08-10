const publicErrorMiddleware = (err, req, res, next) => {
  const isPublic = res.locals.public ? res.locals.public : false;
  if (!isPublic)
    return next(err);

  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode);

  const isServerError = res.statusCode.toString().startsWith('5');
  const isReport = err.name === "ReportError";

  err.message = isServerError && !isReport ? "Error del servidor" : err.message;
  err.message = isReport ? "Se produjo un problema al generar el reporte" : err.message;

  res.set('Content-Type', 'text/html');
  res.send(`<p class="predial__error">${err.message}</p>`);
};

module.exports = publicErrorMiddleware;
