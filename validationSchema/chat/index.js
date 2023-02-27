const Joi = require("joi");

const createRoomSchema = Joi.object({
  sender: Joi.string().required(),
  reciever: Joi.string().required(),
});

const createMessageSchema = Joi.object({
  _id: Joi.string().required(),
  sender: Joi.string().required(),
  reciever: Joi.string().required(),
  message: Joi.string().required()
});


module.exports = { createRoomSchema, createMessageSchema };
