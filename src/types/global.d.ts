/* eslint-disable @typescript-eslint/consistent-type-definitions */

declare module "*.css" {
  const styles: Record<string, string>;
  export default styles;
}

declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    AUTH_DRIZZLE_URL: string;
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    EMAIL_API_KEY: string;
    CRON_SECRET: string;
  }
}
