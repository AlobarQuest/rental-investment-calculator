import { z } from 'zod';

export const financialCalculatorSchema = z.object({
  purchasePrice: z.number()
    .positive('Purchase price must be positive')
    .min(10000, 'Purchase price must be at least $10,000')
    .max(10000000, 'Purchase price cannot exceed $10,000,000'),
  
  monthlyRent: z.number()
    .positive('Monthly rent must be positive')
    .min(100, 'Monthly rent must be at least $100')
    .max(100000, 'Monthly rent cannot exceed $100,000'),
  
  expenses: z.number()
    .positive('Expenses must be positive')
    .min(0, 'Expenses cannot be negative')
    .max(50000, 'Monthly expenses cannot exceed $50,000'),
  
  downPayment: z.number()
    .positive('Down payment must be positive')
    .min(1000, 'Down payment must be at least $1,000')
    .max(10000000, 'Down payment cannot exceed $10,000,000'),
  
  interestRate: z.number()
    .positive('Interest rate must be positive')
    .min(0.01, 'Interest rate must be at least 0.01%')
    .max(20, 'Interest rate cannot exceed 20%')
});

export type FinancialCalculatorInput = z.infer<typeof financialCalculatorSchema>;