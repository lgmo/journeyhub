import app from "./api/api.js";
import journeyControllerFactory from "./api/controllers/journeyController.js";
import dbClient from "./common/db.js";
import baseConfig from "./config/baseConfig.js";
import journeyRepositoryFactory from "./repositories/journeyRepository.js";
import journeyRouterFactory from "./api/routers/journeyRouter.js";
import userRouterFactory from "./api/routers/userRouter.js";
import userControllerFactory from "./api/controllers/userController.js";
import workerServiceFactory from "./api/services/backgroundProcessor.js";
import Bull from "bull";
import redisConfig from "./config/redisConfig.js";

const journeyRepository = journeyRepositoryFactory(dbClient());
const journeyController = journeyControllerFactory(journeyRepository);
const journeyRouter = journeyRouterFactory(journeyController);

const userController = userControllerFactory({});
const userRouter = userRouterFactory(userController);

const appInstance = app([
  { routerpath: "/api/v1/journeys", router: journeyRouter },
  { routerpath: "/api/v1/users", router: userRouter },
]);

appInstance.listen(baseConfig.serverPort, () => {
  console.log(`Server is running at http://localhost:${baseConfig.serverPort}`);
});
