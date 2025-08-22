import {
  describe,
  beforeEach,
  afterEach,
  it,
  expect,
  jest,
  beforeAll,
} from "@jest/globals";
import { v4 as uuidv4 } from "uuid";
import userControllerFactory from "../../../src/api/controllers/userController.js";

describe("userController", () => {
  let userRepository;
  let userController;
  let req;
  let res;
  let status;
  let response;

  beforeEach(() => {
    userRepository = {
      addJourney: jest.fn(),
    };

    userController = userControllerFactory(userRepository);

    status = null;
    response = {};
    res = {
      status: jest.fn().mockImplementation((code) => {
        status = code;
        return {
          json: jest.fn().mockImplementation((data) => {
            response = { ...data };
          }),
          send: jest.fn().mockImplementation((data) => {
            response = { ...data };
          }),
        };
      }),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("addJourney", () => {
    beforeAll(() => {
      req = {
        body: {
          journeyId: uuidv4(),
        },
        params: {
          userId: uuidv4(),
        },
      };
    });

    it("should add a journey to user", async () => {
      await userController.addJourney(req, res);

      expect(status).toBe(204);
    });

    // it("should return 500 if repository throws an error", async () => {
    //   const journeyData = {
    //     name: "Test Journey",
    //     actions: [
    //       [
    //         {
    //           type: "email",
    //           content: "content",
    //           runsAt: new Date().toISOString().split("T")[1],
    //         },
    //       ],
    //     ],
    //   };

    //   journeyRepository.create.mockRejectedValue(new Error("Database error"));

    //   req.body = journeyData;

    //   await journeyController.create(req, res);

    //   expect(status).toBe(500);
    //   expect(journeyRepository.create).toHaveBeenCalledWith(
    //     expect.objectContaining(journeyData)
    //   );
    // });
  });
});
