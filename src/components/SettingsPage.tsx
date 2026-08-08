import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Sliders, 
  Upload, 
  KeyRound, 
  Lock, 
  CheckCircle, 
  AlertCircle,
  FileSpreadsheet,
  Loader2,
  Users,
  ShieldAlert
} from 'lucide-react';
import Papa from 'papaparse';
import { UserRole } from '../types';
import { supabase } from '../utils/supabase';

interface SettingsPageProps {
  userRole: UserRole;
  userName: string;
  userEmail: string;
  onSaveSettings: (data: { name: string; email: string }) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  userRole,
  userName,
  userEmail,
  onSaveSettings,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'config' | 'security'>('security');
  
  // Profile State
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [passMessage, setPassMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // CSV Import State
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);

  // Handle Save Profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({ name, email });
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  // Handle Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPassMessage({ type: 'error', text: 'Password minimal harus 6 karakter.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassMessage({ type: 'error', text: 'Konfirmasi password tidak cocok.' });
      return;
    }

    setPassLoading(true);
    setPassMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      await supabase.from('audit_logs').insert({
        action: 'CHANGE_PASSWORD',
        user_email: email,
        details: 'Admin merubah kata sandi akun'
      });

      setPassMessage({ type: 'success', text: 'Password berhasil diperbarui!' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPassMessage({ type: 'error', text: err.message || 'Gagal mengubah password.' });
    } finally {
      setPassLoading(false);
    }
  };

  // Handle CSV Import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportMessage(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const rows = results.data as any[];
          if (rows.length === 0) throw new Error('File CSV kosong');

          const formattedProfiles = rows.map((row) => ({
            name: row.name || row.Nama || 'Peserta Baru',
            email: row.email || row.Email || `trainee_${Date.now()}@aktara.com`,
            role: 'trainee',
            institution: row.institution || row.Instansi || '-'
          }));

          const { error } = await supabase.from('profiles').insert(formattedProfiles);
          if (error) throw error;

          await supabase.from('audit_logs').insert({
            action: 'IMPORT_CSV',
            user_email: email,
            details: `Mengimpor ${formattedProfiles.length} data peserta via CSV`
          });

          setImportMessage(`Berhasil mengimpor ${formattedProfiles.length} peserta!`);
        } catch (err: any) {
          setImportMessage(`Gagal import: ${err.message}`);
        } finally {
          setImporting(false);
        }
      }
    });
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto font-sans">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2C3A]">Pengaturan System & Konsol</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola profil, preferensi sistem, data, dan akses Super Admin.
          </p>
        </div>

        <label className="flex items-center gap-2 px-5 py-2.5 bg-[#0F2C3A] hover:bg-[#183d50] text-white text-sm font-bold rounded-xl cursor-pointer transition shadow-md self-start md:self-auto">
          {importing ? <Loader2 className="w-4 h-4 animate-spin text-[#F5C748]" /> : <Upload className="w-4 h-4 text-[#F5C748]" />}
          <span>{importing ? 'Memproses...' : 'Import Data CSV'}</span>
          <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {importMessage && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-amber-600" />
            <span>{importMessage}</span>
          </div>
          <button onClick={() => setImportMessage(null)} className="text-xs font-bold underline cursor-pointer">Tutup</button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-gray-200 mb-6 gap-6 text-sm font-bold">
        <button
          type="button"
          onClick={() => setActiveSubTab('profile')}
          className={`pb-3 flex items-center gap-2 transition cursor-pointer border-b-2 ${
            activeSubTab === 'profile'
              ? 'border-[#0F2C3A] text-[#0F2C3A]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profil Pengguna</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('config')}
          className={`pb-3 flex items-center gap-2 transition cursor-pointer border-b-2 ${
            activeSubTab === 'config'
              ? 'border-[#0F2C3A] text-[#0F2C3A]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Konfigurasi System</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('security')}
          className={`pb-3 flex items-center gap-2 transition cursor-pointer border-b-2 ${
            activeSubTab === 'security'
              ? 'border-[#0F2C3A] text-[#0F2C3A]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Hak Akses & Keamanan</span>
        </button>
      </div>

      {/* TAB 1: PROFIL PENGGUNA */}
      {activeSubTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          {profileSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Profil berhasil diperbarui!</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Nama Lengkap</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C3A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Email Admin</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C3A]"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-[#0F2C3A] hover:bg-[#183d50] text-white text-sm font-bold rounded-xl transition cursor-pointer"
            >
              Simpan Profil
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: KONFIGURASI SYSTEM */}
      {activeSubTab === 'config' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-6">
          <h3 className="text-base font-bold text-[#0F2C3A]">Pengaturan Aplikasi</h3>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Nama Platform</label>
              <input
                type="text"
                defaultValue="AKTARA ACADEMY"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Versi System Konsol</label>
              <input
                type="text"
                defaultValue="v2.4 Pro (Production)"
                disabled
                className="w-full px-4 py-2.5 rounded-xl bg-gray-100 border border-gray-200 text-sm text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HAK AKSES & KEAMANAN */}
      {activeSubTab === 'security' && (
        <div className="space-y-6">
          {/* Status Role Saat Ini */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-amber-900 uppercase tracking-wide">
                  ROLE TERDETEKSI: {userRole.toUpperCase()}
                </h4>
                <p className="text-xs text-amber-700 mt-0.5">
                  Akses penuh Super Admin aktif. Mengelola seluruh database, materi LMS, dan akun pengguna.
                </p>
              </div>
            </div>

            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-300">
              Active Security
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ubah Password Admin */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-base font-bold text-[#0F2C3A] mb-1 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#F5C748]" />
                Ubah Kata Sandi Admin
              </h3>
              <p className="text-xs text-gray-500 mb-5">
                Perbarui password akun Supabase Auth kamu untuk menjaga keamanan konsol.
              </p>

              {passMessage && (
                <div
                  className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2 border ${
                    passMessage.type === 'success'
                      ? 'bg-green-50 border-green-200 text-green-700'
                      : 'bg-red-50 border-red-200 text-red-700'
                  }`}
                >
                  {passMessage.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{passMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    placeholder="Minimal 6 karakter"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C3A]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                    Konfirmasi Password Baru
                  </label>
                  <input
                    type="password"
                    placeholder="Ulangi password baru"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C3A]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={passLoading}
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0F2C3A] hover:bg-[#183d50] text-white text-sm font-bold rounded-xl transition cursor-pointer disabled:opacity-50"
                >
                  {passLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4 text-[#F5C748]" />}
                  <span>{passLoading ? 'Memperbarui...' : 'Perbarui Password'}</span>
                </button>
              </form>
            </div>

            {/* Matriks Hak Akses Peran */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-base font-bold text-[#0F2C3A] mb-1 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#F5C748]" />
                Matriks Hak Akses Peran (RLS)
              </h3>
              <p className="text-xs text-gray-500 mb-5">
                Hierarki otorisasi akses pengguna di platform AKTARA Academy.
              </p>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-[#0F2C3A]">Super Admin</span>
                    <p className="text-gray-500 text-[11px]">Akses penuh CRUD seluruh tabel & audit log.</p>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-extrabold rounded-md text-[10px]">
                    FULL ACCESS
                  </span>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-[#0F2C3A]">Mentor / Trainer</span>
                    <p className="text-gray-500 text-[11px]">Membuat modul LMS, mengampu live session, penilai.</p>
                  </div>
                  <span className="px-2.5 py-1 bg-purple-100 text-purple-800 font-extrabold rounded-md text-[10px]">
                    INSTRUCTOR
                  </span>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-[#0F2C3A]">Trainee (Peserta)</span>
                    <p className="text-gray-500 text-[11px]">Membaca materi, mengikuti live session, klaim sertifikat.</p>
                  </div>
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-800 font-extrabold rounded-md text-[10px]">
                    READ & CLAIM
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;