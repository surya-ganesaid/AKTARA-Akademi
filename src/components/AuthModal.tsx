import React, { useState } from 'react';
import { UserRole } from '../types';
import { GraduationCap, ShieldCheck, Lock, Mail, ArrowRight, X, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: UserRole, userName: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('trainee');
  const [email, setEmail] = useState('budi.santoso@sma1jakarta.sch.id');
  const [password, setPassword] = useState('••••••••••••');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let name = 'Budi Santoso, S.Pd';
    if (selectedRole === 'mentor') name = 'Dr. Hendra Wijaya';
    if (selectedRole === 'admin') name = 'Super Admin AKTARA';

    onLoginSuccess(selectedRole, name);
    onClose();
  };

  const handleQuickDemoRole = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'trainee') setEmail('budi.santoso@sma1jakarta.sch.id');
    if (role === 'mentor') setEmail('hendra.wijaya@aktara.id');
    if (role === 'admin') setEmail('admin.master@aktara.id');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Brand & Hero Artwork */}
        <div className="w-full md:w-1/2 bg-[#0F2C3A] text-white p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-[#F5C748]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-10 right-10 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#F5C748] flex items-center justify-center text-[#0F2C3A]">
                <GraduationCap className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <span className="text-xl font-black tracking-tight text-white">AKTARA</span>
                  <span className="text-xl font-black tracking-tight text-[#F5C748]">Academy</span>
                </div>
                <p className="text-[10px] text-slate-300 font-medium uppercase tracking-wider">
                  National Trainer of Trainers Portal
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-white leading-tight mb-3">
              Portal Sertifikasi Guru & Fasilitator Digital Indonesia
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Platform terpadu penyelarasan kurikulum berbasis AI, evaluasi portofolio digital, dan pengikatan e-sertifikat resmi terverifikasi QR Code.
            </p>

            <div className="mt-8 space-y-3">
              <div className="flex items-center space-x-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-[#F5C748] flex-shrink-0" />
                <span>Integrasi Login Akun Belajar.id & SIMPKB Kemdikbud</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-[#F5C748] flex-shrink-0" />
                <span>Modul Interaktif & Live Session Coaching Mentor</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-[#F5C748] flex-shrink-0" />
                <span>Automated Rubrik Penilaian Portofolio 3-Kriteria</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>© 2026 TOT AKTARA Academy</span>
            <span className="text-[#F5C748] font-medium">v2.4 Pro System</span>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="w-full md:w-1/2 p-8 bg-white flex flex-col justify-center">
          
          {/* Header Switcher */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {activeTab === 'login' ? 'Masuk ke Platform' : 'Daftar Akun Peserta'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Pilih peran dan gunakan akun Anda</p>
            </div>
            
            <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setActiveTab('login')}
                className={`px-3 py-1 rounded-md transition ${activeTab === 'login' ? 'bg-white shadow text-[#0F2C3A]' : 'text-slate-500'}`}
              >
                Masuk
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`px-3 py-1 rounded-md transition ${activeTab === 'register' ? 'bg-white shadow text-[#0F2C3A]' : 'text-slate-500'}`}
              >
                Daftar
              </button>
            </div>
          </div>

          {/* Quick Demo Role Selector */}
          <div className="mb-5 p-3 bg-amber-50 rounded-xl border border-amber-200">
            <span className="text-[11px] font-bold text-amber-900 block mb-1.5 uppercase tracking-wider">
              ⚡ Demo Switcher (Uji Coba Langsung)
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-center">
              <button
                type="button"
                onClick={() => handleQuickDemoRole('trainee')}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition ${
                  selectedRole === 'trainee'
                    ? 'bg-[#0F2C3A] text-[#F5C748]'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Guru / Trainee
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoRole('mentor')}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition ${
                  selectedRole === 'mentor'
                    ? 'bg-[#0F2C3A] text-[#F5C748]'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Mentor / Evaluator
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoRole('admin')}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition ${
                  selectedRole === 'admin'
                    ? 'bg-[#0F2C3A] text-[#F5C748]'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Super Admin
              </button>
            </div>
          </div>

          {/* SSO Buttons */}
          <div className="space-y-2 mb-4">
            <button
              onClick={() => {
                onLoginSuccess(selectedRole, selectedRole === 'trainee' ? 'Budi Santoso, S.Pd' : selectedRole === 'mentor' ? 'Dr. Hendra Wijaya' : 'Super Admin AKTARA');
                onClose();
              }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Masuk dengan Google Workspace (Belajar.id)</span>
            </button>

            <button
              onClick={() => {
                onLoginSuccess(selectedRole, selectedRole === 'trainee' ? 'Budi Santoso, S.Pd' : selectedRole === 'mentor' ? 'Dr. Hendra Wijaya' : 'Super Admin AKTARA');
                onClose();
              }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 border border-blue-200 bg-blue-50/50 rounded-xl text-xs font-bold text-blue-900 hover:bg-blue-100/60 transition"
            >
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Masuk dengan SIMPKB Kemdikbud</span>
            </button>
          </div>

          <div className="relative my-4 flex items-center justify-center">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold absolute">
              atau Email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Alamat Email SIMPKB / Dinas
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F2C3A] focus:outline-none"
                  placeholder="nama@guru.sma.belajar.id"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F2C3A] focus:outline-none"
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#0F2C3A] hover:bg-[#133748] text-[#F5C748] font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2 mt-2"
            >
              <span>Lanjutkan ke Workpace {selectedRole.toUpperCase()}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
