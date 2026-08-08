import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  Settings as SettingsIcon, 
  Award,
  UserCheck,
  ShieldAlert,
  User,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { UserRole } from './types';
import { SettingsPage } from './components/SettingsPage';
import { BatchManagement } from './components/admin/BatchManagement';

// Import Komponen Admin
import { AdminDashboard } from './components/admin/AdminDashboard';
import { BatchCertificateMapper } from './components/admin/BatchCertificateMapper';
import { PromotionApproval } from './components/admin/PromotionApproval';
import { SecurityAuditLogs } from './components/admin/SecurityAuditLogs';
import { LmsIntegration } from './components/admin/LmsIntegration';

// Import Komponen Portal Trainee & Dashboard Mentor (Satu Entry Point)
import { TraineePortal } from './components/trainee/TraineePortal';
import { MentorDashboard } from './components/mentor/MentorDashboard';

export function App() {
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [userName, setUserName] = useState('Super Admin Master');
  const [userEmail, setUserEmail] = useState('admin@aktara.com');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const handleSaveSettings = (data: { name: string; email: string }) => {
    if (data.name) setUserName(data.name);
    if (data.email) setUserEmail(data.email);
  };

  // Navigasi Khusus Admin
  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard Utama', icon: LayoutDashboard },
    { id: 'batches', label: 'Batch Pelatihan', icon: Layers },
    { id: 'lms', label: 'Integrasi LMS', icon: BookOpen },
    { id: 'certificate-mapper', label: 'Pemetaan Sertifikat', icon: Award },
    { id: 'promotion-approval', label: 'Promosi Mentor', icon: UserCheck },
    { id: 'audit-logs', label: 'Audit Keamanan', icon: ShieldAlert },
    { id: 'settings', label: 'Pengaturan System', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-gray-800">
      {/* Sidebar Navigasi Dynamic Per Role */}
      <aside className="w-full md:w-64 bg-[#0F2C3A] text-white flex flex-col justify-between shrink-0">
        <div>
          {/* Logo Brand AKTARA */}
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5C748] flex items-center justify-center text-[#0F2C3A] font-black text-xl shadow-md">
              A
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-wide text-white">AKTARA ACADEMY</h1>
              <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">Console System v2.4</p>
            </div>
          </div>

          {/* Dynamic Nav Items */}
          <nav className="p-4 space-y-1.5">
            {userRole === 'admin' && adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition cursor-pointer ${
                    isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5 text-[#F5C748]" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {userRole === 'mentor' && (
              <button
                type="button"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-white/10 text-white"
              >
                <UserCheck className="w-5 h-5 text-[#F5C748]" />
                <span>Portal Instructor</span>
              </button>
            )}

            {userRole === 'trainee' && (
              <button
                type="button"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-white/10 text-white"
              >
                <GraduationCap className="w-5 h-5 text-[#F5C748]" />
                <span>Portal Ruang Belajar</span>
              </button>
            )}
          </nav>
        </div>

        {/* Profil Singkat User */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-3 p-2">
            <div className="w-9 h-9 rounded-full bg-[#F5C748]/20 border border-[#F5C748] flex items-center justify-center text-[#F5C748] font-bold text-sm shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{userName}</p>
              <p className="text-[10px] text-gray-400 truncate">{userEmail}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto min-h-screen">
        {/* Top Bar Header + Role Switcher */}
        <header className="bg-white border-b border-gray-200/80 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-extrabold rounded-md uppercase tracking-wide">
              {userRole.toUpperCase()}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs font-bold text-gray-500">AKTARA TOT Management</span>
          </div>

          {/* Interactive Role Switcher */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-400">Simulasi Role:</span>
            <select
              value={userRole}
              onChange={(e) => {
                const r = e.target.value as UserRole;
                setUserRole(r);
                if (r === 'admin') setUserName('Super Admin Master');
                if (r === 'mentor') setUserName('Dr. Kusmawan, M.Pd.');
                if (r === 'trainee') setUserName('Budi Santoso');
              }}
              className="px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-[#0F2C3A] focus:outline-none"
            >
              <option value="admin">Super Admin</option>
              <option value="mentor">Mentor / Instructor</option>
              <option value="trainee">Trainee / Peserta</option>
            </select>
          </div>
        </header>

        {/* Dynamic Content Rendering Based On Selected Role */}
        <div className="pb-12">
          {userRole === 'admin' && (
            <>
              {activeTab === 'dashboard' && <AdminDashboard />}
              {activeTab === 'batches' && <BatchManagement />}
              {activeTab === 'lms' && <LmsIntegration />}
              {activeTab === 'certificate-mapper' && <BatchCertificateMapper />}
              {activeTab === 'promotion-approval' && <PromotionApproval />}
              {activeTab === 'audit-logs' && <SecurityAuditLogs />}
              {activeTab === 'settings' && (
                <SettingsPage 
                  userRole={userRole} 
                  userName={userName} 
                  userEmail={userEmail} 
                  onSaveSettings={handleSaveSettings}
                />
              )}
            </>
          )}

          {userRole === 'mentor' && <MentorDashboard userName={userName} />}

          {userRole === 'trainee' && <TraineePortal userName={userName} userEmail={userEmail} />}
        </div>
      </main>
    </div>
  );
}

export default App;