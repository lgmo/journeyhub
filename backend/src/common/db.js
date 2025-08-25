import { MongoClient } from 'mongodb';
import dbConfig from '../config/dbConfig.js';

async function getclient(dbname) {
	try {
		const uri = `mongodb://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbname}`;
		const client = new MongoClient(uri);
		return client;
	} catch (error) {
		console.error('Failed to create MongoDB client:', error);
	}
}

async function dbClientFactory(dbName = dbConfig.database) {
	const client = await getclient(dbName);

	return {
		getCollection(collectionName) {
			return client.db(dbName).collection(collectionName);
		},
		async close() {
			if (client) {
				await client.close();
			}
		},
	};
}

export default dbClientFactory;
