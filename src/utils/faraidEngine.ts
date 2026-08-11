import {
  AhliWarisInput,
  CalculationResult,
  CalculationStep,
  HartaData,
  InheritanceShare,
  PengurangHartaData,
  PewarisData
} from '../types/faraid';

// Utility function to calculate Least Common Multiple (KPK / LCM)
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

function getArrayLCM(numbers: number[]): number {
  const filtered = numbers.filter(n => n > 0);
  if (filtered.length === 0) return 1;
  return filtered.reduce((acc, curr) => lcm(acc, curr), filtered[0]);
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function calculateInheritance(
  pewaris: PewarisData,
  harta: HartaData,
  pengurang: PengurangHartaData,
  input: AhliWarisInput
): CalculationResult {
  // 1. Calculate Gross Assets
  const totalHartaGross = 
    (harta.rumah || 0) +
    (harta.tanah || 0) +
    (harta.kendaraan || 0) +
    (harta.tabungan || 0) +
    (harta.emas || 0) +
    (harta.saham || 0) +
    (harta.investasi || 0) +
    (harta.piutang || 0) +
    (harta.asetLain || 0);

  // 2. Calculate Deductions (Funeral & Debts first)
  const biayaJenazah = pengurang.biayaPemakaman || 0;
  const utang = pengurang.utang || 0;
  const initialDeductions = biayaJenazah + utang;

  const sisaSetelahUtang = Math.max(0, totalHartaGross - initialDeductions);

  // Wasiat rule: Max 1/3 of net estate after debts
  const maxWasiatAllowed = sisaSetelahUtang / 3;
  const requestedWasiat = pengurang.wasiat || 0;
  const wasiatValidRp = Math.min(requestedWasiat, maxWasiatAllowed);
  const wasiatExcessWarning = requestedWasiat > maxWasiatAllowed;

  const totalPengurang = initialDeductions + wasiatValidRp;
  const tarikahNet = Math.max(0, totalHartaGross - totalPengurang);

  // List of active shares
  const rawShares: {
    key: string;
    title: string;
    titleEn: string;
    category: string;
    count: number;
    fractionNum: number;
    fractionDenom: number;
    isAshabah: boolean;
    ashabahRatio?: number; // e.g., 2 for male, 1 for female
    isMahjub: boolean;
    mahjubBy?: string;
    legalBasis: any;
    isKhiSubstitute?: boolean;
  }[] = [];

  // Helper flags for presence
  const hasSon = input.anakLaki > 0;
  const hasDaughter = input.anakPerempuan > 0;
  const numDaughters = input.anakPerempuan;
  const hasChildren = hasSon || hasDaughter;
  
  const hasGrandson = input.cucuLaki > 0;
  const hasGranddaughter = input.cucuPerempuan > 0;
  const hasGrandchildren = hasGrandson || hasGranddaughter;

  const hasMaleDescendant = hasSon || hasGrandson;
  const hasDescendant = hasChildren || hasGrandchildren;

  const hasFather = input.ayah > 0;
  const hasMother = input.ibu > 0;
  const hasGrandfather = input.kakek > 0;

  const numSiblings = 
    input.saudaraKandungLaki + input.saudaraKandungPerempuan +
    input.saudaraSeayahLaki + input.saudaraSeayahPerempuan +
    input.saudaraSeibuLaki + input.saudaraSeibuPerempuan;

  // --- SPOUSE (Suami / Istri) ---
  if (pewaris.gender === 'female' && input.suami > 0) {
    if (hasDescendant) {
      rawShares.push({
        key: 'suami',
        title: 'Suami',
        titleEn: 'Husband',
        category: 'Pasangan',
        count: 1,
        fractionNum: 1,
        fractionDenom: 4,
        isAshabah: false,
        isMahjub: false,
        legalBasis: {
          quranVerse: 'QS. An-Nisa (4) : 12',
          quranArabic: 'وَلَكُمْ نِصْفُ مَا تَرَكَ أَزْوَاجُكُمْ إِنْ لَمْ يَكُنْ لَهُنَّ وَلَدٌ فَإِنْ كَانَ لَهُنَّ وَلَدٌ فَلَكُمُ الرُّبُعُ',
          quranTranslation: 'Dan bagimu (suami-suami) seperdua dari harta yang ditinggalkan oleh istri-istrimu, jika mereka tidak mempunyai anak. Jika istri-istrimu itu mempunyai anak, maka kamu mendapat seperempat...',
          khiArticle: 'KHI Pasal 179',
          reasoning: 'Suami mendapat 1/4 karena terdapat anak / cucu pewaris.'
        }
      });
    } else {
      rawShares.push({
        key: 'suami',
        title: 'Suami',
        titleEn: 'Husband',
        category: 'Pasangan',
        count: 1,
        fractionNum: 1,
        fractionDenom: 2,
        isAshabah: false,
        isMahjub: false,
        legalBasis: {
          quranVerse: 'QS. An-Nisa (4) : 12',
          quranArabic: 'وَلَكُمْ نِصْفُ مَا تَرَكَ أَزْوَاجُكُمْ إِنْ لَمْ يَكُنْ لَهُنَّ وَلَدٌ',
          quranTranslation: 'Dan bagimu (suami-suami) seperdua dari harta yang ditinggalkan oleh istri-istrimu, jika mereka tidak mempunyai anak...',
          khiArticle: 'KHI Pasal 179',
          reasoning: 'Suami mendapat 1/2 karena pewaris tidak memiliki anak atau cucu.'
        }
      });
    }
  }

  if (pewaris.gender === 'male' && input.istri > 0) {
    const wifeCount = Math.min(4, input.istri);
    if (hasDescendant) {
      rawShares.push({
        key: 'istri',
        title: `Istri (${wifeCount} orang)`,
        titleEn: 'Wife/Wives',
        category: 'Pasangan',
        count: wifeCount,
        fractionNum: 1,
        fractionDenom: 8,
        isAshabah: false,
        isMahjub: false,
        legalBasis: {
          quranVerse: 'QS. An-Nisa (4) : 12',
          quranArabic: 'فَإِنْ كَانَ لَكُمْ وَلَدٌ فَلَهُنَّ الثُُّمُنُ مِمَّا تَرَكْتُمْ',
          quranTranslation: 'Jika kamu mempunyai anak, maka para istri mendapat seperdelapan dari harta yang kamu tinggalkan...',
          khiArticle: 'KHI Pasal 180',
          reasoning: 'Istri (dibagi bersama) mendapat 1/8 karena pewaris memiliki keturunan.'
        }
      });
    } else {
      rawShares.push({
        key: 'istri',
        title: `Istri (${wifeCount} orang)`,
        titleEn: 'Wife/Wives',
        category: 'Pasangan',
        count: wifeCount,
        fractionNum: 1,
        fractionDenom: 4,
        isAshabah: false,
        isMahjub: false,
        legalBasis: {
          quranVerse: 'QS. An-Nisa (4) : 12',
          quranArabic: 'وَلَهُنَّ الرُّبُعُ مِمَّا تَرَكْتُمْ إِنْ لَمْ يَكُنْ لَكُمْ وَلَدٌ',
          quranTranslation: 'Para istri memperoleh seperempat harta yang kamu tinggalkan jika kamu tidak mempunyai anak...',
          khiArticle: 'KHI Pasal 180',
          reasoning: 'Istri (dibagi bersama) mendapat 1/4 karena pewaris tidak memiliki anak/cucu.'
        }
      });
    }
  }

  // --- PARENTS (Ayah & Ibu) ---
  if (hasMother) {
    if (hasDescendant || numSiblings >= 2) {
      rawShares.push({
        key: 'ibu',
        title: 'Ibu',
        titleEn: 'Mother',
        category: 'Orang Tua',
        count: 1,
        fractionNum: 1,
        fractionDenom: 6,
        isAshabah: false,
        isMahjub: false,
        legalBasis: {
          quranVerse: 'QS. An-Nisa (4) : 11',
          quranArabic: 'وَلأَبَوَيْهِ لِكُلِّ وَاحِدٍ مِنْهُمَا السُُّدُسُ مِمَّا تَرَكَ إِنْ كَانَ لَهُ وَلَدٌ',
          quranTranslation: 'Dan untuk dua orang ibu-bapa, bagi masing-masingnya seperenam dari harta yang ditinggalkan, jika yang meninggal itu mempunyai anak...',
          khiArticle: 'KHI Pasal 178',
          reasoning: 'Ibu mendapat 1/6 karena terdapat keturunan atau 2+ saudara/i.'
        }
      });
    } else {
      // Check Umariyyat (Gharrawain) case: Spouse + Mother + Father (No children, no 2+ siblings)
      const hasSpouse = (input.suami > 0 || input.istri > 0);
      if (hasSpouse && hasFather && !hasDescendant && numSiblings < 2) {
        // Umariyyat case: Mother gets 1/3 of the REMAINDER after spouse
        // Represented temporarily as 1/3 or handled via special logic
        rawShares.push({
          key: 'ibu',
          title: 'Ibu (Kasus Umariyyat)',
          titleEn: 'Mother (Gharrawain Case)',
          category: 'Orang Tua',
          count: 1,
          fractionNum: 1,
          fractionDenom: 3,
          isAshabah: false,
          isMahjub: false,
          legalBasis: {
            quranVerse: 'Ijma Para Sahabat (Kasus Gharrawain)',
            quranTranslation: 'Ibu mendapat 1/3 dari sisa harta setelah diambil bagian suami/istri agar bagian ayah tidak lebih kecil dari ibu.',
            khiArticle: 'KHI Pasal 178 ayat (2)',
            reasoning: 'Kasus Umariyyat / Gharrawain: Ibu memperoleh 1/3 dari sisa harta setelah bagian pasangan diambil.'
          }
        });
      } else {
        rawShares.push({
          key: 'ibu',
          title: 'Ibu',
          titleEn: 'Mother',
          category: 'Orang Tua',
          count: 1,
          fractionNum: 1,
          fractionDenom: 3,
          isAshabah: false,
          isMahjub: false,
          legalBasis: {
            quranVerse: 'QS. An-Nisa (4) : 11',
            quranArabic: 'فَإِنْ لَمْ يَكُنْ لَهُ وَلَدٌ وَوَرِثَهُ أَبَوَاهُ فَلأُمِّهِ الثُُّلُثُ',
            quranTranslation: 'Jika orang yang meninggal tidak mempunyai anak dan ia diwarisi oleh ibu-bapaknya (saja), maka ibunya mendapat sepertiga...',
            khiArticle: 'KHI Pasal 178',
            reasoning: 'Ibu mendapat 1/3 karena tidak ada keturunan dan tidak ada 2+ saudara.'
          }
        });
      }
    }
  }

  if (hasFather) {
    if (hasMaleDescendant) {
      // Gets 1/6 as Ashabul Furudh
      rawShares.push({
        key: 'ayah',
        title: 'Ayah',
        titleEn: 'Father',
        category: 'Orang Tua',
        count: 1,
        fractionNum: 1,
        fractionDenom: 6,
        isAshabah: false,
        isMahjub: false,
        legalBasis: {
          quranVerse: 'QS. An-Nisa (4) : 11',
          quranArabic: 'وَلأَبَوَيْهِ لِكُلِّ وَاحِدٍ مِنْهُمَا السُُّدُسُ مِمَّا تَرَكَ إِنْ كَانَ لَهُ وَلَدٌ',
          quranTranslation: 'Dan untuk dua orang ibu-bapa, bagi masing-masingnya seperenam dari harta yang ditinggalkan...',
          khiArticle: 'KHI Pasal 177',
          reasoning: 'Ayah mendapat 1/6 karena terdapat keturunan laki-laki.'
        }
      });
    } else if (hasDaughter || hasGranddaughter) {
      // Gets 1/6 + Ashabah
      rawShares.push({
        key: 'ayah',
        title: 'Ayah',
        titleEn: 'Father',
        category: 'Orang Tua',
        count: 1,
        fractionNum: 1,
        fractionDenom: 6,
        isAshabah: true, // Also takes residue
        ashabahRatio: 1,
        isMahjub: false,
        legalBasis: {
          quranVerse: 'QS. An-Nisa (4) : 11 & Sunnah',
          quranTranslation: 'Ayah mendapat 1/6 sebagai Ashabul Furudh dan mengambil sisa harta (Ashabah) jika ada sisa.',
          khiArticle: 'KHI Pasal 177',
          reasoning: 'Ayah mendapat 1/6 plus sisa harta (Ashabah) karena hanya ada anak/cucu perempuan.'
        }
      });
    } else {
      // Pure Ashabah
      rawShares.push({
        key: 'ayah',
        title: 'Ayah',
        titleEn: 'Father',
        category: 'Orang Tua',
        count: 1,
        fractionNum: 0,
        fractionDenom: 1,
        isAshabah: true,
        ashabahRatio: 1,
        isMahjub: false,
        legalBasis: {
          quranVerse: 'Hadis Sahih Bukhari & Muslim',
          quranTranslation: 'Berikan bagian warisan kepada yang berhak (Ashabul Furudh), dan sisanya untuk laki-laki yang paling dekat (Ashabah).',
          khiArticle: 'KHI Pasal 177',
          reasoning: 'Ayah menerima seluruh sisa harta (Ashabah bi nafsihi) karena tidak ada keturunan.'
        }
      });
    }
  }

  // --- GRANDPARENTS (Kakek & Nenek) ---
  if (hasGrandfather) {
    if (hasFather) {
      rawShares.push({
        key: 'kakek',
        title: 'Kakek',
        titleEn: 'Grandfather',
        category: 'Kakek & Nenek',
        count: 1,
        fractionNum: 0,
        fractionDenom: 1,
        isAshabah: false,
        isMahjub: true,
        mahjubBy: 'Ayah',
        legalBasis: {
          reasoning: 'Kakek terhalang (Mahjub Hirman) oleh keberadaan Ayah.',
          khiArticle: 'KHI Pasal 177 & Faraid Ijma'
        }
      });
    } else {
      if (hasMaleDescendant) {
        rawShares.push({
          key: 'kakek',
          title: 'Kakek',
          titleEn: 'Grandfather',
          category: 'Kakek & Nenek',
          count: 1,
          fractionNum: 1,
          fractionDenom: 6,
          isAshabah: false,
          isMahjub: false,
          legalBasis: {
            reasoning: 'Kakek menggantikan kedudukan Ayah mendapat 1/6 karena ada anak/cucu laki-laki.',
            khiArticle: 'KHI Pasal 177'
          }
        });
      } else {
        rawShares.push({
          key: 'kakek',
          title: 'Kakek',
          titleEn: 'Grandfather',
          category: 'Kakek & Nenek',
          count: 1,
          fractionNum: 0,
          fractionDenom: 1,
          isAshabah: true,
          ashabahRatio: 1,
          isMahjub: false,
          legalBasis: {
            reasoning: 'Kakek menggantikan posisi Ayah sebagai Ashabah.',
            khiArticle: 'KHI Pasal 177'
          }
        });
      }
    }
  }

  // Nenek Ayah / Ibu
  if (input.nenekIbu > 0 || input.nenekAyah > 0) {
    const totalNenek = input.nenekIbu + input.nenekAyah;
    if (hasMother) {
      rawShares.push({
        key: 'nenek',
        title: `Nenek (${totalNenek} orang)`,
        titleEn: 'Grandmother(s)',
        category: 'Kakek & Nenek',
        count: totalNenek,
        fractionNum: 0,
        fractionDenom: 1,
        isAshabah: false,
        isMahjub: true,
        mahjubBy: 'Ibu',
        legalBasis: {
          reasoning: 'Nenek terhalang (Mahjub Hirman) oleh keberadaan Ibu.',
          khiArticle: 'KHI Pasal 178 & Ijma'
        }
      });
    } else {
      rawShares.push({
        key: 'nenek',
        title: `Nenek (${totalNenek} orang)`,
        titleEn: 'Grandmother(s)',
        category: 'Kakek & Nenek',
        count: totalNenek,
        fractionNum: 1,
        fractionDenom: 6,
        isAshabah: false,
        isMahjub: false,
        legalBasis: {
          reasoning: 'Nenek (dibagi bersama) mendapat 1/6 karena tidak ada Ibu.',
          khiArticle: 'KHI Pasal 178'
        }
      });
    }
  }

  // --- CHILDREN (Anak Laki-Laki & Anak Perempuan) ---
  if (hasChildren) {
    if (hasSon) {
      // Both Son & Daughter become Ashabah bi Ghairihi with ratio 2:1
      rawShares.push({
        key: 'anakLaki',
        title: `Anak Laki-Laki (${input.anakLaki} orang)`,
        titleEn: 'Son(s)',
        category: 'Anak Kandung',
        count: input.anakLaki,
        fractionNum: 0,
        fractionDenom: 1,
        isAshabah: true,
        ashabahRatio: input.anakLaki * 2,
        isMahjub: false,
        legalBasis: {
          quranVerse: 'QS. An-Nisa (4) : 11',
          quranArabic: 'يُوصِيكُمُ اللَّهُ فِي أَوْلاَدِكُمْ لِلذَّكَرِ مِثْلُ حَظِّ الأُنْثَيَيْنِ',
          quranTranslation: 'Allah mensyariatkan bagimu tentang (pembagian pusaka untuk) anak-anakmu. Yaitu: bahagian seorang anak lelaki sama dengan bahagian dua orang anak perempuan...',
          khiArticle: 'KHI Pasal 176',
          reasoning: 'Anak Laki-Laki menerima sisa harta (Ashabah bi nafsihi/bi ghairihi) dengan nisbah 2 : 1 dibanding anak perempuan.'
        }
      });

      if (hasDaughter) {
        rawShares.push({
          key: 'anakPerempuan',
          title: `Anak Perempuan (${input.anakPerempuan} orang)`,
          titleEn: 'Daughter(s)',
          category: 'Anak Kandung',
          count: input.anakPerempuan,
          fractionNum: 0,
          fractionDenom: 1,
          isAshabah: true,
          ashabahRatio: input.anakPerempuan * 1,
          isMahjub: false,
          legalBasis: {
            quranVerse: 'QS. An-Nisa (4) : 11',
            khiArticle: 'KHI Pasal 176',
            reasoning: 'Anak perempuan ditarik menjadi Ashabah bi Ghairihi oleh anak laki-laki dengan nisbah 1 : 2.'
          }
        });
      }
    } else {
      // Only Daughters (No sons)
      if (numDaughters === 1) {
        rawShares.push({
          key: 'anakPerempuan',
          title: 'Anak Perempuan (1 orang)',
          titleEn: 'Daughter (Single)',
          category: 'Anak Kandung',
          count: 1,
          fractionNum: 1,
          fractionDenom: 2,
          isAshabah: false,
          isMahjub: false,
          legalBasis: {
            quranVerse: 'QS. An-Nisa (4) : 11',
            quranArabic: 'فَإِنْ كُنَّ نِسَاءً فَوْقَ اثْنَتَيْنِ فَلَهُنَّ ثُلُثَا مَا تَرَكَ وَإِنْ كَانَتْ وَاحِدَةً فَلَهَا النِّصْفُ',
            quranTranslation: 'Jika anak perempuan itu seorang saja, maka ia memperoleh separo harta...',
            khiArticle: 'KHI Pasal 176',
            reasoning: 'Anak perempuan tunggal memperoleh 1/2 bagian.'
          }
        });
      } else if (numDaughters >= 2) {
        rawShares.push({
          key: 'anakPerempuan',
          title: `Anak Perempuan (${numDaughters} orang)`,
          titleEn: 'Daughters (Multiple)',
          category: 'Anak Kandung',
          count: numDaughters,
          fractionNum: 2,
          fractionDenom: 3,
          isAshabah: false,
          isMahjub: false,
          legalBasis: {
            quranVerse: 'QS. An-Nisa (4) : 11',
            quranTranslation: 'Jika anak perempuan itu lebih dari dua (atau dua), maka bagi mereka dua pertiga dari harta yang ditinggalkan...',
            khiArticle: 'KHI Pasal 176',
            reasoning: 'Dua atau lebih anak perempuan (tanpa anak laki-laki) memperoleh 2/3 bagian bersama.'
          }
        });
      }
    }
  }

  // --- GRANDCHILDREN (Cucu dari Anak Laki-Laki) ---
  if (hasGrandchildren) {
    if (hasSon) {
      // Blocked by Son in classical Faraid, but KHI offers Ahli Waris Pengganti if applicable
      rawShares.push({
        key: 'cucuLaki',
        title: `Cucu Laki-Laki (${input.cucuLaki} orang)`,
        titleEn: 'Grandson(s)',
        category: 'Cucu',
        count: input.cucuLaki,
        fractionNum: 0,
        fractionDenom: 1,
        isAshabah: false,
        isMahjub: true,
        mahjubBy: 'Anak Laki-Laki',
        legalBasis: {
          reasoning: 'Cucu terhalang (Mahjub Hirman) oleh keberadaan Anak Laki-Laki langsung.',
          khiArticle: 'KHI Pasal 185 (Catatan: Dapat memperoleh bagian jika melalui skema Ahli Waris Pengganti)'
        }
      });
    } else {
      // No Son exists
      if (hasGrandson) {
        rawShares.push({
          key: 'cucuLaki',
          title: `Cucu Laki-Laki (${input.cucuLaki} orang)`,
          titleEn: 'Grandson(s)',
          category: 'Cucu',
          count: input.cucuLaki,
          fractionNum: 0,
          fractionDenom: 1,
          isAshabah: true,
          ashabahRatio: input.cucuLaki * 2,
          isMahjub: false,
          legalBasis: {
            reasoning: 'Cucu Laki-Laki menggantikan posisi Anak Laki-Laki sebagai Ashabah.',
            khiArticle: 'KHI Pasal 185'
          }
        });

        if (hasGranddaughter) {
          rawShares.push({
            key: 'cucuPerempuan',
            title: `Cucu Perempuan (${input.cucuPerempuan} orang)`,
            titleEn: 'Granddaughter(s)',
            category: 'Cucu',
            count: input.cucuPerempuan,
            fractionNum: 0,
            fractionDenom: 1,
            isAshabah: true,
            ashabahRatio: input.cucuPerempuan * 1,
            isMahjub: false,
            legalBasis: {
              reasoning: 'Cucu Perempuan menjadi Ashabah bi Ghairihi ditarik oleh Cucu Laki-Laki (nisbah 1:2).',
              khiArticle: 'KHI Pasal 185'
            }
          });
        }
      } else {
        // Only Granddaughters (No grandsons and no sons)
        if (numDaughters === 0) {
          // Equivalent to daughters
          if (input.cucuPerempuan === 1) {
            rawShares.push({
              key: 'cucuPerempuan',
              title: 'Cucu Perempuan (1 orang)',
              titleEn: 'Granddaughter (1)',
              category: 'Cucu',
              count: 1,
              fractionNum: 1,
              fractionDenom: 2,
              isAshabah: false,
              isMahjub: false,
              legalBasis: {
                reasoning: 'Cucu perempuan tunggal (tanpa anak) memperoleh 1/2 bagian.',
                khiArticle: 'KHI Pasal 185'
              }
            });
          } else {
            rawShares.push({
              key: 'cucuPerempuan',
              title: `Cucu Perempuan (${input.cucuPerempuan} orang)`,
              titleEn: 'Granddaughters',
              category: 'Cucu',
              count: input.cucuPerempuan,
              fractionNum: 2,
              fractionDenom: 3,
              isAshabah: false,
              isMahjub: false,
              legalBasis: {
                reasoning: 'Dua atau lebih cucu perempuan (tanpa anak) mendapat 2/3 bersama.',
                khiArticle: 'KHI Pasal 185'
              }
            });
          }
        } else if (numDaughters === 1) {
          // Daughter gets 1/2, Granddaughters get 1/6 to complete 2/3 (Takmilatuh ussulusain)
          rawShares.push({
            key: 'cucuPerempuan',
            title: `Cucu Perempuan (${input.cucuPerempuan} orang)`,
            titleEn: 'Granddaughter(s)',
            category: 'Cucu',
            count: input.cucuPerempuan,
            fractionNum: 1,
            fractionDenom: 6,
            isAshabah: false,
            isMahjub: false,
            legalBasis: {
              reasoning: 'Cucu Perempuan mendapat 1/6 untuk melengkapi bagian 2/3 wanita (Takmilatuh as-Sulusain) bersama 1 Anak Perempuan.',
              khiArticle: 'KHI Pasal 185 & Hadis Sahih Ibn Mas\'ud'
            }
          });
        } else {
          // numDaughters >= 2, 2/3 exhausted!
          rawShares.push({
            key: 'cucuPerempuan',
            title: `Cucu Perempuan (${input.cucuPerempuan} orang)`,
            titleEn: 'Granddaughter(s)',
            category: 'Cucu',
            count: input.cucuPerempuan,
            fractionNum: 0,
            fractionDenom: 1,
            isAshabah: false,
            isMahjub: true,
            mahjubBy: '2+ Anak Perempuan',
            legalBasis: {
              reasoning: 'Cucu perempuan terhalang karena jatah 2/3 perempuan telah dihabiskan oleh 2+ Anak Perempuan.',
              khiArticle: 'KHI Pasal 185'
            }
          });
        }
      }
    }
  }

  // --- SIBLINGS (Saudara Kandung, Seayah, Seibu) ---
  const isBlockedByFatherOrSon = hasSon || hasFather || hasGrandson;

  // 1. Saudara Seibu (Laki/Perempuan) - Blocked by any descendant or Father/Grandfather
  const numSaudaraSeibu = input.saudaraSeibuLaki + input.saudaraSeibuPerempuan;
  if (numSaudaraSeibu > 0) {
    if (hasDescendant || hasFather || hasGrandfather) {
      rawShares.push({
        key: 'saudaraSeibu',
        title: `Saudara Seibu (${numSaudaraSeibu} orang)`,
        titleEn: 'Maternal Sibling(s)',
        category: 'Saudara',
        count: numSaudaraSeibu,
        fractionNum: 0,
        fractionDenom: 1,
        isAshabah: false,
        isMahjub: true,
        mahjubBy: hasDescendant ? 'Anak / Cucu' : 'Ayah / Kakek',
        legalBasis: {
          quranVerse: 'QS. An-Nisa (4) : 12',
          reasoning: 'Saudara seibu terhalang (Kalalah syarat) jika terdapat keturunan atau ayah/kakek.',
          khiArticle: 'KHI Pasal 181 & 182'
        }
      });
    } else {
      if (numSaudaraSeibu === 1) {
        rawShares.push({
          key: 'saudaraSeibu',
          title: 'Saudara Seibu (1 orang)',
          titleEn: 'Maternal Sibling (1)',
          category: 'Saudara',
          count: 1,
          fractionNum: 1,
          fractionDenom: 6,
          isAshabah: false,
          isMahjub: false,
          legalBasis: {
            quranVerse: 'QS. An-Nisa (4) : 12',
            quranTranslation: '...Jika seorang meninggal, baik laki-laki maupun perempuan yang tidak meninggalkan ayah dan tidak meninggalkan anak, tetapi mempunyai seorang saudara laki-laki (seibu) atau seorang saudara perempuan (seibu), maka bagi masing-masing dari kedua jenis saudara itu seperenam harta...',
            khiArticle: 'KHI Pasal 181',
            reasoning: 'Satu saudara seibu (Kalalah) mendapat 1/6 bagian.'
          }
        });
      } else {
        rawShares.push({
          key: 'saudaraSeibu',
          title: `Saudara Seibu (${numSaudaraSeibu} orang)`,
          titleEn: 'Maternal Siblings (Multiple)',
          category: 'Saudara',
          count: numSaudaraSeibu,
          fractionNum: 1,
          fractionDenom: 3,
          isAshabah: false,
          isMahjub: false,
          legalBasis: {
            quranVerse: 'QS. An-Nisa (4) : 12',
            quranTranslation: '...Tetapi jika saudara-saudara seibu itu lebih dari seorang, maka mereka bersekutu dalam yang sepertiga itu...',
            khiArticle: 'KHI Pasal 181',
            reasoning: 'Dua atau lebih saudara seibu mendapat 1/3 bagian dibagi rata secara seimbang.'
          }
        });
      }
    }
  }

  // 2. Saudara Kandung (Laki & Perempuan)
  const numSaudaraKandungLaki = input.saudaraKandungLaki;
  const numSaudaraKandungPerempuan = input.saudaraKandungPerempuan;
  if (numSaudaraKandungLaki > 0 || numSaudaraKandungPerempuan > 0) {
    if (isBlockedByFatherOrSon) {
      rawShares.push({
        key: 'saudaraKandung',
        title: `Saudara Kandung (${numSaudaraKandungLaki + numSaudaraKandungPerempuan} orang)`,
        titleEn: 'Full Sibling(s)',
        category: 'Saudara',
        count: numSaudaraKandungLaki + numSaudaraKandungPerempuan,
        fractionNum: 0,
        fractionDenom: 1,
        isAshabah: false,
        isMahjub: true,
        mahjubBy: hasSon ? 'Anak Laki-Laki' : (hasFather ? 'Ayah' : 'Cucu Laki-Laki'),
        legalBasis: {
          quranVerse: 'QS. An-Nisa (4) : 176',
          reasoning: 'Saudara kandung terhalang (Mahjub Hirman) oleh Anak Laki-Laki, Cucu Laki-Laki, atau Ayah.',
          khiArticle: 'KHI Pasal 182'
        }
      });
    } else {
      if (numSaudaraKandungLaki > 0) {
        rawShares.push({
          key: 'saudaraKandungLaki',
          title: `Saudara Laki-Laki Kandung (${numSaudaraKandungLaki} orang)`,
          titleEn: 'Full Brother(s)',
          category: 'Saudara',
          count: numSaudaraKandungLaki,
          fractionNum: 0,
          fractionDenom: 1,
          isAshabah: true,
          ashabahRatio: numSaudaraKandungLaki * 2,
          isMahjub: false,
          legalBasis: {
            quranVerse: 'QS. An-Nisa (4) : 176',
            khiArticle: 'KHI Pasal 182',
            reasoning: 'Saudara Laki-Laki Kandung menjadi Ashabah (menerima sisa).'
          }
        });

        if (numSaudaraKandungPerempuan > 0) {
          rawShares.push({
            key: 'saudaraKandungPerempuan',
            title: `Saudara Perempuan Kandung (${numSaudaraKandungPerempuan} orang)`,
            titleEn: 'Full Sister(s)',
            category: 'Saudara',
            count: numSaudaraKandungPerempuan,
            fractionNum: 0,
            fractionDenom: 1,
            isAshabah: true,
            ashabahRatio: numSaudaraKandungPerempuan * 1,
            isMahjub: false,
            legalBasis: {
              quranVerse: 'QS. An-Nisa (4) : 176',
              khiArticle: 'KHI Pasal 182',
              reasoning: 'Saudara Perempuan Kandung ditarik menjadi Ashabah bi Ghairihi (2:1).'
            }
          });
        }
      } else {
        // Only Full Sisters
        if (hasDaughter || hasGranddaughter) {
          // Ashabah Ma'a Ghairihi!
          rawShares.push({
            key: 'saudaraKandungPerempuan',
            title: `Saudara Perempuan Kandung (${numSaudaraKandungPerempuan} orang)`,
            titleEn: 'Full Sister(s)',
            category: 'Saudara',
            count: numSaudaraKandungPerempuan,
            fractionNum: 0,
            fractionDenom: 1,
            isAshabah: true,
            ashabahRatio: 1,
            isMahjub: false,
            legalBasis: {
              quranVerse: 'Hadis Nabi SAW (At-Tirmidzi)',
              quranTranslation: 'Jadikanlah saudara-saudara perempuan bersama anak-anak perempuan sebagai ashabah (Ashabah Ma\'a Ghairihi).',
              khiArticle: 'KHI Pasal 182',
              reasoning: 'Saudara Perempuan Kandung menjadi Ashabah Ma\'a Ghairihi karena ada anak/cucu perempuan.'
            }
          });
        } else {
          // Standard Ashabul Furudh for sisters
          if (numSaudaraKandungPerempuan === 1) {
            rawShares.push({
              key: 'saudaraKandungPerempuan',
              title: 'Saudara Perempuan Kandung (1 orang)',
              titleEn: 'Full Sister (1)',
              category: 'Saudara',
              count: 1,
              fractionNum: 1,
              fractionDenom: 2,
              isAshabah: false,
              isMahjub: false,
              legalBasis: {
                quranVerse: 'QS. An-Nisa (4) : 176',
                quranTranslation: 'Jika seorang meninggal dunia dan tidak mempunyai anak tetapi mempunyai saudara perempuan, maka baginya seperdua dari harta yang ditinggalkannya...',
                khiArticle: 'KHI Pasal 182',
                reasoning: 'Satu saudara perempuan kandung mendapat 1/2 bagian (Kalalah).'
              }
            });
          } else {
            rawShares.push({
              key: 'saudaraKandungPerempuan',
              title: `Saudara Perempuan Kandung (${numSaudaraKandungPerempuan} orang)`,
              titleEn: 'Full Sisters (Multiple)',
              category: 'Saudara',
              count: numSaudaraKandungPerempuan,
              fractionNum: 2,
              fractionDenom: 3,
              isAshabah: false,
              isMahjub: false,
              legalBasis: {
                quranVerse: 'QS. An-Nisa (4) : 176',
                quranTranslation: 'Tetapi jika saudara perempuan itu dua orang, maka bagi keduanya dua pertiga dari harta yang ditinggalkan...',
                khiArticle: 'KHI Pasal 182',
                reasoning: 'Dua atau lebih saudara perempuan kandung mendapat 2/3 bagian.'
              }
            });
          }
        }
      }
    }
  }

  // --- KHI AHLI WARIS PENGGANTI (Pasal 185 KHI) ---
  if (input.cucuPengganti > 0 && hasSon) {
    rawShares.push({
      key: 'cucuPengganti',
      title: `Cucu Ahli Waris Pengganti (${input.cucuPengganti} orang)`,
      titleEn: 'Substitute Heir Grandchildren',
      category: 'Ahli Waris Pengganti (KHI)',
      count: input.cucuPengganti,
      fractionNum: 0,
      fractionDenom: 1,
      isAshabah: true,
      ashabahRatio: input.cucuPengganti * 1,
      isMahjub: false,
      isKhiSubstitute: true,
      legalBasis: {
        khiArticle: 'KHI Pasal 185',
        khiText: 'Ahli waris yang meninggal lebih dahulu daripada si pewaris, maka kedudukannya dapat digantikan oleh anaknya...',
        reasoning: 'Berdasarkan Kompilasi Hukum Islam (KHI) Pasal 185, cucu dari anak yang wafat lebih dulu menggantikan kedudukan orang tuanya.'
      }
    });
  }

  // --- MATHEMATICAL RESOLUTION (Asal Masalah, KPK, Aul, Radd) ---
  const activeShares = rawShares.filter(s => !s.isMahjub);
  const blockedShares = rawShares.filter(s => s.isMahjub);

  const furudhShares = activeShares.filter(s => !s.isAshabah);
  const ashabahShares = activeShares.filter(s => s.isAshabah);

  const denominators = furudhShares.map(s => s.fractionDenom);
  const initialAsalMasalah = getArrayLCM(denominators);

  // Calculate sum of shares in terms of initialAsalMasalah
  let furudhSumNumerator = 0;
  furudhShares.forEach(s => {
    const shareNum = (initialAsalMasalah / s.fractionDenom) * s.fractionNum;
    furudhSumNumerator += shareNum;
  });

  let isAul = false;
  let isRadd = false;
  let finalAsalMasalah = initialAsalMasalah;
  let sisaNumerator = initialAsalMasalah - furudhSumNumerator;

  // AUL Case: Sum of fractions > Asal Masalah
  if (furudhSumNumerator > initialAsalMasalah) {
    isAul = true;
    finalAsalMasalah = furudhSumNumerator; // Scale denominator up to sum of numerators
    sisaNumerator = 0;
  } 
  // RADD Case: Sum of fractions < Asal Masalah AND No Ashabah
  else if (furudhSumNumerator < initialAsalMasalah && ashabahShares.length === 0 && furudhShares.length > 0) {
    // Exclude spouse from Radd in traditional view or include if only heir
    const nonSpouseFurudh = furudhShares.filter(s => s.key !== 'suami' && s.key !== 'istri');
    if (nonSpouseFurudh.length > 0) {
      isRadd = true;
      // Redistribute sisaNumerator proportionally to non-spouse furudh
    }
  }

  // Distribute Rupiah amounts and construct final InheritanceShare objects
  const finalShares: InheritanceShare[] = [];

  // Total ratio weight for Ashabah
  const totalAshabahWeight = ashabahShares.reduce((acc, s) => acc + (s.ashabahRatio || 1), 0);

  // Calculate Rupiah for Furudh
  furudhShares.forEach(s => {
    let shareRatio = ((initialAsalMasalah / s.fractionDenom) * s.fractionNum) / finalAsalMasalah;
    
    // Handle Radd adjustment if active
    if (isRadd && s.key !== 'suami' && s.key !== 'istri') {
      const spouseShares = furudhShares.filter(sp => sp.key === 'suami' || sp.key === 'istri');
      let spouseRatio = 0;
      spouseShares.forEach(sp => {
        spouseRatio += (initialAsalMasalah / sp.fractionDenom * sp.fractionNum) / initialAsalMasalah;
      });
      
      const remainingRatioForRadd = 1 - spouseRatio;
      const nonSpouseSumNum = nonSpouseFurudhSum(furudhShares, initialAsalMasalah);
      const myNum = (initialAsalMasalah / s.fractionDenom) * s.fractionNum;
      
      shareRatio = (s.key === 'suami' || s.key === 'istri')
        ? (myNum / initialAsalMasalah)
        : (remainingRatioForRadd * (myNum / nonSpouseSumNum));
    }

    const amountRp = tarikahNet * shareRatio;
    const individualAmountRp = amountRp / s.count;
    const shareNumInKPK = Math.round((initialAsalMasalah / s.fractionDenom) * s.fractionNum);

    finalShares.push({
      id: s.key,
      title: s.title,
      titleEn: s.titleEn,
      category: s.category,
      count: s.count,
      fractionText: `${s.fractionNum}/${s.fractionDenom}`,
      fractionValue: shareRatio,
      shareNumerator: shareNumInKPK,
      percentage: shareRatio * 100,
      amountRp: amountRp,
      individualAmountRp: individualAmountRp,
      status: s.isKhiSubstitute ? 'Ahli Waris Pengganti' : 'Ashabul Furudh',
      legalBasis: s.legalBasis
    });
  });

  // Calculate Rupiah for Ashabah
  const furudhTotalRatio = isAul ? 1 : (furudhSumNumerator / initialAsalMasalah);
  const remainingRatioForAshabah = Math.max(0, 1 - furudhTotalRatio);
  const remainingAshabahRp = tarikahNet * remainingRatioForAshabah;

  ashabahShares.forEach(s => {
    const weight = s.ashabahRatio || 1;
    const shareRatio = totalAshabahWeight > 0 ? (remainingRatioForAshabah * (weight / totalAshabahWeight)) : 0;
    const amountRp = remainingAshabahRp * (weight / totalAshabahWeight);
    const individualAmountRp = amountRp / s.count;

    finalShares.push({
      id: s.key,
      title: s.title,
      titleEn: s.titleEn,
      category: s.category,
      count: s.count,
      fractionText: 'Sisa (Ashabah)',
      fractionValue: shareRatio,
      shareNumerator: 0,
      percentage: shareRatio * 100,
      amountRp: amountRp,
      individualAmountRp: individualAmountRp,
      status: s.isKhiSubstitute ? 'Ahli Waris Pengganti' : 'Ashabah',
      legalBasis: s.legalBasis
    });
  });

  // Construct Blocked Shares list
  const finalBlockedShares: InheritanceShare[] = blockedShares.map(s => ({
    id: s.key,
    title: s.title,
    titleEn: s.titleEn,
    category: s.category,
    count: s.count,
    fractionText: '0 (Terhalang)',
    fractionValue: 0,
    shareNumerator: 0,
    percentage: 0,
    amountRp: 0,
    individualAmountRp: 0,
    status: 'Mahjub',
    mahjubBy: s.mahjubBy,
    legalBasis: s.legalBasis
  }));

  // Build Transparent Trace Steps (Langkah demi langkah)
  const steps: CalculationStep[] = [
    {
      stepNumber: 1,
      title: 'Perhitungan Harta Kotor & Pengurang (Hutang, Biaya, Wasiat)',
      description: `Total Harta Kotor = ${formatRupiah(totalHartaGross)}. Dikurangi Biaya Pemakaman (${formatRupiah(biayaJenazah)}), Utang (${formatRupiah(utang)}), dan Wasiat Sah (${formatRupiah(wasiatValidRp)}).`,
      details: {
        totalHartaGross,
        biayaJenazah,
        utang,
        wasiatRequested: requestedWasiat,
        wasiatValidRp,
        maxWasiatAllowed,
        wasiatExcessWarning
      }
    },
    {
      stepNumber: 2,
      title: 'Penetapan Harta Bersih Siap Bagi (Tarikah)',
      description: `Tarikah = ${formatRupiah(totalHartaGross)} - ${formatRupiah(totalPengurang)} = ${formatRupiah(tarikahNet)}.`,
      details: { tarikahNet }
    },
    {
      stepNumber: 3,
      title: 'Verifikasi & Identifikasi Ahli Waris Aktif',
      description: `Ditemukan ${finalShares.length} kelompok ahli waris yang berhak menerima warisan.`,
      data: finalShares.map(s => ({ title: s.title, status: s.status, count: s.count }))
    },
    {
      stepNumber: 4,
      title: 'Identifikasi Ahli Waris Terhalang (Mahjub)',
      description: finalBlockedShares.length > 0 
        ? `${finalBlockedShares.length} ahli waris terhalang (Mahjub Hirman).`
        : 'Tidak ada ahli waris yang terhalang.',
      data: finalBlockedShares.map(s => ({ title: s.title, mahjubBy: s.mahjubBy }))
    },
    {
      stepNumber: 5,
      title: 'Penentuan Asal Masalah (Kelipatan Persekutuan Terkecil / KPK)',
      description: `Asal Masalah awal ditetapkan sebesar ${initialAsalMasalah} berdasarkan penyebut pecahan Ashabul Furudh.`,
      details: { initialAsalMasalah }
    },
    {
      stepNumber: 6,
      title: 'Pemeriksaan Kasus Aul / Radd',
      description: isAul 
        ? `Terjadi kasus AUL: Jumlah pembagi (${furudhSumNumerator}) melebihi Asal Masalah (${initialAsalMasalah}). Asal Masalah dinaikkan menjadi ${finalAsalMasalah}.`
        : isRadd 
          ? `Terjadi kasus RADD: Terdapat sisa harta dan tidak ada Ashabah. Sisa harta didistribusikan kembali secara proporsional.`
          : `Pembagian normal (Sisa harta dialokasikan untuk Ashabah atau terbagi habis).`,
      details: { isAul, isRadd, finalAsalMasalah }
    },
    {
      stepNumber: 7,
      title: 'Perhitungan Nominal (Rupiah) & Persentase Akhir',
      description: 'Setiap bagian dikalikan dengan Harta Bersih (Tarikah).',
      data: finalShares.map(s => ({
        title: s.title,
        fraction: s.fractionText,
        percentage: `${s.percentage.toFixed(2)}%`,
        amount: formatRupiah(s.amountRp)
      }))
    }
  ];

  const totalAllocatedRp = finalShares.reduce((acc, s) => acc + s.amountRp, 0);
  const remainingRp = Math.max(0, tarikahNet - totalAllocatedRp);

  return {
    id: `calc_${Date.now()}`,
    timestamp: new Date().toISOString(),
    pewaris,
    harta,
    pengurang,
    ahliWarisInput: input,
    totalHartaGross,
    totalPengurang,
    tarikahNet,
    wasiatValidRp,
    wasiatExcessWarning,
    asalMasalahInitial: initialAsalMasalah,
    asalMasalahFinal: finalAsalMasalah,
    isAul,
    isRadd,
    shares: finalShares,
    blockedHeirs: finalBlockedShares,
    steps,
    totalAllocatedRp,
    remainingRp
  };
}

function nonSpouseFurudhSum(shares: any[], asalMasalah: number): number {
  let sum = 0;
  shares.forEach(s => {
    if (s.key !== 'suami' && s.key !== 'istri') {
      sum += (asalMasalah / s.fractionDenom) * s.fractionNum;
    }
  });
  return sum || 1;
}
