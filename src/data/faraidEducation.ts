export interface EducationTopic {
  id: string;
  title: string;
  category: string;
  iconName: string;
  summary: string;
  contentMarkdown: string;
  arabicVerse?: string;
  translation?: string;
}

export const EDUCATION_TOPICS: EducationTopic[] = [
  {
    id: 'pengertian-faraid',
    title: 'Pengertian & Keutamaan Ilmu Faraid',
    category: 'Dasar Hukum',
    iconName: 'BookOpen',
    summary: 'Mengenal ilmu pembagian harta waris menurut syariat Islam dan perintah mempelajarinya.',
    contentMarkdown: `
### Apa itu Ilmu Faraid?
**Ilmu Faraid** (فقه المواريث) adalah cabang ilmu fiqih yang membahas tentang tata cara pembagian harta peninggalan (*Tarikah*) bagi orang yang telah meninggal dunia kepada ahli waris yang berhak menerimanya secara adil, tepat, dan sesuai petunjuk Al-Qur'an dan As-Sunnah.

### Keutamaan Mempelajari Faraid
Rasulullah SAW sangat menekankan pentingnya mempelajari ilmu Faraid karena ilmu ini adalah ilmu yang pertama kali akan diangkat dari umat manusia.

* **Perintah Rasulullah SAW:** *"Pelajarilah ilmu Faraid dan ajarkanlah kepada manusia, karena sesungguhnya Faraid adalah separuh dari ilmu, dan ia adalah ilmu yang mudah dilupakan serta ilmu yang pertama kali dicabut dari umatku."* (HR. Ibn Majah & Ad-Daraqutni).
* **Menghindari Perselisihan:** Pembagian yang jelas dan pasti dari Allah SWT mencegah terjadinya pertengkaran keluarga setelah pewaris wafat.
    `,
    arabicVerse: 'يُوصِيكُمُ اللَّهُ فِي أَوْلاَدِكُمْ لِلذَّكَرِ مِثْلُ حَظِّ الأُنْثَيَيْنِ',
    translation: 'Allah mensyariatkan (mewajibkan) kepadamu tentang (pembagian warisan untuk) anak-anakmu...'
  },
  {
    id: 'rukun-syarat-waris',
    title: 'Rukun & Syarat Saling Mewarisi',
    category: 'Rukun & Syarat',
    iconName: 'CheckCircle2',
    summary: 'Tiga rukun utama dan syarat sah terjadinya pembagian warisan dalam Islam.',
    contentMarkdown: `
### Rukun Waris
Agar pembagian waris dapat dilaksanakan, harus terpenuhi 3 rukun:
1. **Al-Muwarrith (الموَرِّث):** Orang yang meninggal dunia dan meninggalkan harta.
2. **Al-Warith (الوَارِث):** Ahli waris yang masih hidup saat pewaris meninggal.
3. **Al-Mauruth / At-Tarikah (المَوْرُوث / التَّرِكَة):** Harta peninggalan bersih milik pewaris.

### Syarat Sah Mewarisi
* **Meninggalnya Pewaris:** Baik secara hakiki (nyata) maupun *hukmi* (putusan hakim).
* **Hidupnya Ahli Waris:** Ahli waris dipastikan masih hidup saat pewaris wafat.
* **Tidak Ada Penghalang Waris:** Tidak ada sebab yang membatalkan hak waris (seperti pembunuhan atau perbedaan agama).
    `
  },
  {
    id: 'penghalang-waris',
    title: 'Sebab & Penghalang Mewarisi',
    category: 'Sebab & Penghalang',
    iconName: 'ShieldAlert',
    summary: 'Faktor yang menetapkan dan menggugurkan hak seseorang menerima warisan.',
    contentMarkdown: `
### Sebab-Sebab Hak Mewarisi
 Seseorang berhak menerima warisan karena salah satu dari 3 hal:
1. **Pernikahan yang Sah (An-Nikah):** Hubungan suami-istri yang sah secara syar'i.
2. **Hubungan Nasab/Kekerabatan (An-Nasab):** Hubungan darah (orang tua, anak, saudara, paman).
3. **Wala' (الوَلاَء):** Hubungan pembebasan budak (sudah tidak berlaku di masa modern).

### Penghalang Mewarisi (Mawani' Al-Irth)
Seseorang yang sejatinya ahli waris bisa **gugur haknya** jika terjadi:
1. **Pembunuhan (Al-Qatl):** Ahli waris membunuh pewaris. *"Membunuh tidak berhak menerima warisan sedikitpun."* (HR. Abu Dawud).
2. **Perbedaan Agama (Ikhtilaf Ad-Din):** Seorang Muslim tidak mewarisi dari non-Muslim dan sebaliknya.
3. **Perbudakan (Al-Ubudiyyah):** Seseorang yang berstatus budak (secara historis).
    `
  },
  {
    id: 'ashabul-furudh',
    title: 'Daftar Ashabul Furudh (Pemilik Bagian Pasti)',
    category: 'Ashabul Furudh',
    iconName: 'PieChart',
    summary: 'Penjelasan 6 kadar bagian pasti dalam Al-Qur\'an: 1/2, 1/4, 1/8, 2/3, 1/3, dan 1/6.',
    contentMarkdown: `
### Kadar Bagian Pasti (An-Nushub Al-Muqaddarah)
Al-Qur'an menentukan 6 pecahan pasti untuk Ashabul Furudh:

| Pecahan | Ahli Waris Utama yang Berhak |
|---|---|
| **1/2 (Seperdua)** | Suami (tanpa anak), 1 Anak Perempuan (tanpa anak laki-laki), 1 Cucu Perempuan, 1 Saudari Kandung. |
| **1/4 (Seperempat)** | Suami (jika ada anak), Istri (tanpa anak). |
| **1/8 (Seperdelapan)** | Istri / Para Istri (jika ada anak/cucu pewaris). |
| **2/3 (Dua Pertiga)** | 2+ Anak Perempuan, 2+ Cucu Perempuan, 2+ Saudari Kandung (tanpa anak/saudara laki-laki). |
| **1/3 (Sepertiga)** | Ibu (tanpa anak & saudara <2), 2+ Saudara Seibu. |
| **1/6 (Seperenam)** | Ayah (ada anak), Ibu (ada anak/2+ saudara), Kakek, Nenek, 1 Saudara Seibu. |
    `
  },
  {
    id: 'ashabah',
    title: 'Konsep Ashabah (Penerima Sisa Harta)',
    category: 'Ashabah',
    iconName: 'TrendingUp',
    summary: 'Penerima seluruh atau sisa harta peninggalan setelah Ashabul Furudh mengambil bagiannya.',
    contentMarkdown: `
### Jenis-Jenis Ashabah
1. **Ashabah bi Nafsihi (العصبة بالنفس):** Laki-laki yang menerima sisa harta karena hubungan nasab langsung sendiri (Anak laki-laki, Cucu laki-laki, Ayah, Kakek, Saudara laki-laki kandung/seayah, Paman).
2. **Ashabah bi Ghairihi (العصبة بالغير):** Wanita yang menjadi ashabah karena ditarik oleh saudara laki-lakinya (Anak perempuan ditarik Anak laki-laki dengan pembagian 2:1).
3. **Ashabah ma'a Ghairihi (العصبة مع الغير):** Saudara perempuan kandung/seayah yang menjadi ashabah karena bersama anak/cucu perempuan.
    `
  },
  {
    id: 'aul-dan-radd',
    title: 'Penyesuaian Aul & Radd',
    category: 'Studi Khusus',
    iconName: 'Scale',
    summary: 'Solusi matematika syariah ketika jumlah total pembagian melebihi atau kurang dari harta.',
    contentMarkdown: `
### 1. Kasus Aul (العَوْل)
Terjadi ketika total pembagian pembilang Ashabul Furudh **melebihi** Asal Masalah (penyebut). 
* **Solusi:** Asal Masalah (penyebut) dinaikkan menyesuaikan total pembilang agar semua ahli waris mendapatkan bagian secara proporsional tanpa ada yang dirugikan.

### 2. Kasus Radd (الرَّدّ)
Terjadi ketika total pembagian pembilang **lebih kecil** dari Asal Masalah dan **tidak ada Ashabah** yang menerima sisa.
* **Solusi:** Sisa harta dikembalikan dan didistribusikan secara proporsional kepada para Ashabul Furudh (selain suami/istri menurut pendapat mayoritas).
    `
  },
  {
    id: 'khi-ahli-waris-pengganti',
    title: 'Ahli Waris Pengganti menurut KHI (Pasal 185)',
    category: 'Hukum Indonesia (KHI)',
    iconName: 'FileText',
    summary: 'Aturan khusus dalam Kompilasi Hukum Islam untuk cucu yang orang tuanya meninggal lebih dulu.',
    contentMarkdown: `
### Kompilasi Hukum Islam (KHI) Pasal 185
Dalam hukum waris Indonesia (KHI), terdapat terobosan hukum mengenai **Ahli Waris Pengganti**:

* **Pasal 185 ayat (1):** Ahli waris yang meninggal lebih dahulu daripada si pewaris, maka kedudukannya dapat digantikan oleh anaknya.
* **Pasal 185 ayat (2):** Bagian ahli waris pengganti tidak boleh melebihi dari bagian ahli waris yang sederajat dengan yang digantikan.

Fitur ini membantu menjamin keadilan sosial bagi cucu yatim dalam hukum waris nasional di Indonesia.
    `
  }
];

