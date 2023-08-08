const mongoose = require("mongoose");
const connectDB = async () => {
    mongoose
        .connect(
            process.env.DATABASE_KEY,
            { useNewUrlParser: true }
        )
        .then(() => {
            console.log("Successfully connected to mongodb database");
        })
        .catch((err) => {
            console.log(err);
        })
}
module.exports = connectDB;