import React from 'react';
import { 
  Scale, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  PieChart, 
  Sparkles,
  Users,
  Award,
  Zap,
  Lock
} from 'lucide-react';
import { ViewMode } from '../types/faraid';

interface LandingPageProps {
  onSelectView: (view: ViewMode) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectView }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Navigation Bar */}
      <header className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between relative z-20">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-[#D4AF37] flex items-center justify-center text-emerald-950 shadow-xl shadow-emerald-900/20 border border-emerald-500/30">
            <Scale className="w-6 h-6 text-emerald-950" />
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white uppercase">
              Waris Cerdas
            </h1>
            <p className="text-xs text-[#0F766E] dark:text-[#D4AF37] font-semibold">
              Smart Islamic Inheritance Calculator
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => onSelectView('education')}
            className="hidden md:flex items-center space-x-2 px-5 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:text-[#0F766E] dark:hover:text-[#D4AF37] font-semibold text-sm transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>Edukasi Faraid</span>
          </button>

          <button
            onClick={() => onSelectView('calculator')}
            className="px-6 py-3 rounded-xl bg-[#0F766E] hover:bg-[#134E4A] text-white font-bold text-sm shadow-xl transition-all hover:scale-105 flex items-center space-x-2 border border-[#D4AF37]/30"
          >
            <span>Mulai Perhitungan</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 overflow-hidden">
        {/* Background Islamic Geometric Gradient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-emerald-100/60 via-teal-50/20 to-transparent dark:from-emerald-950/40 dark:via-slate-900/10 dark:to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Sesuai Al-Qur'an, Hadis, & KHI (Kompilasi Hukum Islam)</span>
            </div>

            <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-slate-900 dark:text-white leading-[1.15] tracking-tight">
              Hitung Pembagian Warisan <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-900 dark:from-emerald-400 dark:via-teal-300 dark:to-amber-300 bg-clip-text text-transparent">
                Secara Akurat & Transparan
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Aplikasi kalkulator waris modern berdasarkan <strong className="text-slate-900 dark:text-white">Ilmu Faraid</strong>, Al-Qur'an (Surah An-Nisa), Hadis Sahih, dan Kompilasi Hukum Islam (KHI). Cepat, transparan, dan dilengkapi penjelasan hukum lengkap.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onSelectView('calculator')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#0F766E] hover:bg-[#134E4A] text-white font-bold text-base shadow-2xl transition-all hover:scale-105 flex items-center justify-center space-x-3 border border-[#D4AF37]/40"
              >
                <span>Mulai Perhitungan Sekarang</span>
                <ArrowRight className="w-5 h-5 text-[#D4AF37]" />
              </button>

              <button
                onClick={() => onSelectView('education')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850 font-bold text-base shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <span>Pelajari Ilmu Faraid</span>
              </button>
            </div>

            {/* Key Statistics Grid */}
            <div className="pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
                <div className="text-emerald-700 dark:text-emerald-400 font-bold text-lg font-heading">100% Akurat</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Algoritma Faraid</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
                <div className="text-emerald-700 dark:text-emerald-400 font-bold text-lg font-heading">Sesuai KHI</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pasal 171 - 193</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
                <div className="text-emerald-700 dark:text-emerald-400 font-bold text-lg font-heading">11 Langkah</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Proses Transparan</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
                <div className="text-amber-600 dark:text-amber-400 font-bold text-lg font-heading">PDF & Excel</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Ekspor Laporan</div>
              </div>
            </div>
          </div>

          {/* Hero Right Graphic Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/30 text-white shadow-2xl shadow-emerald-950/50 space-y-6">
              {/* Islamic Calligraphy Accent */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">Simulasi Perhitungan</span>
                </div>
                <span className="font-arabic text-amber-300 text-sm">الْعَدْلُ وَالْحَقُّ</span>
              </div>

              {/* Sample Calculation Result Box */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-1">
                  <span className="text-[11px] font-medium text-slate-400">Total Harta Bersih (Tarikah)</span>
                  <div className="text-xl sm:text-2xl font-black font-heading text-amber-300">
                    Rp 1.500.000.000
                  </div>
                  <span className="text-[10px] text-emerald-400 block font-medium">Sudah dikurangi utang, biaya jenazah & wasiat</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                    <span className="font-semibold text-slate-200">Istri (1/8)</span>
                    <span className="font-bold text-emerald-400">Rp 187.500.000</span>
                  </div>

                  <div className="flex justify-between items-center text-xs p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                    <span className="font-semibold text-slate-200">Anak Laki-Laki (Ashabah 2x)</span>
                    <span className="font-bold text-amber-400">Rp 875.000.000</span>
                  </div>

                  <div className="flex justify-between items-center text-xs p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                    <span className="font-semibold text-slate-200">Anak Perempuan (Ashabah 1x)</span>
                    <span className="font-bold text-amber-400">Rp 437.500.000</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onSelectView('simulation')}
                  className="w-full py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-semibold text-xs transition-colors flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Coba Contoh Simulasi Lengkap</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white">
              Mengapa Menggunakan Waris Cerdas?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Dirancang dengan standar syariat Islam yang ketat, kemudahan penggunaan, dan laporan lengkap yang dapat dicetak.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-4 hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
                Sesuai Fiqih & KHI
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Menghitung Ashabul Furudh, Ashabah, Mahjub, Aul, Radd, hingga Ahli Waris Pengganti berdasarkan Pasal 185 KHI.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-4 hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                <PieChart className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
                Visualisasi & Diagram
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Menampilkan porsi pembagian secara visual melalui Pie Chart dan Bar Chart interaktif agar mudah dipahami seluruh keluarga.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-4 hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400 flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
                Privasi Terjamin
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Seluruh data aset dan ahli waris diproses secara lokal di perangkat Anda tanpa risiko kebocoran informasi pribadi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer Footer */}
      <footer className="py-12 bg-slate-900 text-slate-400 border-t border-slate-800 text-xs text-center px-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <p className="leading-relaxed">
            Perhitungan ini merupakan simulasi berdasarkan data yang dimasukkan pengguna. Untuk penetapan hukum yang mengikat atau penyelesaian sengketa, konsultasikan dengan Pengadilan Agama atau ahli hukum waris terpercaya.
          </p>
          <div className="text-slate-500">
            © {new Date().getFullYear()} Waris Cerdas – Smart Islamic Inheritance Calculator.
          </div>
        </div>
      </footer>
    </div>
  );
};
