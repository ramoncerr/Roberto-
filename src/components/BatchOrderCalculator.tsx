import React, { useState } from 'react';
import { Plus, Trash2, Copy, Printer, CheckCircle2, Layers } from 'lucide-react';
import { BatchItem } from '../types';
import { formatNum, formatCurrency, YARDS_TO_METERS } from '../utils/textileMath';

export const BatchOrderCalculator: React.FC = () => {
  const [orderName, setOrderName] = useState('Orden de Corte #101');
  const [wastePercent, setWastePercent] = useState<number>(3);
  const [rollLength, setRollLength] = useState<number>(50);
  const [pricePerYard, setPricePerYard] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const [items, setItems] = useState<BatchItem[]>([
    { id: '1', name: 'Talla CH (S)', pieces: 120, piecesPerYard: 4 },
    { id: '2', name: 'Talla M', pieces: 240, piecesPerYard: 3.5 },
    { id: '3', name: 'Talla G (L)', pieces: 180, piecesPerYard: 3 },
    { id: '4', name: 'Talla XG (XL)', pieces: 80, piecesPerYard: 2.8 },
  ]);

  const addItem = () => {
    const newItem: BatchItem = {
      id: Date.now().toString(),
      name: `Talla / Pieza #${items.length + 1}`,
      pieces: 100,
      piecesPerYard: 3.5,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, updates: Partial<BatchItem>) => {
    setItems(items.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  // Calculations
  const totalPieces = items.reduce((sum, item) => sum + (Number(item.pieces) || 0), 0);
  const totalNetYards = items.reduce((sum, item) => {
    const pieces = Number(item.pieces) || 0;
    const yieldVal = Number(item.piecesPerYard) || 1;
    return sum + (yieldVal > 0 ? pieces / yieldVal : 0);
  }, 0);

  const wasteYards = totalNetYards * (wastePercent / 100);
  const totalYardsWithWaste = totalNetYards + wasteYards;
  const totalMetersWithWaste = totalYardsWithWaste * YARDS_TO_METERS;
  const rollsNeeded = rollLength > 0 ? Math.ceil(totalYardsWithWaste / rollLength) : 0;
  const totalCost = pricePerYard > 0 ? totalYardsWithWaste * pricePerYard : 0;

  const handleCopySummary = () => {
    const lines = [
      `📋 *ORDEN DE CORTE MULTI-TALLA*`,
      `🔖 *Orden:* ${orderName}`,
      `--------------------------------`,
      ...items.map(
        (i) =>
          `• ${i.name}: ${formatNum(i.pieces, 0)} pzas @ ${formatNum(i.piecesPerYard, 2)} p/yd = ${formatNum(
            i.piecesPerYard > 0 ? i.pieces / i.piecesPerYard : 0,
            2
          )} yds`
      ),
      `--------------------------------`,
      `🔢 *Total Piezas:* ${formatNum(totalPieces, 0)}`,
      `🎯 *Yardas Netas:* ${formatNum(totalNetYards, 2)} yds`,
      `⚠️ *Con Merma (${wastePercent}%):* ${formatNum(totalYardsWithWaste, 2)} yds (${formatNum(
        totalMetersWithWaste,
        2
      )} m)`,
      rollsNeeded > 0 ? `📦 *Rollos (${rollLength} yds c/u):* ${rollsNeeded} rollos` : '',
      totalCost > 0 ? `💵 *Costo Total:* ${formatCurrency(totalCost)}` : '',
    ];

    navigator.clipboard.writeText(lines.filter(Boolean).join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <span>Órdenes de Corte Multi-Talla</span>
          </h2>
          <p className="text-xs text-slate-500">
            Calcula el total de yardas cuando una orden incluye varias tallas o piezas con distintos rendimientos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopySummary}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              copied ? 'bg-emerald-600 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado' : 'Copiar Orden'}</span>
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

      {/* Order Info & Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre / Referencia de la Orden</label>
          <input
            type="text"
            value={orderName}
            onChange={(e) => setOrderName(e.target.value)}
            className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-medium"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Merma Global (%)</label>
          <input
            type="number"
            min="0"
            value={wastePercent}
            onChange={(e) => setWastePercent(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-mono-nums"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Yards / Rollo</label>
          <input
            type="number"
            min="0"
            value={rollLength}
            onChange={(e) => setRollLength(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-mono-nums"
          />
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Partidas y Tallas de la Orden
          </span>
          <button
            type="button"
            onClick={addItem}
            className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agregar Talla</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-2.5 px-4">Talla / Descripción</th>
                <th className="py-2.5 px-4 text-right">Cantidad Piezas</th>
                <th className="py-2.5 px-4 text-right">Piezas / Yarda</th>
                <th className="py-2.5 px-4 text-right">Consumo Unit.</th>
                <th className="py-2.5 px-4 text-right">Yardas Requeridas</th>
                <th className="py-2.5 px-4 text-center w-12">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => {
                const pieces = Number(item.pieces) || 0;
                const yieldVal = Number(item.piecesPerYard) || 1;
                const yardage = yieldVal > 0 ? pieces / yieldVal : 0;
                const unitCons = yieldVal > 0 ? 1 / yieldVal : 0;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2 px-4">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(item.id, { name: e.target.value })}
                        className="w-full px-2 py-1 text-xs border border-transparent hover:border-slate-200 focus:border-indigo-500 rounded font-medium text-slate-800"
                      />
                    </td>
                    <td className="py-2 px-4 text-right">
                      <input
                        type="number"
                        min="1"
                        value={item.pieces || ''}
                        onChange={(e) =>
                          updateItem(item.id, { pieces: Math.max(0, parseInt(e.target.value, 10) || 0) })
                        }
                        className="w-24 px-2 py-1 text-xs border border-slate-200 rounded font-mono-nums text-right font-bold text-slate-900"
                      />
                    </td>
                    <td className="py-2 px-4 text-right">
                      <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={item.piecesPerYard || ''}
                        onChange={(e) =>
                          updateItem(item.id, {
                            piecesPerYard: Math.max(0.01, parseFloat(e.target.value) || 0),
                          })
                        }
                        className="w-20 px-2 py-1 text-xs border border-slate-200 rounded font-mono-nums text-right font-bold text-indigo-700"
                      />
                    </td>
                    <td className="py-2 px-4 text-right font-mono-nums text-slate-500">
                      {formatNum(unitCons, 3)} yd
                    </td>
                    <td className="py-2 px-4 text-right font-mono-nums font-bold text-slate-900 text-sm">
                      {formatNum(yardage, 2)} yds
                    </td>
                    <td className="py-2 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length <= 1}
                        className="p-1 text-slate-400 hover:text-red-600 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                        title="Eliminar partida"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Totals Summary */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-slate-400 block mb-1">
            Total Piezas
          </span>
          <span className="text-2xl font-bold font-mono-nums text-white">
            {formatNum(totalPieces, 0)} pzas
          </span>
        </div>
        <div>
          <span className="text-xs uppercase tracking-wider text-slate-400 block mb-1">
            Yardas Netas
          </span>
          <span className="text-2xl font-bold font-mono-nums text-slate-200">
            {formatNum(totalNetYards, 2)} yds
          </span>
        </div>
        <div className="sm:col-span-2 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
          <span className="text-xs uppercase tracking-wider text-indigo-400 block mb-0.5">
            TOTAL CON MERMA ({wastePercent}%)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono-nums text-white">
              {formatNum(totalYardsWithWaste, 2)}
            </span>
            <span className="text-lg font-bold text-indigo-400">YARDAS</span>
            <span className="text-xs text-slate-400 font-mono-nums ml-2">
              ({formatNum(totalMetersWithWaste, 2)} metros)
            </span>
          </div>
          {rollsNeeded > 0 && (
            <span className="text-xs text-slate-300 block mt-1">
              Equivale a: <strong className="text-emerald-400 font-mono-nums">{rollsNeeded} rollos</strong> de {rollLength} yds
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
