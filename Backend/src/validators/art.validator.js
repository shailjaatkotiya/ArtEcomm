const Joi = require('joi');

const createArtSchema = Joi.object({
  type: Joi.string().valid('wall decor', 'room decor', 'digital').required(),
  material: Joi.string().valid('canvas', 'paper', 'prints').required(),
  color: Joi.string().valid('acrylic', 'poster').required(),
  shape: Joi.string().valid('landscape', 'portrait', 'square').required(),
  special_edition: Joi.boolean().optional().default(false),
  image_url: Joi.string().uri().required(),
  price: Joi.number().positive().required(),
  description: Joi.string().max(255).required(),
  dimension: Joi.string().max(100).optional()
});

const updateArtSchema = Joi.object({
  type: Joi.string().valid('wall decor', 'room decor', 'digital').optional(),
  material: Joi.string().valid('canvas', 'paper', 'prints').optional(),
  color: Joi.string().valid('acrylic', 'poster').optional(),
  shape: Joi.string().valid('landscape', 'portrait', 'square').optional(),
  special_edition: Joi.boolean().optional(),
  image_url: Joi.string().uri().optional(),
  price: Joi.number().positive().optional(),
  description: Joi.string().max(255).optional(),
  dimension: Joi.string().max(100).optional()
}).min(1);

module.exports = {
  createArtSchema,
  updateArtSchema,
};
