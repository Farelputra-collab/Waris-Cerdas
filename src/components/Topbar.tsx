import React from 'react';
import { Menu, Sun, Moon, Globe, PlusCircle } from 'lucide-react';
import { ViewMode } from '../types/faraid';

interface TopbarProps {
  currentView: ViewMode;
  onOpenMobileSidebar: () => void;
  onStartNewCalc: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  language: 'id' | 'en';
  onToggleLanguage: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentView,
  onOpenMobileSidebar,
  onStartNewCalc,
  darkMode,
  onToggleDarkMode,
  language,
  onToggleLanguage
}) => {
  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Dashboard Waris Cerdas';
      case 'calculator': return 'Kalkulator Perhitungan Baru';
      case 'result': return 'Hasil & Rincian Pembagian';
      case 'history': return 'Riwayat Simulasi Waris';
      case 'education': return 'Edukasi & Fiqih Faraid';
      case 'simulation': return 'Simulasi & Studi Kasus';
      case 'help': return 'Bantuan & Konsultasi Hukum';
      case 'settings': return 'Pengaturan Aplikasi';
      default: return 'Waris Cerdas';
    }
  };

  return (
    <header className="h-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between transition-colors">
      <div className="flex items-center space-x-4">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 lg:hidden hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900 dark:text-white">
            {getViewTitle()}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            Sistem Informasi Pembagian Warisan Berdasarkan Faraid & KHI
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3">
        {currentView !== 'calculator' && (
          <button
            onClick={onStartNewCalc}
            className="hidden sm:flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#134E4A] text-white font-semibold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4 text-[#D4AF37]" />
            <span>Hitung Waris</span>
          </button>
        )}

        {/* Language Toggle */}
        <button
          onClick={onToggleLanguage}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
          title="Ubah Bahasa"
        >
          <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-[#0F766E] dark:text-[#D4AF37] font-bold text-[10px]">
            {language.toUpperCase()}
          </div>
          <span className="uppercase text-xs font-bold">Bahasa</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
          title={darkMode ? 'Mode Terang' : 'Mode Gelap'}
        >
          {darkMode ? <Sun className="w-4 h-4 text-[#D4AF37]" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-9 h-9 rounded-full bg-[#0F766E] border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-bold text-xs shadow-sm">
            WC
          </div>
        </div>
      </div>
    </header>
  );
};
