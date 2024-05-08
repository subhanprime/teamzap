function sendSuccessResponse(req, res, next) {
    res.success = function (code, message, data) {
        const response = {
            status: true,
            message: message || 'Success',
            data: data || null,
        };
        res.status(code).json(response);
    };
    next();
}
module.exports = sendSuccessResponse