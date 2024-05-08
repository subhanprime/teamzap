const mongoose = require("mongoose");
const connectDB = async (url) => {
    await mongoose
        .connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("DB connected successfully.");
        })
        .catch((error) => {
            console.log(error);
        });
};

module.exports = connectDB;
