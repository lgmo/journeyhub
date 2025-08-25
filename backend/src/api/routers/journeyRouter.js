import express from "express";
import validationMiddleware from "../middlewares/validationMiddleware.js";
import { createJourneySchemas } from "../schemas/journey.js";

const journeyRouterFactory = (journeyController) => {
  const router = express.Router();

  router.post(
    "",
    validationMiddleware(createJourneySchemas),
    journeyController.create
  );

  return router;
};

export default journeyRouterFactory;
