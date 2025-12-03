export interface UserInputs {
  age1?: number;
  age2?: number;
  annualExpense?: number;
  fixedExpense?: number;
  tuition?: number;
  oneOffExpenses?: number;
  rentalIncome?: number;
  income1?: number;
  income2?: number;
}

export interface YearlyUserInputs {
  [year: number]: UserInputs;
}

