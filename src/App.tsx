import { useState, useEffect } from 'react';
import { defaultInputParams, type InputParams } from './models/InputParams';
import type { YearlyData } from './models/YearlyData';
import type { YearlyUserInputs } from './models/UserInputs';
import { SimulationService } from './services/simulationService';
import { PersistenceService, type SavedData } from './services/persistenceService';
import { InputPanel } from './components/InputPanel';
import { SpreadsheetTable } from './components/SpreadsheetTable';
import { NetWorthChart } from './components/NetWorthChart';
import './App.scss';

function App() {
  const [inputParams, setInputParams] = useState<InputParams>(defaultInputParams);
  const [yearlyInputs, setYearlyInputs] = useState<YearlyUserInputs>({});
  const [simulationData, setSimulationData] = useState<YearlyData[]>([]);

  useEffect(() => {
    calculateSimulation();
  }, [inputParams, yearlyInputs]);

  const calculateSimulation = () => {
    const data = SimulationService.calculateYearlyData(inputParams, yearlyInputs);
    setSimulationData(data);
  };

  const handleUpdateParams = (params: InputParams) => {
    setInputParams(params);
  };

  const handleSave = () => {
    const data: SavedData = {
      inputParams,
      yearlyInputs,
    };
    PersistenceService.saveToFile(data);
  };

  const handleLoad = async (file: File) => {
    try {
      const data = await PersistenceService.loadFromFile(file);
      setInputParams(data.inputParams);
      setYearlyInputs(data.yearlyInputs || {});
    } catch (error) {
      alert('Failed to load file. Please check the file format.');
      console.error(error);
    }
  };

  const handleCellUpdate = (year: number, field: string, value: number) => {
    setYearlyInputs((prev) => ({
      ...prev,
      [year]: {
        ...prev[year],
        [field]: value,
      },
    }));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>2-Bucket Investment Simulator</h1>
        <p className="subtitle">Early Retirement Planning Tool</p>
      </header>
      <main className="app-main">
        <InputPanel
          params={inputParams}
          onUpdate={handleUpdateParams}
          onSave={handleSave}
          onLoad={handleLoad}
        />
        <NetWorthChart data={simulationData} />
        <SpreadsheetTable
          data={simulationData}
          yearlyInputs={yearlyInputs}
          onCellUpdate={handleCellUpdate}
        />
      </main>
    </div>
  );
}

export default App;
