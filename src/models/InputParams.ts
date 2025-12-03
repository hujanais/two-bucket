export interface InputParams {
  age1: number;
  age2: number;
  startingPortfolio: number;
  inflationRate: number;
  ss1Amount: number;
  ss1StartAge: number;
  ss2Amount: number;
  ss2StartAge: number;
  colaPercentage: number;
  effectiveTaxRate: number;
  stockReturnRate: number;
  cashThreshold: number;
  baseAnnualExpense: number;
  baseRentalIncome: number;
  rentalIncomeGrowthRate: number;
}

export const defaultInputParams: InputParams = {
  age1: 55,
  age2: 56,
  startingPortfolio: 1000000,
  inflationRate: 0.03,
  ss1Amount: 3000, // Monthly amount
  ss1StartAge: 65,
  ss2Amount: 2500, // Monthly amount
  ss2StartAge: 65,
  colaPercentage: 0.02,
  effectiveTaxRate: 0.15,
  stockReturnRate: 0.065,
  cashThreshold: 2, // Number of years of annual need
  baseAnnualExpense: 50000,
  baseRentalIncome: 0,
  rentalIncomeGrowthRate: 0.02,
};

