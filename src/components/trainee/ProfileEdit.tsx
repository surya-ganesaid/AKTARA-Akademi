import React, { useState } from 'react';
import { Lock, AlertTriangle, Send, CheckCircle2, User, Building, Phone, Mail, Award, X } from 'lucide-react';

interface ProfileEditProps {
  userProfile: {
    name: string;
    nip: string;
    instansi: string;
    email: string;
    phone: string;
  };
  onRequestUnlock: (reason: string, fields: string[]) => void;
}

export const ProfileEdit: React.FC<ProfileEditProps> = ({ userProfile, onRequestUnlock }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [selectedFields, setSelectedFields] = useState<string[]>(['NIP / NIK', 'Gelar Akademik']);
  const [isSubmittedToast, setIsSubmittedToast] = useState(false);

  const toggleField = (field: string) => {
    if (selectedFields.includes(field)) {
      setSelectedFields(selectedFields.filter((f) => f !== field));
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    onRequestUnlock(reason, selectedFields);
    setIsModalOpen(false);
    setIsSubmittedToast(true);
    setTimeout(() => setIsSubmittedToast(false), 5000);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#0F2C3A] font-bold uppercase tracking-wider mb-1">
            <User className="w-4 h-4 text-[#F5C748]" />
            <span>Manajemen Profil & Legalitas Peserta</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Identitas Resmi E-Sertifikat
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Data identitas Anda digunakan secara langsung untuk pencetakan e-sertifikat terverifikasi QR Code.
          </p>
        </div>
      </div>

      {/* Success Notification */}
      {isSubmittedToast && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-center space-x-3 text-xs font-bold text-emerald-900 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>
            Permohonan revisi data profil telah dikirimkan ke Super Admin AKTARA. Tim verifikasi akan meninjau perubahan Anda dalam 1x24 jam.
          </span>
        </div>
      )}

      {/* Locked Data Warning Callout */}
      <div className="bg-amber-50 border-l-4 border-[#C68E28] rounded-2xl p-5 shadow-sm space-y-2">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-[#C68E28] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider">
              Mode Terkunci (Locked Profile Mode)
            </h3>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              Perhatian: Data profil Anda telah <span className="font-bold">dikunci otomatis oleh sistem</span> pasca-proses verifikasi dan pendaftaran sertifikasi. Perubahan data secara langsung tidak diperkenankan untuk mencegah pemalsuan sertifikat nasional.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Form Card with Locked Inputs */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
            <span>Data Identitas Terverifikasi</span>
            <Lock className="w-4 h-4 text-[#C68E28]" />
          </h3>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#0F2C3A] hover:bg-[#163f52] text-[#F5C748] font-bold text-xs rounded-xl transition shadow flex items-center space-x-2"
          >
            <Lock className="w-3.5 h-3.5 text-[#F5C748]" />
            <span>Ajukan Permohonan Revisi Profil</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Readonly Name */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
              Nama Lengkap & Gelar Akademik
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={userProfile.name}
                className="w-full pl-3 pr-10 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-800 cursor-not-allowed"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Dicetak persis sesuai input ini pada sertifikat.</p>
          </div>

          {/* Readonly NIP */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
              NIP / NIK NUPTK Resmi
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={userProfile.nip}
                className="w-full pl-3 pr-10 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-800 cursor-not-allowed"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Digunakan untuk validasi keanggotaan SIMPKB.</p>
          </div>

          {/* Readonly Instansi */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
              Satuan Pendidikan / Instansi
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={userProfile.instansi}
                className="w-full pl-3 pr-10 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-800 cursor-not-allowed"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>
          </div>

          {/* Readonly Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
              Nomor WhatsApp Pembina
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={userProfile.phone}
                className="w-full pl-3 pr-10 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-800 cursor-not-allowed"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Revision Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-extrabold text-[#0F2C3A] mb-1">
              Formulir Permohonan Buka Kunci Profile
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Kirimkan permohonan ke Super Admin dengan alasan perubahan yang valid.
            </p>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Pilih Data yang Ingin Diubah
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                  {['Nama Lengkap', 'Gelar Akademik', 'NIP / NIK', 'Instansi Pembina'].map((item) => (
                    <label
                      key={item}
                      className="flex items-center space-x-2 p-2 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFields.includes(item)}
                        onChange={() => toggleField(item)}
                        className="rounded border-slate-300 text-[#0F2C3A] focus:ring-[#0F2C3A]"
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Alasan Permohonan & Bukti Pendukung
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F2C3A] focus:outline-none"
                  placeholder="Jelaskan alasan koreksi data (misal: Penambahan gelar magister baru, koreksi typo NIP, mutasi sekolah)..."
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-[#0F2C3A] hover:bg-[#163f52] text-[#F5C748] font-bold text-xs rounded-xl transition shadow flex items-center justify-center space-x-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Permohonan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
