import express from "express";

const app = (routers) => {
  const app = express();
  app.use(express.json());
  for (const { routerpath, router } of routers) {
    app.use(routerpath, router);
  }
  return app;
};

export default app;
