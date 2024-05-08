const catchAsync = (passedFunc) => (req, res, next) =>
    Promise.resolve(passedFunc(req, res, next)).catch(next);
module.exports = catchAsync