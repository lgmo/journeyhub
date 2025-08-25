function userRepositoryFactory(client) {
	const collection = client.getCollection('users');
	return {
		async create(userData) {
			try {
				await collection.insertOne(userData);
				return await collection.findOne(
					{ id: userData.id },
					{ fields: { _id: 0 } },
				);
			} catch (error) {
				throw new Error(`Failed to create user: ${error.message}`);
			}
		},
		async addJourney({ userId, journeyId, journeyStartDate }) {
			try {
				await collection.updateOne(
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
					},
				);
				return await collection.findOne({ id: userId }, { fields: { _id: 0 } });
			} catch (error) {
				throw new Error(`Failed to add journey: ${error.message}`);
			}
		},
	};
}

export default userRepositoryFactory;
