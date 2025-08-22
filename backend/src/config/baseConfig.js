import dotenv from "dotenv";

dotenv.config();

const config = {
  serverPort: process.env.SERVER_PORT,
};

export default config;
