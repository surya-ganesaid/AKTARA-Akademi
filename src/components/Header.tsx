import React from 'react';
import { Search, Bell, ShieldCheck, ChevronDown } from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  userRole?: UserRole;
  userName?: string;
  userTitle?: string;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userRole = 'admin',
  userName = 'Super Admin Master',
  userTitle = 'Super Admin System Lead'
}) => {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30 font-sans">
      {/* KIRI: Badge Role & Info Halaman */}
      <div className="flex items-center gap-3">
        <span className="bg-[#0F2C3A] text-[#F5C748] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider">
          SUPER ADMIN
        </span>
        <span className="text-gray-300">•</span>
        <span className="text-sm font-bold text-[#0F2C3A]">Pengaturan System</span>
      </div>

      {/* TENGAH: Form Pencarian Global */}
      <div className="flex-1 max-w-md mx-8 hidden md:block">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
          <input
            id="header-global-search"
            name="header-global-search"
            type="text"
            autoComplete="off"
            placeholder="Cari modul, peserta, atau sesi live..."
            className="w-full pl-10 pr-12 py-2 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F2C3A]/20 transition"
          />
          <kbd className="absolute right-3 text-[10px] text-gray-400 bg-white border border-gray-200 px-1.5 py-0.5 rounded shadow-2xs font-mono">
            ⌘ K
          </kbd>
        </div>
      </div>

      {/* KANAN: Status Logout, Notifikasi & Profil */}
      <div className="flex items-center gap-4">
        {/* Timer Auto Logout */}
        <div className="hidden lg:flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Auto Logout: <strong>30m</strong></span>
          <span className="bg-amber-400 text-[#0F2C3A] text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
            TES
          </span>
        </div>

        {/* Bell Notification */}
        <button 
          type="button" 
          aria-label="Notifikasi" 
          className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition cursor-pointer"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>

        {/* Profile Avatar */}
        <div className="flex items-center gap-3 pl-2 border-l border-gray-100">
          <div className="w-9 h-9 rounded-full bg-[#0F2C3A] text-[#F5C748] font-bold flex items-center justify-center text-xs shadow-2xs">
            SA
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-[#0F2C3A] leading-tight">{userName}</p>
            <p className="text-[10px] text-gray-400">{userTitle}</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </header>
  );
};

export default Header;