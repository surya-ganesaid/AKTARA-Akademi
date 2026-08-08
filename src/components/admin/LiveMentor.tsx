import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Plus, 
  Calendar, 
  ExternalLink, 
  Clock, 
  UserCheck, 
  Loader2, 
  X, 
  CheckCircle2, 
  Layers,
  Radio
} from 'lucide-react';
import { supabase } from '../../utils/supabase';

interface LiveSession {
  id: string;
  batch_id: string;
  title: string;
  mentor_name: string;
  meet_url: string;
  session_date: string;
  status: 'upcoming' | 'live' | 'finished' | string;
}

interface BatchOption {
  id: string;
  title: string;
}

export const LiveMentor: React.FC = () => {
  const [batches, setBatches] = useState<BatchOption[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State Modal
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [mentorName, setMentorName] = useState('');
  const [meetUrl, setMeetUrl] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [status, setStatus] = useState('upcoming');
  const [savingLoading, setSavingLoading] = useState(false);

  useEffect(() => {
    const fetchBatches = async () => {
      const { data } = await supabase.from('batches').select('id, title').order('created_at', { ascending: false });
      if (data && data.length > 0) {
        setBatches(data);
        setSelectedBatchId(data[0].id);
      }
    };
    fetchBatches();
  }, []);

  const fetchSessions = async () => {
    if (!selectedBatchId) return;
    setLoading(true);
    const { data } = await supabase
      .from('live_sessions')
      .select('*')
      .eq('batch_id', selectedBatchId)
      .order('session_date', { ascending: true });
    
    setSessions(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchSessions();
  }, [selectedBatchId]);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !selectedBatchId || !meetUrl) return;

    setSavingLoading(true);
    try {
      const { error } = await supabase.from('live_sessions').insert([{
        batch_id: selectedBatchId,
        title,
        mentor_name: mentorName || 'Master Trainer AKTARA',
        meet_url: meetUrl,
        session_date: sessionDate || new Date().toISOString(),
        status
      }]);

      if (error) throw error;

      await supabase.from('audit_logs').insert({
        action: 'CREATE_LIVE_SESSION',
        user_email: 'admin@aktara.com',
        details: `Menambahkan sesi live mentor: ${title}`
      });

      setShowModal(false);
      setTitle('');
      setMentorName('');
      setMeetUrl('');
      setSessionDate('');
      
      fetchSessions();
    } catch (err: any) {
      alert(`Gagal membuat sesi: ${err.message}`);
    } finally {
      setSavingLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto font-sans">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2C3A] flex items-center gap-2">
            <Video className="w-7 h-7 text-[#F5C748]" />
            Jadwal Live Mentor & Webinar TOT
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola sesi pertemuan tatap muka virtual (Google Meet/Zoom) antara Trainee dan Mentor.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0F2C3A] hover:bg-[#183d50] text-white text-sm font-bold rounded-xl transition cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4 text-[#F5C748]" />
          <span>Tambah Sesi Live</span>
        </button>
      </div>

      {/* Filter Batch Selection */}
      <div className="mb-6 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Layers className="w-5 h-5 text-[#0F2C3A]" />
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Batch Pelatihan:</span>
          <select
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-[#0F2C3A] focus:outline-none focus:ring-2 focus:ring-[#0F2C3A]"
          >
            {batches.map((b) => (
              <option key={b.id} value={b.id}>{b.title}</option>
            ))}
          </select>
        </div>

        <div className="text-xs font-bold text-gray-500">
          Total Sesi: <span className="text-[#0F2C3A] text-sm font-black">{sessions.length}</span>
        </div>
      </div>

      {/* Grid List Live Sessions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full p-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#0F2C3A]" />
            <p className="text-sm font-semibold">Memuat jadwal sesi live...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="col-span-full p-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">
            <Video className="w-10 h-10 mx-auto mb-2 text-gray-300" />
            <p className="text-sm font-bold text-gray-600">Belum ada jadwal Live Mentor untuk batch ini.</p>
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
                      <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200">
                      <Clock className="w-3.5 h-3.5" /> Akan Datang
                    </span>
                  )}

                  <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-[#0F2C3A]" />
                    {ses.mentor_name}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#0F2C3A] mb-2">{ses.title}</h3>
                
                <p className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#F5C748]" />
                  {new Date(ses.session_date).toLocaleString('id-ID', {
                    dateStyle: 'full',
                    timeStyle: 'short'
                  })}
                </p>
              </div>

              <a
                href={ses.meet_url}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0F2C3A] hover:bg-[#183d50] text-white text-xs font-bold rounded-xl transition cursor-pointer mt-2"
              >
                <ExternalLink className="w-4 h-4 text-[#F5C748]" />
                <span>Join Virtual Room (Google Meet / Zoom)</span>
              </a>
            </div>
          ))
        )}
      </div>

      {/* Modal Form Tambah Sesi */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl relative font-sans">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-[#0F2C3A] mb-1">Jadwalkan Live Mentor Baru</h3>
            <p className="text-xs text-gray-500 mb-6">Atur jadwal webinar, pemateri, dan tautan virtual room.</p>

            <form onSubmit={handleCreateSession} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Judul Sesi *</label>
                <input
                  type="text"
                  placeholder="Contoh: Mentoring 1 - Mentoring Portofolio & Best Practice"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C3A]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nama Mentor / Pemateri</label>
                <input
                  type="text"
                  placeholder="Contoh: Dr. Kusmawan, M.Pd."
                  value={mentorName}
                  onChange={(e) => setMentorName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C3A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tautan Virtual Room (Meet/Zoom) *</label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/..."
                  value={meetUrl}
                  onChange={(e) => setMeetUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C3A]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Waktu & Tanggal</label>
                  <input
                    type="datetime-local"
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C3A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Status Sesi</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C3A]"
                  >
                    <option value="upcoming">Akan Datang</option>
                    <option value="live">Sedang Live</option>
                    <option value="finished">Selesai</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingLoading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#0F2C3A] hover:bg-[#183d50] text-white text-sm font-bold rounded-xl disabled:opacity-50"
                >
                  {savingLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{savingLoading ? 'Menyimpan...' : 'Simpan Sesi Live'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveMentor;