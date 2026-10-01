import React, { useState } from 'react';
import { Scissors, Ruler, Eye, Layers } from 'lucide-react';
import { CalculationInput } from '../types';
import { calculateYardage, formatNum } from '../utils/textileMath';

interface VisualCutterProps {
  input: CalculationInput;
}

export const VisualCutter: React.FC<VisualCutterProps> = ({ input }) => {
  const result = calculateYardage(input);
  const [zoomYards, setZoomYards] = useState<number>(4);

  // Pieces per yard clamped for rendering
  const piecesPerYard = input.piecesPerYard || 1;
  const inchesPerPiece = (1 / piecesPerYard) * 36;
  const cmPerPiece = (1 / piecesPerYard) * 91.44;

  const yardsToDisplay = Math.min(zoomYards, Math.ceil(result.exactYards || 4));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Scissors className="w-5 h-5 text-indigo-600" />
            <span>Simulador Visual de Tendido y Marcada</span>
          </h2>
          <p className="text-xs text-slate-500">
            Visualiza cómo se distribuyen las piezas en cada yarda de tela a lo largo de la mesa de corte.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Ver yardas:</span>
          {[2, 4, 8, 12].map((num) => (
            <button
              key={num}
              onClick={() => setZoomYards(num)}
              className={`px-2.5 py-1 rounded-md font-mono-nums border transition-colors ${
                zoomYards === num
                  ? 'bg-slate-900 text-white font-bold border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {num} yds
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-xs">
        <div>
          <span className="text-slate-400 block mb-0.5">Rendimiento</span>
          <span className="text-sm font-bold text-slate-900 font-mono-nums">
            {formatNum(piecesPerYard, 2)} piezas / yarda
          </span>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">Largo por pieza</span>
          <span className="text-sm font-bold text-indigo-600 font-mono-nums">
            {formatNum(inchesPerPiece, 1)}" ({formatNum(cmPerPiece, 1)} cm)
          </span>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">Yardas totales requeridas</span>
          <span className="text-sm font-bold text-slate-900 font-mono-nums">
            {formatNum(result.exactYards, 2)} yardas
          </span>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">Total de piezas a cortar</span>
          <span className="text-sm font-bold text-slate-900 font-mono-nums">
            {formatNum(result.totalPieces, 0)} piezas
          </span>
        </div>
      </div>

      {/* Fabric Roll & Table Visualization */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700">
            <Ruler className="w-4 h-4 text-indigo-600" />
            <span>Mesa de corte simulada (Mostrando las primeras {yardsToDisplay} yardas)</span>
          </div>
          <span className="font-mono-nums">1 Yarda = 36 pulgadas = 91.44 cm</span>
        </div>

        {/* Visual Ruler & Cut Blocks */}
        <div className="space-y-4">
          {Array.from({ length: yardsToDisplay }).map((_, yardIndex) => {
            const yardNumber = yardIndex + 1;
            const fullPiecesInYard = Math.floor(piecesPerYard);
            const fractionalPart = piecesPerYard - fullPiecesInYard;
            const pieceSlots = Math.ceil(piecesPerYard);

            return (
              <div key={yardIndex} className="relative">
                {/* Yard label & ruler tick marks */}
                <div className="flex items-center justify-between text-[11px] font-mono-nums text-slate-500 mb-1 px-1">
                  <span className="font-bold text-indigo-600">Yarda #{yardNumber}</span>
                  <span className="text-slate-400">36" de tela</span>
                </div>

                {/* The Fabric Strip Container */}
                <div className="h-16 w-full bg-slate-100 rounded-xl border border-slate-300 relative overflow-hidden flex p-1 gap-1 shadow-inner">
                  {/* Pieces mapped inside this yard */}
                  {Array.from({ length: pieceSlots }).map((_, pieceIndex) => {
                    const isLastFractional =
                      pieceIndex === pieceSlots - 1 && fractionalPart > 0.05;
                    const pieceWidthPercent = (1 / piecesPerYard) * 100;
                    const overallPieceNum = Math.floor(yardIndex * piecesPerYard + pieceIndex + 1);

                    if (overallPieceNum > result.totalPieces) return null;

                    return (
                      <div
                        key={pieceIndex}
                        style={{
                          width: `${Math.min(100, pieceWidthPercent)}%`,
                          flexGrow: isLastFractional ? fractionalPart : 1,
                        }}
                        className={`h-full rounded-lg border flex flex-col items-center justify-center text-center p-1 transition-all relative ${
                          pieceIndex % 2 === 0
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold tracking-wider">
                          Pieza #{overallPieceNum}
                        </span>
                        <span className="text-[9px] font-mono-nums opacity-75">
                          {formatNum(inchesPerPiece, 1)}"
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Cutting Line Marks */}
                <div className="flex justify-between px-1 text-[9px] font-mono-nums text-slate-400 mt-0.5">
                  <span>0"</span>
                  <span>9"</span>
                  <span>18" (Media yd)</span>
                  <span>27"</span>
                  <span>36" (1 Yd)</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-indigo-100 border border-indigo-300" />
              <span>Pieza corte A</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" />
              <span>Pieza corte B</span>
            </div>
          </div>
          <span className="italic">
            Para producir las {formatNum(result.totalPieces, 0)} piezas se requerirán en total{' '}
            <strong className="text-slate-900 font-mono-nums">{formatNum(result.exactYards, 2)} yardas</strong> continuas.
          </span>
        </div>
      </div>
    </div>
  );
};
