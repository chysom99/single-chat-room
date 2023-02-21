const { celebrate, Joi, Segments } = require("celebrate");
const { isValidObjectId } = require("./utility.util");

class Validator {
	// Validators for auth routes
	static signupValidator = celebrate({
		[Segments.BODY]: Joi.object().keys({
			username: Joi.string()
				.required()
				.messages({ "string.empty": "Username required" }),
			password: Joi.string()
				.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/)
				.required()
				.label("Password")
				.messages({
					"string.min": "{#label} Must have at least 8 characters",
					"string.pattern.base":
						"{#label} must include at least eight characters, one uppercase and lowercase letter and one number",
				}),
		}),
	});

	static loginValidator = celebrate({
		[Segments.BODY]: Joi.object().keys({
			username: Joi.string()
				.required()
				.messages({ "string.empty": "Username required" }),
			password: Joi.string()
				.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/)
				.required()
				.label("Password")
				.messages({
					"string.min": "{#label} Must have at least 8 characters",
					"string.pattern.base":
						"{#label} must include at least eight characters, one uppercase and lowercase letter and one number",
				}),
		}),
	});

	// Others

	static postMessageValidator = celebrate({
		[Segments.BODY]: Joi.object().keys({
			messageText: Joi.string().required(),
			timeSent: Joi.date().required(),
		}),
	});

	static getMessagesValidator = celebrate({
		[Segments.QUERY]: Joi.object().keys({
			page: Joi.number().positive().min(1).default(1),
			limit: Joi.number().positive().min(1).default(25),
			select: Joi.string(),
			sort: Joi.string(),
			title: Joi.string(),
			description: Joi.string(),
			subject: Joi.string(),
		}),
	});
}

module.exports = Validator;
