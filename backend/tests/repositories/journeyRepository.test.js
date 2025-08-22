import { describe, beforeAll, afterAll, it, expect } from "@jest/globals";
import { v4 as uuidv4 } from "uuid";
import journeyRepositoryFactory from "../../src/repositories/journeyRepository.js";
import client from "../../src/common/db.js";

describe("create", () => {
  let journeyRepository = null;
  let dbClient = null;

  beforeAll(async () => {
    dbClient = client();
    journeyRepository = journeyRepositoryFactory(dbClient);
  });

  afterEach(async () => {
    const db = await dbClient.getDB();
    await db.collection("journeys").deleteMany({});
  });

  afterAll(async () => {
    await dbClient.close();
  });

  it("should create a journey", async () => {
    const journey = {
      id: uuidv4(),
      name: "Test Journey",
      actions: {
        type: "email",
        content: "content",
        runsAt: new Date().toISOString().split("T")[1],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createdJourney = await journeyRepository.create(journey);

    expect(createdJourney.name).toBe(journey.name);
    expect(createdJourney.actions).toEqual(journey.actions);
    expect(createdJourney.createdAt).toEqual(journey.createdAt);
    expect(createdJourney.updatedAt).toEqual(journey.updatedAt);
  });
});
