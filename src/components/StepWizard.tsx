import React, { useState } from 'react';
import {
  Scissors,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Copy,
  Printer,
  Sparkles,
  Layers,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  Sliders,
  HelpCircle,
  Check,
} from 'lucide-react';
import { CalculationInput, CalculationResult } from '../types';
import { calculateYardage, formatNum, formatCurrency, generateShareText } from '../utils/textileMath';

interface StepWizardProps {
  input: CalculationInput;
  onChangeInput: (newInput: Partial<CalculationInput>) => void;
  onSaveToHistory: (result: CalculationResult) => void;
  onOpenGuide: () => void;
  onSwitchToQuickMode?: () => void;
}

export const StepWizard: React.FC<StepWizardProps> = ({
  input,
  onChangeInput,
  onSaveToHistory,
  onOpenGuide,
  onSwitchToQuickMode,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Common quick values
  const piecePresets = [24, 50, 100, 250, 500, 1000, 2500, 5000];
  const yieldPresets = [1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 8];
  const wastePresets = [0, 2, 3, 5, 8, 10];

  const result = calculateYardage(input);

  const goToStep = (stepNumber: 1 | 2 | 3) => {
    // If going to step 2 and totalPieces is 0 or invalid, set default to 100
    if (stepNumber >= 2 && (!input.totalPieces || input.totalPieces <= 0)) {
      onChangeInput({ totalPieces: 100 });
    }
    // If going to step 3 and piecesPerYard is 0 or invalid, set default to 4
    if (stepNumber === 3 && (!input.piecesPerYard || input.piecesPerYard <= 0)) {
      onChangeInput({ piecesPerYard: 4 });
    }
    setCurrentStep(stepNumber);
  };

  const handleNextFromStep1 = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    goToStep(2);
  };

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    goToStep(3);
  };

  const handleCopy = () => {
    const text = generateShareText(result, input.fabricName);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onSaveToHistory(result);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    onChangeInput({
      totalPieces: 500,
      piecesPerYard: 4,
      wastePercent: 3,
      rollLengthYards: 50,
      pricePerYard: 0,
      fabricName: '',
      notes: '',
    });
    setCurrentStep(1);
    setSaved(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Interactive Step Navigation Bar (Clickable tabs) */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Modo Asistido:
            </span>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
              Paso {currentStep} de 3
            </span>
          </div>

          {onSwitchToQuickMode && (
            <button
              type="button"
              onClick={onSwitchToQuickMode}
              className="text-xs text-slate-600 hover:text-indigo-600 font-medium underline flex items-center gap-1 transition-colors"
            >
              <span>¿Prefieres ver todo en una sola pantalla? Cambiar a modo directo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* CLICKABLE STEP BUTTONS */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-200/80 rounded-2xl border border-slate-300/70">
          <button
            type="button"
            onClick={() => goToStep(1)}
            className={`flex items-center justify-center sm:justify-start gap-2 px-3 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
              currentStep === 1
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/90'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                currentStep === 1
                  ? 'bg-slate-900 text-white'
                  : currentStep > 1
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-300 text-slate-700'
              }`}
            >
              {currentStep > 1 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '1'}
            </span>
            <span className="truncate">1. Total de piezas</span>
          </button>

          <button
            type="button"
            onClick={() => goToStep(2)}
            className={`flex items-center justify-center sm:justify-start gap-2 px-3 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
              currentStep === 2
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/90 ring-2 ring-indigo-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                currentStep === 2
                  ? 'bg-indigo-600 text-white'
                  : currentStep > 2
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-300 text-slate-700'
              }`}
            >
              {currentStep > 2 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '2'}
            </span>
            <span className="truncate">2. Piezas por yarda</span>
          </button>

          <button
            type="button"
            onClick={() => goToStep(3)}
            className={`flex items-center justify-center sm:justify-start gap-2 px-3 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
              currentStep === 3
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/90 ring-2 ring-indigo-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                currentStep === 3 ? 'bg-indigo-600 text-white' : 'bg-slate-300 text-slate-700'
              }`}
            >
              3
            </span>
            <span className="truncate">3. Yardas requeridas</span>
          </button>
        </div>
      </div>

      {/* STEP 1: CANTIDAD DE PIEZAS */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-6">
              <span className="text-xs uppercase tracking-wider font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-md">
                Página 1: Cantidad a Producir
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tracking-tight">
                ¿Cuántas piezas necesitas sacar en total?
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Ingresa el número total de prendas, patrones o piezas requeridas para esta orden.
              </p>
            </div>

            <form onSubmit={handleNextFromStep1} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Cantidad total de piezas
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={input.totalPieces || ''}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      onChangeInput({ totalPieces: isNaN(val) ? 0 : Math.max(0, val) });
                    }}
                    placeholder="Ej. 500"
                    autoFocus
                    className="w-full px-5 py-4 text-3xl sm:text-4xl font-mono-nums font-bold text-slate-900 border-2 border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-hidden transition-all text-center placeholder:text-slate-300"
                  />
                  <div className="absolute right-4 text-sm font-semibold text-slate-400 pointer-events-none">
                    pzas
                  </div>
                </div>

                {/* Quick Stepper Buttons */}
                <div className="flex items-center justify-center gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() =>
                      onChangeInput({ totalPieces: Math.max(1, (input.totalPieces || 0) - 100) })
                    }
                    className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                  >
                    -100
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onChangeInput({ totalPieces: Math.max(1, (input.totalPieces || 0) - 10) })
                    }
                    className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                  >
                    -10
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeInput({ totalPieces: (input.totalPieces || 0) + 10 })}
                    className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                  >
                    +10
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeInput({ totalPieces: (input.totalPieces || 0) + 100 })}
                    className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                  >
                    +100
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeInput({ totalPieces: (input.totalPieces || 0) + 500 })}
                    className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                  >
                    +500
                  </button>
                </div>
              </div>

              {/* Quick Presets */}
              <div>
                <span className="block text-xs font-medium text-slate-500 mb-2 text-center">
                  O selecciona una cantidad frecuente:
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {piecePresets.map((qty) => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => onChangeInput({ totalPieces: qty })}
                      className={`px-3 py-1.5 text-xs font-mono-nums font-medium rounded-lg border transition-all ${
                        input.totalPieces === qty
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {formatNum(qty, 0)} pzas
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Fabric / Order Name */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Nombre de la prenda o tela <span className="text-slate-400 font-normal">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={input.fabricName || ''}
                  onChange={(e) => onChangeInput({ fabricName: e.target.value })}
                  placeholder="Ej. Playera Básica Algodón / Orden #204"
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-hidden"
                />
              </div>

              {/* Next Step Action - Always active and clickable */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-slate-400 text-center sm:text-left">
                  Siguiente paso: Indicar cuántas piezas salen por yarda
                </span>
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer hover:shadow-lg active:scale-98"
                >
                  <span>Ir al Paso 2: Piezas por Yarda</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STEP 2: PIEZAS POR YARDA */}
      {currentStep === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-6">
              <span className="text-xs uppercase tracking-wider font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-md">
                Página 2: Rendimiento de Tela
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tracking-tight">
                ¿Cuántas piezas rinde 1 yarda de tela?
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Indica el rendimiento del corte: cuántas piezas salen en una yarda continua (36 pulgadas).
              </p>
            </div>

            <form onSubmit={handleCalculate} className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Piezas por yarda (Rendimiento)
                  </label>
                  <button
                    type="button"
                    onClick={onOpenGuide}
                    className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    ¿Cómo calcular este dato?
                  </button>
                </div>

                <div className="relative flex items-center">
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={input.piecesPerYard || ''}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      onChangeInput({ piecesPerYard: isNaN(val) ? 0 : Math.max(0, val) });
                    }}
                    placeholder="Ej. 4"
                    autoFocus
                    className="w-full px-5 py-4 text-3xl sm:text-4xl font-mono-nums font-bold text-slate-900 border-2 border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-hidden transition-all text-center placeholder:text-slate-300"
                  />
                  <div className="absolute right-4 text-sm font-semibold text-slate-400 pointer-events-none">
                    pzas / yd
                  </div>
                </div>

                {/* Real-time explanation box */}
                {input.piecesPerYard > 0 && (
                  <div className="mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Scissors className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>
                        Consumo unitario:{' '}
                        <strong>{formatNum(1 / input.piecesPerYard, 3)} yardas</strong> por pieza
                      </span>
                    </div>
                    <span className="text-slate-500 font-mono-nums">
                      = {formatNum((1 / input.piecesPerYard) * 36, 1)} pulgadas ({formatNum((1 / input.piecesPerYard) * 91.44, 1)} cm)
                    </span>
                  </div>
                )}
              </div>

              {/* Yield Presets */}
              <div>
                <span className="block text-xs font-medium text-slate-500 mb-2 text-center">
                  Rendimientos comunes en corte:
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {yieldPresets.map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => onChangeInput({ piecesPerYard: y })}
                      className={`px-3 py-1.5 text-xs font-mono-nums font-medium rounded-lg border transition-all ${
                        input.piecesPerYard === y
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {y} {y === 1 ? 'pieza/yd' : 'pzas/yd'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview Box of the Calculation */}
              <div className="p-4 bg-indigo-50/70 rounded-xl border border-indigo-200 text-xs text-indigo-950 space-y-1.5">
                <div className="flex justify-between items-center text-slate-600">
                  <span>1. Piezas a confeccionar:</span>
                  <span className="font-mono-nums font-bold text-slate-900">
                    {formatNum(input.totalPieces || 100, 0)} piezas
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>2. Piezas por yarda:</span>
                  <span className="font-mono-nums font-bold text-indigo-700">
                    {formatNum(input.piecesPerYard || 4, 2)} pzas/yd
                  </span>
                </div>
                <div className="flex justify-between items-center font-bold text-sm text-indigo-950 pt-2 border-t border-indigo-200">
                  <span>Cálculo = Piezas ÷ Rendimiento:</span>
                  <span className="font-mono-nums text-base text-indigo-700">
                    {formatNum(
                      (input.totalPieces || 100) / (input.piecesPerYard || 4),
                      2
                    )}{' '}
                    yardas
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className="px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium text-sm rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver al Paso 1</span>
                </button>

                <button
                  type="button"
                  onClick={() => goToStep(3)}
                  className="px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-98"
                >
                  <span>Ver Resultado (Yardas Totales)</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STEP 3: RESULTADO PRINCIPAL & DESGLOSE */}
      {currentStep === 3 && (
        <div className="space-y-6">
          {/* Main Hero Result Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs font-semibold tracking-wider uppercase text-indigo-400">
                    Página 3: Resultado Final de Corte
                  </span>
                  {input.fabricName && (
                    <h3 className="text-lg font-semibold text-white mt-0.5">{input.fabricName}</h3>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono-nums">
                  <span>{formatNum(result.totalPieces, 0)} piezas</span>
                  <span>÷</span>
                  <span>{formatNum(result.piecesPerYard, 2)} pzas/yd</span>
                </div>
              </div>

              {/* The Hero Yardage Number */}
              <div className="my-6 text-center sm:text-left">
                <div className="text-xs uppercase tracking-wider text-slate-400 font-medium mb-1">
                  Cantidad de yardas requeridas:
                </div>
                <div className="flex items-baseline justify-center sm:justify-start gap-3">
                  <span className="text-5xl sm:text-7xl font-extrabold font-mono-nums tracking-tight text-white">
                    {result.wastePercent > 0
                      ? formatNum(result.totalYardsWithWaste, 2)
                      : formatNum(result.exactYards, 2)}
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-indigo-400">
                    YARDAS
                  </span>
                </div>
                <div className="text-sm text-slate-400 mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1">
                  <span>
                    Equivalente en metros:{' '}
                    <strong className="text-white font-mono-nums">
                      {formatNum(
                        result.wastePercent > 0
                          ? result.totalMetersWithWaste
                          : result.exactMeters,
                        2
                      )}{' '}
                      m
                    </strong>
                  </span>
                  <span>·</span>
                  <span>
                    Yardas enteras para corte:{' '}
                    <strong className="text-white font-mono-nums">
                      {formatNum(
                        result.wastePercent > 0
                          ? result.roundedUpYardsWithWaste
                          : result.roundedUpYards,
                        0
                      )}{' '}
                      yds
                    </strong>
                  </span>
                </div>
              </div>

              {/* Quick Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800 text-xs">
                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 block mb-0.5">Piezas totales</span>
                  <span className="text-base font-bold text-white font-mono-nums">
                    {formatNum(result.totalPieces, 0)}
                  </span>
                </div>
                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 block mb-0.5">Rendimiento</span>
                  <span className="text-base font-bold text-white font-mono-nums">
                    {formatNum(result.piecesPerYard, 2)} p/yd
                  </span>
                </div>
                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 block mb-0.5">Consumo unitario</span>
                  <span className="text-base font-bold text-white font-mono-nums">
                    {formatNum(result.unitConsumptionYards, 3)} yd
                  </span>
                </div>
                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 block mb-0.5">Pulgadas / pieza</span>
                  <span className="text-base font-bold text-white font-mono-nums">
                    {formatNum(result.unitConsumptionInches, 1)}"
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Real-world Production Adjustments (Merma, Rollos, Costos) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-600" />
                <h4 className="text-base font-bold text-slate-900">
                  Ajustes de Producción en Taller
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
              >
                {showAdvanced ? 'Ocultar opciones' : 'Mostrar opciones avanzadas (Rollos / Costos)'}
              </button>
            </div>

            {/* Waste Margin Selector */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    Margen de Merma / Desperdicio de tela:
                  </span>
                  <span className="font-mono-nums font-bold text-slate-900">
                    {input.wastePercent}% ({formatNum(result.wasteYards, 2)} yardas extra)
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {wastePresets.map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => onChangeInput({ wastePercent: pct })}
                      className={`px-3 py-1.5 text-xs font-mono-nums font-medium rounded-lg border transition-all cursor-pointer ${
                        input.wastePercent === pct
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {pct === 0 ? 'Sin merma (0%)' : `+${pct}%`}
                    </button>
                  ))}
                  <div className="flex items-center gap-1 text-xs text-slate-500 pl-2">
                    <span>Personalizado:</span>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={input.wastePercent}
                      onChange={(e) =>
                        onChangeInput({
                          wastePercent: Math.max(0, parseFloat(e.target.value) || 0),
                        })
                      }
                      className="w-16 px-2 py-1 text-xs border border-slate-200 rounded font-mono-nums"
                    />
                    <span>%</span>
                  </div>
                </div>
              </div>

              {showAdvanced && (
                <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Roll Size Calculation */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div className="flex items-center gap-2 mb-2">
                      <Layers className="w-4 h-4 text-slate-600" />
                      <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                        Cálculo por Rollos de Tela
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        step="10"
                        value={input.rollLengthYards || ''}
                        onChange={(e) =>
                          onChangeInput({
                            rollLengthYards: Math.max(0, parseFloat(e.target.value) || 0),
                          })
                        }
                        placeholder="Yds por rollo (ej. 50)"
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg font-mono-nums"
                      />
                      <span className="text-xs text-slate-500 whitespace-nowrap">yds/rollo</span>
                    </div>
                    {result.rollsNeeded > 0 && (
                      <div className="mt-2 text-xs text-slate-700 font-medium">
                        Necesitas:{' '}
                        <strong className="text-indigo-600 font-mono-nums">
                          {result.rollsNeeded} rollo(s)
                        </strong>
                        <span className="text-slate-500 block">
                          Sobrante estimado: {formatNum(result.surplusYardsFromRolls, 2)} yardas
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Fabric Cost Calculation */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-slate-600" />
                      <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                        Presupuesto y Costos
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={input.pricePerYard || ''}
                        onChange={(e) =>
                          onChangeInput({
                            pricePerYard: Math.max(0, parseFloat(e.target.value) || 0),
                          })
                        }
                        placeholder="Precio por yarda ($)"
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg font-mono-nums"
                      />
                      <span className="text-xs text-slate-500 whitespace-nowrap">$/yarda</span>
                    </div>
                    {result.totalCost > 0 && (
                      <div className="mt-2 text-xs text-slate-700 font-medium">
                        Total tela:{' '}
                        <strong className="text-emerald-700 font-mono-nums">
                          {formatCurrency(result.totalCost)}
                        </strong>
                        <span className="text-slate-500 block">
                          Costo de tela por pieza: {formatCurrency(result.costPerPiece)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => goToStep(2)}
                className="px-4 py-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-medium text-sm rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Paso 2 (Rendimiento)</span>
              </button>
              <button
                type="button"
                onClick={() => goToStep(1)}
                className="px-4 py-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-medium text-sm rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Paso 1 (Piezas)</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium text-sm rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reiniciar</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                className={`px-4 py-2.5 text-sm font-medium rounded-xl border transition-colors flex items-center gap-2 cursor-pointer ${
                  saved
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {saved ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Sparkles className="w-4 h-4 text-amber-500" />
                )}
                <span>{saved ? 'Guardado en historial' : 'Guardar cálculo'}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-sm rounded-xl transition-colors flex items-center gap-1.5 no-print cursor-pointer"
                title="Imprimir ficha para mesa de corte"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Imprimir Ficha</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className={`px-5 py-2.5 text-white font-medium text-sm rounded-xl transition-colors flex items-center gap-2 shadow-xs cursor-pointer ${
                  copied ? 'bg-emerald-600' : 'bg-slate-900 hover:bg-slate-800'
                }`}
              >
                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? '¡Copiado al portapapeles!' : 'Copiar Resumen'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
