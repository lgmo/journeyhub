import queueServiceFactory from "../../src/api/services/queueService";
import workerServiceFactory from "../../src/api/services/workerService";
import dbClientFactory from "../../src/common/db";
import { afterAll, describe, it, jest } from "@jest/globals";
import userRepositoryFactory from "../../src/repositories/userRepository";
import journeyRepositoryFactory from "../../src/repositories/journeyRepository";
import { v4 as uuidv4 } from "uuid";

describe("workerService", () => {
  let queueService;
  let workerService;
  let dbClient;
  let journeyRepository;
  let userRepository;
  let user;
  let db;

  beforeAll(async () => {
    queueService = await queueServiceFactory("queue");
    dbClient = dbClientFactory("test");
    // journeyRepository = journeyRepositoryFactory(dbClient);

    // workerService = workerServiceFactory({ queueService, journeyRepository });
    userRepository = userRepositoryFactory(dbClient);
    db = dbClient.getDB("test");
  });

  afterAll(async () => {
    await dbClient.close();
    await queueService.close();
  });

  it("should build a job", async () => {
    const userId = uuidv4();
    const user = {
      id: userId,
      name: "Test User",
      email: "test@example.com",
      password: "password",
      journeys: [],
    };

    const createdUser = await userRepository.create(user);
    await userRepository.create({
      id: uuidv4(),
      name: "Test User",
      journeys: [],
    });
  });
});
