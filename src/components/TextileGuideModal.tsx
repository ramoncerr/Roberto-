import React, { useState } from 'react';
import { X, BookOpen, Calculator, Check, ArrowRightLeft } from 'lucide-react';
import { formatNum, YARDS_TO_METERS } from '../utils/textileMath';

interface TextileGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TextileGuideModal: React.FC<TextileGuideModalProps> = ({ isOpen, onClose }) => {
  const [convYards, setConvYards] = useState<number>(100);
  const [convMeters, setConvMeters] = useState<number>(91.44);

  if (!isOpen) return null;

  const handleYardsChange = (val: number) => {
    setConvYards(val);
    setConvMeters(val * YARDS_TO_METERS);
  };

  const handleMetersChange = (val: number) => {
    setConvMeters(val);
    setConvYards(val / YARDS_TO_METERS);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              Guía de Fórmulas y Rendimiento Textil
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-xs sm:text-sm">
          {/* Core Formula */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4">
            <span className="text-xs uppercase tracking-wider font-bold text-indigo-700 block mb-1">
              Fórmula Principal de Corte
            </span>
            <div className="p-3 bg-white rounded-lg border border-indigo-200 text-center font-mono-nums font-bold text-base sm:text-lg text-slate-900 my-2">
              Yardas Requeridas = Cantidad Total de Piezas ÷ Piezas por Yarda
            </div>
            <p className="text-xs text-indigo-900 mt-2">
              <strong>Ejemplo real:</strong> Si necesitas confeccionar <strong>500 piezas</strong> y tu patrón/trazo rinde <strong>4 piezas por cada yarda</strong>:
              <br />
              <code>500 ÷ 4 = 125.00 yardas de tela.</code>
            </p>
          </div>

          {/* Unit Consumption */}
          <div className="border border-slate-200 rounded-xl p-4">
            <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-indigo-600" />
              Consumo Unitario por Prenda
            </h4>
            <p className="text-xs text-slate-600 mb-2">
              El consumo unitario es cuánta tela se lleva una sola pieza:
            </p>
            <ul className="space-y-1 text-xs list-disc list-inside text-slate-700">
              <li><strong>Consumo en yardas:</strong> <code>1 ÷ (Piezas por Yarda)</code> (Ej. 1 ÷ 4 = 0.25 yardas/pieza).</li>
              <li><strong>Consumo en pulgadas:</strong> <code>(1 ÷ Piezas por Yarda) × 36 pulgadas</code> (Ej. 0.25 × 36 = 9 pulgadas).</li>
              <li><strong>Consumo en centímetros:</strong> <code>(1 ÷ Piezas por Yarda) × 91.44 cm</code> (Ej. 0.25 × 91.44 = 22.86 cm).</li>
            </ul>
          </div>

          {/* Recommended Waste Margins */}
          <div className="border border-slate-200 rounded-xl p-4">
            <h4 className="font-bold text-slate-900 text-sm mb-2">
              Recomendación de Merma de Tela por Tipo de Tejido
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 font-semibold text-slate-700">
                    <th className="py-2">Tipo de Tela</th>
                    <th className="py-2">Merma Típica</th>
                    <th className="py-2">Motivo Principal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr>
                    <td className="py-1.5 font-medium text-slate-900">Tejido Plano (Popelina, Gabardina)</td>
                    <td className="py-1.5 font-mono-nums font-semibold text-emerald-700">2% – 3%</td>
                    <td className="py-1.5">Estable, poco encogimiento en corte.</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-medium text-slate-900">Algodón / Chifón / Playera</td>
                    <td className="py-1.5 font-mono-nums font-semibold text-amber-700">3% – 5%</td>
                    <td className="py-1.5">Encogimiento natural y desperdicio en orillos.</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-medium text-slate-900">Tejido de Punto / Licras / Spandex</td>
                    <td className="py-1.5 font-mono-nums font-semibold text-amber-700">5% – 8%</td>
                    <td className="py-1.5">Tensión de rollo, requiere reposo previo.</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-medium text-slate-900">Denim / Mezclilla pre-lavada</td>
                    <td className="py-1.5 font-mono-nums font-semibold text-red-700">5% – 10%</td>
                    <td className="py-1.5">Lavado industrial y encogimiento longitudinal.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Mini Quick Converter */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-3 flex items-center gap-1.5">
              <ArrowRightLeft className="w-4 h-4 text-indigo-600" />
              Conversor Inmediato: Yardas ↔ Metros
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Yardas</label>
                <input
                  type="number"
                  value={convYards}
                  onChange={(e) => handleYardsChange(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-mono-nums border border-slate-200 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Metros (x 0.9144)</label>
                <input
                  type="number"
                  value={formatNum(convMeters, 2)}
                  onChange={(e) => handleMetersChange(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-mono-nums border border-slate-200 rounded-lg bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
