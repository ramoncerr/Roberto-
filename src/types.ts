export interface CalculationInput {
  totalPieces: number;
  piecesPerYard: number;
  wastePercent: number; // e.g., 0, 3, 5%
  rollLengthYards: number; // e.g., 50, 100, 0 for none
  pricePerYard: number; // e.g., 0 for none
  fabricName?: string;
  notes?: string;
}

export interface CalculationResult {
  totalPieces: number;
  piecesPerYard: number;
  // Core yards
  exactYards: number;
  roundedUpYards: number;
  exactMeters: number;
  // Unit consumption
  unitConsumptionYards: number; // 1 / piecesPerYard
  unitConsumptionInches: number; // unitConsumptionYards * 36
  unitConsumptionCm: number; // unitConsumptionYards * 91.44
  // Waste (merma)
  wastePercent: number;
  wasteYards: number;
  totalYardsWithWaste: number;
  totalMetersWithWaste: number;
  roundedUpYardsWithWaste: number;
  // Roll calculations
  rollLengthYards: number;
  rollsNeeded: number;
  surplusYardsFromRolls: number;
  // Cost calculations
  pricePerYard: number;
  totalCost: number;
  costPerPiece: number;
}

export interface SavedCalculation {
  id: string;
  timestamp: number;
  title: string;
  fabricName?: string;
  input: CalculationInput;
  result: CalculationResult;
}

export interface BatchItem {
  id: string;
  name: string; // e.g. "Talla S", "Talla M", "Talla L", "Frente", "Espalda"
  pieces: number;
  piecesPerYard: number;
  notes?: string;
}
