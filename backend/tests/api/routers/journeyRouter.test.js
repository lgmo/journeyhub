import { describe, afterEach, it, expect } from "@jest/globals";
import request from "supertest";
import client from "../../../src/common/db.js";
import app from "../../../src/api/api.js";
import { v4 as uuidv4 } from "uuid";
import journeyRepositoryFactory from "../../../src/repositories/journeyRepository.js";
import journeyControllerFactory from "../../../src/api/controllers/journeyController.js";
import journeyRouterFactory from "../../../src/api/routers/journeyRouter.js";

describe("journeyRouter", () => {
  let dbClient;
  let appInstance;

  beforeAll(() => {
    dbClient = client();
    const journeyRepository = journeyRepositoryFactory(dbClient);
    const journeyController = journeyControllerFactory(journeyRepository);
    const journeyRouter = journeyRouterFactory(journeyController);

    appInstance = app([
      { routerpath: "/api/v1/journeys", router: journeyRouter },
    ]);
  });

  afterEach(async () => {
    const db = await dbClient.getDB();
    await db.collection("journeys").deleteMany({});
  });

  afterAll(async () => {
    await dbClient.close();
  });

  describe("create", () => {
    it("should create a journey", async () => {
      const journeyData = {
        name: "Test Journey",
        actions: [
          [
            {
              type: "email",
              content: "content",
              runsAt: new Date().toISOString().split("T")[1],
            },
          ],
        ],
      };

      const mockJourney = {
        id: uuidv4(),
        ...journeyData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const res = await request(appInstance)
        .post("/api/v1/journeys")
        .send(journeyData);

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.name).toBe(journeyData.name);
      expect(res.body.actions).toEqual(journeyData.actions);
      expect(res.body.createdAt).toBeDefined();
      expect(res.body.updatedAt).toBeDefined();
    });

    it("should fail due to bad request", async () => {
      const journeyData = {
        actions: [
          [
            {
              type: "email",
              content: "content",
              runsAt: new Date().toISOString().split("T")[1],
            },
          ],
        ],
      };

      const mockJourney = {
        id: uuidv4(),
        ...journeyData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const res = await request(appInstance)
        .post("/api/v1/journeys")
        .send(journeyData);

      expect(res.status).toBe(400);
    });
  });
});
