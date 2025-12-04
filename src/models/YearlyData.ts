export interface YearlyData {
  age1: number;
  age2: number;
  annualExpense: number;
  fixedExpense: number;
  tuition: number;
  oneOffExpenses: number;
  totalExpenses: number;
  rentalIncome: number;
  income1: number;
  income2: number;
  ss1: number;
  ss2: number;
  effectiveTaxRate: number; // Calculated tax rate (totalTax / grossIncome)
  totalIncome: number;
  annualNeed: number;
  cash: number;
  stock: number;
  netWorth: number;
  inflationAdjusted: number;
}

