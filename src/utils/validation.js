import Joi from 'joi';

/**
 * Define a schema for listings
 */
export const listingSchema = Joi.object({
  listing: Joi.object({
    // Core Fields
    title: Joi.string().required().trim().min(1).max(100).messages({
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 1 character long',
      'string.max': 'Title cannot exceed 100 characters',
      'any.required': 'Title is required'
    }),
    
    description: Joi.string().required().trim().min(10).max(2000).messages({
      'string.empty': 'Description is required',
      'string.min': 'Description must be at least 10 characters long',
      'string.max': 'Description cannot exceed 2000 characters',
      'any.required': 'Description is required'
    }),

    // Pricing & Currencies
    price: Joi.object({
      base: Joi.number().required().min(0).max(1000000).messages({
        'number.base': 'Base price must be a number',
        'number.min': 'Base price must be at least 0',
        'number.max': 'Base price cannot exceed 1,000,000',
        'any.required': 'Base price is required'
      }),
      currency: Joi.string().valid('INR', 'USD', 'EUR').default('INR').messages({
        'any.only': 'Currency must be INR, USD, or EUR'
      })
    }).required(),

    // Location & GeoJSON
    location: Joi.object({
      street: Joi.string().required().trim().min(1).max(200).messages({
        'string.empty': 'Street address is required',
        'string.min': 'Street address must be at least 1 character long',
        'string.max': 'Street address cannot exceed 200 characters',
        'any.required': 'Street address is required'
      }),
      city: Joi.string().required().trim().min(1).max(50).messages({
        'string.empty': 'City is required',
        'string.min': 'City must be at least 1 character long',
        'string.max': 'City cannot exceed 50 characters',
        'any.required': 'City is required'
      }),
      state: Joi.string().required().trim().min(1).max(50).messages({
        'string.empty': 'State is required',
        'string.min': 'State must be at least 1 character long',
        'string.max': 'State cannot exceed 50 characters',
        'any.required': 'State is required'
      }),
      country: Joi.string().required().trim().min(1).max(50).messages({
        'string.empty': 'Country is required',
        'string.min': 'Country must be at least 1 character long',
        'string.max': 'Country cannot exceed 50 characters',
        'any.required': 'Country is required'
      }),
      pincode: Joi.string().required().trim().min(3).max(10).pattern(/^[a-zA-Z0-9\s\-]*$/).messages({
        'string.empty': 'Pincode is required',
        'string.min': 'Pincode must be at least 3 characters long',
        'string.max': 'Pincode cannot exceed 10 characters',
        'string.pattern.base': 'Pincode can only contain letters, numbers, spaces, and hyphens',
        'any.required': 'Pincode is required'
      }),
      geometry: Joi.object({
        type: Joi.string().valid('Point').default('Point').required().messages({
          'any.only': 'Geometry type must be "Point"',
          'any.required': 'Geometry type is required'
        }),
        coordinates: Joi.array().items(
          Joi.number().min(-180).max(180).required(), // longitude
          Joi.number().min(-90).max(90).required()   // latitude
        ).length(2).required().messages({
          'array.length': 'Coordinates must contain exactly 2 numbers [longitude, latitude]',
          'number.min': 'Longitude must be between -180 and 180, Latitude between -90 and 90',
          'number.max': 'Longitude must be between -180 and 180, Latitude between -90 and 90',
          'any.required': 'Coordinates are required'
        })
      }).required()
    }).required(),

    // Media & Images
    images: Joi.array().items(
      Joi.object({
        url: Joi.string().uri().required().messages({
          'string.uri': 'Image URL must be a valid URL',
          'any.required': 'Image URL is required'
        }),
        filename: Joi.string().trim().allow('').optional()
      })
    ).min(1).max(5).required().messages({
      'array.min': 'At least 1 image is required',
      'array.max': 'Cannot have more than 5 images',
      'any.required': 'Images are required'
    }),

    // Specifications and Capacity
    maxGuests: Joi.number().required().min(1).max(50).messages({
      'number.base': 'Max guests must be a number',
      'number.min': 'Max guests must be at least 1',
      'number.max': 'Max guests cannot exceed 50',
      'any.required': 'Max guests is required'
    }),
    
    bedrooms: Joi.number().default(1).min(0).max(20).messages({
      'number.base': 'Bedrooms must be a number',
      'number.min': 'Bedrooms cannot be negative',
      'number.max': 'Bedrooms cannot exceed 20'
    }),
    
    beds: Joi.number().default(1).min(1).max(50).messages({
      'number.base': 'Beds must be a number',
      'number.min': 'Beds must be at least 1',
      'number.max': 'Beds cannot exceed 50'
    }),
    
    bathrooms: Joi.number().default(1).min(0).max(20).messages({
      'number.base': 'Bathrooms must be a number',
      'number.min': 'Bathrooms cannot be negative',
      'number.max': 'Bathrooms cannot exceed 20'
    }),

    // Categorization
    type: Joi.string().valid('Entire Place', 'Private Room', 'Hotel Room', 'Shared Room').required().messages({
      'any.only': 'Type must be one of: Entire Place, Private Room, Hotel Room, Shared Room',
      'any.required': 'Type is required'
    }),

    amenities: Joi.array().items(Joi.string().trim()).default([]),

    // Listing Status
    status: Joi.string().valid('active', 'inactive', 'pending', 'blocked').default('active').messages({
      'any.only': 'Status must be one of: active, inactive, pending, blocked'
    }),

    // Availability (date ranges)
    availability: Joi.array().items(
      Joi.object({
        from: Joi.date().greater('now').required().messages({
          'date.greater': 'Availability start date must be in the future',
          'any.required': 'Availability start date is required'
        }),
        to: Joi.date().greater(Joi.ref('from')).required().messages({
          'date.greater': 'Availability end date must be after start date',
          'any.required': 'Availability end date is required'
        })
      })
    ).default([])

  }).required()
});

