namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    PORT: string;
    DATABASE_URL: string;
    PRIVATE_KEY: string;
    SESSION_SECRET: string;
  }
}

declare namespace Express {
  export interface Request {
      userId: string;
      username: string | undefined;
      session: {
        browser: string | undefined;
        user: string | undefined;
        destroy(fn: (err: any) => void): void;
      }
  }
}

declare namespace jwt {
  export interface JwtPayload {
      userId: string;
      username: string;
  }
}