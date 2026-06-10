const Joi = require('joi');

const createUserSchema = Joi.object({
  name: Joi.string().max(255).required(),
  email: Joi.string().email().max(255).required(),
  number: Joi.string().max(20).optional().allow('', null),
  address: Joi.string().optional().allow('', null),
});

const updateUserSchema = Joi.object({
  name: Joi.string().max(255).optional(),
  email: Joi.string().email().max(255).optional(),
  number: Joi.string().max(20).optional().allow('', null),
  address: Joi.string().optional().allow('', null),
}).min(1);

module.exports = {
  createUserSchema,
  updateUserSchema,
};
