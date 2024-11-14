
declare global {
    namespace NodeJS {
      interface ProcessEnv {
        MONGODB_URI: string;
        email: string;
        JWT_SECRET_KEY: string;
        NODE_VERSION: string;
        pass: string;
        RECAPTCHA_SECRET_KEY: string;
        SECRET_KEY: string;
        TEST_EMAIL: string;
        USER_ID: string;
        PROMETHEUSER: string;
        PROMETHEPASS: string;
        PORT: string;
        REDIS_URL: string;
      }
    }
  }
  
  export {};
  