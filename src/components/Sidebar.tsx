import React from 'react';
import { UserRole, TraineeTab, MentorTab, AdminTab } from '../types';
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  Award,
  BookOpen,
  FileCheck2,
  User,
  CheckCircle2,
  Calendar,
  Users,
  SlidersHorizontal,
  ShieldAlert,
  Sparkles,
  X,
  LogOut,
  Settings
} from 'lucide-react';

interface SidebarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTraineeTab: TraineeTab;
  onTraineeTabChange: (tab: TraineeTab) => void;
  activeMentorTab: MentorTab;
  onMentorTabChange: (tab: MentorTab) => void;
  activeAdminTab: AdminTab;
  onAdminTabChange: (tab: AdminTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onLogout?: () => void;
  logoUrl?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  activeTraineeTab,
  onTraineeTabChange,
  activeMentorTab,
  onMentorTabChange,
  activeAdminTab,
  onAdminTabChange,
  isOpenMobile,
  onCloseMobile,
  onLogout,
  logoUrl
}) => {
  const roleDisplayNames: Record<UserRole, string> = {
    trainee: 'Guru / Trainee',
    mentor: 'Mentor / Evaluator',
    admin: 'Super Admin',
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0F2C3A] text-white border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[#1A3D4D] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo Platform"
                className="w-9 h-9 rounded-xl object-contain bg-white/10 p-0.5 border border-amber-300/30 shadow-inner shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#F5C748] to-[#f8d87a] flex items-center justify-center text-[#0F2C3A] font-extrabold text-lg shadow-inner shrink-0">
                <GraduationCap className="w-5 h-5 stroke-[2.5]" />
              </div>
            )}
            <div>
              <div className="flex items-center space-x-1">
                <span className="text-lg font-black tracking-tight text-white">AKTARA</span>
                <span className="text-lg font-black tracking-tight text-[#F5C748]">Academy</span>
              </div>
              <p className="text-[10px] text-slate-300 tracking-wider uppercase font-semibold">
                TOT LMS & Sertifikasi
              </p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1A3D4D]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Workspace Indicator Badge */}
        <div className="px-5 py-3 border-b border-[#1A3D4D] bg-[#0A1D28]/60 flex items-center space-x-2.5">
          <span className="w-2 h-2 rounded-full bg-[#F5C748] animate-pulse shrink-0"></span>
          <div className="overflow-hidden">
            <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block">
              Ruang Kerja Aktif
            </span>
            <span className="text-xs font-black text-[#F5C748] truncate block">
              {roleDisplayNames[currentRole]}
            </span>
          </div>
        </div>

        {/* Navigation Menu Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-none">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block px-2 mb-2">
              Menu Navigasi Main
            </span>

            <nav className="space-y-1">
              {/* GURU / TRAINEE NAV LINKS */}
              {currentRole === 'trainee' && (
                <>
                  <button
                    onClick={() => {
                      onTraineeTabChange('dashboard');
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                      activeTraineeTab === 'dashboard'
                        ? 'bg-[#1A3D4D] text-[#F5C748] border-l-4 border-l-[#F5C748] shadow-sm'
                        : 'text-slate-300 hover:bg-[#1A3D4D]/60 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-[#F5C748]" />
                    <span>Dashboard</span>
                  </button>

                  <button
                    onClick={() => {
                      onTraineeTabChange('lms');
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                      activeTraineeTab === 'lms'
                        ? 'bg-[#1A3D4D] text-[#F5C748] border-l-4 border-l-[#F5C748] shadow-sm'
                        : 'text-slate-300 hover:bg-[#1A3D4D]/60 hover:text-white'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Modul Belajar</span>
                  </button>

                  <button
                    onClick={() => {
                      onTraineeTabChange('tasks');
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                      activeTraineeTab === 'tasks'
                        ? 'bg-[#1A3D4D] text-[#F5C748] border-l-4 border-l-[#F5C748] shadow-sm'
                        : 'text-slate-300 hover:bg-[#1A3D4D]/60 hover:text-white'
                    }`}
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>Tugas & Portofolio</span>
                  </button>

                  <button
                    onClick={() => {
                      onTraineeTabChange('certificate');
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                      activeTraineeTab === 'certificate'
                        ? 'bg-[#1A3D4D] text-[#F5C748] border-l-4 border-l-[#F5C748] shadow-sm'
                        : 'text-slate-300 hover:bg-[#1A3D4D]/60 hover:text-white'
                    }`}
                  >
                    <Award className="w-4 h-4 text-[#F5C748]" />
                    <span>E-Sertifikat</span>
                  </button>

                  <button
                    onClick={() => {
                      onTraineeTabChange('profile');
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                      activeTraineeTab === 'profile'
                        ? 'bg-[#1A3D4D] text-[#F5C748] border-l-4 border-l-[#F5C748] shadow-sm'
                        : 'text-slate-300 hover:bg-[#1A3D4D]/60 hover:text-white'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Edit Profil</span>
                  </button>
                </>
              )}

              {/* MENTOR / EVALUATOR NAV LINKS */}
              {currentRole === 'mentor' && (
                <>
                  <button
                    onClick={() => {
                      onMentorTabChange('dashboard');
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                      activeMentorTab === 'dashboard'
                        ? 'bg-[#1A3D4D] text-[#F5C748] border-l-4 border-l-[#F5C748] shadow-sm'
                        : 'text-slate-300 hover:bg-[#1A3D4D]/60 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-[#F5C748]" />
                    <span>Overview Mentor</span>
                  </button>

                  <button
                    onClick={() => {
                      onMentorTabChange('grading');
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                      activeMentorTab === 'grading'
                        ? 'bg-[#1A3D4D] text-[#F5C748] border-l-4 border-l-[#F5C748] shadow-sm'
                        : 'text-slate-300 hover:bg-[#1A3D4D]/60 hover:text-white'
                    }`}
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>Grading Hub (Antrean)</span>
                  </button>

                  <button
                    onClick={() => {
                      onMentorTabChange('live_session');
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                      activeMentorTab === 'live_session'
                        ? 'bg-[#1A3D4D] text-[#F5C748] border-l-4 border-l-[#F5C748] shadow-sm'
                        : 'text-slate-300 hover:bg-[#1A3D4D]/60 hover:text-white'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Live Session Hub</span>
                  </button>

                  <button
                    onClick={() => {
                      onMentorTabChange('trainees');
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                      activeMentorTab === 'trainees'
                        ? 'bg-[#1A3D4D] text-[#F5C748] border-l-4 border-l-[#F5C748] shadow-sm'
                        : 'text-slate-300 hover:bg-[#1A3D4D]/60 hover:text-white'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Monitoring Peserta</span>
                  </button>
                </>
              )}

              {/* SUPER ADMIN NAV LINKS */}
              {currentRole === 'admin' && (
                <>
                  <button
                    onClick={() => {
                      onAdminTabChange('dashboard');
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                      activeAdminTab === 'dashboard'
                        ? 'bg-[#1A3D4D] text-[#F5C748] border-l-4 border-l-[#F5C748] shadow-sm'
                        : 'text-slate-300 hover:bg-[#1A3D4D]/60 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-[#F5C748]" />
                    <span>Executive Dashboard</span>
                  </button>

                  <button
                    onClick={() => {
                      onAdminTabChange('promotions');
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                      activeAdminTab === 'promotions'
                        ? 'bg-[#1A3D4D] text-[#F5C748] border-l-4 border-l-[#F5C748] shadow-sm'
                        : 'text-slate-300 hover:bg-[#1A3D4D]/60 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approval Promosi</span>
                  </button>

                  <button
                    onClick={() => {
                      onAdminTabChange('batch_cert');
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                      activeAdminTab === 'batch_cert'
                        ? 'bg-[#1A3D4D] text-[#F5C748] border-l-4 border-l-[#F5C748] shadow-sm'
                        : 'text-slate-300 hover:bg-[#1A3D4D]/60 hover:text-white'
                    }`}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>Master Batch & Sertifikat</span>
                  </button>

                  <button
                    onClick={() => {
                      onAdminTabChange('security_audit');
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                      activeAdminTab === 'security_audit'
                        ? 'bg-[#1A3D4D] text-[#F5C748] border-l-4 border-l-[#F5C748] shadow-sm'
                        : 'text-slate-300 hover:bg-[#1A3D4D]/60 hover:text-white'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Audit Logs & Security</span>
                  </button>

                  <button
                    onClick={() => {
                      onAdminTabChange('settings');
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                      activeAdminTab === 'settings'
                        ? 'bg-[#1A3D4D] text-[#F5C748] border-l-4 border-l-[#F5C748] shadow-sm'
                        : 'text-slate-300 hover:bg-[#1A3D4D]/60 hover:text-white'
                    }`}
                  >
                    <Settings className="w-4 h-4 text-[#F5C748]" />
                    <span>Pengaturan System</span>
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer Status & Logout */}
        <div className="p-4 border-t border-[#1A3D4D] bg-[#0a1e28] space-y-2">
          <div className="flex items-center justify-between p-2.5 bg-[#1A3D4D]/80 rounded-xl border border-slate-700/60">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#F5C748] animate-pulse"></span>
              <span className="text-[11px] font-extrabold text-[#F5C748] uppercase tracking-wider">
                System Active
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-400">
              Batch 5 TOT
            </span>
          </div>

          {onLogout && (
            <button
              onClick={() => {
                onLogout();
                onCloseMobile();
              }}
              className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar / Logout</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

