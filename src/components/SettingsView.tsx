import React from 'react';
import { Settings, Moon, Sun, Globe, Database, Trash2, FileJson, CheckCircle2 } from 'lucide-react';

interface SettingsViewProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  language: 'id' | 'en';
  onToggleLanguage: () => void;
  onClearHistory: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  darkMode,
  onToggleDarkMode,
  language,
  onToggleLanguage,
  onClearHistory
}) => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
        <h1 className="font-heading font-bold text-2xl text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-emerald-600" />
          <span>Pengaturan Aplikasi</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Sesuaikan tampilan, bahasa, dan kelola data simulasi Waris Cerdas.
        </p>
      </div>

      <div className="space-y-4">
        {/* Dark Mode Setting */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
              {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 dark:text-white block">Mode Tampilan</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Pilih antara Mode Gelap dan Mode Terang.</span>
            </div>
          </div>

          <button
            onClick={onToggleDarkMode}
            className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs text-slate-800 dark:text-slate-200 transition-colors"
          >
            {darkMode ? 'Mode Terang' : 'Mode Gelap'}
          </button>
        </div>

        {/* Language Setting */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 dark:text-white block">Bahasa Aplikasi</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Bahasa Indonesia / English</span>
            </div>
          </div>

          <button
            onClick={onToggleLanguage}
            className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs text-slate-800 dark:text-slate-200 uppercase transition-colors"
          >
            {language === 'id' ? 'Bahasa Indonesia' : 'English'}
          </button>
        </div>

        {/* Data Management */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 dark:text-white block">Penyimpanan & Privasi</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Data disimpan secara lokal di perangkat Anda.</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Kosongkan Penyimpanan Lokal</span>
            <button
              onClick={() => {
                if (confirm('Apakah Anda yakin ingin menghapus seluruh riwayat simpanan?')) {
                  onClearHistory();
                }
              }}
              className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
