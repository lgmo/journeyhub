import Joi from "joi";
import JoiDate from "@joi/date";

export const createJourneySchemas = {
  bodySchema: Joi.object({
    name: Joi.string()
      .pattern(/^[a-zA-Z]+( [a-zA-Z])*/)
      .min(3)
      .max(255)
      .required(),
    actions: Joi.array()
      .items(
        Joi.array().items(
          Joi.object({
            type: Joi.string().valid("email", "discord", "meeting").required(),
            content: Joi.string().min(3).max(500).required(),
            runsAt: Joi.extend(JoiDate).date().format("hh:mm:ss").required(),
          })
        )
      )
      .required(),
  }),
};
