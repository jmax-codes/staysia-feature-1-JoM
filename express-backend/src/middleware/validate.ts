/**
 * Validation Middleware
 * 
 * Middleware factory for Yup schema validation.
 */

import { Request, Response, NextFunction } from 'express';
import { AnySchema } from 'yup';

export interface ValidationTarget {
  body?: AnySchema;
  query?: AnySchema;
  params?: AnySchema;
}

/**
 * Create validation middleware from Yup schemas
 */
export function validate(schemas: ValidationTarget) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate body
      if (schemas.body) {
        req.body = await schemas.body.validate(req.body, {
          abortEarly: false,
          stripUnknown: true
        });
      }

      // Validate query
      if (schemas.query) {
        req.query = await schemas.query.validate(req.query, {
          abortEarly: false,
          stripUnknown: true
        });
      }

      // Validate params
      if (schemas.params) {
        req.params = await schemas.params.validate(req.params, {
          abortEarly: false,
          stripUnknown: true
        });
      }

      next();
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        res.status(400).json({
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: error.errors
        });
        return;
      }

      next(error);
    }
  };
}
