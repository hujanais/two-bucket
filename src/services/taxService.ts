// Define a type for a tax bracket
export type TaxBracket = {
  upperLimit: number;
  rate: number;
};

// Define input parameters for tax calculation
export interface TaxpayerInfo {
  grossIncome: number;
  filingStatus: 'single' | 'married';
  itemizedDeductions?: number;
}

// Tax calculation result
export interface TaxCalculationResult {
  federalTax: number;
  stateTax: number;
  totalTax: number;
  netIncome: number;
}

// Simplified Federal Tax Brackets for 2024
export const FEDERAL_BRACKETS_SINGLE: TaxBracket[] = [
  { upperLimit: 11600, rate: 0.10 },
  { upperLimit: 47150, rate: 0.12 },
  { upperLimit: 100525, rate: 0.22 },
  { upperLimit: 191950, rate: 0.24 },
  { upperLimit: 243725, rate: 0.32 },
  { upperLimit: 609350, rate: 0.35 },
  { upperLimit: Infinity, rate: 0.37 },
];

export const FEDERAL_BRACKETS_MARRIED: TaxBracket[] = [
  { upperLimit: 23200, rate: 0.10 },
  { upperLimit: 94300, rate: 0.12 },
  { upperLimit: 201050, rate: 0.22 },
  { upperLimit: 383900, rate: 0.24 },
  { upperLimit: 487450, rate: 0.32 },
  { upperLimit: 731200, rate: 0.35 },
  { upperLimit: Infinity, rate: 0.37 },
];

export const STANDARD_DEDUCTIONS: Record<TaxpayerInfo['filingStatus'], number> = {
  single: 14600,
  married: 29200,
};

/**
 * Calculates the tax owed based on progressive tax brackets.
 * @param taxableIncome The income amount after deductions.
 * @param brackets The tax brackets to use.
 * @returns The total tax owed.
 */
export function calculateProgressiveTax(taxableIncome: number, brackets: TaxBracket[]): number {
  let totalTax = 0;
  let remainingIncome = taxableIncome;
  let previousLimit = 0;

  for (const bracket of brackets) {
    if (remainingIncome > bracket.upperLimit) {
      const incomeInBracket = bracket.upperLimit - previousLimit;
      totalTax += incomeInBracket * bracket.rate;
      remainingIncome -= incomeInBracket;
    } else {
      totalTax += (remainingIncome - previousLimit) * bracket.rate;
      break; // All remaining income taxed
    }
    previousLimit = bracket.upperLimit;
  }
  return totalTax;
}

/**
 * Calculates the pre-tax income required to achieve a target after-tax income.
 * This function reverses the tax calculation to find what gross income is needed.
 * @param info Taxpayer information.
 * @param afterTaxIncome The desired after-tax income amount.
 * @param brackets The tax brackets to use.
 * @returns The pre-tax (gross) income required to achieve the after-tax amount.
 */
export function calculatePreTaxIncome(info: TaxpayerInfo, afterTaxIncome: number, brackets: TaxBracket[]): number {
  // Get the appropriate deduction amount based on filing status
  const standardDeduction = STANDARD_DEDUCTIONS[info.filingStatus];
  const deductionAmount = (info.itemizedDeductions && info.itemizedDeductions > standardDeduction)
    ? info.itemizedDeductions
    : standardDeduction;
  
  // Use binary search to find the gross income that results in the desired after-tax income
  // We know: afterTaxIncome = grossIncome - tax(taxableIncome)
  // where taxableIncome = grossIncome - deductionAmount
  
  // Find the maximum possible gross income (upper bound)
  // For a flat rate r, afterTaxIncome = grossIncome - tax(grossIncome - deduction)
  // Use the highest tax rate as a conservative estimate
  const maxRate = Math.max(...brackets.map(b => b.rate));
  const upperBound = (afterTaxIncome + deductionAmount) / (1 - maxRate) * 1.5; // Add 50% buffer for progressive brackets
  const lowerBound = afterTaxIncome; // At minimum, gross income must be >= after-tax income
  
  // Binary search with tolerance for floating point precision
  const tolerance = 0.01;
  let low = lowerBound;
  let high = upperBound;
  let bestGuess = (low + high) / 2;
  
  // Iterate until we find a value within tolerance
  for (let i = 0; i < 100; i++) { // Max 100 iterations to prevent infinite loops
    const guess = (low + high) / 2;
    // Calculate taxable income by subtracting deductions
    const taxableIncome = Math.max(0, guess - deductionAmount);
    const tax = calculateProgressiveTax(taxableIncome, brackets);
    const resultingAfterTax = guess - tax;
    
    const difference = resultingAfterTax - afterTaxIncome;
    
    if (Math.abs(difference) < tolerance) {
      return parseFloat(guess.toFixed(2));
    }
    
    if (difference > 0) {
      // Resulting after-tax is too high, need lower gross income
      high = guess;
    } else {
      // Resulting after-tax is too low, need higher gross income
      low = guess;
    }
    
    bestGuess = guess;
  }
  
  // Return the best guess if we didn't converge exactly
  return parseFloat(bestGuess.toFixed(2));
}

/**
 * Calculates total federal and state taxes after applying deductions.
 * @param info Taxpayer information.
 * @param stateBrackets State-specific tax brackets.
 * @returns An object containing the calculated taxes and take-home pay.
 */
export function calculateTaxes(info: TaxpayerInfo, stateBrackets: TaxBracket[]): TaxCalculationResult {
  // 1. Determine the allowable deduction (standard vs. itemized)
  const standardDeduction = STANDARD_DEDUCTIONS[info.filingStatus];
  const deductionAmount = (info.itemizedDeductions && info.itemizedDeductions > standardDeduction)
    ? info.itemizedDeductions
    : standardDeduction;

  // Note: SALT (State and Local Taxes) deduction is capped at $10,000 for federal itemizing
  // This simplified example assumes itemizedDeductions only contains SALT + other possible deductions.

  // 2. Calculate Federal Taxable Income
  const federalTaxableIncome = Math.max(0, info.grossIncome - deductionAmount);

  // 3. Calculate Federal Tax Owed (use appropriate brackets based on filing status)
  const federalBrackets = info.filingStatus === 'married' ? FEDERAL_BRACKETS_MARRIED : FEDERAL_BRACKETS_SINGLE;
  const federalTax = calculateProgressiveTax(federalTaxableIncome, federalBrackets);

  // 4. Calculate State Taxable Income (often the same as Federal AGI or slightly adjusted)
  const stateDeduction = 0; // States may have different rules - for now, we'll assume no deductions
  const stateTaxableIncome = Math.max(0, info.grossIncome - stateDeduction); 

  // 5. Calculate State Tax Owed (state brackets are the same regardless of filing status for MA)
  const stateTax = calculateProgressiveTax(stateTaxableIncome, stateBrackets);

  // 6. Calculate Net Income
  const netIncome = info.grossIncome - federalTax - stateTax;

  return {
    federalTax: parseFloat(federalTax.toFixed(2)),
    stateTax: parseFloat(stateTax.toFixed(2)),
    totalTax: parseFloat((federalTax + stateTax).toFixed(2)),
    netIncome: parseFloat(netIncome.toFixed(2)),
  };
}

// State specific tax brackets. We will only use Massachusetts for now.
// Massachusetts has a flat 5% tax rate for all income levels
export const MASSACHUSETTS_BRACKET: TaxBracket[] = [
  { upperLimit: Infinity, rate: 0.05 },  // 5% flat tax rate
];
  