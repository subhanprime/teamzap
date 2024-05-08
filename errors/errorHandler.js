const ErrorHandler = (err, req, res, next) => {
    err.message = err.message || "internal Server Error";
    err.statusCode = err.statusCode || 500;
    res.status(err.statusCode).json({ message: err.message, status: false });
};

module.exports = ErrorHandler;
