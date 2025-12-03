import { useState } from 'react';
import type { YearlyData } from '../models/YearlyData';
import { SimulationService } from '../services/simulationService';
import type { YearlyUserInputs } from '../models/UserInputs';
import './SpreadsheetTable.scss';

interface SpreadsheetTableProps {
  data: YearlyData[];
  yearlyInputs: YearlyUserInputs;
  onCellUpdate: (year: number, field: string, value: number) => void;
}

export function SpreadsheetTable({ data, yearlyInputs, onCellUpdate }: SpreadsheetTableProps) {
  const [editingCell, setEditingCell] = useState<{ year: number; field: string } | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  if (data.length === 0) {
    return <div className="spreadsheet-table empty">No data to display</div>;
  }

  const handleCellClick = (year: number, field: string, currentValue: number) => {
    if (isEditableField(field)) {
      setEditingCell({ year, field });
      setEditValue(currentValue.toString());
    }
  };

  const handleCellBlur = () => {
    if (editingCell) {
      const numValue = parseFloat(editValue) || 0;
      onCellUpdate(editingCell.year, editingCell.field, numValue);
      setEditingCell(null);
      setEditValue('');
    }
  };

  const handleCellKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCellBlur();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
      setEditValue('');
    }
  };

  const isEditableField = (field: string): boolean => {
    return ['fixedExpense', 'tuition', 'oneOffExpenses', 'income1', 'income2'].includes(field);
  };

  const getCellValue = (row: YearlyData, year: number, field: string): number => {
    const userInput = yearlyInputs[year];
    if (field === 'fixedExpense') return userInput?.fixedExpense ?? row.fixedExpense;
    if (field === 'tuition') return userInput?.tuition ?? row.tuition;
    if (field === 'oneOffExpenses') return userInput?.oneOffExpenses ?? row.oneOffExpenses;
    if (field === 'income1') return userInput?.income1 ?? row.income1;
    if (field === 'income2') return userInput?.income2 ?? row.income2;
    return 0;
  };

  return (
    <div className="spreadsheet-table">
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Age1</th>
              <th>Age2</th>
              <th>Annual Expense</th>
              <th>Fixed Expense</th>
              <th>Tuition</th>
              <th>One-off Expenses</th>
              <th>Total Expenses</th>
              <th>Rental Income</th>
              <th>Income1</th>
              <th>Income2</th>
              <th>SS1</th>
              <th>SS2</th>
              <th>Effective Tax Rate</th>
              <th>Total Income</th>
              <th>Annual Need</th>
              <th>Cash</th>
              <th>Stock</th>
              <th>Net Worth</th>
              <th>Inflation Adjusted</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => {
              const year = index;
              const isEditing = editingCell?.year === year;
              
              return (
                <tr key={index}>
                  <td>{row.age1}</td>
                  <td>{row.age2}</td>
                  <td>{SimulationService.formatCurrency(row.annualExpense)}</td>
                  <td
                    className={isEditableField('fixedExpense') ? 'editable' : ''}
                    onClick={() => handleCellClick(year, 'fixedExpense', getCellValue(row, year, 'fixedExpense'))}
                  >
                    {isEditing && editingCell?.field === 'fixedExpense' ? (
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleCellBlur}
                        onKeyDown={handleCellKeyDown}
                        autoFocus
                        className="cell-input"
                      />
                    ) : (
                      SimulationService.formatCurrency(getCellValue(row, year, 'fixedExpense'))
                    )}
                  </td>
                  <td
                    className={isEditableField('tuition') ? 'editable' : ''}
                    onClick={() => handleCellClick(year, 'tuition', getCellValue(row, year, 'tuition'))}
                  >
                    {isEditing && editingCell?.field === 'tuition' ? (
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleCellBlur}
                        onKeyDown={handleCellKeyDown}
                        autoFocus
                        className="cell-input"
                      />
                    ) : (
                      SimulationService.formatCurrency(getCellValue(row, year, 'tuition'))
                    )}
                  </td>
                  <td
                    className={isEditableField('oneOffExpenses') ? 'editable' : ''}
                    onClick={() => handleCellClick(year, 'oneOffExpenses', getCellValue(row, year, 'oneOffExpenses'))}
                  >
                    {isEditing && editingCell?.field === 'oneOffExpenses' ? (
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleCellBlur}
                        onKeyDown={handleCellKeyDown}
                        autoFocus
                        className="cell-input"
                      />
                    ) : (
                      SimulationService.formatCurrency(getCellValue(row, year, 'oneOffExpenses'))
                    )}
                  </td>
                  <td>{SimulationService.formatCurrency(row.totalExpenses)}</td>
                  <td>{SimulationService.formatCurrency(row.rentalIncome)}</td>
                  <td
                    className={isEditableField('income1') ? 'editable' : ''}
                    onClick={() => handleCellClick(year, 'income1', getCellValue(row, year, 'income1'))}
                  >
                    {isEditing && editingCell?.field === 'income1' ? (
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleCellBlur}
                        onKeyDown={handleCellKeyDown}
                        autoFocus
                        className="cell-input"
                      />
                    ) : (
                      SimulationService.formatCurrency(getCellValue(row, year, 'income1'))
                    )}
                  </td>
                  <td
                    className={isEditableField('income2') ? 'editable' : ''}
                    onClick={() => handleCellClick(year, 'income2', getCellValue(row, year, 'income2'))}
                  >
                    {isEditing && editingCell?.field === 'income2' ? (
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleCellBlur}
                        onKeyDown={handleCellKeyDown}
                        autoFocus
                        className="cell-input"
                      />
                    ) : (
                      SimulationService.formatCurrency(getCellValue(row, year, 'income2'))
                    )}
                  </td>
                  <td>{SimulationService.formatCurrency(row.ss1)}</td>
                  <td>{SimulationService.formatCurrency(row.ss2)}</td>
                  <td>{SimulationService.formatPercentage(row.effectiveTaxRate)}</td>
                  <td>{SimulationService.formatCurrency(row.totalIncome)}</td>
                  <td className={row.annualNeed > 0 ? 'negative' : 'positive'}>
                    {SimulationService.formatCurrency(row.annualNeed)}
                  </td>
                  <td>{SimulationService.formatCurrency(row.cash)}</td>
                  <td>{SimulationService.formatCurrency(row.stock)}</td>
                  <td>{SimulationService.formatCurrency(row.netWorth)}</td>
                  <td>{SimulationService.formatCurrency(row.inflationAdjusted)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
