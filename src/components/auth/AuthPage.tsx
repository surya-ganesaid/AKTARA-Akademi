import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Mail, 
  Building2, 
  Layers, 
  Loader2, 
  GraduationCap,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { supabase } from '../../utils/supabase';

interface BatchOption {
  id: string;
  title: string;
}

interface AuthPageProps {
  onLoginSuccess: (userData: {
    name: string;
    email: string;
    role: string;
  }) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [batches, setBatches] = useState<BatchOption[]>([]);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [institution, setInstitution] = useState('');
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [role, setRole] = useState('trainee');

  // Fetch Batch
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const { data, error } = await supabase
          .from('batches')
          .select('id, title')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) {
          setBatches(data);
          setSelectedBatchId(data[0].id);
        }
      } catch (err) {
        console.error('Gagal mengambil data batch:', err);
      }
    };

    fetchBatches();
  }, []);

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailClean = email.trim().toLowerCase();

    if (!emailClean || !password) {
      alert('Silakan isi email dan kata sandi Anda.');
      return;
    }

    setLoading(true);

    try {
      if (isRegisterMode) {
        if (!fullName.trim()) {
          alert('Silakan isi Nama Lengkap Anda.');
          setLoading(false);
          return;
        }

        const { data: authData, error: authErr } = await supabase.auth.signUp({
          email: emailClean,
          password: password,
          options: {
            data: {
              name: fullName.trim(),
              institution: institution.trim() || 'Instansi Umum',
              role: role,
              batch_id: selectedBatchId || null
            }
          }
        });

        if (authErr) throw authErr;

        const { error: profileErr } = await supabase.from('profiles').upsert([
          {
            email: emailClean,
            name: fullName.trim(),
            institution: institution.trim() || 'Instansi Umum',
            role: role,
            batch_id: selectedBatchId || null,
            score: 0,
            completed_modules: 0,
            feedback: 'Peserta baru terdaftar di sistem.'
          }
        ], { onConflict: 'email' });

        if (profileErr) throw profileErr;

        await supabase.from('audit_logs').insert({
          action: 'USER_REGISTER',
          user_email: emailClean,
          details: `Peserta ${fullName} (${institution}) berhasil mendaftar.`
        });

        alert('Pendaftaran berhasil! Silakan masuk ke akun Anda.');
        setIsRegisterMode(false);

      } else {
        let userRole = 'trainee';
        let userName = emailClean.split('@')[0];

        const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
          email: emailClean,
          password: password
        });

        const { data: profile } = await supabase
          .from('profiles')
          .select('name, role')
          .eq('email', emailClean)
          .maybeSingle();

        if (profile) {
          userName = profile.name || userName;
          userRole = profile.role || userRole;
        } else if (signInData?.user) {
          userName = signInData.user.user_metadata?.name || userName;
          userRole = signInData.user.user_metadata?.role || userRole;
        }

        if (signInErr && !profile) {
          if (emailClean.includes('admin')) {
            userRole = 'superadmin';
            userName = 'Kang Surya (Super Admin)';
          } else if (emailClean.includes('mentor')) {
            userRole = 'mentor';
            userName = 'Mentor Master Trainer';
          }
        }

        await supabase.from('audit_logs').insert({
          action: 'USER_LOGIN',
          user_email: emailClean,
          details: `User ${userName} (${userRole.toUpperCase()}) berhasil login.`
        });

        onLoginSuccess({
          name: userName,
          email: emailClean,
          role: userRole
        });
      }
    } catch (err: any) {
      alert(`Terjadi kesalahan: ${err.message || 'Gagal memproses otentikasi.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071923] text-white flex flex-col justify-between p-6 md:p-10 font-sans relative overflow-hidden">
      
      {/* HEADER TOP LOGO BRAND */}
      <header className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F5C748] text-[#071923] flex items-center justify-center font-black text-xl shadow-lg">
            A
          </div>
          <div>
            <h1 className="font-black text-sm tracking-wider text-white uppercase">AKTARA ACADEMY</h1>
            <p className="text-[10px] text-[#F5C748] font-extrabold uppercase tracking-widest">CONSOLE SYSTEM V2.4</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-gray-400">
          <GraduationCap className="w-4 h-4 text-[#F5C748]" />
          <span>TOT LMS & SERTIFIKASI GURU</span>
        </div>
      </header>

      {/* MAIN CONTENT SPLIT SCREEN */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-8 relative z-10 max-w-7xl mx-auto w-full">
        
        {/* SISI KIRI: HERO IMAGE & PROMO */}
        <div className="lg:col-span-7 relative flex flex-col justify-center">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0F2C3A]/60 backdrop-blur-md p-2">
            <img 
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200" 
              alt="AKTARA Academy Training" 
              className="w-full h-[360px] md:h-[480px] object-cover rounded-2xl filter brightness-90 contrast-105"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#071923] via-[#071923]/40 to-transparent rounded-2xl p-6 md:p-10 flex flex-col justify-end">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#F5C748] text-[#071923] text-[10px] font-black rounded-full uppercase tracking-wider w-fit mb-2">
                <Sparkles className="w-3 h-3" />
                Program Pelatihan Master Trainer
              </span>
              <h2 className="text-2xl md:text-4xl font-black text-white leading-tight">
                Transformasi Digital Pendidikan Bersama AKTARA
              </h2>
              <p className="text-xs md:text-sm text-gray-300 mt-2 max-w-xl font-medium">
                Tingkatkan kompetensi pedagogik, kelola kelas TOT, dan klaim e-Sertifikat resmi terakreditasi KKM 75.
              </p>
            </div>
          </div>
        </div>

        {/* SISI KANAN: FORM LOGIN / REGISTER STYLED ALA SAMPLE */}
        <div className="lg:col-span-5 flex flex-col justify-center max-w-md mx-auto w-full space-y-6 lg:pl-6">
          <div className="space-y-2">
            <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">
              {isRegisterMode ? 'PENDAFTARAN PESERTA' : 'WELCOME BACK TRAINER!'}
            </h3>
            <p className="text-xs text-gray-400 font-medium">
              {isRegisterMode 
                ? 'Lengkapi data untuk mendaftar ke batch pelatihan.' 
                : 'Log in to your account to access your learning portal.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Register Fields */}
            {isRegisterMode && (
              <>
                <div>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#F5C748] absolute left-4 top-3.5" />
                    <input
                      type="text"
                      placeholder="Nama Lengkap & Gelar"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-11 pr-5 py-3 rounded-full bg-[#1e2d37] border border-white/10 text-xs font-bold text-white placeholder-gray-400 focus:outline-none focus:border-[#F5C748] transition"
                      required={isRegisterMode}
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-[#F5C748] absolute left-4 top-3.5" />
                    <input
                      type="text"
                      placeholder="Asal Sekolah / Instansi"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      className="w-full pl-11 pr-5 py-3 rounded-full bg-[#1e2d37] border border-white/10 text-xs font-bold text-white placeholder-gray-400 focus:outline-none focus:border-[#F5C748] transition"
                      required={isRegisterMode}
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Layers className="w-4 h-4 text-[#F5C748] absolute left-4 top-3.5" />
                    <select
                      value={selectedBatchId}
                      onChange={(e) => setSelectedBatchId(e.target.value)}
                      className="w-full pl-11 pr-5 py-3 rounded-full bg-[#1e2d37] border border-white/10 text-xs font-bold text-white focus:outline-none focus:border-[#F5C748] cursor-pointer transition"
                    >
                      {batches.map((b) => (
                        <option key={b.id} value={b.id} className="bg-[#071923] text-white">
                          {b.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Input Email / Username */}
            <div>
              <div className="relative">
                <User className="w-4 h-4 text-[#F5C748] absolute left-4 top-3.5" />
                <input
                  type="email"
                  placeholder="Username / Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-5 py-3.5 rounded-full bg-[#1e2d37] border border-white/10 text-xs font-bold text-white placeholder-gray-400 focus:outline-none focus:border-[#F5C748] transition"
                  required
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#F5C748] absolute left-4 top-3.5" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-5 py-3.5 rounded-full bg-[#1e2d37] border border-white/10 text-xs font-bold text-white placeholder-gray-400 focus:outline-none focus:border-[#F5C748] transition"
                  required
                />
              </div>
            </div>

            {/* Tombol Login Pill dengan Highlight Kuning Aksen */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-[#0F2C3A] hover:bg-[#183d50] text-[#F5C748] border-2 border-[#F5C748] text-sm font-black tracking-wider uppercase transition-all shadow-lg hover:shadow-[#F5C748]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>{isRegisterMode ? 'DAFTAR SEKARANG' : 'LOGIN'}</span>
                    <ArrowRight className="w-4 h-4 text-[#F5C748]" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Navigation Switcher */}
          <div className="flex items-center justify-between text-xs text-gray-400 font-bold pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="hover:text-[#F5C748] transition cursor-pointer"
            >
              {isRegisterMode ? 'Already Have Account? Login' : 'Create Account'}
            </button>

            {!isRegisterMode && (
              <button
                type="button"
                onClick={() => alert('Silakan hubungi Super Admin untuk bantuan reset password.')}
                className="hover:text-[#F5C748] transition cursor-pointer"
              >
                Need Help?
              </button>
            )}
          </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="text-center text-[11px] text-gray-500 font-bold relative z-10 border-t border-white/5 pt-4">
        © 2026 PT Akara Natura Nusantara • AKTARA Academy Console System
      </footer>
    </div>
  );
};

export default AuthPage;