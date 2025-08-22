import mongoose from "mongoose";

export const actionSchema = new mongoose.Schema({
  name: String,
  type: String,
  content: String,
  timeOffset: Number,
});

export const journeySchema = new mongoose.Schema({
  id: String,
  name: String,
  actions: [actionSchema],
  startTime: Number,
});

export const Journey = mongoose.model("Journey", journeySchema);
export const Action = mongoose.model("Action", actionSchema);
