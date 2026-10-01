/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StepWizard } from './components/StepWizard';
import { QuickCalculator } from './components/QuickCalculator';
import { BatchOrderCalculator } from './components/BatchOrderCalculator';
import { VisualCutter } from './components/VisualCutter';
import { HistoryModal } from './components/HistoryModal';
import { TextileGuideModal } from './components/TextileGuideModal';
import { CalculationInput, CalculationResult, SavedCalculation } from './types';

const STORAGE_KEY = 'corteyarda_saved_history_v1';

const defaultInput: CalculationInput = {
  totalPieces: 500,
  piecesPerYard: 4,
  wastePercent: 3,
  rollLengthYards: 50,
  pricePerYard: 0,
  fabricName: '',
  notes: '',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'wizard' | 'quick' | 'batch' | 'visual'>('wizard');
  const [input, setInput] = useState<CalculationInput>(defaultInput);
  const [savedList, setSavedList] = useState<SavedCalculation[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedList(JSON.parse(stored));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const saveHistoryToStorage = (list: SavedCalculation[]) => {
    setSavedList(list);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      // Ignore storage errors
    }
  };

  const handleUpdateInput = (newProps: Partial<CalculationInput>) => {
    setInput((prev) => ({ ...prev, ...newProps }));
  };

  const handleSaveToHistory = (result: CalculationResult) => {
    const newItem: SavedCalculation = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      title: input.fabricName ? input.fabricName : `Cálculo de ${input.totalPieces} piezas`,
      fabricName: input.fabricName,
      input: { ...input },
      result: { ...result },
    };
    saveHistoryToStorage([newItem, ...savedList]);
  };

  const handleRestoreHistory = (item: SavedCalculation) => {
    setInput({ ...item.input });
    setActiveTab('wizard');
  };

  const handleDeleteHistory = (id: string) => {
    saveHistoryToStorage(savedList.filter((item) => item.id !== id));
  };

  const handleClearHistory = () => {
    saveHistoryToStorage([]);
  };

  const handleReset = () => {
    setInput(defaultInput);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Navbar adhering to the 3-Zone contract */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        historyCount={savedList.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onReset={handleReset}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {activeTab === 'wizard' && (
          <StepWizard
            input={input}
            onChangeInput={handleUpdateInput}
            onSaveToHistory={handleSaveToHistory}
            onOpenGuide={() => setIsGuideOpen(true)}
            onSwitchToQuickMode={() => setActiveTab('quick')}
          />
        )}

        {activeTab === 'quick' && (
          <QuickCalculator
            input={input}
            onChangeInput={handleUpdateInput}
            onSaveToHistory={handleSaveToHistory}
          />
        )}

        {activeTab === 'batch' && <BatchOrderCalculator />}

        {activeTab === 'visual' && <VisualCutter input={input} />}
      </main>

      {/* Clean Unboxed Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">CorteYarda</span>
            <span aria-hidden="true">·</span>
            <span>Herramienta de cálculo textil para corte y confección</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Fórmula: Yardas = Piezas ÷ (Piezas/Yd)</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
            >
              Consultar Fórmulas
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedList={savedList}
        onRestore={handleRestoreHistory}
        onDelete={handleDeleteHistory}
        onClearAll={handleClearHistory}
      />

      <TextileGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
