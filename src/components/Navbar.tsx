import React from 'react';
import { History, Scissors, RefreshCw, BookOpen } from 'lucide-react';

interface NavbarProps {
  activeTab: 'wizard' | 'quick' | 'batch' | 'visual';
  setActiveTab: (tab: 'wizard' | 'quick' | 'batch' | 'visual') => void;
  historyCount: number;
  onOpenHistory: () => void;
  onOpenGuide: () => void;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  historyCount,
  onOpenHistory,
  onOpenGuide,
  onReset,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Scissors className="w-5 h-5 text-indigo-400" />
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('wizard');
              }}
              className="text-lg font-bold tracking-tight text-slate-900 flex items-baseline gap-1"
            >
              <span>CorteYarda</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">Textil</span>
            </a>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('wizard')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'wizard'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Paso a Paso
            </button>
            <button
              onClick={() => setActiveTab('quick')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'quick'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Calculadora Rápida
            </button>
            <button
              onClick={() => setActiveTab('batch')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'batch'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Órdenes Multi-Talla
            </button>
            <button
              onClick={() => setActiveTab('visual')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'visual'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Simulador de Corte
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenGuide}
              title="Fórmulas y Guía Textil"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
            >
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span className="hidden lg:inline">Fórmulas</span>
            </button>

            <button
              onClick={onOpenHistory}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="Historial de cálculos"
            >
              <History className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Historial</span>
              {historyCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-mono-nums flex items-center justify-center font-bold">
                  {historyCount}
                </span>
              )}
            </button>

            <button
              onClick={onReset}
              title="Reiniciar cálculo actual"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile secondary tab bar */}
        <div className="flex md:hidden items-center justify-between border-t border-slate-100 py-2 overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('wizard')}
            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'wizard' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Paso a Paso
          </button>
          <button
            onClick={() => setActiveTab('quick')}
            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'quick' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Directa
          </button>
          <button
            onClick={() => setActiveTab('batch')}
            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'batch' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Multi-Talla
          </button>
          <button
            onClick={() => setActiveTab('visual')}
            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'visual' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Simulador
          </button>
        </div>
      </div>
    </header>
  );
};
