import express from "express";
import mongoose from "mongoose";
// import cors from "cors";
import journeyRoutes from "./routes/journeys.js";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";

dotenv.config();

const app = express();

app.use(express.json());

const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_HOST = process.env.MONGO_HOST;
const MONGO_PORT = process.env.MONGO_PORT;

mongoose.connect(
  `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/journeyhub`,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }
);

app.use("/api/journeys", journeyRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
