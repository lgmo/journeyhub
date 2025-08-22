import { Router } from "express";
import { User } from "../models/user.js";
import { v4 } from "uuid";
import { Journey } from "../models/journey.js";
import journeyQueue from "../queues/journeyQueues.js";

const router = Router();

router.post("", async (req, res) => {
  const user = new User({ ...req.body, id: v4() });
  user.save();
  res
    .status(201)
    .json(await User.findOne({ id: user.id }).select("-_id -__v").lean());
});

router.get("", async (_, res) => {
  const users = await User.find({}, { projection: { _id: 0 } })
    .select("-_id -__v")
    .lean();
  res.status(200).json(users);
});

router.post("/:userId/journeys", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const journey = new Journey(req.body);
    await journey.save();

    user.journeys.push(journey);
    await user.save();

    for (const action of journey.actions) {
      await journeyQueue.add(
        {
          journeyId: journey.id,
          actionIndex: journey.actions.indexOf(action),
        },
        {
          delay: journey.startTime + action.timeOffset,
        }
      );
    }

    const updatedUser = await User.findOne({ id: userId })
      .select("-_id -__v")
      .lean();

    res.status(200).json(updatedUser);
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