export const FAQ_ITEMS = [
  {
    q: 'Apakah biaya pemakaman dan utang harus dilunasi dulu sebelum harta dibagikan?',
    a: 'Ya, benar. Dalam Islam, urutan kewajiban terhadap harta peninggalan adalah: 1) Biaya perawatan jenazah secara wajar, 2) Pelunasan utang piutang pewaris, 3) Pelaksanaan wasiat sah (maksimal 1/3 harta bersih), baru kemudian sisanya dibagikan sebagai warisan.'
  },
  {
    q: 'Berapa batasan maksimal nilai wasiat dalam hukum Islam?',
    a: 'Maksimal nilai wasiat adalah 1/3 (sepertiga) dari sisa harta bersih setelah dikurangi biaya pemakaman dan pelunasan utang. Wasiat juga tidak boleh ditujukan kepada ahli waris yang sudah mendapatkan bagian warisan, kecuali disetujui seluruh ahli waris lainnya.'
  },
  {
    q: 'Mengapa bagian anak laki-laki dapat 2 kali lipat dari anak perempuan?',
    a: 'Dalam Islam, anak laki-laki menanggung kewajiban finansial yang lebih besar, seperti kewajiban memberikan nafkah kepada istri, anak-anak, dan keluarga perempuan yang membutuhkan. Sedangkan anak perempuan berhak menyimpan seluruh hartanya tanpa wajib menafkahi suami atau keluarga.'
  },
  {
    q: 'Apakah anak angkat mendapat bagian harta waris?',
    a: 'Anak angkat secara hukum Faraid klasik bukan merupakan ahli waris nasab. Namun menurut KHI (Pasal 209), anak angkat berhak menerima Wasiat Wajibah maksimal 1/3 dari harta peninggalan.'
  }
];
