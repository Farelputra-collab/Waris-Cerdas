import React, { useState } from 'react';
import { 
  CalculationResult 
} from '../types/faraid';
import { formatRupiah } from '../utils/faraidEngine';
import { generateInheritancePDF, exportInheritanceCSV } from '../utils/pdfGenerator';
import { 
  Search, 
  Trash2, 
  Download, 
  FileSpreadsheet, 
  ArrowRight, 
  History, 
  Clock, 
  Upload, 
  FileJson,
  CheckCircle2
} from 'lucide-react';

interface HistoryViewProps {
  history: CalculationResult[];
  onSelectResult: (result: CalculationResult) => void;
  onDeleteHistoryItem: (id: string) => void;
  onClearHistory: () => void;
  onRestoreHistory: (data: CalculationResult[]) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onSelectResult,
  onDeleteHistoryItem,
  onClearHistory,
  onRestoreHistory
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);

  const filteredHistory = history.filter(item => {
    const name = item.pewaris.nama || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleBackupJSON = () => {
    const jsonStr = JSON.stringify(history, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `WarisCerdas_Backup_${Date.now()}.json`;
    link.click();
  };

  const handleRestoreJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onRestoreHistory(parsed);
          setRestoreMessage('Data riwayat berhasil dipulihkan!');
          setTimeout(() => setRestoreMessage(null), 3000);
        } else {
          alert('Format berkas JSON tidak valid.');
        }
      } catch (err) {
        alert('Gagal membaca berkas JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header & Backup/Restore Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="font-heading font-bold text-2xl text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-6 h-6 text-emerald-600" />
            <span>Riwayat Perhitungan Waris</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Simulasi yang tersimpan secara lokal di peramban Anda.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleBackupJSON}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center space-x-2 transition-colors"
          >
            <FileJson className="w-4 h-4 text-emerald-600" />
            <span>Backup Data</span>
          </button>

          <label className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-semibold text-xs flex items-center space-x-2 cursor-pointer transition-colors border border-emerald-200 dark:border-emerald-800">
            <Upload className="w-4 h-4" />
            <span>Restore JSON</span>
            <input type="file" accept=".json" onChange={handleRestoreJSON} className="hidden" />
          </label>

          {history.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Apakah Anda yakin ingin menghapus seluruh riwayat?')) {
                  onClearHistory();
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition-colors"
            >
              Hapus Semua
            </button>
          )}
        </div>
      </div>

      {restoreMessage && (
        <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{restoreMessage}</span>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Cari berdasarkan nama pewaris..."
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
        />
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <Clock className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
            Tidak Ada Data Riwayat
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Belum ada data simulasi yang tersimpan atau tidak ada nama yang cocok dengan kata kunci pencarian.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 shadow-sm space-y-4 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold uppercase tracking-wider">
                    {item.pewaris.gender === 'male' ? 'Laki-Laki' : 'Perempuan'}
                  </span>

                  <span className="text-[11px] text-slate-400 font-medium">
                    {new Date(item.timestamp).toLocaleDateString('id-ID')}
                  </span>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                    {item.pewaris.nama || 'Pewaris Tanpa Nama'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Status: {item.pewaris.statusPernikahan === 'married' ? 'Menikah' : 'Duda/Janda'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 space-y-1">
                  <span className="text-[10px] text-slate-400 font-medium block">Total Harta Bersih (Tarikah)</span>
                  <div className="text-xl font-bold font-heading text-emerald-600 dark:text-emerald-400">
                    {formatRupiah(item.tarikahNet)}
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    {item.shares.length} kelompok ahli waris berhak
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectResult(item)}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center space-x-1 transition-colors"
                >
                  <span>Buka Detail</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => generateInheritancePDF(item)}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                  title="Cetak PDF"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onDeleteHistoryItem(item.id)}
                  className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
