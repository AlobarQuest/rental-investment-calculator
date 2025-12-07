import { InputState, RateSegment, YearlyResult, SummaryMetrics } from '../types';

export const calculateMortgagePayment = (principal: number, annualRate: number, years: number): number => {
  if (annualRate === 0) return years > 0 ? principal / (years * 12) : 0;
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = years * 12;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
};

export const calculateAnalysis = (inputs: InputState, rateSegments: RateSegment[]): { yearly: YearlyResult[], summary: SummaryMetrics } => {
  const {
    purchasePrice, downPaymentPercent, closingCosts, loanTermYears,
    monthlyRent, annualRentIncrease, otherMonthlyIncome, annualOtherIncomeIncrease, vacancyRate,
    propertyTax, annualTaxIncrease, insurance, annualInsuranceIncrease,
    hoaMonthly, annualHoaIncrease, maintenanceMonthly, annualMaintenanceIncrease, managementFeePercent,
    appreciationRate, holdingPeriod, costToSell
  } = inputs;

  const initialLoanAmount = purchasePrice * (1 - downPaymentPercent / 100);
  const initialInvestment = (purchasePrice * (downPaymentPercent / 100)) + closingCosts;

  let currentBalance = initialLoanAmount;
  let yearlyResults: YearlyResult[] = [];
  
  // Sort segments by start year to ensure chronological order
  const sortedSegments = [...rateSegments].sort((a, b) => a.startYear - b.startYear);

  let currentPropertyValue = purchasePrice;
  let currentMonthlyRent = monthlyRent;
  let currentOtherMonthlyIncome = otherMonthlyIncome;
  
  let currentAnnualTax = propertyTax;
  let currentAnnualInsurance = insurance;
  let currentMonthlyHoa = hoaMonthly;
  let currentMonthlyMaintenance = maintenanceMonthly;

  for (let year = 1; year <= holdingPeriod; year++) {
    // Determine interest rate for this year
    // Find the latest segment that starts on or before the current year
    const activeSegment = sortedSegments.reduce((prev, curr) => {
      return (curr.startYear <= year) ? curr : prev;
    }, sortedSegments[0]);

    const annualRate = activeSegment.interestRate;
    const monthlyRate = annualRate / 100 / 12;
    
    // Remaining years on loan from the START of the loan, not current year
    // However, for variable calculation, we re-amortize based on REMAINING term
    const yearsElapsed = year - 1;
    const remainingLoanTermYears = Math.max(0, loanTermYears - yearsElapsed);
    
    let annualPrincipalPaid = 0;
    let annualInterestPaid = 0;
    let annualMortgagePayment = 0;

    if (currentBalance > 0 && remainingLoanTermYears > 0) {
      // Calculate monthly payment for this year based on current balance and remaining term
      const monthlyPayment = calculateMortgagePayment(currentBalance, annualRate, remainingLoanTermYears);
      
      // Run 12 months of amortization
      for (let m = 0; m < 12; m++) {
        if (currentBalance <= 0) break;
        const interestPayment = currentBalance * monthlyRate;
        const principalPayment = Math.min(currentBalance, monthlyPayment - interestPayment);
        
        annualInterestPaid += interestPayment;
        annualPrincipalPaid += principalPayment;
        currentBalance -= principalPayment;
      }
      annualMortgagePayment = annualInterestPaid + annualPrincipalPaid;
    }

    // Income Calculations
    const grossPotentialRent = currentMonthlyRent * 12;
    const grossOtherIncome = currentOtherMonthlyIncome * 12;
    const vacancyLoss = (grossPotentialRent + grossOtherIncome) * (vacancyRate / 100);
    const effectiveGrossIncome = grossPotentialRent + grossOtherIncome - vacancyLoss;

    // Expense Calculations
    const managementFee = effectiveGrossIncome * (managementFeePercent / 100);
    const annualHoa = currentMonthlyHoa * 12;
    const annualMaintenance = currentMonthlyMaintenance * 12;
    const totalOperatingExpenses = currentAnnualTax + currentAnnualInsurance + annualHoa + annualMaintenance + managementFee;

    const noi = effectiveGrossIncome - totalOperatingExpenses;
    const cashFlow = noi - annualMortgagePayment;

    // Store Result
    yearlyResults.push({
      year,
      propertyValue: currentPropertyValue,
      rentalIncome: effectiveGrossIncome, // simplified for display
      otherIncome: grossOtherIncome, // tracking raw
      vacancyLoss,
      operatingExpenses: totalOperatingExpenses,
      noi,
      mortgagePayment: annualMortgagePayment,
      interestPaid: annualInterestPaid,
      principalPaid: annualPrincipalPaid,
      remainingLoanBalance: Math.max(0, currentBalance),
      cashFlow,
      equity: currentPropertyValue - Math.max(0, currentBalance),
      rateApplied: annualRate
    });

    // Increment values for next year
    currentPropertyValue *= (1 + appreciationRate / 100);
    currentMonthlyRent *= (1 + annualRentIncrease / 100);
    currentOtherMonthlyIncome *= (1 + annualOtherIncomeIncrease / 100);
    currentAnnualTax *= (1 + annualTaxIncrease / 100);
    currentAnnualInsurance *= (1 + annualInsuranceIncrease / 100);
    currentMonthlyHoa *= (1 + annualHoaIncrease / 100);
    currentMonthlyMaintenance *= (1 + annualMaintenanceIncrease / 100);
  }

  // Summary Metrics
  const year1 = yearlyResults[0];
  const totalCashFlow = yearlyResults.reduce((sum, y) => sum + y.cashFlow, 0);
  const finalYear = yearlyResults[yearlyResults.length - 1];
  
  const salePrice = finalYear.propertyValue;
  const saleProceeds = salePrice * (1 - costToSell / 100) - finalYear.remainingLoanBalance;
  const totalProfit = totalCashFlow + saleProceeds - initialInvestment;

  // IRR Approximation (Iterative)
  const calculateNPV = (rate: number) => {
    let npv = -initialInvestment;
    for (let i = 0; i < yearlyResults.length; i++) {
        let flow = yearlyResults[i].cashFlow;
        if (i === yearlyResults.length - 1) {
            flow += (yearlyResults[i].propertyValue * (1 - costToSell / 100) - yearlyResults[i].remainingLoanBalance);
        }
        npv += flow / Math.pow(1 + rate, i + 1);
    }
    return npv;
  };

  let irr = 0;
  let low = -0.5;
  let high = 1.0;
  for(let i=0; i<50; i++) { // 50 iterations for precision
      const mid = (low + high) / 2;
      if(calculateNPV(mid) > 0) low = mid;
      else high = mid;
  }
  irr = low * 100;

  const summary: SummaryMetrics = {
    irr,
    cashOnCash: (year1.cashFlow / initialInvestment) * 100,
    capRate: (year1.noi / purchasePrice) * 100,
    totalCashFlow,
    totalProfit,
    initialInvestment
  };

  return { yearly: yearlyResults, summary };
};
