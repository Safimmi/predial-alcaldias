const { error } = require("pdf-lib");

class ReportError extends Error {
  constructor(cause = null, error = null) {
    super('An error occurred while generating the report');
    this.name = 'ReportError';
    this.status = 500;
    this.wrappedError = error;
    this.cause = cause;
  }
}

module.exports = ReportError;
