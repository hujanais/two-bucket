import { useState, useEffect, useRef } from 'react';
import { defaultInputParams, type InputParams } from '../models/InputParams';
import './InputPanel.scss';

interface InputPanelProps {
  params: InputParams;
  onUpdate: (params: InputParams) => void;
  onSave: () => void;
  onLoad: (file: File) => void;
}

export function InputPanel({ params, onUpdate, onSave, onLoad }: InputPanelProps) {
  const [localParams, setLocalParams] = useState<InputParams>(params);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync local state when params prop changes (e.g., when loading from file)
  useEffect(() => {
    setLocalParams(params);
  }, [params]);

  const handleChange = (field: keyof InputParams, value: string) => {
    const numValue = parseFloat(value) || 0;
    setLocalParams((prev) => ({ ...prev, [field]: numValue }));
  };

  const handlePercentageChange = (field: keyof InputParams, value: string) => {
    // Round to 2 decimal places in percentage form, then convert to decimal
    // Round the final decimal value to avoid floating point precision issues
    const percentageValue = parseFloat(value) || 0;
    const roundedPercentage = Math.round(percentageValue * 100) / 100;
    const decimalValue = roundedPercentage / 100;
    // Round to 4 decimal places (equivalent to 2 decimal places in percentage)
    const roundedDecimal = Math.round(decimalValue * 10000) / 10000;
    setLocalParams((prev) => ({ ...prev, [field]: roundedDecimal }));
  };

  const formatPercentage = (value: number): string => {
    return (value * 100).toFixed(2);
  };

  const handleUpdate = () => {
    onUpdate(localParams);
  };

  const handleReset = () => {
    setLocalParams(defaultInputParams);
    onUpdate(defaultInputParams);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onLoad(file);
      // Reset the file input so the same file can be loaded again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="input-panel">
      <h2>Simulation Parameters</h2>
      <div className="input-grid">
        <div className="input-group">
          <label>Age 1</label>
          <input
            type="number"
            value={localParams.age1}
            onChange={(e) => handleChange('age1', e.target.value)}
            min="0"
          />
        </div>
        <div className="input-group">
          <label>Age 2</label>
          <input
            type="number"
            value={localParams.age2}
            onChange={(e) => handleChange('age2', e.target.value)}
            min="0"
          />
        </div>
        <div className="input-group">
          <label>Starting Portfolio ($)</label>
          <input
            type="number"
            value={localParams.startingPortfolio}
            onChange={(e) => handleChange('startingPortfolio', e.target.value)}
            min="0"
          />
        </div>
        <div className="input-group">
          <label>Inflation Rate (%)</label>
          <input
            type="number"
            value={formatPercentage(localParams.inflationRate)}
            onChange={(e) => handlePercentageChange('inflationRate', e.target.value)}
            min="0"
            max="100"
            step="0.01"
          />
        </div>
        <div className="input-group">
          <label>SS1 Amount ($/month)</label>
          <input
            type="number"
            value={localParams.ss1Amount}
            onChange={(e) => handleChange('ss1Amount', e.target.value)}
            min="0"
          />
        </div>
        <div className="input-group">
          <label>SS1 Start Age</label>
          <input
            type="number"
            value={localParams.ss1StartAge}
            onChange={(e) => handleChange('ss1StartAge', e.target.value)}
            min="0"
          />
        </div>
        <div className="input-group">
          <label>SS2 Amount ($/month)</label>
          <input
            type="number"
            value={localParams.ss2Amount}
            onChange={(e) => handleChange('ss2Amount', e.target.value)}
            min="0"
          />
        </div>
        <div className="input-group">
          <label>SS2 Start Age</label>
          <input
            type="number"
            value={localParams.ss2StartAge}
            onChange={(e) => handleChange('ss2StartAge', e.target.value)}
            min="0"
          />
        </div>
        <div className="input-group">
          <label>COLA Percentage (%)</label>
          <input
            type="number"
            value={formatPercentage(localParams.colaPercentage)}
            onChange={(e) => handlePercentageChange('colaPercentage', e.target.value)}
            min="0"
            max="100"
            step="0.01"
          />
        </div>
        <div className="input-group">
          <label>Stock Return Rate (%)</label>
          <input
            type="number"
            value={formatPercentage(localParams.stockReturnRate)}
            onChange={(e) => handlePercentageChange('stockReturnRate', e.target.value)}
            min="0"
            max="100"
            step="0.01"
          />
        </div>
        <div className="input-group">
          <label>Cash Buffer (Years)</label>
          <input
            type="number"
            value={localParams.cashThreshold}
            onChange={(e) => handleChange('cashThreshold', e.target.value)}
            min="0"
            step="0.1"
          />
        </div>
      </div>
      <h3>Base Yearly Expenses & Income</h3>
      <div className="input-grid">
        <div className="input-group">
          <label>Base Annual Expense ($)</label>
          <input
            type="number"
            value={localParams.baseAnnualExpense}
            onChange={(e) => handleChange('baseAnnualExpense', e.target.value)}
            min="0"
          />
        </div>
        <div className="input-group">
          <label>Base Rental Income ($)</label>
          <input
            type="number"
            value={localParams.baseRentalIncome}
            onChange={(e) => handleChange('baseRentalIncome', e.target.value)}
            min="0"
          />
        </div>
        <div className="input-group">
          <label>Rental Adjustment (%)</label>
          <input
            type="number"
            value={formatPercentage(localParams.rentalIncomeGrowthRate)}
            onChange={(e) => handlePercentageChange('rentalIncomeGrowthRate', e.target.value)}
            min="0"
            max="100"
            step="0.01"
          />
        </div>
      </div>
      <p className="info-text">
        Note: Fixed Expense, Tuition, One-off Expenses, Income1, and Income2 can be entered directly in the spreadsheet table below.
      </p>
      <div className="button-group">
        <button onClick={handleUpdate} className="btn btn-primary">
          Update
        </button>
        <button onClick={handleReset} className="btn btn-secondary">
          Reset
        </button>
        <button onClick={onSave} className="btn btn-secondary">
          Save to File
        </button>
        <label className="btn btn-secondary">
          Load from File
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </label>
      </div>
    </div>
  );
}

