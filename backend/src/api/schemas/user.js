import Joi from "joi";
import JoiDate from "@joi/date";

export const addJourneySchemas = {
  bodySchema: Joi.object({
    journeyId: Joi.string().uuid().required(),
    journeyStartDate: Joi.extend(JoiDate)
      .date()
      .format("YYYY-MM-DD")
      .required(),
  }),
  paramsSchema: Joi.object({
    userId: Joi.string().uuid().required(),
  }),
};
