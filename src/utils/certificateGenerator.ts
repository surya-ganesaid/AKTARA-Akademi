import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

interface CertificateData {
  participantName: string;
  participantInstitution?: string;
  batchTitle: string;
  certificateNumber: string;
  issueDate?: string;
}

export const generateCertificatePDF = async (data: CertificateData) => {
  // 1. Buat Canvas QR Code Verifikasi
  const verifyUrl = `https://aktara.id/verify/${encodeURIComponent(data.certificateNumber)}`;
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 120, margin: 1 });

  // 2. Inisialisasi PDF Lanskap A4
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // --- DESAIN BACKGROUND & BORDER ---
  doc.setFillColor(15, 44, 58); // Warna Utama AKTARA #0F2C3A
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Inner White Card
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(10, 10, pageWidth - 20, pageHeight - 20, 5, 5, 'F');

  // Gold Inner Frame Accent
  doc.setDrawColor(245, 199, 72); // Warna Gold #F5C748
  doc.setLineWidth(1.5);
  doc.roundedRect(14, 14, pageWidth - 28, pageHeight - 28, 3, 3, 'S');

  // --- HEADER BRANDING ---
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 44, 58);
  doc.setFontSize(26);
  doc.text('AKTARA ACADEMY', pageWidth / 2, 38, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139);
  doc.text('SERTIFIKAT KELULUSAN TRAINING OF TRAINERS (TOT)', pageWidth / 2, 46, { align: 'center' });

  // Nomor Sertifikat
  doc.setFontSize(9);
  doc.setFont('courier', 'bold');
  doc.setTextColor(15, 44, 58);
  doc.text(`NO: ${data.certificateNumber}`, pageWidth / 2, 54, { align: 'center' });

  // --- ISI SERTIFIKAT ---
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(12);
  doc.setTextColor(71, 85, 105);
  doc.text('Diberikan dengan bangga kepada:', pageWidth / 2, 70, { align: 'center' });

  // Nama Peserta
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(15, 44, 58);
  doc.text(data.participantName, pageWidth / 2, 86, { align: 'center' });

  // Garis Bawah Emas Nama
  const nameWidth = doc.getTextWidth(data.participantName);
  doc.setDrawColor(245, 199, 72);
  doc.setLineWidth(1);
  doc.line((pageWidth - nameWidth) / 2 - 5, 90, (pageWidth + nameWidth) / 2 + 5, 90);

  // Instansi Peserta
  if (data.participantInstitution && data.participantInstitution !== '-') {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.text(`(${data.participantInstitution})`, pageWidth / 2, 98, { align: 'center' });
  }

  // Keterangan Kelulusan & Batch
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(51, 65, 85);
  doc.text(
    `Telah menyelesaikan dan dinyatakan LULUS dalam program pelatihan intensif`,
    pageWidth / 2,
    112,
    { align: 'center' }
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 44, 58);
  doc.text(data.batchTitle, pageWidth / 2, 120, { align: 'center' });

  // --- FOOTER & TANDA TANGAN ---
  // DIBERSIHKAN: month: 'long' (lowercase)
  const issueDateFormatted = data.issueDate || new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Sisi Kiri: QR Code Verifikasi
  doc.addImage(qrDataUrl, 'PNG', 25, 138, 30, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('SCAN UNTUK VERIFIKASI', 40, 172, { align: 'center' });

  // Sisi Kanan: Tanda Tangan & Tanggal Terbit
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  doc.text(`Bandung, ${issueDateFormatted}`, pageWidth - 60, 142, { align: 'center' });
  doc.text('Direktur AKTARA Academy', pageWidth - 60, 148, { align: 'center' });

  // Garis Tanda Tangan
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 44, 58);
  doc.text('Master Trainer Team', pageWidth - 60, 168, { align: 'center' });
  doc.setDrawColor(15, 44, 58);
  doc.setLineWidth(0.5);
  doc.line(pageWidth - 90, 170, pageWidth - 30, 170);

  // Download PDF Langsung
  const fileName = `Sertifikat_${data.participantName.replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
};