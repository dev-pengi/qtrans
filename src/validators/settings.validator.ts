import Joi, { CustomHelpers } from "joi";

export const languagesValidator = Joi.object({
  languages: Joi.array().items(Joi.string()).required(),
  defaultLanguage: Joi.string()
    .required()
    .custom((value: string, helpers: CustomHelpers) => {
      const { languages } = helpers.state.ancestors[0] as {
        languages: string[];
      };
      if (!languages.includes(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }),
});
