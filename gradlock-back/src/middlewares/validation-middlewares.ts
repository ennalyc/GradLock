import { RequestHandler } from 'express';
import { ValidationError } from '../errors/httpErrors';
import { z, ZodError } from 'zod';

export const validateRequest =
  ({
    bodySchema,
    querySchema,
    pathSchema,
  }: {
    bodySchema?: z.ZodSchema;
    querySchema?: z.ZodSchema;
    pathSchema?: z.ZodSchema;
  }): RequestHandler =>
  (req, _res, next) => {
    try {
      if (pathSchema) {
        pathSchema.parse(req.params);
      }
      if (bodySchema) {
        bodySchema.parse(req.body); // Valida os parâmetros de rota
      }

      if (querySchema) {
        querySchema.parse(req.query);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues
          .map((issue) => {
            const path = issue.path.length > 0 ? issue.path.join('.') : '(request body)';
            return `${path}: ${issue.message}`;
          })
          .join('; ');

        next(new ValidationError(errorMessages));
      }
      next(error);
    }
  };
