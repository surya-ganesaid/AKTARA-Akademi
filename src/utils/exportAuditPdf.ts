import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AuditLog } from '../types';

export const generateAuditPdf = (
  logs: AuditLog[],
  generatedBy: string = 'Super Admin Master'
) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const now = new Date();
  const formattedDate = now.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const formattedTime = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Header Colors
  const navyColor = [15, 44, 58]; // #0F2C3A
  const goldColor = [245, 199, 72]; // #F5C748

  // Top Accent Bar
  doc.setFillColor(navyColor[0], navyColor[1], navyColor[2]);
  doc.rect(0, 0, 297, 18, 'F');

  // Title in Header Bar
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('AKTARA ACADEMY • SISTEM INFORMASI PELATIHAN & AUDIT KEAMANAN', 14, 11);

  doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
  doc.setFontSize(9);
  doc.text('CONFIDENTIAL / LAPORAN RESMI KEPATUHAN', 283, 11, { align: 'right' });

  // Document Title Header
  doc.setTextColor(15, 44, 58);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('LAPORAN AUDIT KEAMANAN & JEJAK REKAM SISTEM', 14, 28);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Nomor Referensi: AUDIT-SEC/AKTARA/${now.getFullYear()}/${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${Math.floor(1000 + Math.random() * 9000)}`,
    14,
    34
  );

  // Metadata Box (Right aligned)
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(`Tanggal Cetak : ${formattedDate}, ${formattedTime} WIB`, 283, 28, { align: 'right' });
  doc.text(`Pencetak (Auditor) : ${generatedBy}`, 283, 34, { align: 'right' });
  doc.text(`Total Log Transaksi : ${logs.length} Aktivitas`, 283, 40, { align: 'right' });

  // Divider Line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(14, 44, 283, 44);

  // Table Columns
  const tableColumn = [
    'No',
    'Timestamp (Waktu)',
    'Aktor (Pengguna)',
    'Role',
    'Aktivitas / Transaksi',
    'Target Objek',
    'IP Address',
    'Status'
  ];

  // Table Rows
  const tableRows = logs.map((log, index) => [
    (index + 1).toString(),
    log.timestamp,
    log.actor,
    log.role,
    log.action,
    log.target,
    log.ipAddress,
    log.status
  ]);

  autoTable(doc, {
    startY: 48,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 44, 58],
      textColor: [245, 199, 72],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'left'
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59],
      cellPadding: 2.5
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 38 },
      2: { cellWidth: 35, fontStyle: 'bold' },
      3: { cellWidth: 20 },
      4: { cellWidth: 55, fontStyle: 'bold' },
      5: { cellWidth: 50 },
      6: { cellWidth: 32 },
      7: { cellWidth: 28, halign: 'center', fontStyle: 'bold' }
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 7) {
        if (data.cell.raw === 'Success') {
          data.cell.styles.textColor = [16, 185, 129]; // Emerald
        } else {
          data.cell.styles.textColor = [217, 119, 6]; // Amber
        }
      }
    },
    margin: { left: 14, right: 14, bottom: 25 }
  });

  // Footer / Compliance Seal on every page
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();

    // Footer line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(14, pageHeight - 15, 283, pageHeight - 15);

    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'Dokumen ini sah & dijamin keotentikannya oleh Sistem Keamanan AKTARA Academy untuk audit kepatuhan ISO/IEC 27001.',
      14,
      pageHeight - 9
    );
    doc.text(`Halaman ${i} dari ${pageCount}`, 283, pageHeight - 9, { align: 'right' });
  }

  doc.save(`Laporan_Audit_Keamanan_AKTARA_${new Date().toISOString().slice(0, 10)}.pdf`);
};
