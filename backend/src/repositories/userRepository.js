const userRepositoryFactory = (client) => ({
  async create(userData) {
    const db = await client.getDB();
    try {
      const userCollection = db.collection("users");
      await userCollection.insertOne(userData);
      return await userCollection.findOne(
        { id: userData.id },
        { fields: { _id: 0 } }
      );
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    } finally {
      await client.close();
    }
  },
  async addJourney({ userId, journeyId, journeyStartDate }) {
    const db = await client.getDB();
    try {
      const userCollection = db.collection("users");
      await userCollection.updateOne(
        {
          id: userId,
        },
        {
          $push: {
            journeys: {
              journeyId,
              journeyStartDate,
            },
          },
        }
      );
      return await userCollection.findOne(
        { id: userId },
        { fields: { _id: 0 } }
      );
    } catch (error) {
      throw new Error(`Failed to add journey: ${error.message}`);
    } finally {
      await client.close();
    }
  },
});

export default userRepositoryFactory;
