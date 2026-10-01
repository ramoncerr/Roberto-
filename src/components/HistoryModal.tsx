import React from 'react';
import { X, Trash2, ArrowUpRight, Copy, CheckCircle2, History } from 'lucide-react';
import { SavedCalculation } from '../types';
import { formatNum, formatCurrency, generateShareText } from '../utils/textileMath';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedList: SavedCalculation[];
  onRestore: (item: SavedCalculation) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  savedList,
  onRestore,
  onDelete,
  onClearAll,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (item: SavedCalculation) => {
    const text = generateShareText(item.result, item.fabricName || item.title);
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Historial de Cálculos de Corte</h3>
            <span className="text-xs text-slate-500 font-mono-nums">({savedList.length})</span>
          </div>
          <div className="flex items-center gap-2">
            {savedList.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs text-red-600 hover:text-red-700 hover:underline px-2 py-1"
              >
                Borrar todo
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {savedList.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <History className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
              <p className="text-sm font-medium text-slate-600">No hay cálculos guardados aún</p>
              <p className="text-xs text-slate-400">
                Cuando hagas un cálculo de piezas y yardas, pulsa "Guardar cálculo" para archivarlo aquí.
              </p>
            </div>
          ) : (
            savedList.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all bg-white shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {item.fabricName || item.title || 'Cálculo de corte'}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {new Date(item.timestamp).toLocaleString('es-MX', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-extrabold font-mono-nums text-indigo-700">
                      {formatNum(
                        item.result.wastePercent > 0
                          ? item.result.totalYardsWithWaste
                          : item.result.exactYards,
                        2
                      )}{' '}
                      yds
                    </span>
                    <span className="block text-[11px] text-slate-500 font-mono-nums">
                      {formatNum(item.result.exactMeters, 2)} m
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Piezas totales</span>
                    <span className="font-mono-nums font-semibold">{formatNum(item.input.totalPieces, 0)} pzas</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Rendimiento</span>
                    <span className="font-mono-nums font-semibold">{formatNum(item.input.piecesPerYard, 2)} p/yd</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Merma</span>
                    <span className="font-mono-nums font-semibold">{item.input.wastePercent}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 mt-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(item)}
                    className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors flex items-center gap-1"
                  >
                    {copiedId === item.id ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-medium">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onRestore(item);
                      onClose();
                    }}
                    className="px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors flex items-center gap-1"
                  >
                    <span>Cargar al calculador</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    className="p-1 text-slate-400 hover:text-red-600 transition-colors rounded"
                    title="Eliminar del historial"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
