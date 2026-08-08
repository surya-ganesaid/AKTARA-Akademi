import React from 'react';
import { LMSModule, LiveSession, TraineeTask, TraineeTab } from '../../types';
import {
  Sparkles,
  BookOpen,
  Calendar,
  CheckCircle2,
  Lock,
  ArrowRight,
  ExternalLink,
  Award,
  AlertCircle,
  FileText,
  Clock,
  ChevronRight
} from 'lucide-react';

interface TraineeDashboardProps {
  userName: string;
  modules: LMSModule[];
  tasks: TraineeTask[];
  liveSessions: LiveSession[];
  onNavigateTab: (tab: TraineeTab) => void;
  onSelectModule: (moduleId: number) => void;
}

export const TraineeDashboard: React.FC<TraineeDashboardProps> = ({
  userName,
  modules,
  tasks,
  liveSessions,
  onNavigateTab,
  onSelectModule
}) => {
  const completedCount = modules.filter((m) => m.status === 'completed').length;
  const progressPercent = Math.round((completedCount / modules.length) * 100);
  const activeModule = modules.find((m) => m.status === 'active') || modules[0];
  const activeSession = liveSessions.find((s) => s.status === 'live') || liveSessions[0];
  const pendingRevisionTask = tasks.find((t) => t.status === 'perlu_revisi');

  return (
    <div className="space-y-6">
      
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-[#0F2C3A] via-[#163f52] to-[#0F2C3A] rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[#F5C748]/10 blur-2xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#F5C748]/20 text-[#F5C748] text-xs font-bold mb-3 border border-[#F5C748]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Program TOT Facilitator Master • Batch 5</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Selamat Datang, {userName}! 👋
            </h1>
            <p className="text-sm text-slate-200 mt-2 max-w-2xl leading-relaxed">
              Anda sedang menyelesaikan sertifikasi nasional Trainer of Trainers AKTARA. Selesaikan 5 modul kompetensi dan unggah portofolio digital untuk menerbitkan e-sertifikat terverifikasi.
            </p>
          </div>

          {/* Quick Stat Counter */}
          <div className="flex items-center gap-3 bg-[#0a1e28]/80 p-4 rounded-xl border border-slate-700">
            <div className="text-center px-3 border-r border-slate-700">
              <span className="text-2xl font-black text-[#F5C748]">{completedCount}/5</span>
              <span className="text-[10px] text-slate-300 block uppercase font-medium">Modul Selesai</span>
            </div>
            <div className="text-center px-3">
              <span className="text-2xl font-black text-emerald-400">88.5</span>
              <span className="text-[10px] text-slate-300 block uppercase font-medium">Rata-Rata Nilai</span>
            </div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="mt-6 pt-6 border-t border-slate-700/80">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-slate-200 flex items-center space-x-2">
              <span>Progres Kelulusan Total</span>
              <span className="text-[#F5C748]">({progressPercent}%)</span>
            </span>
            <span className="text-slate-300">Target minimal: 100% Modul + Portofolio</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3 p-0.5 border border-slate-700">
            <div
              className="bg-gradient-to-r from-[#F5C748] to-[#f8d87a] h-2 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Warning Alert Banner (If Task Needs Revision) */}
      {pendingRevisionTask && (
        <div className="bg-amber-50 border-l-4 border-[#C68E28] rounded-xl p-4 shadow-sm flex items-start justify-between gap-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-[#C68E28] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Perhatian: Catatan Revisi Tugas Portofolio
              </h4>
              <p className="text-xs text-amber-800 mt-1">
                Tugas <span className="font-semibold">"{pendingRevisionTask.title}"</span> membutuhkan penyesuaian dari Mentor. Silakan periksa catatan dan unggah ulang berkas revisi Anda.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('tasks')}
            className="px-3.5 py-1.5 bg-[#C68E28] hover:bg-[#a87820] text-white font-bold text-xs rounded-lg transition whitespace-nowrap flex items-center space-x-1"
          >
            <span>Perbaiki Sekarang</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Grid: Live Session Widget & Active Module Launch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Live Session Google Meet Widget */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-extrabold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                <span>Live Sesi Google Meet</span>
              </span>
              <Calendar className="w-4 h-4 text-slate-400" />
            </div>

            <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
              {activeSession.title}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Instruktur: <span className="font-semibold text-slate-800">{activeSession.trainer}</span>
            </p>

            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Jadwal:</span>
                <span className="font-bold text-slate-800">{activeSession.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Waktu:</span>
                <span className="font-bold text-[#0F2C3A]">{activeSession.time}</span>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <a
              href={activeSession.meetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center space-x-2"
            >
              <span>Gabung Sesi Live (Google Meet)</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Active Module Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase tracking-wider">
                Modul Berjalan Sekarang
              </span>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>

            <h3 className="text-base font-bold text-slate-900 mt-1">
              {activeModule.title}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {activeModule.subtitle} • <span className="text-[#0F2C3A] font-semibold">{activeModule.duration}</span>
            </p>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed line-clamp-2">
              {activeModule.description}
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              <span className="font-bold text-slate-900">{activeModule.resources.length}</span> Berkas Modul & Kit Pembelajaran
            </div>
            <button
              onClick={() => {
                onSelectModule(activeModule.id);
                onNavigateTab('lms');
              }}
              className="px-4 py-2 bg-[#0F2C3A] hover:bg-[#153e52] text-[#F5C748] font-bold text-xs rounded-xl transition flex items-center space-x-2 shadow-sm"
            >
              <span>Buka Modul Belajar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Module Timeline Roadmap */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-extrabold text-[#0F2C3A]">
              Alur Sertifikasi & Timeline Modul Belajar
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Selesaikan modul secara berurutan untuk membuka akses uji portofolio
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('lms')}
            className="text-xs font-bold text-[#0F2C3A] hover:underline flex items-center space-x-1"
          >
            <span>Lihat Semua LMS</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {modules.map((module) => {
            const isCompleted = module.status === 'completed';
            const isActive = module.status === 'active';
            const isLocked = module.status === 'locked';

            return (
              <div
                key={module.id}
                onClick={() => {
                  if (!isLocked) {
                    onSelectModule(module.id);
                    onNavigateTab('lms');
                  }
                }}
                className={`p-4 rounded-xl border transition-all duration-200 flex items-center justify-between gap-4 cursor-pointer ${
                  isCompleted
                    ? 'bg-slate-50 border-slate-200 hover:border-emerald-300'
                    : isActive
                    ? 'bg-blue-50/50 border-blue-300 ring-2 ring-blue-500/20 shadow-sm'
                    : 'bg-slate-100/60 border-slate-200 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isActive
                        ? 'bg-[#0F2C3A] text-[#F5C748]'
                        : 'bg-slate-300 text-slate-600'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : isLocked ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      module.id
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      {module.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {module.subtitle} • <span className="text-slate-700">{module.duration}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : isActive
                        ? 'bg-blue-100 text-blue-800 animate-pulse'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isCompleted ? 'Selesai' : isActive ? 'Sedang Berjalan' : 'Terkunci'}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
