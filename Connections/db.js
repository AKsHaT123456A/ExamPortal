
import { connect } from "mongoose";
import constants from "./constants.js";
const connectDB = async () => {
    connect(
            process.env.DATABASE_KEY || constants.DATABASE_KEY,
            { useNewUrlParser: true }
        )
        .then(() => {
            console.log("Successfully connected to mongodb database");
        })
        .catch((err) => {
            console.log(err);
        })
}
export default connectDB;