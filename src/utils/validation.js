import Joi from 'joi';

/**
 * Define a schema for listings
 */
export const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required().messages({
      'string.empty': 'Title is required',
      'any.required': 'Title is required'
    }),
    description: Joi.string().required().messages({
      'string.empty': 'Description is required',
      'any.required': 'Description is required'
    }),
    price: Joi.number().required().min(0).messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price must be at least 0',
      'any.required': 'Price is required'
    }),
  }).required()
});

/**
 * Middleware factory to validate request body against a Joi schema
 * @param {Joi.ObjectSchema} schema - Joi schema object
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const message = error.details.map(el => el.message).join(', ');
      return res.status(400).send({ error: message }); // Or next(new Error(message)) if you have centralized error handling
    }
    next();
  }
}
