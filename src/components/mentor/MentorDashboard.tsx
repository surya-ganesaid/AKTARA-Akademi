import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Video, 
  BookOpen, 
  Plus, 
  Loader2, 
  X, 
  Calendar, 
  ExternalLink,
  Users,
  Award,
  CheckCircle,
  Clock,
  Radio,
  FileSpreadsheet,
  Star,
  Megaphone,
  HelpCircle,
  Filter,
  Send,
  MessageSquareText
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { supabase } from '../../utils/supabase';

interface BatchOption {
  id: string;
  title: string;
}

interface LiveSession {
  id: string;
  batch_id: string;
  title: string;
  mentor_name: string;
  meet_url: string;
  session_date: string;
  status: string;
}

interface TraineeProfile {
  id: string;
  name: string;
  email: string;
  institution?: string;
  role: string;
  score?: number;
  feedback?: string;
  completed_modules?: number;
  total_modules?: number;
}

interface QuizAnswerItem {
  id: string;
  trainee_name: string;
  trainee_email: string;
  answer: string;
  created_at: string;
  quizzes?: {
    title: string;
  };
}

interface MentorDashboardProps {
  userName: string;
}

export const MentorDashboard: React.FC<MentorDashboardProps> = ({ userName }) => {
  const [activeTab, setActiveTab] = useState<'sessions' | 'trainees' | 'announcements' | 'quizzes'>('sessions');
  const [batches, setBatches] = useState<BatchOption[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'active' | 'lagging'>('all');

  // Data State
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [trainees, setTrainees] = useState<TraineeProfile[]>([]);
  const [quizAnswersList, setQuizAnswersList] = useState<QuizAnswerItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals State
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [liveTitle, setLiveTitle] = useState('');
  const [meetUrl, setMeetUrl] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [savingLive, setSavingLive] = useState(false);

  const [showModuleModal, setShowModuleModal] = useState(false);
  const [modTitle, setModTitle] = useState('');
  const [modDesc, setModDesc] = useState('');
  const [modUrl, setModUrl] = useState('');
  const [modScore, setModScore] = useState(75);
  const [savingMod, setSavingMod] = useState(false);

  const [selectedTrainee, setSelectedTrainee] = useState<TraineeProfile | null>(null);
  const [gradeScore, setGradeScore] = useState<number>(85);
  const [gradeFeedback, setGradeFeedback] = useState<string>('');
  const [savingGrade, setSavingGrade] = useState(false);

  // Broadcast & Quiz Form
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [savingAnn, setSavingAnn] = useState(false);

  const [quizTitle, setQuizTitle] = useState('');
  const [quizQuestion, setQuizQuestion] = useState('');
  const [savingQuiz, setSavingQuiz] = useState(false);

  // Fetch Data
  const loadMentorData = async () => {
    setLoading(true);
    try {
      const { data: batchData } = await supabase.from('batches').select('id, title').order('created_at', { ascending: false });
      if (batchData && batchData.length > 0) {
        setBatches(batchData);
        if (!selectedBatchId) setSelectedBatchId(batchData[0].id);
      }

      const { data: modData } = await supabase.from('lms_modules').select('id');
      const modCount = modData && modData.length > 0 ? modData.length : 4;

      const { data: traineeData } = await supabase.from('profiles').select('*').eq('role', 'trainee');
      
      const mappedTrainees = (traineeData || []).map((t: any, idx: number) => {
        const completed = t.completed_modules ?? Math.min(modCount, idx + 2);
        return {
          ...t,
          score: t.score ?? (idx % 2 === 0 ? 88 : 65),
          feedback: t.feedback || 'Portofolio tugas mandiri dan keaktifan webinar terpantau baik.',
          completed_modules: completed,
          total_modules: modCount
        };
      });

      setTrainees(mappedTrainees);

      // TARIK JAWABAN KUIS DARI SUPABASE
      const { data: ansData } = await supabase.from('quiz_answers').select('*, quizzes(title)').order('created_at', { ascending: false });
      setQuizAnswersList(ansData || []);

      if (selectedBatchId) {
        const { data: sesData } = await supabase.from('live_sessions').select('*').eq('batch_id', selectedBatchId).order('session_date', { ascending: true });
        setSessions(sesData || []);
      }
    } catch (err) {
      console.error('Error mentor data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMentorData();
  }, [selectedBatchId]);

  // Handle Create Live Session
  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveTitle || !selectedBatchId || !meetUrl) return;

    setSavingLive(true);
    try {
      const { error } = await supabase.from('live_sessions').insert([{
        batch_id: selectedBatchId,
        title: liveTitle,
        mentor_name: userName,
        meet_url: meetUrl,
        session_date: sessionDate || new Date().toISOString(),
        status: 'upcoming'
      }]);

      if (error) throw error;

      await supabase.from('audit_logs').insert({
        action: 'CREATE_LIVE_SESSION',
        user_email: 'mentor@aktara.com',
        details: `Mentor ${userName} menambah sesi live: ${liveTitle}`
      });

      setShowLiveModal(false);
      setLiveTitle('');
      setMeetUrl('');
      loadMentorData();
    } catch (err: any) {
      alert(`Gagal membuat sesi: ${err.message}`);
    } finally {
      setSavingLive(false);
    }
  };

  // Handle Create LMS Module
  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modTitle || !selectedBatchId) return;

    setSavingMod(true);
    try {
      const { error } = await supabase.from('lms_modules').insert([{
        batch_id: selectedBatchId,
        title: modTitle,
        description: modDesc,
        resource_url: modUrl,
        passing_score: modScore
      }]);

      if (error) throw error;

      setShowModuleModal(false);
      setModTitle('');
      setModDesc('');
      setModUrl('');
      alert('Modul baru berhasil ditambahkan!');
      loadMentorData();
    } catch (err: any) {
      alert(`Gagal membuat modul: ${err.message}`);
    } finally {
      setSavingMod(false);
    }
  };

  // Handle Submit Grade
  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrainee) return;

    setSavingGrade(true);
    try {
      const { error: profileErr } = await supabase
        .from('profiles')
        .update({
          score: gradeScore,
          feedback: gradeFeedback
        })
        .eq('id', selectedTrainee.id);

      if (profileErr) throw profileErr;

      await supabase.from('audit_logs').insert({
        action: 'GRADE_TRAINEE',
        user_email: 'mentor@aktara.com',
        details: `Mentor ${userName} memberikan nilai ${gradeScore} & feedback kepada ${selectedTrainee.name}`
      });

      setTrainees(prev => prev.map(t => t.id === selectedTrainee.id ? { ...t, score: gradeScore, feedback: gradeFeedback } : t));

      setSelectedTrainee(null);
      alert(`Nilai & umpan balik untuk ${selectedTrainee.name} berhasil disimpan!`);
    } catch (err: any) {
      alert(`Gagal menyimpan penilaian: ${err.message}`);
    } finally {
      setSavingGrade(false);
    }
  };

  // Broadcast Pengumuman
  const handleSendAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent || !selectedBatchId) return;

    setSavingAnn(true);
    try {
      const { error } = await supabase.from('announcements').insert([{
        batch_id: selectedBatchId,
        title: annTitle,
        content: annContent,
        mentor_name: userName
      }]);

      if (error) throw error;

      setAnnTitle('');
      setAnnContent('');
      alert('Broadcast Pengumuman berhasil terkirim ke seluruh Trainee!');
    } catch (err: any) {
      alert(`Gagal mengirim pengumuman: ${err.message}`);
    } finally {
      setSavingAnn(false);
    }
  };

  // Buat Kuis Refleksi
  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTitle || !quizQuestion || !selectedBatchId) return;

    setSavingQuiz(true);
    try {
      const { error } = await supabase.from('quizzes').insert([{
        batch_id: selectedBatchId,
        title: quizTitle,
        question: quizQuestion
      }]);

      if (error) throw error;

      setQuizTitle('');
      setQuizQuestion('');
      alert('Kuis refleksi baru berhasil diterbitkan!');
      loadMentorData();
    } catch (err: any) {
      alert(`Gagal menerbitkan kuis: ${err.message}`);
    } finally {
      setSavingQuiz(false);
    }
  };

  // Filtered Trainees
  const filteredTrainees = trainees.filter(t => {
    const total = t.total_modules || 4;
    const completed = t.completed_modules || 0;
    const pct = (completed / total) * 100;

    if (statusFilter === 'completed') return pct === 100 && (t.score || 0) >= 75;
    if (statusFilter === 'active') return pct >= 50 && pct < 100;
    if (statusFilter === 'lagging') return pct < 50 || (t.score || 0) < 75;
    return true;
  });

  const chartSessionData = [
    { name: 'Akan Datang', total: sessions.filter(s => s.status === 'upcoming').length || 1 },
    { name: 'Sedang Live', total: sessions.filter(s => s.status === 'live').length },
    { name: 'Selesai', total: sessions.filter(s => s.status === 'finished').length },
  ];

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto font-sans space-y-8">
      {/* Banner Master Trainer */}
      <div className="bg-[#0F2C3A] text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg text-[11px] font-bold text-[#F5C748] mb-3 border border-white/10">
              <UserCheck className="w-3.5 h-3.5" />
              Instructor Console
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              Ruang Master Trainer: {userName}
            </h1>
            <p className="text-xs md:text-sm text-gray-300 mt-1 max-w-xl">
              Fasilitasi sesi live, pantau progress bar peserta, siarkan broadcast pengumuman, dan tinjau jawaban kuis refleksi.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setShowLiveModal(true)}
              className="flex items-center gap-2 px-5 py-3 bg-[#F5C748] hover:bg-amber-400 text-[#0F2C3A] text-sm font-black rounded-xl transition cursor-pointer shadow-md"
            >
              <Video className="w-4 h-4" />
              <span>Jadwalkan Live Mentor</span>
            </button>

            <button
              type="button"
              onClick={() => setShowModuleModal(true)}
              className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-xl border border-white/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#F5C748]" />
              <span>Buat Tugas LMS</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI & Chart Dashboard Mentor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Trainee Diampu</p>
              <p className="text-3xl font-black text-[#0F2C3A]">{trainees.length} <span className="text-xs font-normal text-gray-400">Peserta</span></p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status Pengampu</p>
              <p className="text-lg font-black text-green-600">Verified Master Trainer</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0F2C3A] flex items-center gap-2 mb-1">
              <Video className="w-5 h-5 text-[#F5C748]" />
              Rekapitulasi Sesi Live Mentoring
            </h3>
            <p className="text-xs text-gray-400">Status jadwal webinar untuk batch terpilih</p>
          </div>

          <div className="h-40 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartSessionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Bar dataKey="total" fill="#0F2C3A" radius={[6, 6, 0, 0]} name="Total Sesi" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-gray-400 border-t border-gray-100 pt-3">
            <span>Pilih Batch:</span>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-[#0F2C3A]"
            >
              {batches.map((b) => <option key={b.id} value={b.id}>{b.title}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs Mentor */}
      <div className="flex bg-white p-2 rounded-2xl border border-gray-100 shadow-sm gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('sessions')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold rounded-xl transition cursor-pointer ${
            activeTab === 'sessions' ? 'bg-[#0F2C3A] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Video className="w-4 h-4 text-[#F5C748]" />
          <span>Sesi Webinar ({sessions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('trainees')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold rounded-xl transition cursor-pointer ${
            activeTab === 'trainees' ? 'bg-[#0F2C3A] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Users className="w-4 h-4 text-[#F5C748]" />
          <span>Progres & Penilaian ({trainees.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('announcements')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold rounded-xl transition cursor-pointer ${
            activeTab === 'announcements' ? 'bg-[#0F2C3A] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Megaphone className="w-4 h-4 text-[#F5C748]" />
          <span>Broadcast Pengumuman</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('quizzes')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold rounded-xl transition cursor-pointer ${
            activeTab === 'quizzes' ? 'bg-[#0F2C3A] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-[#F5C748]" />
          <span>Kuis & Jawaban Trainee ({quizAnswersList.length})</span>
        </button>
      </div>

      {/* TAB 1: LIST WEBINAR SESSIONS */}
      {activeTab === 'sessions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-full p-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#0F2C3A]" />
              <p className="text-sm font-semibold">Memuat jadwal webinar mentor...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="col-span-full p-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">
              <Video className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p className="text-sm font-bold text-gray-600">Belum ada sesi live yang kamu jadwalkan.</p>
            </div>
          ) : (
            sessions.map((ses) => (
              <div key={ses.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    {ses.status === 'live' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 text-xs font-black rounded-full border border-red-200 animate-pulse">
                        <Radio className="w-3.5 h-3.5" /> LIVE NOW
                      </span>
                    ) : ses.status === 'finished' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
                        <CheckCircle className="w-3.5 h-3.5" /> Selesai
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200">
                        <Clock className="w-3.5 h-3.5" /> Akan Datang
                      </span>
                    )}
                    <span className="text-xs font-bold text-gray-400">{ses.mentor_name}</span>
                  </div>

                  <h3 className="text-base font-bold text-[#0F2C3A] mb-2">{ses.title}</h3>
                  <p className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#F5C748]" />
                    {new Date(ses.session_date).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}
                  </p>
                </div>

                <a
                  href={ses.meet_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0F2C3A] hover:bg-[#183d50] text-white text-xs font-bold rounded-xl transition cursor-pointer mt-2"
                >
                  <ExternalLink className="w-4 h-4 text-[#F5C748]" />
                  <span>Buka Virtual Room (Google Meet/Zoom)</span>
                </a>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: TRAINEE LIST, PROGRESS TRACKING & GRADING */}
      {activeTab === 'trainees' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#0F2C3A]" />
              <span className="text-xs font-bold text-gray-600 uppercase">Filter Keaktifan:</span>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setStatusFilter('all')} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${statusFilter === 'all' ? 'bg-[#0F2C3A] text-white' : 'bg-gray-100 text-gray-600'}`}>Semua ({trainees.length})</button>
              <button type="button" onClick={() => setStatusFilter('completed')} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${statusFilter === 'completed' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700'}`}>Selesai / Lulus</button>
              <button type="button" onClick={() => setStatusFilter('active')} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${statusFilter === 'active' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700'}`}>Sedang Aktif</button>
              <button type="button" onClick={() => setStatusFilter('lagging')} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${statusFilter === 'lagging' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700'}`}>Tertinggal / Remidial</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase">
                  <th className="py-4 px-6">Nama Trainee</th>
                  <th className="py-4 px-6">Progress Modul</th>
                  <th className="py-4 px-6">Nilai Akhir</th>
                  <th className="py-4 px-6">Status Keaktifan</th>
                  <th className="py-4 px-6 text-right">Aksi Penilaian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredTrainees.map((t) => {
                  const total = t.total_modules || 4;
                  const completed = t.completed_modules || 0;
                  const pct = Math.round((completed / total) * 100);
                  const isPassed = (t.score || 0) >= 75;

                  return (
                    <tr key={t.id} className="hover:bg-gray-50/50 transition">
                      <td className="py-4 px-6 font-bold text-[#0F2C3A]">
                        <div>{t.name}</div>
                        <div className="text-[11px] font-normal text-gray-400">{t.email}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="w-36 space-y-1">
                          <div className="flex justify-between text-[11px] font-bold text-gray-600">
                            <span>{completed} dari {total} Modul</span>
                            <span>{pct}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? 'bg-green-500' : pct >= 50 ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-black text-[#0F2C3A]">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-[#F5C748] fill-[#F5C748]" />
                          {t.score || '-'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 text-xs font-extrabold rounded-full border ${pct === 100 && isPassed ? 'bg-green-50 text-green-700 border-green-200' : pct >= 50 ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                          {pct === 100 && isPassed ? 'COMPLETED' : pct >= 50 ? 'ACTIVE' : 'LAGGING BEHIND'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button type="button" onClick={() => { setSelectedTrainee(t); setGradeScore(t.score || 85); setGradeFeedback(t.feedback || ''); }} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0F2C3A] hover:bg-[#183d50] text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-sm">
                          <FileSpreadsheet className="w-3.5 h-3.5 text-[#F5C748]" />
                          <span>Input Nilai</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: BROADCAST PENGUMUMAN */}
      {activeTab === 'announcements' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="p-3 bg-amber-50 border border-amber-200 text-[#F5C748] rounded-2xl">
              <Megaphone className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0F2C3A]">Siarkan Broadcast Pengumuman</h3>
              <p className="text-xs text-gray-500">Kirim pengingat atau informasi penting ke banner atas Portal Trainee.</p>
            </div>
          </div>

          <form onSubmit={handleSendAnnouncement} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Target Batch Pelatihan</label>
              <select value={selectedBatchId} onChange={(e) => setSelectedBatchId(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none">
                {batches.map((b) => <option key={b.id} value={b.id}>{b.title}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Judul Pengumuman *</label>
              <input type="text" placeholder="Contoh: Pengingat Batas Pengumpulan Tugas Portofolio" value={annTitle} onChange={(e) => setAnnTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none" required />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Isi Pesan Broadcast *</label>
              <textarea rows={4} placeholder="Tuliskan instruksi pengumuman secara rinci..." value={annContent} onChange={(e) => setAnnContent(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none" required />
            </div>

            <button type="submit" disabled={savingAnn} className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0F2C3A] hover:bg-[#183d50] text-white text-sm font-bold rounded-xl shadow-md transition cursor-pointer disabled:opacity-50">
              <Send className="w-4 h-4 text-[#F5C748]" />
              <span>{savingAnn ? 'Mengirim...' : 'Siarkan Pengumuman Sekarang'}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: KUIS & DAFTAR JAWABAN TRAINEE */}
      {activeTab === 'quizzes' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Buat Kuis Refleksi */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="p-3 bg-blue-50 border border-blue-200 text-blue-600 rounded-2xl">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F2C3A]">Terbitkan Kuis Refleksi Singkat</h3>
                <p className="text-xs text-gray-500">Buat pertanyaan pemahaman singkat untuk Trainee.</p>
              </div>
            </div>

            <form onSubmit={handleCreateQuiz} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Topik Kuis *</label>
                <input type="text" placeholder="Contoh: Refleksi Sesi Live - Pembelajaran Interaktif" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none" required />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Pertanyaan Kuis / Refleksi *</label>
                <textarea rows={3} placeholder="Contoh: Sebutkan 2 fitur Google Workspace yang paling efektif..." value={quizQuestion} onChange={(e) => setQuizQuestion(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none" required />
              </div>

              <button type="submit" disabled={savingQuiz} className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0F2C3A] hover:bg-[#183d50] text-white text-sm font-bold rounded-xl shadow-md transition cursor-pointer disabled:opacity-50">
                <Plus className="w-4 h-4 text-[#F5C748]" />
                <span>{savingQuiz ? 'Menerbitkan...' : 'Terbitkan Kuis Refleksi'}</span>
              </button>
            </form>
          </div>

          {/* Rekapitulasi Jawaban Masuk dari Trainee */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2 text-[#0F2C3A]">
                <MessageSquareText className="w-5 h-5 text-[#F5C748]" />
                <h3 className="text-base font-bold">Jawaban Trainee Masuk ({quizAnswersList.length})</h3>
              </div>
              <button type="button" onClick={loadMentorData} className="text-xs font-bold text-blue-600 hover:underline">Refresh Data</button>
            </div>

            <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
              {quizAnswersList.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <MessageSquareText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-xs font-semibold">Belum ada jawaban kuis yang masuk dari Trainee.</p>
                </div>
              ) : (
                quizAnswersList.map((ans) => (
                  <div key={ans.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#0F2C3A]">{ans.trainee_name} ({ans.trainee_email})</span>
                      <span className="text-[10px] text-gray-400">{new Date(ans.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-[11px] font-bold text-amber-700">Topik: {ans.quizzes?.title || 'Kuis Refleksi'}</p>
                    <p className="text-xs text-gray-700 bg-white p-3 rounded-lg border border-gray-200 leading-relaxed font-medium">
                      "{ans.answer}"
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      {selectedTrainee && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl relative font-sans">
            <button type="button" onClick={() => setSelectedTrainee(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-1 text-[#0F2C3A]">
              <Star className="w-5 h-5 text-[#F5C748] fill-[#F5C748]" />
              <h3 className="text-lg font-bold">Penilaian & Umpan Balik Trainee</h3>
            </div>
            <p className="text-xs text-gray-500 mb-6">Berikan nilai evaluasi portofolio untuk <span className="font-bold text-[#0F2C3A]">{selectedTrainee.name}</span>.</p>
            <form onSubmit={handleSaveGrade} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Skor Nilai Akhir (0–100) *</label>
                <input type="number" min="0" max="100" value={gradeScore} onChange={(e) => setGradeScore(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm font-bold text-[#0F2C3A] focus:outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Catatan Umpan Balik (Feedback Mentor)</label>
                <textarea rows={3} placeholder="Catatan hasil evaluasi..." value={gradeFeedback} onChange={(e) => setGradeFeedback(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none" />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <button type="button" onClick={() => setSelectedTrainee(null)} className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-bold rounded-xl cursor-pointer">Batal</button>
                <button type="submit" disabled={savingGrade} className="px-5 py-2.5 bg-[#0F2C3A] text-white text-sm font-bold rounded-xl shadow-md disabled:opacity-50 cursor-pointer">{savingGrade ? 'Menyimpan...' : 'Simpan Penilaian'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showLiveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl relative font-sans">
            <button type="button" onClick={() => setShowLiveModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"><X className="w-5 h-5" /></button>
            <h3 className="text-lg font-bold text-[#0F2C3A] mb-1">Jadwalkan Live Mentor</h3>
            <p className="text-xs text-gray-500 mb-6">Atur jadwal webinar Google Meet / Zoom untuk peserta TOT.</p>
            <form onSubmit={handleCreateSession} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Batch Pelatihan</label>
                <select value={selectedBatchId} onChange={(e) => setSelectedBatchId(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none">
                  {batches.map((b) => <option key={b.id} value={b.id}>{b.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Judul Sesi *</label>
                <input type="text" placeholder="Contoh: Mentoring Portofolio & Best Practice" value={liveTitle} onChange={(e) => setLiveTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tautan Virtual Room (Meet/Zoom) *</label>
                <input type="url" placeholder="https://meet.google.com/..." value={meetUrl} onChange={(e) => setMeetUrl(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Waktu & Tanggal</label>
                <input type="datetime-local" value={sessionDate} onChange={(e) => setSessionDate(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none" />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <button type="button" onClick={() => setShowLiveModal(false)} className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-bold rounded-xl cursor-pointer">Batal</button>
                <button type="submit" disabled={savingLive} className="px-5 py-2.5 bg-[#0F2C3A] text-white text-sm font-bold rounded-xl disabled:opacity-50 cursor-pointer">{savingLive ? 'Menyimpan...' : 'Simpan Sesi Live'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModuleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl relative font-sans">
            <button type="button" onClick={() => setShowModuleModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"><X className="w-5 h-5" /></button>
            <h3 className="text-lg font-bold text-[#0F2C3A] mb-1">Buat Modul / Tugas Baru</h3>
            <p className="text-xs text-gray-500 mb-6">Unggah link materi Google Classroom, Drive, atau lembar penugasan.</p>
            <form onSubmit={handleCreateModule} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Judul Modul / Tugas *</label>
                <input type="text" placeholder="Contoh: Tugas Mandiri - Rencana Aksi" value={modTitle} onChange={(e) => setModTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Deskripsi Tugas</label>
                <textarea rows={2} placeholder="Jelaskan instruksi..." value={modDesc} onChange={(e) => setModDesc(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Link Materi / Drive</label>
                  <input type="url" placeholder="https://drive.google.com/..." value={modUrl} onChange={(e) => setModUrl(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Standar KKM</label>
                  <input type="number" value={modScore} onChange={(e) => setModScore(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <button type="button" onClick={() => setShowModuleModal(false)} className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-bold rounded-xl cursor-pointer">Batal</button>
                <button type="submit" disabled={savingMod} className="px-5 py-2.5 bg-[#0F2C3A] text-white text-sm font-bold rounded-xl disabled:opacity-50 cursor-pointer">{savingMod ? 'Menyimpan...' : 'Simpan Modul'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorDashboard;