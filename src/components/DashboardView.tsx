import React from 'react';
import { 
  Calculator, 
  History, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp,
  FileText,
  Clock
} from 'lucide-react';
import { CalculationResult, ViewMode } from '../types/faraid';
import { formatRupiah } from '../utils/faraidEngine';
import { PRESET_CASES } from '../data/presetCases';

interface DashboardViewProps {
  history: CalculationResult[];
  onSelectView: (view: ViewMode) => void;
  onSelectResult: (result: CalculationResult) => void;
  onLoadPreset: (presetId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  history,
  onSelectView,
  onSelectResult,
  onLoadPreset
}) => {
  const recentHistory = history.slice(0, 3);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0F766E] via-[#134E4A] to-slate-900 text-white shadow-xl relative overflow-hidden border border-[#D4AF37]/30">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kalkulator Waris Syariah & KHI</span>
          </div>

          <h1 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight">
            Selamat Datang di Waris Cerdas
          </h1>

          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            Hitung pembagian harta warisan secara transparan, akurat, dan dapat dipertanggungjawabkan sesuai ketentuan Faraid dan Kompilasi Hukum Islam.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={() => onSelectView('calculator')}
              className="px-6 py-3.5 rounded-2xl bg-[#D4AF37] hover:bg-amber-400 text-emerald-950 font-bold text-sm shadow-lg uppercase tracking-wider transition-all hover:scale-105 flex items-center space-x-2"
            >
              <Calculator className="w-4 h-4 text-emerald-950" />
              <span>Perhitungan Waris Baru</span>
            </button>

            <button
              onClick={() => onSelectView('simulation')}
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-all flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Lihat Simulasi Kasus</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-[#0F766E] dark:text-[#D4AF37] flex items-center justify-center shrink-0 font-bold">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black font-heading text-[#0F766E] dark:text-[#D4AF37] italic">
              {history.length}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Simulasi Tersimpan
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-[#D4AF37] flex items-center justify-center shrink-0 font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black font-heading text-slate-900 dark:text-white">
              Faraid & KHI
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Standar Hukum Indonesia
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0F766E] text-white shadow-lg flex items-center space-x-4 border border-teal-700/50">
          <div className="w-12 h-12 rounded-xl bg-[#134E4A] text-[#D4AF37] flex items-center justify-center shrink-0 font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-black font-heading text-[#D4AF37] italic uppercase">
              100% Valid
            </div>
            <div className="text-xs text-emerald-100 font-medium">
              Matematika Faraid Sah
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent History & Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent History */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-5 h-5 text-emerald-600" />
              <span>Riwayat Perhitungan Terakhir</span>
            </h2>

            {history.length > 0 && (
              <button
                onClick={() => onSelectView('history')}
                className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center space-x-1"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {recentHistory.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-slate-900 dark:text-white text-base">
                  Belum Ada Perhitungan
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Mulai dengan memasukkan data pewaris dan harta untuk melihat hasil perhitungan.
                </p>
              </div>
              <button
                onClick={() => onSelectView('calculator')}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-medium text-xs shadow-md"
              >
                Mulai Perhitungan
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentHistory.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectResult(item)}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 shadow-sm cursor-pointer transition-all hover:scale-[1.01] flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-heading font-bold text-slate-900 dark:text-white text-base">
                        {item.pewaris.nama || 'Pewaris Tanpa Nama'}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                        {item.pewaris.gender === 'male' ? 'Laki-Laki' : 'Perempuan'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-3">
                      <span>Tarikah: <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">{formatRupiah(item.tarikahNet)}</strong></span>
                      <span>•</span>
                      <span>{new Date(item.timestamp).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Interactive Presets */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Simulasi Studi Kasus</span>
            </h2>

            <button
              onClick={() => onSelectView('simulation')}
              className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              Semua Kasus
            </button>
          </div>

          <div className="space-y-3">
            {PRESET_CASES.slice(0, 3).map((preset) => (
              <div
                key={preset.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 hover:border-amber-500/50 shadow-sm transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                      {preset.difficulty}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                      Preset Contoh
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-slate-900 dark:text-white text-sm mt-1">
                    {preset.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {preset.subtitle}
                  </p>
                </div>

                <button
                  onClick={() => onLoadPreset(preset.id)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Muat Kasus Ini</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
