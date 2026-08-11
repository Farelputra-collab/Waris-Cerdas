import { jsPDF } from 'jspdf';
import { CalculationResult } from '../types/faraid';
import { formatRupiah } from './faraidEngine';

export function generateInheritancePDF(calc: CalculationResult): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Header Banner
  doc.setFillColor(15, 118, 110); // Emerald Green #0F766E
  doc.rect(0, 0, pageWidth, 30, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('WARIS CERDAS', 15, 15);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Laporan Pembagian Harta Warisan Islam (Faraid & KHI)', 15, 22);

  const dateStr = new Date(calc.timestamp).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  doc.text(`Tanggal: ${dateStr}`, pageWidth - 60, 22);

  yPos = 40;

  // Pewaris Info Box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, yPos, pageWidth - 30, 28, 3, 3, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMASI PEWARIS', 20, yPos + 7);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nama Pewaris: ${calc.pewaris.nama || 'Almarhum/Almarhumah'}`, 20, yPos + 14);
  doc.text(`Jenis Kelamin: ${calc.pewaris.gender === 'male' ? 'Laki-Laki' : 'Perempuan'}`, 20, yPos + 20);
  doc.text(`Status Pernikahan: ${calc.pewaris.statusPernikahan === 'married' ? 'Menikah' : calc.pewaris.statusPernikahan === 'widowed' ? 'Duda/Janda' : 'Belum Menikah'}`, 110, yPos + 14);
  doc.text(`Tanggal Wafat: ${calc.pewaris.tanggalWafat || '-'}`, 110, yPos + 20);

  yPos += 35;

  // Financial Summary Box
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(15, yPos, pageWidth - 30, 32, 3, 3, 'FD');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('RINGKASAN HARTA & DEDUKSI', 20, yPos + 7);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Harta Kotor: ${formatRupiah(calc.totalHartaGross)}`, 20, yPos + 14);
  doc.text(`Total Pengurang (Utang/Biaya/Wasiat): ${formatRupiah(calc.totalPengurang)}`, 20, yPos + 20);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 118, 110);
  doc.text(`HARTA BERSIH (TARIKAH): ${formatRupiah(calc.tarikahNet)}`, 20, yPos + 26);

  if (calc.isAul) {
    doc.setTextColor(180, 83, 9);
    doc.text(`[Catatan: Terjadi Kasus AUL - Asal Masalah ${calc.asalMasalahFinal}]`, 110, yPos + 26);
  } else if (calc.isRadd) {
    doc.setTextColor(3, 105, 161);
    doc.text(`[Catatan: Terjadi Kasus RADD]`, 110, yPos + 26);
  }

  yPos += 40;

  // Shares Table Header
  doc.setFillColor(15, 118, 110);
  doc.rect(15, yPos, pageWidth - 30, 8, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Ahli Waris', 20, yPos + 5.5);
  doc.text('Bagian', 75, yPos + 5.5);
  doc.text('Persentase', 105, yPos + 5.5);
  doc.text('Nominal (Rp)', 135, yPos + 5.5);
  doc.text('Status', 175, yPos + 5.5);

  yPos += 8;

  // Shares Table Body
  calc.shares.forEach((share, index) => {
    if (yPos > 260) {
      doc.addPage();
      yPos = 20;
    }

    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(15, yPos, pageWidth - 30, 8, 'F');
    }

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    
    doc.text(share.title.substring(0, 28), 20, yPos + 5.5);
    doc.text(share.fractionText, 75, yPos + 5.5);
    doc.text(`${share.percentage.toFixed(2)}%`, 105, yPos + 5.5);
    
    doc.setFont('helvetica', 'bold');
    doc.text(formatRupiah(share.amountRp), 135, yPos + 5.5);
    
    doc.setFont('helvetica', 'normal');
    doc.text(share.status, 175, yPos + 5.5);

    yPos += 8;
  });

  // Blocked Heirs section if any
  if (calc.blockedHeirs.length > 0) {
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    yPos += 5;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text('AHLI WARIS TERHALANG (MAHJUB)', 15, yPos);
    yPos += 5;

    calc.blockedHeirs.forEach(blocked => {
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.text(`• ${blocked.title}: Terhalang oleh ${blocked.mahjubBy || 'Ahli Waris Lain'}`, 20, yPos);
      yPos += 5;
    });
  }

  // Legal Disclaimer Footer
  if (yPos > 260) {
    doc.addPage();
    yPos = 20;
  }

  yPos += 10;
  doc.setDrawColor(226, 232, 240);
  doc.line(15, yPos, pageWidth - 15, yPos);
  yPos += 5;

  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Catatan Hukum & Peringatan:', 15, yPos);
  yPos += 4;
  const disclaimer = 'Perhitungan ini merupakan simulasi berdasarkan data yang dimasukkan pengguna dan hukum Faraid / KHI. Untuk penetapan hukum yang mengikat atau penyelesaian sengketa, silakan konsultasikan dengan Pengadilan Agama atau ahli hukum waris terpercaya.';
  const lines = doc.splitTextToSize(disclaimer, pageWidth - 30);
  doc.text(lines, 15, yPos);

  // Download PDF file
  const fileName = `WarisCerdas_${calc.pewaris.nama ? calc.pewaris.nama.replace(/\s+/g, '_') : 'Simulasi'}_${Date.now()}.pdf`;
  doc.save(fileName);
}

export function exportInheritanceCSV(calc: CalculationResult): void {
  let csv = 'Ahli Waris,Jumlah,Bagian,Persentase,Nominal Total (Rp),Nominal per Orang (Rp),Status,Dasar Hukum\n';

  calc.shares.forEach(s => {
    csv += `"${s.title}",${s.count},"${s.fractionText}","${s.percentage.toFixed(2)}%",${s.amountRp},${s.individualAmountRp},"${s.status}","${s.legalBasis?.quranVerse || s.legalBasis?.khiArticle || ''}"\n`;
  });

  if (calc.blockedHeirs.length > 0) {
    csv += '\nAhli Waris Terhalang,Jumlah,Status,Mahjub Oleh,Dasar Hukum\n';
    calc.blockedHeirs.forEach(b => {
      csv += `"${b.title}",${b.count},"Mahjub","${b.mahjubBy || '-'}","${b.legalBasis?.reasoning || ''}"\n`;
    });
  }

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `WarisCerdas_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
