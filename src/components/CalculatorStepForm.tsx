import React, { useState } from 'react';
import { 
  User, 
  Wallet, 
  Receipt, 
  Users, 
  ArrowRight, 
  ArrowLeft, 
  Calculator, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle,
  Plus,
  Minus
} from 'lucide-react';
import { AhliWarisInput, HartaData, PengurangHartaData, PewarisData } from '../types/faraid';
import { formatRupiah } from '../utils/faraidEngine';

interface CalculatorStepFormProps {
  initialPewaris?: PewarisData;
  initialHarta?: HartaData;
  initialPengurang?: PengurangHartaData;
  initialInput?: AhliWarisInput;
  onSubmit: (pewaris: PewarisData, harta: HartaData, pengurang: PengurangHartaData, input: AhliWarisInput) => void;
}

export const CalculatorStepForm: React.FC<CalculatorStepFormProps> = ({
  initialPewaris,
  initialHarta,
  initialPengurang,
  initialInput,
  onSubmit
}) => {
  const [step, setStep] = useState<number>(1);

  // Step 1: Data Pewaris
  const [pewaris, setPewaris] = useState<PewarisData>(initialPewaris || {
    nama: '',
    gender: 'male',
    statusPernikahan: 'married',
    tanggalWafat: new Date().toISOString().split('T')[0]
  });

  // Step 2: Data Harta
  const [harta, setHarta] = useState<HartaData>(initialHarta || {
    rumah: 0,
    tanah: 0,
    kendaraan: 0,
    tabungan: 0,
    emas: 0,
    saham: 0,
    investasi: 0,
    piutang: 0,
    asetLain: 0
  });

  // Step 3: Pengurang Harta
  const [pengurang, setPengurang] = useState<PengurangHartaData>(initialPengurang || {
    biayaPemakaman: 0,
    utang: 0,
    wasiat: 0
  });

  // Step 4: Ahli Waris Input
  const [input, setInput] = useState<AhliWarisInput>(initialInput || {
    suami: 0,
    istri: pewaris.gender === 'male' ? 1 : 0,
    ayah: 1,
    ibu: 1,
    anakLaki: 1,
    anakPerempuan: 1,
    cucuLaki: 0,
    cucuPerempuan: 0,
    kakek: 0,
    nenekAyah: 0,
    nenekIbu: 0,
    saudaraKandungLaki: 0,
    saudaraKandungPerempuan: 0,
    saudaraSeayahLaki: 0,
    saudaraSeayahPerempuan: 0,
    saudaraSeibuLaki: 0,
    saudaraSeibuPerempuan: 0,
    keponakanLakiKandung: 0,
    keponakanLakiSeayah: 0,
    pamanKandung: 0,
    pamanSeayah: 0,
    cucuPengganti: 0
  });

  // Calculate gross assets sum on the fly
  const totalHartaGross: number = Object.values(harta).reduce<number>((acc, curr) => acc + (Number(curr) || 0), 0);
  const totalDeductionsBeforeWasiat: number = (Number(pengurang.biayaPemakaman) || 0) + (Number(pengurang.utang) || 0);
  const netBeforeWasiat: number = Math.max(0, totalHartaGross - totalDeductionsBeforeWasiat);
  const maxWasiatAllowed = netBeforeWasiat / 3;
  const isWasiatExcess = (Number(pengurang.wasiat) || 0) > maxWasiatAllowed;

  // Handle gender swap rules
  const handleGenderChange = (gender: 'male' | 'female') => {
    setPewaris(prev => ({ ...prev, gender }));
    if (gender === 'male') {
      setInput(prev => ({ ...prev, suami: 0, istri: prev.istri === 0 ? 1 : prev.istri }));
    } else {
      setInput(prev => ({ ...prev, istri: 0, suami: prev.suami === 0 ? 1 : prev.suami }));
    }
  };

  const handleCounterChange = (key: keyof AhliWarisInput, delta: number, max: number = 20) => {
    setInput(prev => {
      const current = prev[key] || 0;
      const nextVal = Math.max(0, Math.min(max, current + delta));
      return { ...prev, [key]: nextVal };
    });
  };

  const handleSubmitFinal = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(pewaris, harta, pengurang, input);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Step Progress Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: 'Pewaris', icon: User },
            { num: 2, label: 'Harta', icon: Wallet },
            { num: 3, label: 'Pengurang', icon: Receipt },
            { num: 4, label: 'Ahli Waris', icon: Users },
          ].map((item, idx) => {
            const Icon = item.icon;
            const isCompleted = step > item.num;
            const isCurrent = step === item.num;

            return (
              <React.Fragment key={item.num}>
                <div 
                  onClick={() => setStep(item.num)}
                  className={`flex items-center space-x-2 cursor-pointer transition-all ${isCurrent ? 'text-emerald-700 dark:text-emerald-400 font-bold' : isCompleted ? 'text-slate-700 dark:text-slate-300 font-medium' : 'text-slate-400 dark:text-slate-600'}`}
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition-all ${isCurrent ? 'bg-[#0F766E] text-[#D4AF37] shadow-md' : isCompleted ? 'bg-emerald-100 dark:bg-emerald-950 text-[#0F766E] dark:text-[#D4AF37]' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className="hidden sm:inline text-xs sm:text-sm font-semibold">{item.label}</span>
                </div>

                {idx < 3 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full transition-colors ${step > idx + 1 ? 'bg-[#0F766E]' : 'bg-slate-200 dark:bg-slate-800'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* STEP 1: DATA PEWARIS */}
      {step === 1 && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="font-heading font-bold text-2xl text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-6 h-6 text-[#0F766E] dark:text-[#D4AF37]" />
              <span>Data Pewaris (Yang Meninggal Dunia)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Isi data almarhum / almarhumah pemilik harta peninggalan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Nama Pewaris
              </label>
              <input
                type="text"
                value={pewaris.nama}
                onChange={e => setPewaris({ ...pewaris, nama: e.target.value })}
                placeholder="Contoh: H. Ahmad Subagyo"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Jenis Kelamin
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleGenderChange('male')}
                  className={`py-3 px-4 rounded-2xl font-bold text-xs border transition-all ${pewaris.gender === 'male' ? 'bg-[#0F766E] text-white border-teal-700 shadow-md' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}
                >
                  Laki-Laki
                </button>
                <button
                  type="button"
                  onClick={() => handleGenderChange('female')}
                  className={`py-3 px-4 rounded-2xl font-bold text-xs border transition-all ${pewaris.gender === 'female' ? 'bg-[#0F766E] text-white border-teal-700 shadow-md' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}
                >
                  Perempuan
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Status Pernikahan
              </label>
              <select
                value={pewaris.statusPernikahan}
                onChange={e => setPewaris({ ...pewaris, statusPernikahan: e.target.value as any })}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="married">Menikah</option>
                <option value="widowed">Duda / Janda</option>
                <option value="single">Belum Menikah</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Tanggal Wafat
              </label>
              <input
                type="date"
                value={pewaris.tanggalWafat}
                onChange={e => setPewaris({ ...pewaris, tanggalWafat: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-8 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-lg shadow-emerald-700/20 flex items-center space-x-2 transition-all"
            >
              <span>Lanjut: Data Harta</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: DATA HARTA */}
      {step === 2 && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-2xl text-slate-900 dark:text-white flex items-center gap-2">
                <Wallet className="w-6 h-6 text-emerald-600" />
                <span>Rincian Aset / Harta Peninggalan</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Masukkan perkiraan nilai pasar seluruh aset dalam Rupiah (Rp).
              </p>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-medium text-slate-400 block">Total Harta Kotor</span>
              <span className="text-xl font-black font-heading text-emerald-600 dark:text-emerald-400">
                {formatRupiah(totalHartaGross)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { key: 'rumah', label: 'Rumah & Properti' },
              { key: 'tanah', label: 'Tanah & Sawah' },
              { key: 'kendaraan', label: 'Kendaraan' },
              { key: 'tabungan', label: 'Tabungan & Deposito' },
              { key: 'emas', label: 'Emas & Perhiasan' },
              { key: 'saham', label: 'Saham & Reksadana' },
              { key: 'investasi', label: 'Investasi Usaha' },
              { key: 'piutang', label: 'Piutang Yang Dapat Ditagih' },
              { key: 'asetLain', label: 'Aset Lain-lain' },
            ].map(item => (
              <div key={item.key} className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {item.label} (Rp)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100000"
                  value={harta[item.key as keyof HartaData] || ''}
                  onChange={e => setHarta({ ...harta, [item.key]: Number(e.target.value) || 0 })}
                  placeholder="0"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-8 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-lg shadow-emerald-700/20 flex items-center space-x-2 transition-all"
            >
              <span>Lanjut: Pengurang Harta</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: PENGURANG HARTA */}
      {step === 3 && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="font-heading font-bold text-2xl text-slate-900 dark:text-white flex items-center gap-2">
              <Receipt className="w-6 h-6 text-emerald-600" />
              <span>Kewajiban & Pengurang Harta</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Berdasarkan Fiqih Faraid, biaya jenazah dan utang harus dilunasi terlebih dahulu sebelum pembagian waris.
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Biaya Pemakaman & Perawatan Jenazah (Rp)
                </label>
                <input
                  type="number"
                  min="0"
                  value={pengurang.biayaPemakaman || ''}
                  onChange={e => setPengurang({ ...pengurang, biayaPemakaman: Number(e.target.value) || 0 })}
                  placeholder="0"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Pelunasan Utang Piutang Pewaris (Rp)
                </label>
                <input
                  type="number"
                  min="0"
                  value={pengurang.utang || ''}
                  onChange={e => setPengurang({ ...pengurang, utang: Number(e.target.value) || 0 })}
                  placeholder="0"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-2 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                  Nilai Wasiat Sah (Maksimal 1/3 Harta Bersih) (Rp)
                </label>
                <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold">
                  Maks Wasiat: {formatRupiah(maxWasiatAllowed)}
                </span>
              </div>
              
              <input
                type="number"
                min="0"
                value={pengurang.wasiat || ''}
                onChange={e => setPengurang({ ...pengurang, wasiat: Number(e.target.value) || 0 })}
                placeholder="0"
                className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />

              {isWasiatExcess && (
                <div className="flex items-center space-x-2 text-xs text-amber-700 dark:text-amber-400 font-medium pt-1">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>
                    Nilai wasiat melebihi 1/3 harta bersih. Menurut syariat, hanya {formatRupiah(maxWasiatAllowed)} yang akan dieksekusi tanpa persetujuan seluruh ahli waris.
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(4)}
              className="px-8 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-lg shadow-emerald-700/20 flex items-center space-x-2 transition-all"
            >
              <span>Lanjut: Data Ahli Waris</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: DATA AHLI WARIS */}
      {step === 4 && (
        <form onSubmit={handleSubmitFinal} className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="font-heading font-bold text-2xl text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-emerald-600" />
              <span>Jumlah Ahli Waris Yang Masih Hidup</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Atur jumlah anggota keluarga yang masih hidup saat pewaris meninggal dunia.
            </p>
          </div>

          {/* Category 1: Pasangan */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-sm text-emerald-700 dark:text-emerald-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
              1. Pasangan (Suami / Istri)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pewaris.gender === 'female' ? (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white block">Suami</span>
                    <span className="text-[10px] text-slate-400">Maksimal 1</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button type="button" onClick={() => handleCounterChange('suami', -1, 1)} className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700"><Minus className="w-4 h-4" /></button>
                    <span className="font-bold text-base w-6 text-center">{input.suami}</span>
                    <button type="button" onClick={() => handleCounterChange('suami', 1, 1)} className="p-2 rounded-xl bg-emerald-700 text-white"><Plus className="w-4 h-4" /></button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white block">Istri</span>
                    <span className="text-[10px] text-slate-400">Maksimal 4 istri</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button type="button" onClick={() => handleCounterChange('istri', -1, 4)} className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700"><Minus className="w-4 h-4" /></button>
                    <span className="font-bold text-base w-6 text-center">{input.istri}</span>
                    <button type="button" onClick={() => handleCounterChange('istri', 1, 4)} className="p-2 rounded-xl bg-emerald-700 text-white"><Plus className="w-4 h-4" /></button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Category 2: Orang Tua & Keturunan Langsung */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-sm text-emerald-700 dark:text-emerald-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
              2. Orang Tua & Anak Kandung
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { key: 'ayah', label: 'Ayah Kandung', max: 1 },
                { key: 'ibu', label: 'Ibu Kandung', max: 1 },
                { key: 'anakLaki', label: 'Anak Laki-Laki', max: 20 },
                { key: 'anakPerempuan', label: 'Anak Perempuan', max: 20 },
              ].map(item => (
                <div key={item.key} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white block">{item.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button type="button" onClick={() => handleCounterChange(item.key as any, -1, item.max)} className="p-1.5 rounded-xl bg-slate-200 dark:bg-slate-700"><Minus className="w-3.5 h-3.5" /></button>
                    <span className="font-bold text-sm w-5 text-center">{input[item.key as keyof AhliWarisInput]}</span>
                    <button type="button" onClick={() => handleCounterChange(item.key as any, 1, item.max)} className="p-1.5 rounded-xl bg-emerald-700 text-white"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category 3: Cucu, Kakek, Nenek */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-sm text-emerald-700 dark:text-emerald-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
              3. Cucu, Kakek, & Nenek
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { key: 'cucuLaki', label: 'Cucu Laki-Laki (dr Anak Laki)', max: 20 },
                { key: 'cucuPerempuan', label: 'Cucu Perempuan (dr Anak Laki)', max: 20 },
                { key: 'kakek', label: 'Kakek (Ayah dr Ayah)', max: 1 },
                { key: 'nenekIbu', label: 'Nenek (Ibu dr Ibu)', max: 1 },
                { key: 'nenekAyah', label: 'Nenek (Ibu dr Ayah)', max: 1 },
                { key: 'cucuPengganti', label: 'Cucu Pengganti (KHI Pasal 185)', max: 20 },
              ].map(item => (
                <div key={item.key} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white block">{item.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button type="button" onClick={() => handleCounterChange(item.key as any, -1, item.max)} className="p-1.5 rounded-xl bg-slate-200 dark:bg-slate-700"><Minus className="w-3.5 h-3.5" /></button>
                    <span className="font-bold text-sm w-5 text-center">{input[item.key as keyof AhliWarisInput]}</span>
                    <button type="button" onClick={() => handleCounterChange(item.key as any, 1, item.max)} className="p-1.5 rounded-xl bg-emerald-700 text-white"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category 4: Saudara / Saudari */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-sm text-emerald-700 dark:text-emerald-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
              4. Saudara & Saudari
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { key: 'saudaraKandungLaki', label: 'Saudara Laki Kandung', max: 20 },
                { key: 'saudaraKandungPerempuan', label: 'Saudara Perempuan Kandung', max: 20 },
                { key: 'saudaraSeayahLaki', label: 'Saudara Laki Seayah', max: 20 },
                { key: 'saudaraSeayahPerempuan', label: 'Saudara Perempuan Seayah', max: 20 },
                { key: 'saudaraSeibuLaki', label: 'Saudara Laki Seibu', max: 20 },
                { key: 'saudaraSeibuPerempuan', label: 'Saudara Perempuan Seibu', max: 20 },
              ].map(item => (
                <div key={item.key} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white block">{item.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button type="button" onClick={() => handleCounterChange(item.key as any, -1, item.max)} className="p-1.5 rounded-xl bg-slate-200 dark:bg-slate-700"><Minus className="w-3.5 h-3.5" /></button>
                    <span className="font-bold text-sm w-5 text-center">{input[item.key as keyof AhliWarisInput]}</span>
                    <button type="button" onClick={() => handleCounterChange(item.key as any, 1, item.max)} className="p-1.5 rounded-xl bg-emerald-700 text-white"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>

            <button
              type="submit"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white font-black text-base shadow-xl shadow-emerald-800/30 flex items-center space-x-3 transition-all hover:scale-105 border border-amber-400/30"
            >
              <Calculator className="w-5 h-5 text-amber-300" />
              <span>Hitung Pembagian Waris</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
