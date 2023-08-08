
const constants = {
    PORT: process.env.PORT || 3000,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    recaptchaSecretKey: process.env.RECAPTCHA_SECRET_KEY,
    CACHE_TTL: 7200000// 2 hours
};

module.exports = constants;
