import React, { useState } from 'react';
import { LMSModule, DiscussionComment } from '../../types';
import {
  Play,
  FileText,
  Download,
  MessageSquare,
  CheckCircle2,
  Clock,
  Send,
  BookOpen,
  ChevronRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface LMSModuleViewProps {
  modules: LMSModule[];
  selectedModuleId: number;
  onSelectModule: (id: number) => void;
  onToggleModuleComplete: (id: number) => void;
  onAddComment: (moduleId: number, text: string) => void;
}

export const LMSModuleView: React.FC<LMSModuleViewProps> = ({
  modules,
  selectedModuleId,
  onSelectModule,
  onToggleModuleComplete,
  onAddComment
}) => {
  const currentModule = modules.find((m) => m.id === selectedModuleId) || modules[0];
  const [activeSubTab, setActiveSubTab] = useState<'desc' | 'resources' | 'qna'>('desc');
  const [newCommentText, setNewCommentText] = useState('');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    onAddComment(currentModule.id, newCommentText);
    setNewCommentText('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#0F2C3A] font-bold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4 text-[#F5C748]" />
            <span>Learning Management System (LMS)</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {currentModule.title}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {currentModule.subtitle} • <span className="text-slate-700 font-semibold">{currentModule.duration}</span>
          </p>
        </div>

        {/* Completion Action */}
        <button
          onClick={() => onToggleModuleComplete(currentModule.id)}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shadow-sm ${
            currentModule.status === 'completed'
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-[#F5C748] hover:bg-[#e2b53b] text-[#0F2C3A]'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>
            {currentModule.status === 'completed'
              ? 'Status: Selesai Dibaca & Ditonton'
              : 'Tandai Selesai & Lanjut Modul'}
          </span>
        </button>
      </div>

      {/* Grid: Main Video Player & Sidebar Module List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Player & Sub-Tabs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Video Player Box */}
          <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-800 relative group">
            <div className="aspect-video relative bg-slate-950 flex items-center justify-center">
              {!isVideoPlaying ? (
                <div className="relative w-full h-full bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/40"></div>
                  
                  <div className="relative z-10 space-y-4 max-w-lg">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#F5C748]/20 text-[#F5C748] text-[11px] font-bold tracking-wider uppercase border border-[#F5C748]/30">
                      Video Pembalajaran LMS AKTARA
                    </span>
                    <h3 className="text-lg font-extrabold text-white">
                      {currentModule.title}
                    </h3>

                    <button
                      onClick={() => setIsVideoPlaying(true)}
                      className="w-16 h-16 mx-auto rounded-full bg-[#F5C748] hover:bg-white text-[#0F2C3A] flex items-center justify-center shadow-2xl transition-transform transform hover:scale-110"
                    >
                      <Play className="w-8 h-8 fill-current ml-1" />
                    </button>
                    
                    <p className="text-xs text-slate-300">
                      Klik untuk memulai pemutaran materi video pembelajaran
                    </p>
                  </div>
                </div>
              ) : (
                <iframe
                  className="w-full h-full"
                  src={`${currentModule.videoUrl}?autoplay=1`}
                  title={currentModule.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          </div>

          {/* Sub-Tabs: Deskripsi, Resource File Kit, QnA */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex border-b border-slate-200 bg-slate-50">
              <button
                onClick={() => setActiveSubTab('desc')}
                className={`flex-1 py-3 px-4 text-xs font-bold transition flex items-center justify-center space-x-2 border-b-2 ${
                  activeSubTab === 'desc'
                    ? 'border-[#0F2C3A] text-[#0F2C3A] bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Deskripsi Modul</span>
              </button>

              <button
                onClick={() => setActiveSubTab('resources')}
                className={`flex-1 py-3 px-4 text-xs font-bold transition flex items-center justify-center space-x-2 border-b-2 ${
                  activeSubTab === 'resources'
                    ? 'border-[#0F2C3A] text-[#0F2C3A] bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Resource File Kit ({currentModule.resources.length})</span>
              </button>

              <button
                onClick={() => setActiveSubTab('qna')}
                className={`flex-1 py-3 px-4 text-xs font-bold transition flex items-center justify-center space-x-2 border-b-2 ${
                  activeSubTab === 'qna'
                    ? 'border-[#0F2C3A] text-[#0F2C3A] bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Diskusi & QnA ({currentModule.discussions.length})</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeSubTab === 'desc' && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900">
                    Mengenai Modul Pembelajaran Ini
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {currentModule.description}
                  </p>
                  
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                    <span className="text-xs font-bold text-[#0F2C3A] block">
                      📌 Capaian Pembelajaran Modul Ini:
                    </span>
                    <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                      <li>Memahami kerangka pedagogik integrasi AI secara etis dan konstruktif.</li>
                      <li>Menguasai pembuatan prompt terstruktur (Role, Task, Context, Constraint).</li>
                      <li>Mampu mengunduh dan mengadaptasi berkas file kit untuk RPP di sekolah masing-masing.</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeSubTab === 'resources' && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 mb-2">
                    Berkas Panduan & Template Praktik (File Kit)
                  </h4>
                  
                  {currentModule.resources.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Tidak ada berkas tambahan untuk modul ini.</p>
                  ) : (
                    currentModule.resources.map((res) => (
                      <div
                        key={res.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100 transition flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-lg bg-[#0F2C3A] text-[#F5C748] flex items-center justify-center font-bold text-xs uppercase">
                            {res.type}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{res.name}</p>
                            <p className="text-[10px] text-slate-500">{res.size} • Format Resmi AKTARA</p>
                          </div>
                        </div>

                        <a
                          href={res.url}
                          download
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`Mengunduh berkas: ${res.name}`);
                          }}
                          className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-lg transition flex items-center space-x-1.5 shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5 text-[#0F2C3A]" />
                          <span>Unduh File</span>
                        </a>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeSubTab === 'qna' && (
                <div className="space-y-6">
                  {/* Comments Feed */}
                  <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                    {currentModule.discussions.length === 0 ? (
                      <p className="text-xs text-slate-400 italic text-center py-4">
                        Belum ada pertanyaan. Jadilah yang pertama bertanya tentang modul ini!
                      </p>
                    ) : (
                      currentModule.discussions.map((comment) => (
                        <div key={comment.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <img
                                src={comment.avatar}
                                alt={comment.author}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                              <span className="text-xs font-bold text-slate-900">{comment.author}</span>
                              <span
                                className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                  comment.role === 'Mentor'
                                    ? 'bg-[#0F2C3A] text-[#F5C748]'
                                    : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {comment.role}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400">{comment.time}</span>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed pl-8">
                            {comment.text}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Comment Input */}
                  <form onSubmit={handleCommentSubmit} className="flex gap-2 pt-2 border-t border-slate-100">
                    <input
                      type="text"
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Tuliskan pertanyaan atau tanggapan diskusi..."
                      className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F2C3A] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#0F2C3A] text-[#F5C748] font-bold text-xs rounded-xl hover:bg-[#163f52] transition flex items-center space-x-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Module Navigator */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Daftar Modul Pembelajaran (LMS)
            </h3>

            <div className="space-y-2">
              {modules.map((m) => {
                const isSelected = m.id === selectedModuleId;
                const isCompleted = m.status === 'completed';
                const isLocked = m.status === 'locked';

                return (
                  <button
                    key={m.id}
                    onClick={() => !isLocked && onSelectModule(m.id)}
                    disabled={isLocked}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#0F2C3A] text-white border-[#0F2C3A] shadow-md'
                        : isCompleted
                        ? 'bg-emerald-50/60 border-emerald-200 text-slate-800 hover:bg-emerald-100/50'
                        : isLocked
                        ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                        : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                          isSelected
                            ? 'bg-[#F5C748] text-[#0F2C3A]'
                            : isCompleted
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {m.id}
                      </span>
                      <span className="text-xs font-bold line-clamp-1">{m.title}</span>
                    </div>

                    {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
