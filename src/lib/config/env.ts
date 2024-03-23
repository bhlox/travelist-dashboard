import { cleanEnv, str } from "envalid";

const env = cleanEnv(process.env, {
  DB_URL: str(),
});

export default env;