/**
 * Schema for updating listings (all fields optional)
 */
export const listingUpdateSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().trim().min(1).max(100).optional(),
    description: Joi.string().trim().min(10).max(2000).optional(),
    price: Joi.object({
      base: Joi.number().min(0).max(1000000).optional(),
      currency: Joi.string().valid('INR', 'USD', 'EUR').optional()
    }).optional(),
    location: Joi.object({
      street: Joi.string().trim().min(1).max(200).optional(),
      city: Joi.string().trim().min(1).max(50).optional(),
      state: Joi.string().trim().min(1).max(50).optional(),
      country: Joi.string().trim().min(1).max(50).optional(),
      pincode: Joi.string().trim().min(3).max(10).pattern(/^[a-zA-Z0-9\s\-]*$/).optional(),
      geometry: Joi.object({
        type: Joi.string().valid('Point').optional(),
        coordinates: Joi.array().items(
          Joi.number().min(-180).max(180),
          Joi.number().min(-90).max(90)
        ).length(2).optional()
      }).optional()
    }).optional(),
    images: Joi.array().items(
      Joi.object({
        url: Joi.string().uri().required(),
        filename: Joi.string().trim().allow('').optional()
      })
    ).min(1).max(5).optional(),
    maxGuests: Joi.number().min(1).max(50).optional(),
    bedrooms: Joi.number().min(0).max(20).optional(),
    beds: Joi.number().min(1).max(50).optional(),
    bathrooms: Joi.number().min(0).max(20).optional(),
    type: Joi.string().valid('Entire Place', 'Private Room', 'Hotel Room', 'Shared Room').optional(),
    amenities: Joi.array().items(Joi.string().trim()).optional(),
    amenities: Joi.array().items(Joi.string().trim()).optional().single(),
    status: Joi.string().valid('active', 'inactive', 'pending', 'blocked').optional(),
    availability: Joi.array().items(
      Joi.object({
        from: Joi.date().min('now').required(),
        to: Joi.date().greater(Joi.ref('from')).required()
      })
    ).optional()
  }).required()
});

/**
 * Schema for search/filter parameters
 */
export const listingSearchSchema = Joi.object({
  search: Joi.string().trim().max(100).optional(),
  type: Joi.string().valid('Entire Place', 'Private Room', 'Hotel Room', 'Shared Room').optional(),
  status: Joi.string().valid('active', 'inactive', 'pending', 'blocked').optional(),
  minPrice: Joi.number().min(0).max(1000000).optional(),
  maxPrice: Joi.number().min(0).max(1000000).optional(),
  maxGuests: Joi.number().min(1).max(50).optional(),
  city: Joi.string().trim().max(50).optional(),

  // Date filters for availability
  availableFrom: Joi.date().iso().min('now').optional().messages({
    'date.format': 'Available from date must be in ISO format (YYYY-MM-DD)',
    'date.min': 'Available from date cannot be in the past'
  }),
  
  availableTo: Joi.date().iso().min(Joi.ref('availableFrom')).optional().messages({
    'date.format': 'Available to date must be in ISO format (YYYY-MM-DD)',
    'date.min': 'Available to date must be after available from date'
  }),

  // Check-in/Check-out dates for booking simulation
  checkIn: Joi.date().iso().min('now').optional().messages({
    'date.format': 'Check-in date must be in ISO format (YYYY-MM-DD)',
    'date.min': 'Check-in date cannot be in the past'
  }),
  
  checkOut: Joi.date().iso().min(Joi.ref('checkIn')).optional().messages({
    'date.format': 'Check-out date must be in ISO format (YYYY-MM-DD)',
    'date.min': 'Check-out date must be after check-in date'
  }),
  
  // Pagination
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(10),

  // Sort options
  sortBy: Joi.string().valid('price', 'createdAt', 'maxGuests', 'title').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc')
});

/**
 * Middleware factory to validate request body against a Joi schema
 * @param {Joi.ObjectSchema} schema - Joi schema object
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true // Remove unknown fields
    });
    
    if (error) {
      const message = error.details.map(el => el.message).join(', ');
      return res.status(400).json({ 
        error: 'Validation failed',
        details: message,
        fields: error.details.map(detail => detail.path.join('.'))
      });
    }
    next();
  };
};

/**
 * Middleware for validating query parameters
 */
export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query, { 
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const message = error.details.map(el => el.message).join(', ');
      return res.status(400).json({ 
        error: 'Invalid query parameters',
        details: message
      });
    }
    next();
  };
};