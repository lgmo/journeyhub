function journeyRepositoryFactory(client) {
	const collection = client.getCollection('journeys');

	return {
		async create(journeyData) {
			try {
				await collection.insertOne(journeyData);
				return await collection.findOne(
					{ id: journeyData.id },
					{ projection: { _id: 0 } },
				);
			} catch (error) {
				throw new Error(`Failed to create journey: ${error.message}`);
			}
		},
		async getById({ id, include, exclude }) {
			const reducer = (list, val) => {
				list.reduce((acc, field) => ({ ...acc, [field]: val }), {});
			};

			try {
				return await collection.findOne(
					{ id },
					{
						projection: {
							_id: 0,
							...(include ? reducer(include, 1) : {}),
							...(exclude ? reducer(exclude, 0) : {}),
						},
					},
				);
			} catch (error) {
				throw new Error(`Failed to get journey: ${error.message}`);
			}
		},
		async getActionsListAtOffset({ id, offset }) {
			try {
				const res = await collection.findOne(
					{ id },
					{
						projection: {
							actions: {
								$slice: [offset, offset + 1],
							},
						},
					},
				);
				console.log('Actions at offset:', res);
				console.log('Actions at offset:', res);
				console.log('Actions at offset:', res);
				console.log('Actions at offset:', res);

				return res.actions[0] || [];
			} catch (error) {
				throw new Error(`Failed to get actions list: ${error.message}`);
			}
		},
	};
}

export default journeyRepositoryFactory;
