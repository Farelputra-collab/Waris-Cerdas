import React from 'react';
import { PRESET_CASES, PresetCase } from '../data/presetCases';
import { Sparkles, ArrowRight, ShieldCheck, Scale, Calculator } from 'lucide-react';
import { formatRupiah } from '../utils/faraidEngine';

interface SimulationViewProps {
  onLoadPreset: (presetId: string) => void;
}

export const SimulationView: React.FC<SimulationViewProps> = ({ onLoadPreset }) => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white shadow-xl shadow-emerald-950/20 border border-emerald-500/20 space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simulasi Studi Kasus Nyata</span>
        </div>

        <h1 className="font-heading font-black text-2xl sm:text-4xl text-white">
          Simulasi & Contoh Kasus Waris Faraid
        </h1>

        <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
          Pilih salah satu contoh studi kasus di bawah ini untuk melihat langsung penerapan matematika Faraid, kasus Aul, dan Kompilasi Hukum Islam (KHI).
        </p>
      </div>

      {/* Grid of Preset Cases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {PRESET_CASES.map((preset) => {
          const totalAssets = Object.values(preset.harta).reduce((a, b) => a + b, 0);

          return (
            <div
              key={preset.id}
              className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 shadow-sm transition-all space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    preset.difficulty === 'Mudah' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                    preset.difficulty === 'Sedang' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                  }`}>
                    Tingkat: {preset.difficulty}
                  </span>

                  <span className="text-xs text-slate-400 font-semibold">
                    {preset.pewaris.gender === 'male' ? 'Pewaris Laki-Laki' : 'Pewaris Perempuan'}
                  </span>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
                    {preset.title}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                    {preset.subtitle}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    {preset.description}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 space-y-1">
                  <span className="text-[11px] text-slate-400 font-medium block">Estimasi Total Harta Kotor</span>
                  <div className="text-lg font-bold font-heading text-slate-900 dark:text-white">
                    {formatRupiah(totalAssets)}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onLoadPreset(preset.id)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white font-bold text-xs shadow-lg shadow-emerald-800/20 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]"
              >
                <Calculator className="w-4 h-4 text-amber-300" />
                <span>Simulasikan Kasus Ini</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
