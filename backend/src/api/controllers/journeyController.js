import { v4 as uuidv4 } from "uuid";

const journeyControllerFactory = (journeyRepository) => ({
  async create(req, res) {
    // let validatedDTO = null;
    // try {
    //   validatedDTO = await createJourneySchema.validateAsync(req.body);
    // } catch (error) {
    //   console.log(`Validation error: ${error.message}`);
    //   res.status(400).json(error.message);
    //   return;
    // }

    const now = new Date().toISOString();
    const journeyEntity = {
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
      ...req.body,
    };

    try {
      const journey = await journeyRepository.create(journeyEntity);
      res.status(201).json(journey);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
});

export default journeyControllerFactory;
