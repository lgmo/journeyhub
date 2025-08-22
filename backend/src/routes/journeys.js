import { Router } from "express";
import { User } from "../models/user.js";
import { Journey } from "../models/journey.js";
import { v4 } from "uuid";

const router = Router();

router.post("/:userId/journeys", async (req, res) => {
  try {
    const { userId } = req.params;
    const { journeyId } = req.body;

    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const journey = await Journey.findOne({ id: journeyId });
    if (!journey) {
      return res.status(404).json({ error: "Jornada não encontrada" });
    }

    user.journeys.push(journey);
    await user.save();

    const updatedUser = await User.findOne({ id: userId })
      .select("-_id -__v")
      .lean();

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/:userId/journeys/create", async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, actions, startTime } = req.body;

    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const newJourney = {
      id: v4(),
      name,
      actions: actions || [],
      startTime: startTime || Date.now(),
    };

    user.journeys.push(newJourney);
    await user.save();

    const updatedUser = await User.findOne({ id: userId })
      .select("-_id -__v")
      .lean();

    res.status(201).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/:userId/journeys", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ id: userId })
      .select("journeys -_id")
      .lean();

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.status(200).json(user.journeys || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
