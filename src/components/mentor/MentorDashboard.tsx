import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Users, 
  Megaphone, 
  HelpCircle, 
  Plus, 
  Search, 
  Loader2, 
  Award, 
  Trash2, 
  Send,
  Edit3,
  ExternalLink,
  RefreshCw,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { supabase } from '../../utils/supabase';

interface MentorDashboardProps {
  userName?: string;
  activeTab?: string;
}

export const MentorDashboard: React.FC<MentorDashboardProps> = ({ 
  userName = 'Mentor Master Trainer',
  activeTab = 'webinars'
}) => {
  const [loading, setLoading] = useState(false);
  const [batches, setBatches] = useState<any[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Master States
  const [liveSessions, setLiveSessions] = useState<any[]>([]);
  const [trainees, setTrainees] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<any[]>([]);

  // Modal States
  const [showAddSessionModal, setShowAddSessionModal] = useState(false);
  const [editingSession, setEditingSession] = useState<any | null>(null);
  
  // Form States
  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionUrl, setSessionUrl] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [announcementText, setAnnouncementText] = useState('');

  // Modal Scoring State
  const [scoringTrainee, setScoringTrainee] = useState<any | null>(null);
  const [inputScore, setInputScore] = useState<number>(75);
  const [inputFeedback, setInputFeedback] = useState<string>('');
  const [savingScore, setSavingScore] = useState(false);

  // Fetch Master Data
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: batchData } = await supabase.from('batches').select('*');
      setBatches(batchData || []);

      const { data: profileData } = await supabase.from('profiles').select('*').order('name', { ascending: true });
      setTrainees(profileData || []);

      const { data: liveData } = await supabase.from('live_sessions').select('*').order('created_at', { ascending: false });
      setLiveSessions(liveData || []);

      const { data: annData } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
      setAnnouncements(annData || []);

      const { data: quizData } = await supabase.from('quiz_answers').select('*').order('created_at', { ascending: false });
      setQuizAnswers(quizData || []);
    } catch (err) {
      console.error('Gagal mengambil data mentor:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Save Webinar
  const handleSaveLiveSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: sessionTitle.trim(),
        meet_url: sessionUrl.trim(),
        scheduled_at: sessionDate.trim(),
        batch_id: selectedBatchId === 'all' ? null : selectedBatchId
      };

      if (editingSession) {
        const { error } = await supabase.from('live_sessions').update(payload).eq('id', editingSession.id);
        if (error) throw error;
        alert('Sesi webinar berhasil diperbarui!');
      } else {
        const { error } = await supabase.from('live_sessions').insert([payload]);
        if (error) throw error;
        alert('Sesi webinar baru berhasil ditambahkan!');
      }

      setShowAddSessionModal(false);
      setEditingSession(null);
      setSessionTitle('');
      setSessionUrl('');
      setSessionDate('');
      fetchData();
    } catch (err: any) {
      alert(`Gagal menyimpan webinar: ${err.message}`);
    }
  };

  // Delete Webinar
  const handleDeleteSession = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus jadwal webinar ini?')) return;
    try {
      const { error } = await supabase.from('live_sessions').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err: any) {
      alert(`Gagal menghapus sesi: ${err.message}`);
    }
  };

  // Post Announcement
  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;

    try {
      const { error } = await supabase.from('announcements').insert([{
        content: announcementText.trim(),
        author: userName,
        batch_id: selectedBatchId === 'all' ? null : selectedBatchId
      }]);

      if (error) throw error;
      alert('Pengumuman berhasil disiarkan!');
      setAnnouncementText('');
      fetchData();
    } catch (err: any) {
      alert(`Gagal menyiarkan pengumuman: ${err.message}`);
    }
  };

  // Delete Announcement
  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Hapus siaran pengumuman ini?')) return;
    try {
      const { error } = await supabase.from('announcements').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err: any) {
      alert(`Gagal menghapus pengumuman: ${err.message}`);
    }
  };

  // Open Modal Scoring
  const handleOpenScoringModal = (trainee: any) => {
    setScoringTrainee(trainee);
    setInputScore(trainee.score || 75);
    setInputFeedback(trainee.feedback || '');
  };

  // Save Score & Feedback
  const handleSaveScoreAndFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scoringTrainee) return;

    setSavingScore(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          score: Number(inputScore),
          feedback: inputFeedback.trim()
        })
        .eq('id', scoringTrainee.id);

      if (error) throw error;

      await supabase.from('audit_logs').insert({
        action: 'GRADE_TRAINEE',
        user_email: 'mentor@aktara.com',
        details: `Mentor memberikan nilai ${inputScore} dan feedback kepada ${scoringTrainee.name}`
      });

      alert(`Nilai & Feedback untuk ${scoringTrainee.name} berhasil disimpan!`);
      setScoringTrainee(null);
      fetchData();
    } catch (err: any) {
      alert(`Gagal menyimpan penilaian: ${err.message}`);
    } finally {
      setSavingScore(false);
    }
  };

  // Export CSV
  const handleExportDataCSV = () => {
    if (trainees.length === 0) {
      alert('Tidak ada data peserta untuk di-export.');
      return;
    }

    const headers = ['Nama Peserta', 'Email', 'Instansi/Sekolah', 'Modul Selesai', 'Nilai KKM', 'Status', 'Feedback'];
    const rows = trainees.map(t => [
      `"${t.name || ''}"`,
      `"${t.email || ''}"`,
      `"${t.institution || ''}"`,
      t.completed_modules || 0,
      t.score || 0,
      (t.score || 0) >= 75 ? 'LULUS KKM' : 'BELUM LULUS',
      `"${t.feedback || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Nilai_AKTARA_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredTrainees = trainees.filter(t => {
    const matchesBatch = selectedBatchId === 'all' || t.batch_id === selectedBatchId;
    const matchesSearch = 
      t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.institution?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesBatch && matchesSearch;
  });

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto font-sans space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0F2C3A] text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-[#F5C748] text-[#0F2C3A] text-[10px] font-black rounded-lg uppercase tracking-wider">
            WORKSPACE MENTOR
          </span>
          <h1 className="text-xl md:text-2xl font-black text-white mt-2">Selamat Datang, {userName}!</h1>
          <p className="text-xs text-gray-300 mt-1">Kelola jadwal webinar, beri penilaian peserta, siarkan pengumuman, dan periksa kuis refleksi.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="bg-white/10 border border-white/10 p-2 rounded-2xl flex items-center gap-2">
            <span className="text-xs font-bold text-gray-300">Batch:</span>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="bg-[#071923] text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/20 focus:outline-none cursor-pointer"
            >
              <option value="all">Semua Batch ({batches.length})</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>{b.title}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={fetchData}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 text-[#F5C748] ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* --- TAB ROUTING --- */}

      {/* 1. SESI WEBINAR */}
      {(activeTab === 'webinars' || activeTab === 'mentor') && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-[#0F2C3A]">Jadwal Sesi Webinar & Mentoring Virtual</h3>
              <p className="text-xs text-gray-500">Atur tautan Google Meet / Zoom dan jadwal live untuk peserta.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingSession(null);
                setSessionTitle('');
                setSessionUrl('');
                setSessionDate('');
                setShowAddSessionModal(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0F2C3A] hover:bg-[#183d50] text-white text-xs font-bold rounded-xl transition cursor-pointer self-start sm:self-auto shadow-md shrink-0"
            >
              <Plus className="w-4 h-4 text-[#F5C748]" />
              <span>Tambah Sesi Webinar</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveSessions.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <Video className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-xs font-semibold">Belum ada jadwal sesi webinar yang ditambahkan.</p>
              </div>
            ) : (
              liveSessions.map((session) => (
                <div key={session.id} className="p-5 bg-gray-50 border border-gray-200 rounded-2xl space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-sm text-[#0F2C3A]">{session.title}</h4>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSession(session);
                          setSessionTitle(session.title);
                          setSessionUrl(session.meet_url);
                          setSessionDate(session.scheduled_at);
                          setShowAddSessionModal(true);
                        }}
                        className="p-1 text-gray-500 hover:text-blue-600 rounded cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSession(session.id)}
                        className="p-1 text-gray-500 hover:text-red-600 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 font-medium">
                    📅 Jadwal: <strong className="text-gray-800">{session.scheduled_at || 'Segera Berlangsung'}</strong>
                  </p>

                  <div>
                    <a
                      href={session.meet_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-bold rounded-xl transition"
                    >
                      <span>Buka Room Live</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 2. PROGRES & PENILAIAN */}
      {activeTab === 'progress' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-[#0F2C3A]">Progres Belajar & Penilaian KKM Trainee</h3>
              <p className="text-xs text-gray-500">Kelola nilai kelulusan KKM (75) dan berikan catatan evaluasi peserta.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari peserta/sekolah..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleExportDataCSV}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 text-xs font-bold rounded-xl transition cursor-pointer shrink-0"
              >
                <FileSpreadsheet className="w-4 h-4 text-green-600" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase">
                  <th className="py-4 px-4 whitespace-nowrap">Nama Peserta Guru</th>
                  <th className="py-4 px-4 whitespace-nowrap">Instansi / Sekolah</th>
                  <th className="py-4 px-4 whitespace-nowrap text-center">Modul Selesai</th>
                  <th className="py-4 px-4 whitespace-nowrap text-center">Nilai KKM (0-100)</th>
                  <th className="py-4 px-4">Feedback / Catatan</th>
                  <th className="py-4 px-4 text-right whitespace-nowrap">Tindakan Mentor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredTrainees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400 font-medium">
                      Tidak ada data peserta yang cocok.
                    </td>
                  </tr>
                ) : (
                  filteredTrainees.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50/50 transition">
                      <td className="py-4 px-4 font-bold text-[#0F2C3A] whitespace-nowrap">
                        <div className="text-xs font-bold">{t.name || 'Tanpa Nama'}</div>
                        <div className="text-[11px] text-gray-400 font-normal">{t.email}</div>
                      </td>
                      <td className="py-4 px-4 text-gray-600 font-medium whitespace-nowrap">
                        {t.institution || '-'}
                      </td>
                      <td className="py-4 px-4 font-extrabold text-blue-600 text-center whitespace-nowrap">
                        {t.completed_modules || 0} Modul
                      </td>
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <span className={`inline-block px-3 py-1 text-[11px] font-black rounded-lg border ${
                          (t.score || 0) >= 75 
                            ? 'bg-green-50 text-green-800 border-green-200' 
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {t.score || 0} / 100
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-500 max-w-xs truncate italic">
                        {t.feedback || 'Belum ada catatan mentor.'}
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenScoringModal(t)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0F2C3A] text-white text-xs font-bold rounded-xl hover:bg-[#183d50] transition cursor-pointer shadow-sm"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#F5C748]" />
                          <span>Beri Nilai & Feedback</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. BROADCAST PENGUMUMAN */}
      {activeTab === 'announcements' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 shadow-sm">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-base font-bold text-[#0F2C3A]">Siarkan Pengumuman Baru</h3>
            <p className="text-xs text-gray-500">Pesan broadcast ini akan langsung muncul di banner atas dashboard peserta.</p>
          </div>

          <form onSubmit={handlePostAnnouncement} className="space-y-3">
            <textarea
              rows={3}
              placeholder="Tuliskan pengumuman resmi untuk peserta TOT..."
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="w-full p-3.5 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F2C3A] font-medium"
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0F2C3A] hover:bg-[#183d50] text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-[#F5C748]" />
                <span>Siarkan Pengumuman</span>
              </button>
            </div>
          </form>

          <div className="space-y-3 pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-700 uppercase">Riwayat Siaran Pengumuman</h4>
            {announcements.length === 0 ? (
              <p className="text-xs text-gray-400 font-medium italic">Belum ada siaran pengumuman.</p>
            ) : (
              announcements.map((ann) => (
                <div key={ann.id} className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-amber-950 font-bold leading-relaxed">{ann.content}</p>
                    <p className="text-[10px] text-amber-800 font-extrabold">
                      Oleh: {ann.author || 'Mentor'} • {new Date(ann.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteAnnouncement(ann.id)}
                    className="p-1.5 text-amber-700 hover:text-red-600 rounded cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 4. KUIS & JAWABAN TRAINEE */}
      {activeTab === 'quizzes' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 shadow-sm">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-base font-bold text-[#0F2C3A]">Hasil Kuis & Jawaban Refleksi Trainee</h3>
            <p className="text-xs text-gray-500">Tinjau jawaban tugas dan refleksi pemahaman modul dari peserta.</p>
          </div>

          <div className="space-y-3">
            {quizAnswers.length === 0 ? (
              <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <HelpCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-xs font-semibold">Belum ada jawaban kuis yang dikirimkan oleh peserta.</p>
              </div>
            ) : (
              quizAnswers.map((q) => (
                <div key={q.id} className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                    <span className="text-xs font-bold text-[#0F2C3A]">{q.user_email}</span>
                    <span className="text-[10px] text-gray-400 font-extrabold">
                      {new Date(q.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 font-medium leading-relaxed">{q.answer_text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL WEBINAR */}
      {showAddSessionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl font-sans space-y-4 relative">
            <button
              type="button"
              onClick={() => setShowAddSessionModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-[#0F2C3A]">
              {editingSession ? 'Edit Sesi Webinar' : 'Tambah Sesi Webinar Baru'}
            </h3>

            <form onSubmit={handleSaveLiveSession} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Judul Sesi Live *</label>
                <input
                  type="text"
                  placeholder="Contoh: Mentoring Modul 1 & SOP Tester"
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 text-xs font-semibold rounded-xl focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tautan Google Meet / Zoom *</label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/xyz-abc"
                  value={sessionUrl}
                  onChange={(e) => setSessionUrl(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 text-xs font-semibold rounded-xl focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Jadwal Pelaksanaan *</label>
                <input
                  type="text"
                  placeholder="Senin, 18 Agustus 2026 - 19.30 WIB"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 text-xs font-semibold rounded-xl focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddSessionModal(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0F2C3A] text-white text-xs font-bold rounded-xl hover:bg-[#183d50] cursor-pointer"
                >
                  Simpan Sesi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PENILAIAN & FEEDBACK */}
      {scoringTrainee && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl font-sans space-y-4 relative">
            <button
              type="button"
              onClick={() => setScoringTrainee(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-200">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0F2C3A]">Form Penilaian Mentor</h3>
                <p className="text-[11px] text-gray-500">{scoringTrainee.name} ({scoringTrainee.email})</p>
              </div>
            </div>

            <form onSubmit={handleSaveScoreAndFeedback} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nilai KKM (0 - 100) *</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={inputScore}
                  onChange={(e) => setInputScore(Number(e.target.value))}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 text-sm font-extrabold text-[#0F2C3A] rounded-xl focus:outline-none"
                  required
                />
                <p className="text-[10px] text-gray-400 mt-1">Nilai minimal 75 untuk membuka unduhan e-Sertifikat peserta.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Catatan Evaluasi / Feedback Mentor</label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan apresiasi atau saran perbaikan..."
                  value={inputFeedback}
                  onChange={(e) => setInputFeedback(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 text-xs font-semibold rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setScoringTrainee(null)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingScore}
                  className="px-5 py-2 bg-[#0F2C3A] text-white text-xs font-bold rounded-xl hover:bg-[#183d50] cursor-pointer disabled:opacity-50"
                >
                  {savingScore ? 'Memproses...' : 'Simpan Nilai & Feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorDashboard;