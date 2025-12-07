import { z } from 'zod';

export interface ValidationError {
  field: string;
  message: string;
}

export const createValidator = <T,>(schema: z.ZodSchema<T>) => {
  return (data: unknown): T => {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.issues[0];
        throw new Error(
          `Validation failed for ${firstError.path.join('.')}: ${firstError.message}`
        );
      }
      throw error;
    }
  };
};

export const validateField = <T,>(
  value: unknown,
  schema: z.ZodSchema<T>,
  fieldName: string
): T => {
  try {
    return schema.parse(value);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      throw new Error(`${fieldName}: ${firstError.message}`);
    }
    throw error;
  }
};

export const safeValidate = <T,>(
  data: unknown,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: ValidationError } => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return {
        success: false,
        error: {
          field: firstError.path.join('.'),
          message: firstError.message
        }
      };
    }
    return {
      success: false,
      error: { field: 'unknown', message: 'Validation failed' }
    };
  }
};
