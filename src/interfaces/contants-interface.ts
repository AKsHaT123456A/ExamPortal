export interface IConstants {
    PORT: number | string;
    JWT_SECRET_KEY?: string;
    recaptchaSecretKey?: string;
    DATABASE_KEY?: string;
    CRYPTO_SECRET_KEY?: string;
    CACHE_TTL: number;
    PROMETHEUSER?: string;
    PROMETHEPASS?: string;
    MONGODB_URI?: string;
    email?: string;
    pass?: string;
    TEST_EMAIL?: string;
    USER_ID?: string;
    REDIS_URL?: string;
  }
  