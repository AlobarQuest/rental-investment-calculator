export interface RateSegment {
  id: string;
  startYear: number;
  interestRate: number; // Percentage
}

export interface InputState {
  // Purchase
  purchasePrice: number;
  downPaymentPercent: number;
  closingCosts: number;
  loanTermYears: number;
  
  // Income
  monthlyRent: number;
  annualRentIncrease: number; // %
  otherMonthlyIncome: number;
  annualOtherIncomeIncrease: number; // %
  vacancyRate: number; // %

  // Expenses (Annual unless specified)
  propertyTax: number;
  annualTaxIncrease: number; // %
  insurance: number;
  annualInsuranceIncrease: number; // %
  hoaMonthly: number;
  annualHoaIncrease: number; // %
  maintenanceMonthly: number;
  annualMaintenanceIncrease: number; // %
  managementFeePercent: number; // % of Rent
  
  // Sell / Valuation
  appreciationRate: number; // %
  holdingPeriod: number; // Years
  costToSell: number; // %
}

export interface YearlyResult {
  year: number;
  propertyValue: number;
  rentalIncome: number;
  otherIncome: number;
  vacancyLoss: number;
  operatingExpenses: number;
  noi: number; // Net Operating Income
  mortgagePayment: number; // Principal + Interest
  interestPaid: number;
  principalPaid: number;
  remainingLoanBalance: number;
  cashFlow: number;
  equity: number;
  rateApplied: number;
}

export interface SummaryMetrics {
  irr: number;
  cashOnCash: number; // Year 1
  capRate: number; // Year 1
  totalCashFlow: number;
  totalProfit: number; // Cash flow + Equity gain - Initial Inv
  initialInvestment: number;
}
