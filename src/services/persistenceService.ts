import type { InputParams } from '../models/InputParams';
import type { YearlyUserInputs } from '../models/UserInputs';

export interface SavedData {
  inputParams: InputParams;
  yearlyInputs: YearlyUserInputs;
}

export class PersistenceService {
  static saveToFile(data: SavedData, filename: string = 'simulation-data.json'): void {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static loadFromFile(file: File): Promise<SavedData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content) as SavedData;
          resolve(data);
        } catch (error) {
          reject(new Error('Failed to parse JSON file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }
}

