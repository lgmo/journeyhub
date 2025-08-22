const journeyRepositoryFactory = (client) => ({
  async create(journeyData) {
    const db = await client.getDB();
    try {
      await db.collection("journeys").insertOne(journeyData);

      delete journeyData._id;
      return journeyData;
    } catch (error) {
      throw new Error(`Failed to create journey: ${error.message}`);
    } finally {
      await client.close();
    }
  },
});

export default journeyRepositoryFactory;
