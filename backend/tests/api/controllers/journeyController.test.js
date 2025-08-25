import {
  describe,
  beforeEach,
  afterEach,
  it,
  expect,
  jest,
} from "@jest/globals";
import { v4 as uuidv4 } from "uuid";
import journeyControllerFactory from "../../../src/api/controllers/journeyController.js";

describe("journeyController", () => {
  let journeyRepository;
  let journeyController;
  let req;
  let res;
  let status;
  let response;

  beforeEach(() => {
    journeyRepository = {
      create: jest.fn(),
    };

    journeyController = journeyControllerFactory(journeyRepository);

    req = {
      body: {},
    };

    status = null;
    response = {};
    res = {
      status: jest.fn().mockImplementation((code) => {
        status = code;
        return {
          json: jest.fn().mockImplementation((data) => {
            response = { ...data };
          }),
        };
      }),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
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
      journeyRepository.create.mockResolvedValue(mockJourney);

      req.body = journeyData;

      await journeyController.create(req, res);

      expect(status).toBe(201);
      expect(response.id).toBeDefined();
      expect(response.name).toBe(journeyData.name);
      expect(response.actions).toEqual(journeyData.actions);
      expect(response.createdAt).toBeDefined();
      expect(response.updatedAt).toBeDefined();
      expect(journeyRepository.create).toHaveBeenCalledWith(
        expect.objectContaining(journeyData)
      );
    });

    it("should return 500 if repository throws an error", async () => {
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

      journeyRepository.create.mockRejectedValue(new Error("Database error"));

      req.body = journeyData;

      await journeyController.create(req, res);

      expect(status).toBe(500);
      expect(journeyRepository.create).toHaveBeenCalledWith(
        expect.objectContaining(journeyData)
      );
    });
  });
});
