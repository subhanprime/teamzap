const CustomError = require('../errors/customError.js');
const authorizeRole = (role) => {
    return (req, res, next) => {
        if (!role)
            return next(new CustomError("Please Provide role", 401));
        if (req.role && req.role === role) {
            next();
        } else {
            return next(new CustomError("You are not Eligible For this Route", 401));
        }
    };
};

module.exports = authorizeRole;