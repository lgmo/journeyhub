import Queue from "bull";
import { Journey } from "../models/journey.js";

const journeyQueue = new Queue("journey-queue", {
  redis: { host: "localhost", port: 6379 },
});

journeyQueue.process(async (job) => {
  const { journeyId, actionIndex } = job.data;

  const journey = await Journey.findOne({ id: journeyId });
  if (!journey) return;

  const action = journey.actions[actionIndex];
  if (!action) return;

  if (action.type === "email") {
    sendEmail(action.userId);
  } else if (action.type === "whatsapp") {
    sendWhatsAppMessage(action.userId);
  } else if (action.type === "discord") {
    sendDiscordMessage(action.userId);
  }
});

function sendEmail(userId) {
  console.log(`Sending email for user ${userId}`);
}

function sendWhatsAppMessage(userId) {
  console.log(`Sending WhatsApp message for user ${userId}`);
}

function sendDiscordMessage(userId) {
  console.log(`Sending Discord message for user ${userId}`);
}

export default journeyQueue;
