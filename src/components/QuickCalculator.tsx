import React, { useState } from 'react';
import {
  Scissors,
  Layers,
  Copy,
  Printer,
  CheckCircle2,
  Sparkles,
  Sliders,
  DollarSign,
  Info,
} from 'lucide-react';
import { CalculationInput, CalculationResult } from '../types';
import { calculateYardage, formatNum, formatCurrency, generateShareText } from '../utils/textileMath';

interface QuickCalculatorProps {
  input: CalculationInput;
  onChangeInput: (newInput: Partial<CalculationInput>) => void;
  onSaveToHistory: (result: CalculationResult) => void;
}

export const QuickCalculator: React.FC<QuickCalculatorProps> = ({
  input,
  onChangeInput,
  onSaveToHistory,
}) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const result = calculateYardage(input);

  const handleCopy = () => {
    const text = generateShareText(result, input.fabricName);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onSaveToHistory(result);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Calculadora Directa de Taller
          </h2>
          <p className="text-xs text-slate-500">
            Ajusta piezas y rendimiento en tiempo real con recálculo instantáneo de yardas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
              saved
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {saved ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
            <span>{saved ? 'Guardado' : 'Guardar'}</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              copied ? 'bg-emerald-600 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado' : 'Copiar'}</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200"
            title="Imprimir"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Inputs */}
        <div className="lg:col-span-6 space-y-5">
          {/* Card 1: Cantidad de Piezas */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                1. Cantidad Total de Piezas
              </label>
              <span className="text-xs text-slate-400 font-mono-nums">Piezas requeridas</span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="1"
                step="1"
                value={input.totalPieces || ''}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  onChangeInput({ totalPieces: isNaN(val) ? 0 : Math.max(0, val) });
                }}
                className="w-full px-4 py-3 text-2xl font-mono-nums font-bold text-slate-900 border border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-hidden"
                placeholder="0"
              />
              <span className="absolute right-4 top-4 text-xs font-semibold text-slate-400">
                piezas
              </span>
            </div>

            <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1">
              {[50, 100, 200, 300, 500, 1000, 2000].map((qty) => (
                <button
                  key={qty}
                  type="button"
                  onClick={() => onChangeInput({ totalPieces: qty })}
                  className={`px-2.5 py-1 text-xs font-mono-nums rounded-md border shrink-0 transition-colors ${
                    input.totalPieces === qty
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {qty}
                </button>
              ))}
            </div>
          </div>

          {/* Card 2: Piezas por Yarda */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. Piezas por Yarda (Rendimiento)
              </label>
              <span className="text-xs text-indigo-600 font-medium">1 yarda = 36 pulgadas</span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="0.01"
                step="0.1"
                value={input.piecesPerYard || ''}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onChangeInput({ piecesPerYard: isNaN(val) ? 0 : Math.max(0, val) });
                }}
                className="w-full px-4 py-3 text-2xl font-mono-nums font-bold text-slate-900 border border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-hidden"
                placeholder="0"
              />
              <span className="absolute right-4 top-4 text-xs font-semibold text-slate-400">
                piezas / yd
              </span>
            </div>

            <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1">
              {[1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6].map((yd) => (
                <button
                  key={yd}
                  type="button"
                  onClick={() => onChangeInput({ piecesPerYard: yd })}
                  className={`px-2.5 py-1 text-xs font-mono-nums rounded-md border shrink-0 transition-colors ${
                    input.piecesPerYard === yd
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {yd} p/yd
                </button>
              ))}
            </div>

            {/* Consumption indicator */}
            {input.piecesPerYard > 0 && (
              <div className="mt-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg flex items-center justify-between">
                <span>Consumo por pieza:</span>
                <span className="font-mono-nums font-semibold text-slate-900">
                  {formatNum(1 / input.piecesPerYard, 3)} yds ({formatNum((1 / input.piecesPerYard) * 36, 1)}")
                </span>
              </div>
            )}
          </div>

          {/* Card 3: Merma & Opcionales */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                <span>Margen de Merma (%)</span>
                <span className="font-mono-nums text-slate-900">{input.wastePercent}%</span>
              </div>
              <div className="flex gap-2">
                {[0, 2, 3, 5, 8, 10].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => onChangeInput({ wastePercent: pct })}
                    className={`flex-1 py-1.5 text-xs font-mono-nums rounded-lg border transition-colors ${
                      input.wastePercent === pct
                        ? 'bg-slate-900 text-white font-bold border-slate-900'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Yards / Rollo
                </label>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={input.rollLengthYards || ''}
                  onChange={(e) => onChangeInput({ rollLengthYards: Math.max(0, parseFloat(e.target.value) || 0) })}
                  placeholder="Ej. 50"
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-mono-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Precio / Yarda ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={input.pricePerYard || ''}
                  onChange={(e) => onChangeInput({ pricePerYard: Math.max(0, parseFloat(e.target.value) || 0) })}
                  placeholder="Ej. 3.25"
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-mono-nums"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Output Display */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-sm">
            <span className="text-xs uppercase tracking-wider font-semibold text-indigo-400">
              Yardas Totales Requeridas
            </span>

            {/* Giant display */}
            <div className="mt-3 mb-5">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl sm:text-6xl font-extrabold font-mono-nums text-white">
                  {formatNum(result.wastePercent > 0 ? result.totalYardsWithWaste : result.exactYards, 2)}
                </span>
                <span className="text-xl font-bold text-indigo-400">YDS</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                = {formatNum(result.wastePercent > 0 ? result.totalMetersWithWaste : result.exactMeters, 2)} metros de tela
              </p>
            </div>

            {/* Formula Breakdown */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80 text-xs font-mono-nums text-slate-300 space-y-1.5">
              <div className="flex justify-between">
                <span>Cálculo base:</span>
                <span>{formatNum(result.totalPieces, 0)} pzas ÷ {formatNum(result.piecesPerYard, 2)} p/yd</span>
              </div>
              <div className="flex justify-between font-bold text-white">
                <span>Yardas netas:</span>
                <span>{formatNum(result.exactYards, 2)} yds</span>
              </div>
              {result.wastePercent > 0 && (
                <div className="flex justify-between text-amber-400 pt-1 border-t border-slate-700">
                  <span>+ Merma ({result.wastePercent}%):</span>
                  <span>+{formatNum(result.wasteYards, 2)} yds</span>
                </div>
              )}
            </div>

            {/* Additional details */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block">Yardas redondeadas (enteras):</span>
                <span className="text-sm font-bold text-white font-mono-nums">
                  {formatNum(result.wastePercent > 0 ? result.roundedUpYardsWithWaste : result.roundedUpYards, 0)} yds
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Consumo unitario:</span>
                <span className="text-sm font-bold text-white font-mono-nums">
                  {formatNum(result.unitConsumptionYards, 3)} yds/pza
                </span>
              </div>

              {result.rollsNeeded > 0 && (
                <div>
                  <span className="text-slate-400 block">Rollos necesarios:</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono-nums">
                    {result.rollsNeeded} rollos ({result.rollLengthYards} yds c/u)
                  </span>
                </div>
              )}

              {result.totalCost > 0 && (
                <div>
                  <span className="text-slate-400 block">Costo total de tela:</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono-nums">
                    {formatCurrency(result.totalCost)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick textile tips box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Info className="w-4 h-4 text-indigo-600" />
              <span>Reglas de Taller para Corte</span>
            </div>
            <p>
              • <strong>Siempre redondea hacia arriba:</strong> Comprar la fracción exacta puede dejar la última pieza mocha o sin márgenes de orillo.
            </p>
            <p>
              • <strong>Telas elásticas / licras:</strong> Se aconseja dejar reposar el rollo 24h antes del corte y considerar 5% a 8% de merma por encogimiento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
