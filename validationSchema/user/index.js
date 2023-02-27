const Joi = require('joi')

const userSignupSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9@]{3,30}$")),
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9@]{3,30}$")),
});


module.exports = { userSignupSchema, userLoginSchema };