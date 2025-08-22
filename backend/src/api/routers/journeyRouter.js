import express from "express";

const journeyRouterFactory = (journeyController) => {
  const router = express.Router();

  router.post("", journeyController.create);

  return router;
};

export default journeyRouterFactory;
