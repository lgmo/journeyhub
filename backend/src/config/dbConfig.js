import dotenv from "dotenv";

dotenv.config();

export default {
  host: process.env.MONGO_HOST,
  port: process.env.MONGO_PORT,
  username: process.env.MONGO_USERNAME,
  password: process.env.MONGO_PASSWORD,
  database: process.env.MONGO_DB_NAME,
};