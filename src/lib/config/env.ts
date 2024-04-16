import { cleanEnv, str } from "envalid";

const env = cleanEnv(process.env, {
  DB_URL: str(),
  PROJECT_URL: str(),
  PROJECT_KEY: str(),
  EMAIL_PW: str(),
});

export default env;
