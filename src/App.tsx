/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  AhliWarisInput, 
  CalculationResult, 
  HartaData, 
  PengurangHartaData, 
  PewarisData, 
  ViewMode 
} from './types/faraid';
import { calculateInheritance } from './utils/faraidEngine';
import { PRESET_CASES } from './data/presetCases';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { CalculatorStepForm } from './components/CalculatorStepForm';
import { CalculationResultView } from './components/CalculationResultView';
import { HistoryView } from './components/HistoryView';
import { EducationView } from './components/EducationView';
import { SimulationView } from './components/SimulationView';
import { HelpView } from './components/HelpView';
import { SettingsView } from './components/SettingsView';

const STORAGE_KEY = 'waris_cerdas_history_v1';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('landing');
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState<boolean>(false);

  const [history, setHistory] = useState<CalculationResult[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeCalculation, setActiveCalculation] = useState<CalculationResult | null>(null);

  // Persist history to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history to localStorage', e);
    }
  }, [history]);

  const handleCalculate = (
    pewaris: PewarisData,
    harta: HartaData,
    pengurang: PengurangHartaData,
    input: AhliWarisInput
  ) => {
    const result = calculateInheritance(pewaris, harta, pengurang, input);
    setHistory(prev => [result, ...prev]);
    setActiveCalculation(result);
    setCurrentView('result');
  };

  const handleLoadPreset = (presetId: string) => {
    const preset = PRESET_CASES.find(p => p.id === presetId);
    if (!preset) return;

    const result = calculateInheritance(
      preset.pewaris,
      preset.harta,
      preset.pengurang,
      preset.input
    );

    setActiveCalculation(result);
    setHistory(prev => [result, ...prev]);
    setCurrentView('result');
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleRestoreHistory = (data: CalculationResult[]) => {
    setHistory(data);
  };

  // Render Landing Page if selected
  if (currentView === 'landing') {
    return <LandingPage onSelectView={setCurrentView} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col lg:flex-row transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        isOpenMobile={isOpenMobileSidebar}
        onCloseMobile={() => setIsOpenMobileSidebar(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Topbar
          currentView={currentView}
          onOpenMobileSidebar={() => setIsOpenMobileSidebar(true)}
          onStartNewCalc={() => setCurrentView('calculator')}
        />

        <main className="flex-1 p-4 sm:p-8">
          {currentView === 'dashboard' && (
            <DashboardView
              history={history}
              onSelectView={setCurrentView}
              onSelectResult={(res) => {
                setActiveCalculation(res);
                setCurrentView('result');
              }}
              onLoadPreset={handleLoadPreset}
            />
          )}

          {currentView === 'calculator' && (
            <CalculatorStepForm
              onSubmit={handleCalculate}
            />
          )}

          {currentView === 'result' && activeCalculation && (
            <CalculationResultView
              result={activeCalculation}
              onNewCalculation={() => setCurrentView('calculator')}
              onBackToDashboard={() => setCurrentView('dashboard')}
            />
          )}

          {currentView === 'history' && (
            <HistoryView
              history={history}
              onSelectResult={(res) => {
                setActiveCalculation(res);
                setCurrentView('result');
              }}
              onDeleteHistoryItem={handleDeleteHistoryItem}
              onClearHistory={handleClearHistory}
              onRestoreHistory={handleRestoreHistory}
            />
          )}

          {currentView === 'education' && (
            <EducationView />
          )}

          {currentView === 'simulation' && (
            <SimulationView
              onLoadPreset={handleLoadPreset}
            />
          )}

          {currentView === 'help' && (
            <HelpView />
          )}

          {currentView === 'settings' && (
            <SettingsView
              onClearHistory={handleClearHistory}
            />
          )}
        </main>

        {/* Global Footer */}
        <footer className="py-6 px-8 border-t border-slate-200 dark:border-slate-800 text-slate-500 text-[11px] text-center space-y-2 bg-white dark:bg-slate-900">
          <p className="max-w-4xl mx-auto leading-relaxed">
            Perhitungan ini merupakan simulasi berdasarkan data yang dimasukkan pengguna. Untuk penetapan hukum yang mengikat atau penyelesaian sengketa, konsultasikan dengan Pengadilan Agama atau ahli hukum waris.
          </p>
          <div>
            © {new Date().getFullYear()} Waris Cerdas – Smart Islamic Inheritance Calculator.
          </div>
        </footer>
      </div>
    </div>
  );
}
