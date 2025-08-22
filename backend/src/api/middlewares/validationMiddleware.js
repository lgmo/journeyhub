const validationMiddleware = ({ bodySchema, paramsSchema }) => {
  return async (req, res, next) => {
    try {
      if (bodySchema) {
        await bodySchema.validateAsync(req?.body || {});
      }

      if (paramsSchema) {
        await paramsSchema.validateAsync(req?.params || {});
      }

      next();
    } catch (error) {
      res.status(400).send(error.details);
    }
  };
};

export default validationMiddleware;
