import path from "path";
import dotenv from "dotenv";


dotenv.config({ path: path.join(__dirname, "../../.env") });



// Loading environment variables
 const constants =  {
    PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
    MONGODB_URI: process.env.MONGODB_URI,
    email: process.env.email,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    pass: process.env.pass,
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
    SECRET_KEY: process.env.SECRET_KEY,
    TEST_EMAIL: process.env.TEST_EMAIL,
    USER_ID: process.env.USER_ID,
    PROMETHEUSER: process.env.PROMETHEUSER,
    PROMETHEPASS: process.env.PROMETHEPASS,
    REDIS_URL: process.env.REDIS_URL,
};

export default constants
