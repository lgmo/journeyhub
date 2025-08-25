import { describe, afterEach, it, expect } from "@jest/globals";
import request from "supertest";
import dbClientFactory from "../../../src/common/db.js";
import app from "../../../src/api/api.js";
import { v4 as uuidv4 } from "uuid";
import userControllerFactory from "../../../src/api/controllers/userController.js";
import userRouterFactory from "../../../src/api/routers/userRouter.js";

describe("userRouter", () => {
  let dbClient;
  let appInstance;

  beforeAll(() => {
    dbClient = dbClientFactory("test");
    const userRepository = {}; //userRepositoryFactory(dbClient);
    const userController = userControllerFactory(userRepository);
    const userRouter = userRouterFactory(userController);

    appInstance = app([{ routerpath: "/api/v1/users", router: userRouter }]);
  });

  afterEach(async () => {
    const db = await dbClient.getDB();
    await db.collection("users").deleteMany({});
  });

  afterAll(async () => {
    await dbClient.close();
  });

  describe("addJourney", () => {
    it("should add a journey to the user", async () => {
      const userId = uuidv4();
      const journeyId = uuidv4();
      const journeyStartDate = new Date().toISOString().split("T")[0];

      const response = await request(appInstance)
        .post(`/api/v1/users/${userId}/journeys`)
        .send({ journeyId, journeyStartDate });

      expect(response.status).toBe(204);
    });

    it("should fail due to missing journeyId", async () => {
      const userId = uuidv4();

      const response = await request(appInstance).post(
        `/api/v1/users/${userId}/journeys`
      );

      expect(response.status).toBe(400);
    });

    it("should fail due to missing journeyStartDate", async () => {
      const userId = uuidv4();

      const response = await request(appInstance).post(
        `/api/v1/users/${userId}/journeys`
      );

      expect(response.status).toBe(400);
    });
  });
});
