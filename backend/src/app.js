import app from "./api/api.js";
import journeyControllerFactory from "./api/controllers/journeyController.js";
import dbClient from "./common/db.js";
import baseConfig from "./config/baseConfig.js";
import journeyRepositoryFactory from "./repositories/journeyRepository.js";
import journeyRouterFactory from "./api/routers/journeyRouter.js";

const journeyRepository = journeyRepositoryFactory(dbClient());
const journeyController = journeyControllerFactory(journeyRepository);
const journeyRouter = journeyRouterFactory(journeyController);

const appInstance = app([
  { routerpath: "/api/v1/journeys", router: journeyRouter },
]);

appInstance.listen(baseConfig.serverPort, () => {
  console.log(`Server is running at http://localhost:${baseConfig.serverPort}`);
});