const CustomError = require("../errors/customError.js");
// const createTokens = require("../helpers/createTokens.js");
const testHandlers = (req, res, next) => {
    const testValue = true;

    // console.log(createTokens({ name: "subhan" }))
    const values = {
        val1: "one",
        val2: "two"
    }
    if (testValue)
        return res.success(201, 'Data fetched successfully', values);
    else
        return next(new CustomError("test produce error", 401));
}



module.exports = { testHandlers }