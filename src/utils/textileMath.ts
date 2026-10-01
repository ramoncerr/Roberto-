import { CalculationInput, CalculationResult } from '../types';

export const YARDS_TO_METERS = 0.9144;
export const YARDS_TO_INCHES = 36;
export const YARDS_TO_CM = 91.44;

export function calculateYardage(input: CalculationInput): CalculationResult {
  const { totalPieces, piecesPerYard, wastePercent, rollLengthYards, pricePerYard } = input;

  const validPieces = Math.max(0, totalPieces);
  const validPiecesPerYard = Math.max(0.0001, piecesPerYard);

  // Exact yards needed = Total Pieces / Pieces Per Yard
  const exactYards = validPieces / validPiecesPerYard;
  const roundedUpYards = Math.ceil(exactYards);
  const exactMeters = exactYards * YARDS_TO_METERS;

  // Unit consumption (how much fabric 1 piece takes)
  const unitConsumptionYards = 1 / validPiecesPerYard;
  const unitConsumptionInches = unitConsumptionYards * YARDS_TO_INCHES;
  const unitConsumptionCm = unitConsumptionYards * YARDS_TO_CM;

  // Waste margin (merma / encogimiento)
  const validWastePercent = Math.max(0, wastePercent || 0);
  const wasteYards = exactYards * (validWastePercent / 100);
  const totalYardsWithWaste = exactYards + wasteYards;
  const totalMetersWithWaste = totalYardsWithWaste * YARDS_TO_METERS;
  const roundedUpYardsWithWaste = Math.ceil(totalYardsWithWaste);

  // Roll calculation
  const validRollLength = Math.max(0, rollLengthYards || 0);
  const rollsNeeded = validRollLength > 0 ? Math.ceil(totalYardsWithWaste / validRollLength) : 0;
  const surplusYardsFromRolls =
    validRollLength > 0 ? rollsNeeded * validRollLength - totalYardsWithWaste : 0;

  // Cost calculation
  const validPrice = Math.max(0, pricePerYard || 0);
  const totalCost = validPrice > 0 ? totalYardsWithWaste * validPrice : 0;
  const costPerPiece = validPieces > 0 ? totalCost / validPieces : 0;

  return {
    totalPieces: validPieces,
    piecesPerYard: validPiecesPerYard,
    exactYards,
    roundedUpYards,
    exactMeters,
    unitConsumptionYards,
    unitConsumptionInches,
    unitConsumptionCm,
    wastePercent: validWastePercent,
    wasteYards,
    totalYardsWithWaste,
    totalMetersWithWaste,
    roundedUpYardsWithWaste,
    rollLengthYards: validRollLength,
    rollsNeeded,
    surplusYardsFromRolls,
    pricePerYard: validPrice,
    totalCost,
    costPerPiece,
  };
}

export function formatNum(val: number, decimals: number = 2): string {
  if (isNaN(val) || !isFinite(val)) return '0';
  const safeDecimals = Math.max(0, Math.min(20, Math.floor(decimals)));
  // Ensure minimumFractionDigits is strictly <= maximumFractionDigits
  const minDigits = safeDecimals === 0 || Number.isInteger(val) ? 0 : Math.min(2, safeDecimals);

  return Number(val.toFixed(safeDecimals)).toLocaleString('es-MX', {
    minimumFractionDigits: Math.min(minDigits, safeDecimals),
    maximumFractionDigits: safeDecimals,
  });
}

export function formatCurrency(amount: number): string {
  if (isNaN(amount) || !isFinite(amount)) return '$0.00';
  return amount.toLocaleString('es-MX', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function generateShareText(result: CalculationResult, fabricName?: string): string {
  const lines: string[] = [
    `🧵 *RESUMEN DE CORTE TEXTIL*`,
    fabricName ? `📦 *Tela:* ${fabricName}` : '',
    `--------------------------------`,
    `🔢 *Total de piezas requeridas:* ${formatNum(result.totalPieces, 0)} pzas`,
    `📐 *Rendimiento:* ${formatNum(result.piecesPerYard, 2)} piezas por yarda`,
    `✂️ *Consumo unitario:* ${formatNum(result.unitConsumptionYards, 3)} yds/pza (${formatNum(result.unitConsumptionInches, 1)}" / ${formatNum(result.unitConsumptionCm, 1)} cm)`,
    `--------------------------------`,
    `🎯 *YARDAS NECESARIAS (Netas):* ${formatNum(result.exactYards, 2)} yds (~${formatNum(result.roundedUpYards, 0)} yds enteras)`,
    `📏 *Equivalente en metros:* ${formatNum(result.exactMeters, 2)} m`,
  ];

  if (result.wastePercent > 0) {
    lines.push(
      `--------------------------------`,
      `⚠️ *Merma considerada (${result.wastePercent}%):* +${formatNum(result.wasteYards, 2)} yds`,
      `🏁 *TOTAL CON MERMA:* ${formatNum(result.totalYardsWithWaste, 2)} yds (${formatNum(result.totalMetersWithWaste, 2)} m)`
    );
  }

  if (result.rollsNeeded > 0) {
    lines.push(
      `--------------------------------`,
      `📦 *Rollos requeridos (${result.rollLengthYards} yds/rollo):* ${result.rollsNeeded} rollo(s)`,
      `✂️ *Sobrante estimado:* ${formatNum(result.surplusYardsFromRolls, 2)} yds`
    );
  }

  if (result.totalCost > 0) {
    lines.push(
      `--------------------------------`,
      `💵 *Costo total de tela:* ${formatCurrency(result.totalCost)} (${formatCurrency(result.pricePerYard)}/yd)`,
      `🏷️ *Costo de tela por pieza:* ${formatCurrency(result.costPerPiece)}`
    );
  }

  lines.push(`\nCalculado con CorteYarda`);

  return lines.filter(Boolean).join('\n');
}
