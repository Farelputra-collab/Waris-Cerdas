import React from 'react';
import { Settings, Database, Trash2 } from 'lucide-react';

interface SettingsViewProps {
  onClearHistory: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onClearHistory
}) => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
        <h1 className="font-heading font-bold text-2xl text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#0F766E] dark:text-[#D4AF37]" />
          <span>Pengaturan Aplikasi</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Kelola data simulasi dan penyimpanan lokal aplikasi Waris Cerdas.
        </p>
      </div>

      <div className="space-y-4">
        {/* Data Management */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 dark:bg-teal-950 text-[#0F766E] dark:text-[#D4AF37] flex items-center justify-center font-bold">
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
