export type Gender = 'male' | 'female';
export type MaritalStatus = 'married' | 'widowed' | 'single';

export interface PewarisData {
  nama: string;
  gender: Gender;
  statusPernikahan: MaritalStatus;
  tanggalWafat: string;
  catatan?: string;
}

export interface HartaData {
  rumah: number;
  tanah: number;
  kendaraan: number;
  tabungan: number;
  emas: number;
  saham: number;
  investasi: number;
  piutang: number;
  asetLain: number;
}

export interface PengurangHartaData {
  biayaPemakaman: number;
  utang: number;
  wasiat: number; // Max 1/3 of net estate after funeral and debts
}

export interface AhliWarisInput {
  // Pasangan
  suami: number; // 0 or 1
  istri: number; // 0 to 4

  // Utama / Langsung
  ayah: number; // 0 or 1
  ibu: number; // 0 or 1
  anakLaki: number;
  anakPerempuan: number;

  // Cucu dari Anak Laki-laki
  cucuLaki: number;
  cucuPerempuan: number;

  // Kakek & Nenek
  kakek: number; // Ayah dari ayah (0 or 1)
  nenekAyah: number; // Ibu dari ayah (0 or 1)
  nenekIbu: number; // Ibu dari ibu (0 or 1)

  // Saudara
  saudaraKandungLaki: number;
  saudaraKandungPerempuan: number;
  saudaraSeayahLaki: number;
  saudaraSeayahPerempuan: number;
  saudaraSeibuLaki: number;
  saudaraSeibuPerempuan: number;

  // Paman & Keponakan
  keponakanLakiKandung: number; // Anak laki-laki saudara laki-laki kandung
  keponakanLakiSeayah: number; // Anak laki-laki saudara laki-laki seayah
  pamanKandung: number; // Saudara laki-laki kandung ayah
  pamanSeayah: number; // Saudara laki-laki seayah ayah

  // KHI (Kompilasi Hukum Islam) - Ahli Waris Pengganti
  cucuPengganti: number; // Cucu dari anak yang meninggal lebih dulu
}

export interface LegalBasis {
  quranVerse?: string;
  quranArabic?: string;
  quranTranslation?: string;
  hadith?: string;
  khiArticle?: string;
  khiText?: string;
  reasoning: string;
}

export interface InheritanceShare {
  id: string;
  title: string;
  titleEn: string;
  category: string;
  count: number;
  fractionText: string;
  fractionValue: number; // e.g. 0.25
  shareNumerator: number; // Part in KPK
  percentage: number;
  amountRp: number;
  individualAmountRp: number;
  status: 'Ashabul Furudh' | 'Ashabah' | 'Mahjub' | 'Ahli Waris Pengganti' | 'Radd' | 'Wasiat';
  mahjubBy?: string;
  legalBasis: LegalBasis;
}

export interface CalculationStep {
  stepNumber: number;
  title: string;
  description: string;
  details?: Record<string, any>;
  data?: any[];
}

export interface CalculationResult {
  id: string;
  timestamp: string;
  pewaris: PewarisData;
  harta: HartaData;
  pengurang: PengurangHartaData;
  ahliWarisInput: AhliWarisInput;
  
  // Financial Summary
  totalHartaGross: number;
  totalPengurang: number;
  tarikahNet: number; // Total - (Biaya + Utang + Wasiat)
  wasiatValidRp: number;
  wasiatExcessWarning: boolean;
  
  // Faraid Mathematical Context
  asalMasalahInitial: number;
  asalMasalahFinal: number; // Adjusted for Aul or Radd
  isAul: boolean;
  isRadd: boolean;
  aulNumeratorTotal?: number;
  
  // Result List & Steps
  shares: InheritanceShare[];
  blockedHeirs: InheritanceShare[];
  steps: CalculationStep[];
  
  totalAllocatedRp: number;
  remainingRp: number;
}

export type ViewMode = 
  | 'landing' 
  | 'dashboard' 
  | 'calculator' 
  | 'result' 
  | 'history' 
  | 'education' 
  | 'simulation' 
  | 'help' 
  | 'settings';
