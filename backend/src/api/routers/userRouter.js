import express from "express";
import validationMiddleware from "../middlewares/validationMiddleware.js";
import { addJourneySchemas } from "../schemas/user.js";

const userRouterFactory = (userController) => {
  const router = express.Router();

  router.post(
    "/:userId/journeys",
    validationMiddleware(addJourneySchemas),
    userController.addJourney
  );

  return router;
};

export default userRouterFactory;
