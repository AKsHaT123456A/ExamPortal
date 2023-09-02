const mongoose = require("mongoose");
const connectDB = async () => {
    mongoose
        .connect(
            "mongodb+srv://root:root@cluster0.2cvrool.mongodb.net/?retryWrites=true&w=majority",
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