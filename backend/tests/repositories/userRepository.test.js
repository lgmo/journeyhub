import { describe, beforeAll, afterAll, it, expect } from "@jest/globals";
import { v4 as uuidv4 } from "uuid";
import userRepositoryFactory from "../../src/repositories/userRepository.js";
import dbClientFactory from "../../src/common/db.js";
import initDatabase from "../../src/common/db.js";

describe("userRepository", () => {
  let userRepository = null;
  let dbClient = null;

  beforeAll(async () => {
    dbClient = initDatabase("test");
    userRepository = userRepositoryFactory(dbClient);
  });

  afterEach(async () => {
    const db = await dbClient.db("test");
    await db.collection("users").deleteMany({});
  });

  afterAll(async () => {
    await dbClient.close();
  });

  describe("create", () => {
    it("should create a user", async () => {
      const userId = uuidv4();
      const user = {
        id: userId,
        name: "Test User",
        email: "test@example.com",
        password: "password",
        journeys: [],
      };

      const createdUser = await userRepository.create(user);

      expect(createdUser.id).toBe(userId);
      expect(createdUser.name).toBe(user.name);
      expect(createdUser.email).toBe(user.email);
      expect(createdUser.password).toBe(user.password);
      expect(createdUser.journeys).toEqual([]);
    });
  });

  describe("addJourney", () => {
    let user;

    beforeAll(async () => {
      const userId = uuidv4();
      const userData = {
        id: userId,
        name: "Test User",
        email: "test@example.com",
        password: "password",
        journeys: [],
      };

      user = await userRepository.create(userData);
    });

    it("should add a journey to user", async () => {
      const journey = {
        journeyId: uuidv4(),
        journeyStartDate: "2025-01-01",
      };

      const updatedUser = await userRepository.addJourney({
        userId: user.id,
        ...journey,
      });

      expect(updatedUser.journeys).toHaveLength(1);
      expect(updatedUser.journeys[0].name).toBe(journey.name);
      expect(updatedUser.journeys[0].journeyStartDate).toEqual(
        journey.journeyStartDate
      );
    });
  });
});
