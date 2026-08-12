import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  Clock, 
  LogOut, 
  ChevronDown 
} from 'lucide-react';
import { supabase } from '../utils/supabase';

interface HeaderProps {
  userName: string;
  userEmail: string;
  userRole: string;
  onLogout: () => void;
  onRoleSwitch?: (newRole: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  userName,
  userEmail,
  userRole,
  onLogout
}) => {
  const [autoLogoutMinutes, setAutoLogoutMinutes] = useState<number>(30);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Read durasi Auto-Logout dari database Supabase system_settings secara real-time
  useEffect(() => {
    const fetchSystemSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('system_settings')
          .select('auto_logout_minutes')
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        if (data && data.auto_logout_minutes) {
          setAutoLogoutMinutes(data.auto_logout_minutes);
        }
      } catch (err) {
        console.error('Gagal membaca durasi auto logout dari Supabase:', err);
      }
    };

    fetchSystemSettings();
  }, []);

  const roleLower = userRole?.toLowerCase() || 'trainee';
  const displayRoleLabel = 
    roleLower === 'superadmin' || roleLower === 'admin'
      ? 'SUPER ADMIN'
      : roleLower === 'mentor' || roleLower === 'instructor'
      ? 'MENTOR'
      : 'TRAINEE / GURU';

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between font-sans shrink-0">
      {/* KIRI: Role Badge & Path Title */}
      <div className="flex items-center gap-3">
        <span className={`px-2.5 py-1 text-[10px] font-black rounded-md tracking-wider uppercase border ${
          roleLower === 'superadmin' || roleLower === 'admin'
            ? 'bg-[#0F2C3A] text-[#F5C748] border-[#0F2C3A]'
            : roleLower === 'mentor'
            ? 'bg-amber-50 text-amber-800 border-amber-200'
            : 'bg-blue-50 text-blue-700 border-blue-200'
        }`}>
          {displayRoleLabel}
        </span>
        <span className="text-gray-300">•</span>
        <h2 className="text-xs font-bold text-gray-700">AKTARA TOT Management</h2>
      </div>

      {/* TENGAH: Form Pencarian & Badge Durasi Auto-Logout Dinamis */}
      <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Cari modul, peserta, atau sesi live..."
            className="w-full pl-9 pr-8 py-1.5 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F2C3A]/20"
          />
          <kbd className="absolute right-2.5 top-2 px-1.5 py-0.5 bg-gray-200/60 text-gray-500 text-[10px] font-bold rounded">
            ⌘K
          </kbd>
        </div>

        {/* Badge Durasi Auto-Logout Sesuai Supabase */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 border border-green-200 text-[11px] font-extrabold rounded-full shrink-0">
          <Clock className="w-3.5 h-3.5 text-green-600" />
          <span>Auto Logout: {autoLogoutMinutes}m</span>
        </div>
      </div>

      {/* KANAN: Notifikasi & Profil */}
      <div className="flex items-center gap-3">
        {/* Bel Notifikasi */}
        <button
          type="button"
          className="p-2 text-gray-400 hover:text-[#0F2C3A] hover:bg-gray-50 rounded-xl transition relative cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 bg-red-500 rounded-full absolute top-1.5 right-1.5 ring-2 ring-white"></span>
        </button>

        {/* Dropdown Menu Profil User */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 hover:bg-gray-50 rounded-xl transition cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#0F2C3A] text-white flex items-center justify-center font-bold text-xs">
              {userName ? userName.slice(0, 2).toUpperCase() : 'US'}
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-xs font-bold text-gray-800 leading-none">{userName}</p>
              <p className="text-[10px] text-gray-400 mt-0.5 leading-none">{displayRoleLabel}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-gray-100 shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-xs font-bold text-gray-800">{userName}</p>
                <p className="text-[10px] text-gray-400 truncate">{userEmail}</p>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer mt-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar / Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;