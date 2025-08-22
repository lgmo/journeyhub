import { describe, afterEach, it, expect } from "@jest/globals";
import request from "supertest";
import dbClientFactory from "../../../src/common/db.js";
import app from "../../../src/api/api.js";
import { v4 as uuidv4 } from "uuid";
import journeyRepositoryFactory from "../../../src/repositories/journeyRepository.js";
import journeyControllerFactory from "../../../src/api/controllers/journeyController.js";
import journeyRouterFactory from "../../../src/api/routers/journeyRouter.js";

describe("journeyRouter", () => {
  let dbClient;
  let appInstance;

  beforeAll(() => {
    dbClient = dbClientFactory("test");
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
              runsAt: "12:00:00",
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

    it("should not create a journey without name", async () => {
      const journeyData = {
        actions: [
          [
            {
              type: "email",
              content: "content",
              runsAt: "12:00:00",
            },
          ],
        ],
      };

      const res = await request(appInstance)
        .post("/api/v1/journeys")
        .send(journeyData);

      expect(res.status).toBe(400);
    });

    it("should not create a journey with an action without type", async () => {
      const journeyData = {
        actions: [
          [
            {
              content: "content",
              runsAt: "12:00:00",
            },
          ],
        ],
      };

      const res = await request(appInstance)
        .post("/api/v1/journeys")
        .send(journeyData);

      expect(res.status).toBe(400);
    });

    it("should not create a journey without actions", async () => {
      const journeyData = {
        name: "Test Journey",
      };

      const res = await request(appInstance)
        .post("/api/v1/journeys")
        .send(journeyData);

      expect(res.status).toBe(400);
    });

    it("should not create a journey with an action without content", async () => {
      const journeyData = {
        actions: [
          [
            {
              type: "email",
              runsAt: "23:59:59",
            },
          ],
        ],
      };

      const res = await request(appInstance)
        .post("/api/v1/journeys")
        .send(journeyData);

      expect(res.status).toBe(400);
    });

    it("should not create a journey with an action without runsAt", async () => {
      const journeyData = {
        actions: [
          [
            {
              type: "email",
              content: "content",
            },
          ],
        ],
      };

      const res = await request(appInstance)
        .post("/api/v1/journeys")
        .send(journeyData);

      expect(res.status).toBe(400);
    });

    it("should not create a journey with an action with an invalid runsAt", async () => {
      const journeyData = {
        actions: [
          [
            {
              type: "email",
              content: "content",
              runsAt: "invalid date",
            },
          ],
        ],
      };

      const res = await request(appInstance)
        .post("/api/v1/journeys")
        .send(journeyData);

      expect(res.status).toBe(400);
    });
  });
});
