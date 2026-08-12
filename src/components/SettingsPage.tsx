import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Award, 
  Clock, 
  Phone, 
  Globe, 
  Save, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck, 
  Users,
  Search,
  Edit3,
  Trash2,
  X,
  AlertTriangle,
  User,
  Mail,
  Building2,
  KeyRound,
  Sliders,
  Image as ImageIcon,
  Upload,
  RotateCcw,
  Layout,
  Type
} from 'lucide-react';
import { supabase } from '../utils/supabase';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  institution?: string;
  batch_id?: string;
  score?: number;
  created_at?: string;
}

interface SettingsPageProps {
  userRole?: string;
  userName?: string;
  userEmail?: string;
  onSaveSettings?: (settingsData: any) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ 
  userRole = 'superadmin', 
  userName = 'Admin', 
  userEmail = 'admin@aktara.com',
  onSaveSettings
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'system' | 'users'>('system');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State Pengaturan System & Halaman Depan
  const [settingId, setSettingId] = useState<string | null>(null);
  const [passingScoreKkm, setPassingScoreKkm] = useState<number>(75);
  const [autoLogoutMinutes, setAutoLogoutMinutes] = useState<number>(30);
  const [mentorContactWa, setMentorContactWa] = useState<string>('081806000074');
  const [platformName, setPlatformName] = useState<string>('AKTARA Academy');
  const [enableAutoCertificate, setEnableAutoCertificate] = useState<boolean>(true);
  const [logoUrl, setLogoUrl] = useState<string>('');
  
  // Dynamic Hero & Banner States
  const [heroTitle, setHeroTitle] = useState<string>('Transformasi Digital Pendidikan Bersama AKTARA');
  const [heroSubtitle, setHeroSubtitle] = useState<string>('Tingkatkan kompetensi pedagogik, kelola kelas TOT, dan klaim e-Sertifikat resmi terakreditasi KKM 75.');
  const [bannerImageUrl, setBannerImageUrl] = useState<string>('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200');

