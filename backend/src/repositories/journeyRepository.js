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
  async getById({ id, include, exclude }) {
    const db = await client.getDB();
    const journeyCollection = db.collection("journeys");

    const reducer = (list, val) => {
      list.reduce((acc, field) => ({ ...acc, [field]: val }), {});
    };

    try {
      return await journeyCollection.findOne(
        { id },
        {
          projection: {
            _id: 0,
            ...(include ? reducer(include, 1) : {}),
            ...(exclude ? reducer(exclude, 0) : {}),
          },
        }
      );
    } catch (error) {
      throw new Error(`Failed to get journey: ${error.message}`);
    } finally {
      await client.close();
    }
  },
  async getActionsListAtOffset({ id, offset }) {
    const db = await client.getDB();
    const journeyCollection = db.collection("journeys");

    try {
      const res = await journeyCollection.findOne(
        { id },
        {
          projection: {
            actions: {
              $slice: [offset, 1], // ← Correto: [offset, quantidade]
            },
          },
        }
      );
      return res["actions"][0] || [];
    } catch (error) {
      throw new Error(`Failed to get actions list: ${error.message}`);
    } finally {
      await client.close();
    }
  },
});

export default journeyRepositoryFactory;
