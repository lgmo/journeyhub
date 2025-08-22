import { MongoClient } from "mongodb";
import dbConfig from "../config/dbConfig.js";

async function initDatabase(dbname = dbConfig.database) {
  const uri = `mongodb://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbname}`;
  const client = new MongoClient(uri);

  const db = client.db(dbname);

  try {
    await client.connect();

    await db.createCollection("users");
    await db.createCollection("journeys");
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
  } finally {
    await client.close();
  }
  return client;
}

let client = null;

const dbClientFactory = (dbname = dbConfig.database) => ({
  getDB: async () => {
    if (!client) {
      client = await initDatabase(dbname);
    }
    await client.connect();
    return client.db(dbname);
  },
  close: async () => {
    if (client) {
      await client.close();
    }
  },
});

export default dbClientFactory;
