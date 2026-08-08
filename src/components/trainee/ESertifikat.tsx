import React, { useState } from 'react';
import { Award, Download, Share2, QrCode, ShieldCheck, CheckCircle2, X, ExternalLink } from 'lucide-react';

interface ESertifikatProps {
  userProfile: {
    name: string;
    nip: string;
    instansi: string;
  };
}

export const ESertifikat: React.FC<ESertifikatProps> = ({ userProfile }) => {
  const [showQrModal, setShowQrModal] = useState(false);
  const [showLinkedInModal, setShowLinkedInModal] = useState(false);

  const certNumber = 'CERT-AKTARA-2026-88912';
  const verifyUrl = `https://aktara.academy/verify/${certNumber}`;

  const handleDownloadPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#0F2C3A] font-bold uppercase tracking-wider mb-1">
            <Award className="w-4 h-4 text-[#F5C748]" />
            <span>Penerbitan Sertifikat Resmi</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            E-Sertifikat Kelulusan Trainer of Trainers
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Dokumen sah terenkripsi digital dengan penanda tangan elektronik dan QR Code verifikasi nasional.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowLinkedInModal(true)}
            className="px-4 py-2.5 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-800 text-xs font-bold rounded-xl transition flex items-center space-x-2"
          >
            <Share2 className="w-4 h-4 text-blue-600" />
            <span>Bagikan ke LinkedIn</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            className="px-4 py-2.5 bg-[#0F2C3A] hover:bg-[#163f52] text-[#F5C748] text-xs font-bold rounded-xl transition shadow flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Cetak PDF (High-Res)</span>
          </button>
        </div>
      </div>

      {/* Visual Certificate Canvas Frame */}
      <div className="bg-[#0b1c24] p-4 sm:p-8 rounded-3xl shadow-2xl border border-slate-800 flex justify-center print:p-0 print:bg-white">
        
        {/* The Certificate Paper Container */}
        <div className="w-full max-w-4xl aspect-[1.414/1] bg-[#FAFAF8] rounded-2xl p-8 sm:p-12 shadow-2xl border-8 border-[#0F2C3A] relative flex flex-col justify-between overflow-hidden text-slate-900 print:shadow-none print:border-4">
          
          {/* Subtle Decorative Golden Borders */}
          <div className="absolute inset-3 border-2 border-[#F5C748]/60 pointer-events-none rounded-lg"></div>
          <div className="absolute inset-4 border border-[#0F2C3A]/20 pointer-events-none rounded-lg"></div>

          {/* Top Header Section */}
          <div className="text-center relative z-10 pt-2">
            <div className="inline-flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#0F2C3A] text-[#F5C748] flex items-center justify-center font-black text-sm">
                A
              </div>
              <span className="text-lg font-black tracking-widest text-[#0F2C3A] uppercase">
                AKTARA ACADEMY INDONESIA
              </span>
            </div>
            
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              Lembaga Pelatihan & Sertifikasi Pendidik Digital Nasional
            </p>

            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#0F2C3A] tracking-wider my-4">
              SERTIFIKAT KELULUSAN
            </h1>
            <p className="text-xs text-[#C68E28] font-bold font-mono uppercase tracking-widest">
              NOMOR: {certNumber}
            </p>
          </div>

          {/* Certificate Body Text */}
          <div className="text-center relative z-10 my-4 space-y-3">
            <p className="text-xs text-slate-600 font-serif italic">
              Sertifikat resmi ini diberikan secara sah kepada:
            </p>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2C3A] border-b-2 border-[#F5C748] inline-block pb-1 px-8">
              {userProfile.name}
            </h2>

            <p className="text-xs text-slate-600 font-medium">
              NIP / NIK: <span className="font-bold text-slate-800">{userProfile.nip}</span> • Instansi: <span className="font-bold text-slate-800">{userProfile.instansi}</span>
            </p>

            <p className="text-xs sm:text-sm text-slate-700 max-w-2xl mx-auto leading-relaxed pt-2">
              Telah dinyatakan <span className="font-bold text-emerald-800 uppercase">LULUS DENGAN PREDIKAT SANGAT MEMUASKAN</span> dalam Pelatihan Nasional & Uji Kompetensi Fasilitator:
            </p>

            <p className="text-base sm:text-lg font-bold text-[#0F2C3A] tracking-wide py-1">
              "Trainer of Trainers (TOT) Pedagogik Digital & Generative AI Pembelajaran"
            </p>

            <p className="text-[11px] text-slate-500 italic">
              Diselenggarakan oleh AKTARA Academy bekerjasama dengan Tim Evaluator Sertifikasi Digital Indonesia • Beban Belajar: 32 Jam Pelajaran (JP)
            </p>
          </div>

          {/* Bottom Footer Signatures & QR Code */}
          <div className="flex items-end justify-between relative z-10 pt-4 border-t border-slate-200">
            
            {/* Signature Left */}
            <div className="text-center">
              <p className="text-[10px] text-slate-500 font-medium">Jakarta, 25 Mei 2026</p>
              <div className="h-12 flex items-center justify-center my-1">
                <span className="font-serif italic font-bold text-lg text-[#0F2C3A]">HendraWijaya.</span>
              </div>
              <p className="text-xs font-bold text-slate-900">Dr. Hendra Wijaya, M.Ed</p>
              <p className="text-[10px] text-slate-500">Ketua Tim Evaluator AKTARA</p>
            </div>

            {/* Middle Seal / Badge */}
            <div className="hidden sm:flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#0F2C3A] to-[#1a4a61] border-4 border-[#F5C748] flex items-center justify-center text-[#F5C748] shadow-lg">
                <ShieldCheck className="w-8 h-8 stroke-[2]" />
              </div>
              <span className="text-[9px] font-bold text-[#0F2C3A] uppercase tracking-widest mt-1">VERIFIED CERT</span>
            </div>

            {/* QR Code Right */}
            <div className="text-center flex flex-col items-center">
              <button
                onClick={() => setShowQrModal(true)}
                className="p-1.5 bg-white border border-slate-300 rounded-xl shadow hover:scale-105 transition"
              >
                <div className="w-14 h-14 bg-slate-900 p-1 flex items-center justify-center text-white rounded-lg">
                  <QrCode className="w-12 h-12 text-[#F5C748]" />
                </div>
              </button>
              <p className="text-[9px] font-mono text-slate-600 font-bold mt-1">Pindai Verifikasi</p>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Verification Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative text-center">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center mb-3">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <h3 className="text-base font-extrabold text-slate-900">
              Sertifikat Resmi Terverifikasi!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Nomor Registrasi: <span className="font-mono font-bold text-[#0F2C3A]">{certNumber}</span>
            </p>

            <div className="my-5 p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block">
              <QrCode className="w-32 h-32 text-[#0F2C3A] mx-auto" />
            </div>

            <p className="text-xs text-slate-600">
              Pemegang: <span className="font-bold text-slate-900">{userProfile.name}</span>
            </p>
            <p className="text-[11px] text-slate-500">
              Instansi: {userProfile.instansi}
            </p>

            <a
              href={verifyUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center space-x-1.5 text-xs font-bold text-[#0F2C3A] hover:underline"
            >
              <span>{verifyUrl}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* LinkedIn Share Modal */}
      {showLinkedInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowLinkedInModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-extrabold text-slate-900 mb-2">
              Bagikan Pencapaian ke LinkedIn 🚀
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Salin draf teks perayaan sertifikasi di bawah ini untuk Anda unggah di feed profesional Anda:
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed font-sans mb-4">
              <p>
                "Bangga dapat menyelesaikan Sertifikasi Fasilitator Nasional Trainer of Trainers (TOT) Pedagogik Digital & Generative AI Pembelajaran di AKTARA Academy! 🎓✨
              </p>
              <p className="mt-2">
                Terima kasih kepada para instruktur dan mentor atas bimbingannya. Siap mengimplementasikan pembelajaran AI di {userProfile.instansi}!
              </p>
              <p className="mt-2 text-blue-600 font-semibold">
                #AktaraAcademy #PedagogikDigital #GuruPenggerak #EdukasiAI
              </p>
            </div>

            <button
              onClick={() => {
                alert('Teks draf LinkedIn berhasil disalin ke clipboard!');
                setShowLinkedInModal(false);
              }}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition"
            >
              Salin Teks & Buka LinkedIn
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
