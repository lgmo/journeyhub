import Joi from "joi";

export const createJourneySchema = Joi.object({
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
          runsAt: Joi.string().pattern(
            /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9][0-9]?[0-9]Z?)$/
          ),
        })
      )
    )
    .required(),
});
