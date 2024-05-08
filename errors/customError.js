class CustomError extends Error {
    constructor(message, statusCode) {
      super(message);
      Object.setPrototypeOf(this, CustomError.prototype);
      this.statusCode = statusCode;
    }
  }
  
  module.exports = CustomError;