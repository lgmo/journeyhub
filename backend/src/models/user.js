import mongoose from "mongoose";
import { Journey, journeySchema } from "./journey.js";

export const userSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  password: String,
  journeys: [journeySchema],
});

export const User = mongoose.model("User", userSchema);
