import {
  describe,
  beforeAll,
  afterAll,
  it,
  expect,
  beforeEach,
} from "@jest/globals";
import { v4 as uuidv4 } from "uuid";
import journeyRepositoryFactory from "../../src/repositories/journeyRepository.js";
import client from "../../src/common/db.js";

describe("journeyRepository", () => {
  let journeyRepository = null;
  let dbClient = null;

  beforeAll(async () => {
    dbClient = client();
    journeyRepository = journeyRepositoryFactory(dbClient);
  });

  afterAll(async () => {
    await dbClient.close();
  });

  describe("create", () => {
    afterEach(async () => {
      const db = await dbClient.getDB();
      await db.collection("journeys").deleteMany({});
    });

    it("should create a journey", async () => {
      const journey = {
        id: uuidv4(),
        name: "Test Journey",
        actions: {
          type: "email",
          content: "content",
          runsAt: "23:59:59",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const createdJourney = await journeyRepository.create(journey);

      expect(createdJourney.name).toBe(journey.name);
      expect(createdJourney.actions).toEqual(journey.actions);
      expect(createdJourney.createdAt).toEqual(journey.createdAt);
      expect(createdJourney.updatedAt).toEqual(journey.updatedAt);
    });
  });

  describe("getById", () => {
    const journey = {
      id: uuidv4(),
      name: "Test Journey",
      actions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    beforeAll(async () => {
      await journeyRepository.create(journey);
    });

    afterAll(async () => {
      const db = await dbClient.getDB();
      await db.collection("journeys").deleteMany({});
    });

    it("should find and retrieve all fields", async () => {
      const foundJourney = await journeyRepository.getById({ id: journey.id });
      expect(foundJourney).toEqual(journey);
    });

    it("should return null for non-existing journey", async () => {
      const foundJourney = await journeyRepository.getById({ id: uuidv4() });
      expect(foundJourney).toBeNull();
    });
  });

  describe("getById", () => {
    const journey = {
      id: uuidv4(),
      name: "Test Journey",
      actions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    beforeAll(async () => {
      await journeyRepository.create(journey);
    });

    afterAll(async () => {
      const db = await dbClient.getDB();
      await db.collection("journeys").deleteMany({});
    });

    it("should find and retrieve all fields", async () => {
      const foundJourney = await journeyRepository.getById({ id: journey.id });
      expect(foundJourney).toEqual(journey);
    });

    it("should return null for non-existing journey", async () => {
      const foundJourney = await journeyRepository.getById({ id: uuidv4() });
      expect(foundJourney).toBeNull();
    });
  });

  describe("getActionsListAtOffset", () => {
    const journey = {
      id: uuidv4(),
      name: "Test Journey",
      actions: [
        [
          {
            type: "email",
            content: "content",
            runsAt: "23:59:59",
          },
        ],
        [
          {
            type: "whatsapp",
            content: "content",
            runsAt: "22:59:59",
          },
        ],
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    beforeAll(async () => {
      await journeyRepository.create(journey);
    });

    afterAll(async () => {
      const db = await dbClient.getDB();
      await db.collection("journeys").deleteMany({});
    });

    it("should get the first action list in the actions field", async () => {
      const foundActionList = await journeyRepository.getActionsListAtOffset({
        id: journey.id,
        offset: 0,
      });
      expect(foundActionList).toEqual(journey.actions[0]);
    });

    it("should get the second action list in the actions field", async () => {
      const foundActionList = await journeyRepository.getActionsListAtOffset({
        id: journey.id,
        offset: 1,
      });
      expect(foundActionList).toEqual(journey.actions[1]);
    });

    it("should get null", async () => {
      const foundActionList = await journeyRepository.getActionsListAtOffset({
        id: journey.id,
        offset: 3,
      });
      expect(foundActionList).toEqual([]);
    });
  });
});
