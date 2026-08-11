import React from 'react';
import { HelpCircle, Scale, PhoneCall, ShieldCheck, Mail, BookOpen, AlertCircle } from 'lucide-react';

export const HelpView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h1 className="font-heading font-bold text-2xl text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-emerald-600" />
          <span>Bantuan & Konsultasi Hukum Waris</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Panduan penggunaan aplikasi Waris Cerdas dan rujukan konsultasi Pengadilan Agama.
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 space-y-3">
        <div className="flex items-center space-x-2 font-bold text-base">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
          <span>Sifat Hukum & Penafian (Disclaimer)</span>
        </div>
        <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          Perhitungan ini merupakan simulasi matematika berdasarkan data yang dimasukkan pengguna dan norma Faraid / KHI. Untuk penetapan hukum yang mengikat secara resmi (Fatwa Waris / Penetapan Ahli Waris) atau dalam hal penyelesaian sengketa keluarga, Anda disarankan untuk berkonsultasi langsung dengan <strong>Pengadilan Agama setempat</strong> atau Lembaga Bantuan Hukum (LBH) Islam resmi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
            Pengadilan Agama
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Pengadilan Agama di bawah Mahkamah Agung RI berwenang memberikan penetapan resmi mengenai kualifikasi ahli waris dan besaran bagian peninggalan.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
            Kompilasi Hukum Islam (KHI)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            KHI diatur melalui Inpres No. 1 Tahun 1991 sebagai pedoman bagi para hakim di lingkungan Pengadilan Agama dalam menyelesaikan perkara waris.
          </p>
        </div>
      </div>
    </div>
  );
};
