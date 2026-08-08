import React, { useState } from 'react';
import { UserRole } from '../types';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
  logoUrl?: string;
  loginBannerTitle?: string;
  loginProgramDesc?: string;
  loginFooterQuote?: string;
  autoLogoutReason?: string | null;
  onClearAutoLogoutReason?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  loginBannerTitle = "Transformasi Digital & AI Assistant untuk Pendidik Abad 21",
  loginProgramDesc = "Wadah kolaborasi dan peningkatan kompetensi guru melalui program Training of Trainers (TOT) berbasis data siswa.",
  loginFooterQuote = "Mencetak Trainer EdTech yang Unggul, Inovatif, dan Berdampak."
}) => {
  const [email, setEmail] = useState('admin@aktara.com');
  const [password, setPassword] = useState('••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let role: UserRole = 'trainee';
    if (email.includes('admin')) {
      role = 'admin';
    } else if (email.includes('mentor') || email.includes('trainer')) {
      role = 'mentor';
    }
    onLogin(role);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white font-sans">
      {/* SISI KIRI: FORM LOGIN */}
      <div className="w-full md:w-1/2 flex flex-col justify-between p-8 md:p-16 lg:p-24 bg-white">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-[#0F2C3A] rounded-xl flex items-center justify-center text-[#F5C748] font-bold text-xl shadow-sm">
              A
            </div>
            <div>
              <h1 className="font-bold text-xl text-[#0F2C3A] leading-tight">AKTARA Academy</h1>
              <p className="text-xs font-semibold text-[#F5C748] tracking-wider uppercase">Training of Trainers Console</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-[#0F2C3A] mb-2 tracking-tight">Portal TOT AKTARA</h2>
            <p className="text-sm text-gray-500">Masuk menggunakan akun Super Admin, Trainer, atau Guru.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label 
                htmlFor="email" 
                className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2"
              >
                Email Aktif
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-[#EFF6FF] text-gray-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C3A] transition"
                placeholder="nama@aktara.com"
                required
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2"
              >
                Kata Sandi
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-[#EFF6FF] text-gray-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C3A] transition"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#0F2C3A] hover:bg-[#183d50] text-white font-bold rounded-xl shadow-md transition duration-200 flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              <span>Masuk ke Konsol</span>
              <span>🚀</span>
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              Belum terdaftar sebagai peserta?{' '}
              <a href="#register" className="font-bold text-[#F5C748] hover:underline">
                Daftar di sini
              </a>
            </p>
          </div>
        </div>

        <div className="mt-12 text-xs text-gray-400">
          © 2026 AKTARA Academy. All rights reserved.
        </div>
      </div>

      {/* SISI KANAN: BRAND HERO PANEL */}
      <div className="hidden md:flex w-1/2 bg-[#0F2C3A] p-12 lg:p-20 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#F5C748]/5 rounded-full blur-3xl pointer-events-none" />

        <div>
          <span className="inline-block bg-[#F5C748] text-[#0F2C3A] text-xs font-extrabold uppercase px-4 py-1.5 rounded-full tracking-wider mb-8">
            AKTARA TOT ECOSYSTEM
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
            {loginBannerTitle}
          </h2>
          <p className="text-slate-300 text-sm lg:text-base leading-relaxed max-w-lg">
            {loginProgramDesc}
          </p>
        </div>

        <div className="border-t border-slate-700/60 pt-6">
          <p className="text-[#F5C748] text-sm font-semibold italic mb-1">
            "{loginFooterQuote}"
          </p>
          <p className="text-xs text-slate-400">Dikelola oleh AKTARA Academy Indonesia</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;