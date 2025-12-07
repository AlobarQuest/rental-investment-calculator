/**
 * Base class for all financial calculation errors
 */
export class CalculationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CalculationError';
    Object.setPrototypeOf(this, CalculationError.prototype);
  }
}

/**
 * Error thrown when attempting division by zero in financial calculations
 */
export class DivisionByZeroError extends CalculationError {
  constructor(message: string = 'Division by zero is not allowed in financial calculations') {
    super(message);
    this.name = 'DivisionByZeroError';
    Object.setPrototypeOf(this, DivisionByZeroError.prototype);
  }
}

/**
 * Error thrown when a negative value is provided where only positive values are accepted
 */
export class NegativeValueError extends CalculationError {
  constructor(message: string = 'Negative values are not allowed for this calculation') {
    super(message);
    this.name = 'NegativeValueError';
    Object.setPrototypeOf(this, NegativeValueError.prototype);
  }
}

/**
 * Error thrown when an iterative calculation fails to converge within the specified limits
 */
export class ConvergenceError extends CalculationError {
  constructor(message: string = 'Calculation failed to converge within the specified tolerance and maximum iterations') {
    super(message);
    this.name = 'ConvergenceError';
    Object.setPrototypeOf(this, ConvergenceError.prototype);
  }
}

/**
 * Type union of all financial calculation error types
 */
export type FinancialError = CalculationError | DivisionByZeroError | NegativeValueError | ConvergenceError;

/**
 * Type guard to check if an error is a financial calculation error
 */
export function isFinancialError(error: unknown): error is FinancialError {
  return error instanceof CalculationError;
}