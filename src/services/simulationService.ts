import type { InputParams } from '../models/InputParams';
import type { YearlyData } from '../models/YearlyData';
import type { YearlyUserInputs } from '../models/UserInputs';
import { calculateTaxes, MASSACHUSETTS_BRACKET } from './taxService';

export class SimulationService {
  static calculateYearlyData(
    params: InputParams,
    yearlyInputs: YearlyUserInputs,
    previousYear?: YearlyData
  ): YearlyData[] {
    const results: YearlyData[] = [];
    let currentAge1 = params.age1;
    let currentAge2 = params.age2;
    let cash = previousYear?.cash ?? 0;
    let stock = previousYear?.stock ?? params.startingPortfolio;
    let inflationMultiplier = 1;
    let rentalIncomeMultiplier = 1;

    while (currentAge1 <= 92 || currentAge2 <= 92) {
      const year = currentAge1 - params.age1;
      const userInputs = yearlyInputs[year];

      // Use user inputs if provided, otherwise use base values from params (for annual expense and rental income)
      // For fixed expense, tuition, one-off expenses, income1, income2 - use user inputs directly (0 if not provided)
      const baseAnnualExpense = userInputs?.annualExpense ?? params.baseAnnualExpense;
      const baseRentalIncome = userInputs?.rentalIncome ?? params.baseRentalIncome;

      // User-entered values in spreadsheet are actual dollar amounts for that year (not base values)
      // These don't get inflated - they're entered as-is
      const fixedExpense = userInputs?.fixedExpense ?? 0;
      const tuition = userInputs?.tuition ?? 0;
      const oneOffExpenses = userInputs?.oneOffExpenses ?? 0;
      const income1 = userInputs?.income1 ?? 0;
      const income2 = userInputs?.income2 ?? 0;

      // Calculate expenses with inflation (only for base annual expense)
      const annualExpense = baseAnnualExpense * inflationMultiplier;
      const totalExpenses = annualExpense + fixedExpense + tuition + oneOffExpenses;

      // Calculate income (rental income gets inflated, others are direct user inputs)
      const rentalIncome = baseRentalIncome * rentalIncomeMultiplier;

      // Social Security with COLA (convert monthly to annual)
      let ss1 = 0;
      if (currentAge1 >= params.ss1StartAge) {
        const ssYears = currentAge1 - params.ss1StartAge;
        const monthlySS1 = params.ss1Amount * Math.pow(1 + params.colaPercentage, ssYears);
        ss1 = monthlySS1 * 12; // Convert monthly to annual
      }

      let ss2 = 0;
      if (currentAge2 >= params.ss2StartAge) {
        const ssYears = currentAge2 - params.ss2StartAge;
        const monthlySS2 = params.ss2Amount * Math.pow(1 + params.colaPercentage, ssYears);
        ss2 = monthlySS2 * 12; // Convert monthly to annual
      }

      const totalIncome = rentalIncome + income1 + income2 + ss1 + ss2;
      let annualNeed = (totalExpenses - totalIncome)
      
      // For simplicity, just calculate the tax burden and add it to the annual need
      const taxResult = calculateTaxes({
        grossIncome: totalExpenses,
        filingStatus: 'married',
        itemizedDeductions: 0
      }, MASSACHUSETTS_BRACKET);

      annualNeed = annualNeed + taxResult.totalTax;
      const effectiveTaxRate = taxResult.totalTax / totalExpenses;
      
      // Calculate actual cash threshold based on annual need
      // Use absolute value to handle both positive and negative annual need
      const actualCashThreshold = Math.abs(annualNeed) * params.cashThreshold;

      // Apply stock returns first
      stock = stock * (1 + params.stockReturnRate);

      // Handle withdrawals or surpluses
      if (annualNeed > 0) {
        // Need to withdraw money
        // First, check if cash bucket needs replenishment before withdrawal
        if (cash < actualCashThreshold && stock > 0) {
          const replenishAmount = Math.min(
            actualCashThreshold - cash,
            stock
          );
          stock -= replenishAmount;
          cash += replenishAmount;
        }

        // Now withdraw the annual need
        if (cash >= annualNeed) {
          cash -= annualNeed;
        } else {
          // Cash is insufficient, withdraw from stock
          const shortfall = annualNeed - cash;
          cash = 0;
          stock = Math.max(0, stock - shortfall);
        }
      } else {
        // Surplus, add to cash
        cash += Math.abs(annualNeed);
      }

      // Final check: replenish cash bucket if below threshold (after all transactions)
      if (cash < actualCashThreshold && stock > 0) {
        const replenishAmount = Math.min(
          actualCashThreshold - cash,
          stock
        );
        stock -= replenishAmount;
        cash += replenishAmount;
      }

      const netWorth = cash + stock;
      const inflationAdjusted = netWorth / Math.pow(1 + params.inflationRate, year);

      const yearlyData: YearlyData = {
        age1: currentAge1,
        age2: currentAge2,
        annualExpense,
        fixedExpense,
        tuition,
        oneOffExpenses,
        totalExpenses,
        rentalIncome,
        income1,
        income2,
        ss1,
        ss2,
        effectiveTaxRate: effectiveTaxRate,
        totalIncome,
        annualNeed,
        cash,
        stock,
        netWorth,
        inflationAdjusted,
      };

      results.push(yearlyData);

      // Update for next year
      currentAge1++;
      currentAge2++;
      inflationMultiplier *= (1 + params.inflationRate);
      rentalIncomeMultiplier *= (1 + params.rentalIncomeGrowthRate);
    }

    return results;
  }

  static formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  static formatPercentage(value: number): string {
    return `${(value * 100).toFixed(2)}%`;
  }
}

