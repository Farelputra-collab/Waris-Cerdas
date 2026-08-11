import { AhliWarisInput, HartaData, PengurangHartaData, PewarisData } from '../types/faraid';

export interface PresetCase {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  difficulty: 'Mudah' | 'Sedang' | 'Lanjutan';
  pewaris: PewarisData;
  harta: HartaData;
  pengurang: PengurangHartaData;
  input: AhliWarisInput;
}

export const PRESET_CASES: PresetCase[] = [
  {
    id: 'kasus-keluarga-inti',
    title: 'Keluarga Inti Standard (Suami, Istri, Anak L/P & Orang Tua)',
    subtitle: 'Meninggalkan Istri, 1 Anak Laki-Laki, 2 Anak Perempuan, Ayah & Ibu',
    description: 'Struktur pembagian keluarga lengkap. Menunjukkan interaksi Ashabul Furudh (Istri, Ayah, Ibu) dan Ashabah bi Ghairihi (Anak Laki-Laki & Anak Perempuan).',
    difficulty: 'Mudah',
    pewaris: {
      nama: 'H. Ahmad Subagyo',
      gender: 'male',
      statusPernikahan: 'married',
      tanggalWafat: '2026-01-15'
    },
    harta: {
      rumah: 1200000000,
      tanah: 500000000,
      kendaraan: 250000000,
      tabungan: 150000000,
      emas: 50000000,
      saham: 0,
      investasi: 0,
      piutang: 0,
      asetLain: 0
    },
    pengurang: {
      biayaPemakaman: 15000000,
      utang: 35000000,
      wasiat: 0
    },
    input: {
      suami: 0,
      istri: 1,
      ayah: 1,
      ibu: 1,
      anakLaki: 1,
      anakPerempuan: 2,
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
    }
  },
  {
    id: 'kasus-aul-terkenal',
    title: 'Kasus Aul Klasik (Suami + 2 Saudara Perempuan Kandung + Ibu)',
    subtitle: 'Contoh nyata ketika total porsi pecahan melampaui angka 1 (Aul)',
    description: 'Suami (1/2 = 3/6), 2 Saudari Kandung (2/3 = 4/6), Ibu (1/6). Total pembilang = 3 + 4 + 1 = 8/6. Asal Masalah dinaikkan dari 6 menjadi 8.',
    difficulty: 'Sedang',
    pewaris: {
      nama: 'Hj. Siti Fatimah',
      gender: 'female',
      statusPernikahan: 'married',
      tanggalWafat: '2026-03-10'
    },
    harta: {
      rumah: 600000000,
      tanah: 0,
      kendaraan: 120000000,
      tabungan: 80000000,
      emas: 0,
      saham: 0,
      investasi: 0,
      piutang: 0,
      asetLain: 0
    },
    pengurang: {
      biayaPemakaman: 10000000,
      utang: 10000000,
      wasiat: 0
    },
    input: {
      suami: 1,
      istri: 0,
      ayah: 0,
      ibu: 1,
      anakLaki: 0,
      anakPerempuan: 0,
      cucuLaki: 0,
      cucuPerempuan: 0,
      kakek: 0,
      nenekAyah: 0,
      nenekIbu: 0,
      saudaraKandungLaki: 0,
      saudaraKandungPerempuan: 2,
      saudaraSeayahLaki: 0,
      saudaraSeayahPerempuan: 0,
      saudaraSeibuLaki: 0,
      saudaraSeibuPerempuan: 0,
      keponakanLakiKandung: 0,
      keponakanLakiSeayah: 0,
      pamanKandung: 0,
      pamanSeayah: 0,
      cucuPengganti: 0
    }
  },
  {
    id: 'kasus-khi-cucu-pengganti',
    title: 'Kasus KHI Ahli Waris Pengganti (Pasal 185 KHI)',
    subtitle: 'Anak Laki-Laki Wafat Lebih Dulu Meninggalkan Cucu',
    description: 'Menunjukkan penerapan Kompilasi Hukum Islam (KHI) di Indonesia di mana cucu dari anak yang wafat lebih dulu memperoleh hak waris sebagai Ahli Waris Pengganti.',
    difficulty: 'Lanjutan',
    pewaris: {
      nama: 'Drs. H. Ridwan Mansyur',
      gender: 'male',
      statusPernikahan: 'widowed',
      tanggalWafat: '2026-05-20'
    },
    harta: {
      rumah: 1500000000,
      tanah: 300000000,
      kendaraan: 200000000,
      tabungan: 100000000,
      emas: 0,
      saham: 0,
      investasi: 0,
      piutang: 0,
      asetLain: 0
    },
    pengurang: {
      biayaPemakaman: 20000000,
      utang: 0,
      wasiat: 0
    },
    input: {
      suami: 0,
      istri: 0,
      ayah: 0,
      ibu: 0,
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
      cucuPengganti: 2
    }
  },
  {
    id: 'kasus-kalalah',
    title: 'Kasus Kalalah (Tidak Memiliki Keturunan & Orang Tua)',
    subtitle: 'Warisan Diwarisi Oleh Saudara Kandung & Saudara Seibu',
    description: 'Pewaris wafat tanpa memiliki anak dan tanpa orang tua (Kalalah). Harta diwariskan kepada Istri, Saudara Seibu, dan Saudara Kandung.',
    difficulty: 'Sedang',
    pewaris: {
      nama: 'Bambang Irawan',
      gender: 'male',
      statusPernikahan: 'married',
      tanggalWafat: '2026-04-12'
    },
    harta: {
      rumah: 800000000,
      tanah: 0,
      kendaraan: 150000000,
      tabungan: 50000000,
      emas: 20000000,
      saham: 0,
      investasi: 0,
      piutang: 0,
      asetLain: 0
    },
    pengurang: {
      biayaPemakaman: 12000000,
      utang: 8000000,
      wasiat: 0
    },
    input: {
      suami: 0,
      istri: 1,
      ayah: 0,
      ibu: 0,
      anakLaki: 0,
      anakPerempuan: 0,
      cucuLaki: 0,
      cucuPerempuan: 0,
      kakek: 0,
      nenekAyah: 0,
      nenekIbu: 0,
      saudaraKandungLaki: 1,
      saudaraKandungPerempuan: 1,
      saudaraSeayahLaki: 0,
      saudaraSeayahPerempuan: 0,
      saudaraSeibuLaki: 2,
      saudaraSeibuPerempuan: 0,
      keponakanLakiKandung: 0,
      keponakanLakiSeayah: 0,
      pamanKandung: 0,
      pamanSeayah: 0,
      cucuPengganti: 0
    }
  }
];
