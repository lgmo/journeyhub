const userControllerFactory = ({
  userRepository,
  journeyRepository,
  queueService,
}) => ({
  async addJourney(req, res) {
    const { userId } = req.params;
    const { journeyId, journeyStartDate } = req.body;
    try {
      const foundJourney = await journeyRepository.getById({ id: journeyId });

      if (foundJourney === null) {
        return res.status(404).send("Journey not found");
      }

      await userRepository.addJourney(userId, journeyId, journeyStartDate);
      await queueService.add({
        jobType: "day",
        userId,
        journeyId,
        journeyStartDate,
        dayOffset: 0,
      });
      res.status(204).send();
    } catch (error) {
      console.error("Error adding journey to user: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
});

export default userControllerFactory;
