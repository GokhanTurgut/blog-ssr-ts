// Type declarations for our environment variables
namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    PORT: string;
    DATABASE_URL: string;
    PRIVATE_KEY: string;
    SESSION_SECRET: string;
  }
}

// Type declarations for our request object
declare namespace Express {
  export interface Request {
      userId: string;
      username: string;
      session: {
        browser: string;
        user: string;
        destroy(fn: (err: any) => void): void;
      }
  }
}

// Type declarations for our JWT payload
declare namespace jwt {
  export interface JwtPayload {
      userId: string;
      username: string;
  }
}