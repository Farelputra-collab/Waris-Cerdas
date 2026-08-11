import React, { useState } from 'react';
import { 
  CalculationResult, 
  InheritanceShare 
} from '../types/faraid';
import { formatRupiah } from '../utils/faraidEngine';
import { generateInheritancePDF, exportInheritanceCSV } from '../utils/pdfGenerator';
import { 
  PieChart as RechartsPie, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { 
  Download, 
  FileSpreadsheet, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  Scale, 
  ArrowLeft, 
  RefreshCw,
  Share2
} from 'lucide-react';

interface CalculationResultViewProps {
  result: CalculationResult;
  onNewCalculation: () => void;
  onBackToDashboard: () => void;
}

const COLORS = [
  '#0F766E', '#D4AF37', '#2563EB', '#D97706', '#7C3AED', 
  '#059669', '#DC2626', '#0284C7', '#4F46E5', '#9333EA'
];

export const CalculationResultView: React.FC<CalculationResultViewProps> = ({
  result,
  onNewCalculation,
  onBackToDashboard
}) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(1);
  const [selectedLegalShare, setSelectedLegalShare] = useState<InheritanceShare | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Chart data
  const pieData = result.shares.map((s, idx) => ({
    name: s.title,
    value: s.amountRp,
    percentage: s.percentage,
    color: COLORS[idx % COLORS.length]
  }));

  const barData = result.shares.map(s => ({
    name: s.title.split('(')[0].trim(),
    Nominal: s.amountRp,
    Persentase: Number(s.percentage.toFixed(1))
  }));

  const handleCopySummary = () => {
    let summaryText = `*WARIS CERDAS - Laporan Pembagian Waris*\n`;
    summaryText += `Pewaris: ${result.pewaris.nama || 'Almarhum/Almarhumah'}\n`;
    summaryText += `Harta Bersih (Tarikah): ${formatRupiah(result.tarikahNet)}\n\n`;
    summaryText += `*Pembagian Waris:*\n`;

    result.shares.forEach(s => {
      summaryText += `• ${s.title}: ${s.fractionText} (${s.percentage.toFixed(2)}%) = ${formatRupiah(s.amountRp)}\n`;
    });

    if (result.blockedHeirs.length > 0) {
      summaryText += `\n*Terhalang (Mahjub):*\n`;
      result.blockedHeirs.forEach(b => {
        summaryText += `• ${b.title}: Terhalang oleh ${b.mahjubBy}\n`;
      });
    }

    navigator.clipboard.writeText(summaryText);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <button
          onClick={onBackToDashboard}
          className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold text-xs sm:text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleCopySummary}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center space-x-2 transition-colors"
          >
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span>{copiedLink ? 'Tersalin!' : 'Salin Ringkasan'}</span>
          </button>

          <button
            onClick={() => exportInheritanceCSV(result)}
            className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-semibold text-xs flex items-center space-x-2 transition-colors border border-emerald-200 dark:border-emerald-800"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Ekspor Excel</span>
          </button>

          <button
            onClick={() => generateInheritancePDF(result)}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 flex items-center space-x-2 transition-colors"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>Cetak PDF</span>
          </button>

          <button
            onClick={onNewCalculation}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md flex items-center space-x-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Perhitungan Baru</span>
          </button>
        </div>
      </div>

      {/* Main Financial Summary Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-xl shadow-emerald-950/20 border border-emerald-500/30 relative overflow-hidden space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-emerald-800/60 pb-6">
          <div>
            <span className="text-amber-400 font-semibold text-xs uppercase tracking-wider block">
              Laporan Akhir Faraid & KHI
            </span>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-white mt-1">
              {result.pewaris.nama || 'Pewaris Almarhum / Almarhumah'}
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Diperhitungkan pada {new Date(result.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1">
            <span className="text-[11px] text-slate-300 font-medium block">Total Harta Bersih Siap Bagi (Tarikah)</span>
            <div className="text-2xl sm:text-3xl font-black font-heading text-amber-300">
              {formatRupiah(result.tarikahNet)}
            </div>
            <span className="text-[10px] text-emerald-300 block">
              Total Harta Kotor: {formatRupiah(result.totalHartaGross)} | Pengurang: {formatRupiah(result.totalPengurang)}
            </span>
          </div>
        </div>

        {/* Case Special Badge if Aul or Radd */}
        {(result.isAul || result.isRadd) && (
          <div className="p-4 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <strong className="font-bold text-amber-300">
                {result.isAul ? 'Terjadi Kasus AUL (Penyebut Dinaikkan)' : 'Terjadi Kasus RADD (Sisa Harta Didistribusikan)'}
              </strong>
              <p className="text-[11px] text-slate-200 mt-0.5">
                {result.isAul 
                  ? `Jumlah bagian pecahan (${result.asalMasalahFinal}) melebihi Asal Masalah awal (${result.asalMasalahInitial}). Penyebut disesuaikan menjadi ${result.asalMasalahFinal} secara proporsional.`
                  : `Jumlah bagian kurang dari Asal Masalah dan tidak ada Ashabah. Sisa harta dikembalikan kepada Ashabul Furudh.`}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Data Table & Interactive Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Shares Table & Cards */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="font-heading font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-600" />
                <span>Rincian Pembagian Ahli Waris</span>
              </h2>

              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {result.shares.length} Kelompok Berhak
              </span>
            </div>

            {/* Desktop Shares Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-3">Ahli Waris</th>
                    <th className="py-3 px-3">Bagian (Furudh)</th>
                    <th className="py-3 px-3">Persentase</th>
                    <th className="py-3 px-3">Nominal Total</th>
                    <th className="py-3 px-3">Nominal / Orang</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {result.shares.map((share) => (
                    <tr 
                      key={share.id} 
                      className="hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer transition-colors"
                      onClick={() => setSelectedLegalShare(share)}
                    >
                      <td className="py-4 px-3 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center space-x-2">
                          <span>{share.title}</span>
                          <BookOpen className="w-3.5 h-3.5 text-[#0F766E] dark:text-[#D4AF37] hover:text-emerald-500" />
                        </div>
                      </td>
                      <td className="py-4 px-3 font-bold text-[#0F766E] dark:text-[#D4AF37] italic">
                        {share.fractionText}
                      </td>
                      <td className="py-4 px-3 font-medium text-slate-700 dark:text-slate-300">
                        {share.percentage.toFixed(2)}%
                      </td>
                      <td className="py-4 px-3 font-black text-slate-900 dark:text-white text-sm">
                        {formatRupiah(share.amountRp)}
                      </td>
                      <td className="py-4 px-3 font-medium text-slate-600 dark:text-slate-400">
                        {share.count > 1 ? formatRupiah(share.individualAmountRp) : '-'}
                      </td>
                      <td className="py-4 px-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          share.status === 'Ashabul Furudh' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                          share.status === 'Ashabah' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                          'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                        }`}>
                          {share.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Pembagian Summary Banner */}
            <div className="p-5 bg-[#0F766E] rounded-2xl text-white flex flex-col sm:flex-row justify-between items-center gap-3 shadow-md">
              <span className="text-xs uppercase tracking-widest font-semibold italic text-emerald-100">
                Total Pembagian Faraid & KHI
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#D4AF37]">
                {formatRupiah(result.tarikahNet)}
              </span>
            </div>

            {/* Blocked Heirs List if any */}
            {result.blockedHeirs.length > 0 && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="font-heading font-bold text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Ahli Waris Terhalang (Mahjub Hirman)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.blockedHeirs.map((blocked) => (
                    <div 
                      key={blocked.id}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1"
                    >
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {blocked.title}
                      </div>
                      <div className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                        Terhalang oleh: <strong>{blocked.mahjubBy || 'Ahli Waris Terdekat'}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recharts Visualization */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
              Diagram Persentase Pembagian
            </h3>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(val: any) => [formatRupiah(Number(val)), 'Nominal']}
                  />
                </RechartsPie>
              </ResponsiveContainer>
            </div>

            {/* Custom Pie Legend */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[140px]">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transparent Step-by-Step Accordion Process */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <h2 className="font-heading font-bold text-2xl text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <span>Langkah demi Langkah Perhitungan Transparan</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Klik pada setiap langkah untuk melihat penjelasan matematis dan hukum Faraid selengkapnya.
          </p>
        </div>

        <div className="space-y-3">
          {result.steps.map((stepItem) => {
            const isExpanded = expandedStep === stepItem.stepNumber;

            return (
              <div 
                key={stepItem.stepNumber}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedStep(isExpanded ? null : stepItem.stepNumber)}
                  className={`w-full p-4 text-left flex items-center justify-between font-bold text-sm transition-colors ${
                    isExpanded 
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200' 
                      : 'bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-7 h-7 rounded-xl bg-emerald-700 text-amber-300 text-xs font-bold flex items-center justify-center shrink-0">
                      {stepItem.stepNumber}
                    </span>
                    <span>{stepItem.title}</span>
                  </div>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-emerald-600" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>

                {isExpanded && (
                  <div className="p-5 bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-300 space-y-3 border-t border-slate-200 dark:border-slate-800">
                    <p className="leading-relaxed font-medium">{stepItem.description}</p>

                    {stepItem.data && (
                      <div className="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 space-y-2 border border-slate-200/80 dark:border-slate-700/80">
                        {stepItem.data.map((d: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center text-[11px]">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{d.title}</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                              {d.amount || d.status || d.mahjubBy || JSON.stringify(d)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal / Card for Legal Explanation when clicked */}
      {selectedLegalShare && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                    Dasar Hukum: {selectedLegalShare.title}
                  </h3>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    Bagian: {selectedLegalShare.fractionText} ({selectedLegalShare.percentage.toFixed(2)}%)
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedLegalShare(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {selectedLegalShare.legalBasis.quranVerse && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                  <div className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>{selectedLegalShare.legalBasis.quranVerse}</span>
                  </div>
                  {selectedLegalShare.legalBasis.quranArabic && (
                    <p className="font-arabic text-lg text-right text-emerald-950 dark:text-amber-200 leading-loose">
                      {selectedLegalShare.legalBasis.quranArabic}
                    </p>
                  )}
                  {selectedLegalShare.legalBasis.quranTranslation && (
                    <p className="italic text-slate-700 dark:text-slate-300 leading-relaxed">
                      "{selectedLegalShare.legalBasis.quranTranslation}"
                    </p>
                  )}
                </div>
              )}

              {selectedLegalShare.legalBasis.khiArticle && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                  <div className="font-bold text-amber-900 dark:text-amber-300">
                    {selectedLegalShare.legalBasis.khiArticle}
                  </div>
                  {selectedLegalShare.legalBasis.khiText && (
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {selectedLegalShare.legalBasis.khiText}
                    </p>
                  )}
                </div>
              )}

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">Penjelasan Ringkas Fiqih</span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedLegalShare.legalBasis.reasoning}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedLegalShare(null)}
              className="w-full py-3 rounded-2xl bg-emerald-700 text-white font-bold text-xs"
            >
              Tutup Penjelasan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
