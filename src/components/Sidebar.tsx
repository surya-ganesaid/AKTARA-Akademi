import React from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  BookOpenCheck, 
  Award, 
  UserCheck, 
  ShieldAlert, 
  Settings, 
  BookOpen, 
  Video, 
  HelpCircle, 
  LogOut,
  Users,
  Megaphone,
  HelpCircle as QuizIcon
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole?: string;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  userRole = 'trainee', 
  onLogout 
}) => {
  const normalizedRole = userRole.toLowerCase().replace(/[\s_-]/g, '');
  const isAdmin = normalizedRole.includes('admin') || normalizedRole.includes('superadmin');
  const isMentor = normalizedRole.includes('mentor') || normalizedRole.includes('instructor');
  const isTrainee = !isAdmin && !isMentor;

  return (
    <aside className="w-64 bg-[#071923] text-white flex flex-col justify-between shrink-0 border-r border-white/10 font-sans">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F5C748] text-[#0F2C3A] flex items-center justify-center font-black text-xl shadow-lg">
            A
          </div>
          <div>
            <h1 className="font-black text-sm tracking-wide text-white">AKTARA ACADEMY</h1>
            <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">CONSOLE SYSTEM V2.4</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="p-4 space-y-6">
          {/* 1. MENU SUPER ADMIN / ADMIN */}
          {isAdmin && (
            <div>
              <p className="px-3 text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">
                MENU NAVIGASI MAIN
              </p>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'dashboard'
                      ? 'bg-[#0F2C3A] text-white border border-white/10 shadow-sm'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-[#F5C748]" />
                  <span>Dashboard Utama</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('batches')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'batches'
                      ? 'bg-[#0F2C3A] text-white border border-white/10 shadow-sm'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4 text-[#F5C748]" />
                  <span>Batch Pelatihan</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('lms')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'lms'
                      ? 'bg-[#0F2C3A] text-white border border-white/10 shadow-sm'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <BookOpenCheck className="w-4 h-4 text-[#F5C748]" />
                  <span>Integrasi LMS</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('certificate-mapper')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'certificate-mapper'
                      ? 'bg-[#0F2C3A] text-white border border-white/10 shadow-sm'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Award className="w-4 h-4 text-[#F5C748]" />
                  <span>Pemetaan Sertifikat</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('promotion-approval')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'promotion-approval'
                      ? 'bg-[#0F2C3A] text-white border border-white/10 shadow-sm'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-[#F5C748]" />
                  <span>Promosi Mentor</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('audit-logs')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'audit-logs'
                      ? 'bg-[#0F2C3A] text-white border border-white/10 shadow-sm'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-[#F5C748]" />
                  <span>Audit Keamanan</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'settings'
                      ? 'bg-[#0F2C3A] text-white border border-white/10 shadow-sm'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Settings className="w-4 h-4 text-[#F5C748]" />
                  <span>Pengaturan System</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. MENU MENTOR / MASTER TRAINER (NAVIGASI SIDEBAR MENTOR) */}
          {isMentor && (
            <div>
              <p className="px-3 text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">
                WORKSPACE MENTOR
              </p>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('webinars')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'webinars' || activeTab === 'mentor'
                      ? 'bg-[#0F2C3A] text-white border border-white/10 shadow-sm'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Video className="w-4 h-4 text-[#F5C748]" />
                  <span>Sesi Webinar</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('progress')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'progress'
                      ? 'bg-[#0F2C3A] text-white border border-white/10 shadow-sm'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4 text-[#F5C748]" />
                  <span>Progres & Penilaian</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('announcements')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'announcements'
                      ? 'bg-[#0F2C3A] text-white border border-white/10 shadow-sm'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Megaphone className="w-4 h-4 text-[#F5C748]" />
                  <span>Broadcast Pengumuman</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('quizzes')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'quizzes'
                      ? 'bg-[#0F2C3A] text-white border border-white/10 shadow-sm'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <QuizIcon className="w-4 h-4 text-[#F5C748]" />
                  <span>Kuis & Jawaban Trainee</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. MENU TRAINEE / GURU */}
          {isTrainee && (
            <div>
              <p className="px-3 text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">
                RUANG BELAJAR GURU
              </p>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('modules')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'modules' || activeTab === 'trainee'
                      ? 'bg-[#0F2C3A] text-white border border-white/10 shadow-sm'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-[#F5C748]" />
                  <span>Materi LMS</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('live')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'live'
                      ? 'bg-[#0F2C3A] text-white border border-white/10 shadow-sm'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Video className="w-4 h-4 text-[#F5C748]" />
                  <span>Live Mentoring</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('quizzes')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'quizzes'
                      ? 'bg-[#0F2C3A] text-white border border-white/10 shadow-sm'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 text-[#F5C748]" />
                  <span>Kuis Refleksi</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('certificate')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'certificate'
                      ? 'bg-[#0F2C3A] text-white border border-white/10 shadow-sm'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Award className="w-4 h-4 text-[#F5C748]" />
                  <span>E-Sertifikat Saya</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold rounded-xl transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar / Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;