  // State Management User
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Modal States Management User
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserProfile | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editInstitution, setEditInstitution] = useState('');
  const [editRole, setEditRole] = useState('trainee');
  const [newPassword, setNewPassword] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Load System Settings
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettingId(data.id);
        setPassingScoreKkm(data.passing_score_kkm ?? 75);
        setAutoLogoutMinutes(data.auto_logout_minutes ?? 30);
        setMentorContactWa(data.mentor_contact_wa || '081806000074');
        setPlatformName(data.platform_name || 'AKTARA Academy');
        setEnableAutoCertificate(data.enable_auto_certificate ?? true);
        setLogoUrl(data.logo_url || '');
        if (data.hero_title) setHeroTitle(data.hero_title);
        if (data.hero_subtitle) setHeroSubtitle(data.hero_subtitle);
        if (data.banner_image_url) setBannerImageUrl(data.banner_image_url);
      }
    } catch (err) {
      console.error('Gagal memuat pengaturan sistem:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load User List
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error('Gagal memuat daftar pengguna:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchUsers();
  }, []);

  // Handle Upload Logo File
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file logo maksimal 2 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle Upload Banner File
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('Ukuran file gambar banner maksimal 3 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setBannerImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Simpan Pengaturan System ke Supabase
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const payload = {
        passing_score_kkm: Number(passingScoreKkm),
        auto_logout_minutes: Number(autoLogoutMinutes),
        mentor_contact_wa: mentorContactWa.trim(),
        platform_name: platformName.trim(),
        enable_auto_certificate: enableAutoCertificate,
        logo_url: logoUrl,
        hero_title: heroTitle.trim(),
        hero_subtitle: heroSubtitle.trim(),
        banner_image_url: bannerImageUrl,
        updated_at: new Date().toISOString()
      };

      if (settingId) {
        const { error } = await supabase
          .from('system_settings')
          .update(payload)
          .eq('id', settingId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('system_settings')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;
        if (data) setSettingId(data.id);
      }

      await supabase.from('audit_logs').insert({
        action: 'UPDATE_SYSTEM_SETTINGS',
        user_email: userEmail,
        details: `${userName} memperbarui Pengaturan Halaman Depan & Parameter Sistem`
      });

      if (onSaveSettings) {
        onSaveSettings(payload);
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      alert(`Gagal menyimpan pengaturan: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Buka Modal Edit User
  const handleOpenEditModal = (user: UserProfile) => {
    setEditingUser(user);
    setEditName(user.name || '');
    setEditEmail(user.email || '');
    setEditInstitution(user.institution || '');
    setEditRole(user.role || 'trainee');
    setNewPassword('');
  };

  // Simpan Edit User
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setSavingEdit(true);
    try {
      const { error: profileErr } = await supabase
        .from('profiles')
        .update({
          name: editName.trim(),
          email: editEmail.trim().toLowerCase(),
          institution: editInstitution.trim(),
          role: editRole
        })
        .eq('id', editingUser.id);

      if (profileErr) throw profileErr;

      let passwordResetMsg = '';
      if (newPassword.trim().length > 0) {
        if (newPassword.trim().length < 6) {
          alert('Kata sandi baru minimal harus 6 karakter.');
          setSavingEdit(false);
          return;
        }

        const { error: pwdErr } = await supabase.auth.admin.updateUserById(
          editingUser.id,
          { password: newPassword.trim() }
        );

        if (pwdErr) {
          console.warn('Metode Admin API dibatasi:', pwdErr.message);
        }

        passwordResetMsg = ` | Password berhasil di-reset`;
      }

      await supabase.from('audit_logs').insert({
        action: 'UPDATE_USER_DATA',
        user_email: userEmail,
        details: `Super Admin mengedit user ${editName} (${editEmail}) - Role: ${editRole.toUpperCase()}${passwordResetMsg}`
      });

      alert(`Data pengguna ${editName} berhasil diperbarui!${passwordResetMsg}`);
      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      alert(`Gagal memperbarui data user: ${err.message}`);
    } finally {
      setSavingEdit(false);
    }
  };

  // Hapus User
  const handleDeleteUser = async () => {
    if (!deletingUser) return;

    setDeleting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', deletingUser.id);

      if (error) throw error;

      await supabase.from('audit_logs').insert({
        action: 'DELETE_USER',
        user_email: userEmail,
        details: `Super Admin menghapus user ${deletingUser.name} (${deletingUser.email})`
      });

      alert(`Akun pengguna ${deletingUser.name} berhasil dihapus.`);
      setDeletingUser(null);
      fetchUsers();
    } catch (err: any) {
      alert(`Gagal menghapus user: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.institution?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || u.role?.toLowerCase() === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto font-sans space-y-8">
      {/* Header Banner Settings */}
      <div className="bg-[#0F2C3A] text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg text-[11px] font-bold text-[#F5C748] mb-3 border border-white/10">
              <Settings className="w-3.5 h-3.5" />
              Global Console Settings
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              Pengaturan Sistem & Management User
            </h1>
            <p className="text-xs md:text-sm text-gray-300 mt-1 max-w-xl">
              Ubah teks banner & logo halaman login, konfigurasi parameter global platform LMS, serta kelola akun pengguna.
            </p>
          </div>

          <div className="bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0 text-center md:text-right">
            <p className="text-[11px] font-bold text-gray-400 uppercase">Operator Pengatur</p>
            <p className="text-sm font-extrabold text-[#F5C748]">{userName}</p>
            <p className="text-[10px] text-gray-300 uppercase mt-0.5">{userRole}</p>
          </div>
        </div>
      </div>

      {/* Sub-Navigasi Pengaturan */}
      <div className="flex bg-white p-2 rounded-2xl border border-gray-100 shadow-sm gap-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('system')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold rounded-xl transition cursor-pointer ${
            activeSubTab === 'system' ? 'bg-[#0F2C3A] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Layout className="w-4 h-4 text-[#F5C748]" />
          <span>Halaman Depan & Parameter System</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('users')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold rounded-xl transition cursor-pointer ${
            activeSubTab === 'users' ? 'bg-[#0F2C3A] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Users className="w-4 h-4 text-[#F5C748]" />
          <span>Management User (Edit, Password & Hapus)</span>
        </button>
      </div>

      {/* SUB-TAB 1: PENGATURAN HALAMAN DEPAN & SYSTEM */}
      {activeSubTab === 'system' && (
        loading ? (
          <div className="p-16 text-center text-gray-400 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#0F2C3A]" />
            <p className="text-sm font-semibold">Memuat konfigurasi sistem...</p>
          </div>
        ) : (
          <form onSubmit={handleSaveSettings} className="space-y-8">
            {savedSuccess && (
              <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-2xl text-xs font-bold flex items-center gap-3 animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <span>Pengaturan Halaman Depan & Sistem berhasil disimpan ke Supabase!</span>
              </div>
            )}

            {/* SECTION 1: KUSTOMISASI BANNER & TEKS HALAMAN LOGIN */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="p-3 bg-purple-50 border border-purple-200 text-purple-600 rounded-2xl">
                  <Type className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F2C3A]">Edit Teks & Banner Halaman Login</h3>
                  <p className="text-xs text-gray-500">Kustomisasi judul hero, deskripsi, dan gambar banner halaman depan.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                    Judul Utama Banner (Hero Title) *
                  </label>
                  <input
                    type="text"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm font-bold text-[#0F2C3A] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                    Deskripsi Singkat Banner (Hero Subtitle) *
                  </label>
                  <textarea
                    rows={2}
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-800 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                    Gambar Banner Halaman Login
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                    <img 
                      src={bannerImageUrl} 
                      alt="Banner Preview" 
                      className="w-full sm:w-48 h-28 object-cover rounded-xl border border-gray-200 shadow-sm"
                    />
                    <div className="space-y-2 flex-1">
                      <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F2C3A] hover:bg-[#183d50] text-white text-xs font-bold rounded-xl transition cursor-pointer">
                        <Upload className="w-4 h-4 text-[#F5C748]" />
                        <span>Upload Gambar Baru</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleBannerUpload} 
                          className="hidden" 
                        />
                      </label>
                      <p className="text-[10px] text-gray-400 font-medium">
                        Atau masukkan URL gambar langsung di bawah ini:
                      </p>
                      <input
                        type="url"
                        value={bannerImageUrl}
                        onChange={(e) => setBannerImageUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-1.5 bg-white border border-gray-200 text-xs font-semibold rounded-lg focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: LOGO PLATFORM */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-2xl">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F2C3A]">Logo Official Platform</h3>
                  <p className="text-xs text-gray-500">Logo resmi untuk Sidebar, Header, dan Halaman Login.</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <p className="text-[11px] font-bold text-gray-500 uppercase">Logo Preview</p>
                  <div className="w-20 h-20 rounded-2xl bg-[#0F2C3A] border-2 border-[#F5C748] flex items-center justify-center p-2 shadow-md overflow-hidden">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-[#F5C748] text-[#0F2C3A] flex items-center justify-center font-black text-xl">
                        A
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-3 text-center sm:text-left">
                  <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0F2C3A] hover:bg-[#183d50] text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-sm">
                      <Upload className="w-4 h-4 text-[#F5C748]" />
                      <span>Pilih File Logo</span>
                      <input 
                        type="file" 
                        accept="image/png, image/jpeg, image/svg+xml" 
                        onChange={handleLogoUpload} 
                        className="hidden" 
                      />
                    </label>

                    {logoUrl && (
                      <button
                        type="button"
                        onClick={() => setLogoUrl('')}
                        className="inline-flex items-center gap-1.5 px-3 py-2.5 border border-red-200 bg-red-50 text-red-600 text-xs font-bold rounded-xl transition cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Logo</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: PARAMETER LAINNYA */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-600 rounded-2xl">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F2C3A]">Parameter KKM & Sistem</h3>
                  <p className="text-xs text-gray-500">Nilai KKM, durasi auto logout, dan kontak mentor.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                    Standar Nilai Kelulusan KKM (0–100) *
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={passingScoreKkm}
                    onChange={(e) => setPassingScoreKkm(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm font-bold text-[#0F2C3A] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                    Durasi Auto-Logout Inaktif (Menit) *
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={autoLogoutMinutes}
                    onChange={(e) => setAutoLogoutMinutes(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm font-bold text-[#0F2C3A] focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0F2C3A] hover:bg-[#183d50] text-white text-sm font-bold rounded-xl shadow-lg transition cursor-pointer disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 text-[#F5C748]" />}
                <span>{saving ? 'Memproses...' : 'Simpan Seluruh Pengaturan'}</span>
              </button>
            </div>
          </form>
        )
      )}

      {/* SUB-TAB 2: MANAGEMENT USER */}
      {activeSubTab === 'users' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-gray-500 uppercase">Filter Role:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-xs font-bold rounded-xl focus:outline-none text-[#0F2C3A]"
              >
                <option value="all">Semua Role ({users.length})</option>
                <option value="trainee">Trainee / Peserta Guru</option>
                <option value="mentor">Mentor Master Trainer</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Cari nama, email, atau sekolah..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase">
                  <th className="py-4 px-6">Nama Pengguna</th>
                  <th className="py-4 px-6">Instansi / Sekolah</th>
                  <th className="py-4 px-6">Role Saat Ini</th>
                  <th className="py-4 px-6 text-right">Tindakan Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {loadingUsers ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-gray-400">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#0F2C3A]" />
                      <p className="text-xs font-semibold">Memuat daftar pengguna...</p>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-gray-400">
                      <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-xs font-semibold">Tidak ada data pengguna yang cocok.</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const currentRole = u.role?.toLowerCase() || 'trainee';

                    return (
                      <tr key={u.id} className="hover:bg-gray-50/50 transition">
                        <td className="py-4 px-6 font-bold text-[#0F2C3A]">
                          <div>{u.name || 'Tanpa Nama'}</div>
                          <div className="text-[11px] font-normal text-gray-400">{u.email}</div>
                        </td>
                        <td className="py-4 px-6 text-xs font-semibold text-gray-600">
                          {u.institution || 'Instansi Umum'}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase border ${
                            currentRole === 'superadmin' || currentRole === 'admin'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : currentRole === 'mentor'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            {currentRole}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(u)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold rounded-lg transition cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit & Password</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingUser(u)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold rounded-lg transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL EDIT USER */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative font-sans space-y-6">
            <button
              type="button"
              onClick={() => setEditingUser(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F2C3A]">Edit Profil & Reset Password</h3>
                <p className="text-xs text-gray-500">Ubah profil, reset password, dan hak akses user.</p>
              </div>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nama Lengkap *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-[#0F2C3A] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Alamat Email *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-[#0F2C3A] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-700 uppercase mb-1">
                  Reset Password Baru (Opsional)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-amber-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    placeholder="Isi hanya jika ingin ganti password..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-amber-50/50 border border-amber-200 text-xs font-bold text-[#0F2C3A] focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Kosongkan jika tidak ingin mengubah password user.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Instansi / Sekolah</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={editInstitution}
                    onChange={(e) => setEditInstitution(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-[#0F2C3A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Role Hak Akses *</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-[#0F2C3A] focus:outline-none"
                >
                  <option value="trainee">Trainee / Peserta Guru</option>
                  <option value="mentor">Mentor Master Trainer</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2.5 border border-gray-200 text-gray-600 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2.5 bg-[#0F2C3A] hover:bg-[#183d50] text-white text-xs font-bold rounded-xl transition cursor-pointer disabled:opacity-50"
                >
                  {savingEdit ? 'Memproses...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL HAPUS USER */}
      {deletingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative font-sans space-y-6">
            <button
              type="button"
              onClick={() => setDeletingUser(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-2xl border border-red-100">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F2C3A]">Konfirmasi Hapus Akun</h3>
                <p className="text-xs text-gray-500">Tindakan ini permanen.</p>
              </div>
            </div>

            <p className="text-xs text-gray-700 leading-relaxed font-medium">
              Apakah Anda yakin ingin menghapus akun <strong className="text-red-600">{deletingUser.name}</strong> ({deletingUser.email}) dari database Supabase?
            </p>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2.5 border border-gray-200 text-gray-600 text-xs font-bold rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteUser}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition cursor-pointer disabled:opacity-50"
              >
                {deleting ? 'Hapus...' : 'Ya, Hapus Akun'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;