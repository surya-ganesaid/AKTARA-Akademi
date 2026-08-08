import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  ExternalLink, 
  Loader2, 
  X, 
  GraduationCap,
  Layers,
  Award,
  Video,
  Calendar,
  Clock,
  UserCheck,
  Radio,
  CheckCircle2,
  PieChart as PieIcon,
  BarChart3,
  CheckCircle
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { supabase } from '../../utils/supabase';

interface LmsModule {
  id: string;
  batch_id: string;
  title: string;
  description: string;
  resource_url: string;
  passing_score: number;
}

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

export const LmsIntegration: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'modules' | 'live'>('modules');
  const [batches, setBatches] = useState<BatchOption[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  
  // State Modul LMS
  const [modules, setModules] = useState<LmsModule[]>([]);
  const [loadingModules, setLoadingModules] = useState(true);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [modTitle, setModTitle] = useState('');
  const [modDesc, setModDesc] = useState('');
  const [modUrl, setModUrl] = useState('');
  const [modScore, setModScore] = useState(75);

  // State Live Mentor
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [liveTitle, setLiveTitle] = useState('');
  const [liveMentor, setLiveMentor] = useState('');
  const [liveMeetUrl, setLiveMeetUrl] = useState('');
  const [liveDate, setLiveDate] = useState('');
  const [liveStatus, setLiveStatus] = useState('upcoming');

  const [savingLoading, setSavingLoading] = useState(false);

  // Fetch Batch List
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

  // Fetch Modul & Live Sessions
  const fetchData = async () => {
    if (!selectedBatchId) return;
    
    setLoadingModules(true);
    setLoadingSessions(true);

    const { data: modData } = await supabase.from('lms_modules').select('*').eq('batch_id', selectedBatchId).order('created_at', { ascending: true });
    setModules(modData || []);
    setLoadingModules(false);

    const { data: sesData } = await supabase.from('live_sessions').select('*').eq('batch_id', selectedBatchId).order('session_date', { ascending: true });
    setSessions(sesData || []);
    setLoadingSessions(false);
  };

  useEffect(() => {
    fetchData();
  }, [selectedBatchId]);

  // Handle Tambah Modul
  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modTitle || !selectedBatchId) return;
    setSavingLoading(true);
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
      fetchData();
    } catch (err: any) {
      alert(`Gagal menambah modul: ${err.message}`);
    } finally {
      setSavingLoading(false);
    }
  };

  // Handle Tambah Live Session
  const handleCreateLive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveTitle || !selectedBatchId || !liveMeetUrl) return;
    setSavingLoading(true);
    try {
      const { error } = await supabase.from('live_sessions').insert([{
        batch_id: selectedBatchId,
        title: liveTitle,
        mentor_name: liveMentor || 'Master Trainer AKTARA',
        meet_url: liveMeetUrl,
        session_date: liveDate || new Date().toISOString(),
        status: liveStatus
      }]);

      if (error) throw error;
      setShowLiveModal(false);
      setLiveTitle('');
      setLiveMentor('');
      setLiveMeetUrl('');
      fetchData();
    } catch (err: any) {
      alert(`Gagal membuat sesi live: ${err.message}`);
    } finally {
      setSavingLoading(false);
    }
  };

  // Chart Data Calculations
  const lmsTypeData = [
    { name: 'Modul Teori & Tugas', value: modules.length || 1, color: '#3B82F6' },
    { name: 'Sesi Live Mentor', value: sessions.length || 1, color: '#F5C748' },
  ];

  const scoreDistributionData = modules.length > 0 
    ? modules.map((m, i) => ({
        name: m.title.length > 10 ? `${m.title.substring(0, 10)}...` : m.title,
        kkm: m.passing_score
      }))
    : [
        { name: 'Modul 1', kkm: 75 },
        { name: 'Modul 2', kkm: 80 }
      ];

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto font-sans space-y-8">
      {/* Header Utama */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2C3A] flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-[#F5C748]" />
            Integrasi LMS & Live Mentoring
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola ruang kelas digital, silabus materi, dan jadwal webinar tatap muka virtual.
          </p>
        </div>

        {activeSubTab === 'modules' ? (
          <button
            type="button"
            onClick={() => setShowModuleModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0F2C3A] hover:bg-[#183d50] text-white text-sm font-bold rounded-xl transition cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4 text-[#F5C748]" />
            <span>Tambah Materi LMS</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowLiveModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0F2C3A] hover:bg-[#183d50] text-white text-sm font-bold rounded-xl transition cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4 text-[#F5C748]" />
            <span>Tambah Sesi Live</span>
          </button>
        )}
      </div>

      {/* VISUAL CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0F2C3A] flex items-center gap-2 mb-1">
              <PieIcon className="w-5 h-5 text-[#F5C748]" />
              Komposisi Pembelajaran
            </h3>
            <p className="text-xs text-gray-400">Rasio Modul Mandiri vs Live Mentoring</p>
          </div>
          <div className="h-44 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={lmsTypeData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={4} dataKey="value">
                  {lmsTypeData.map((item, i) => <Cell key={i} fill={item.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-3 text-[11px] font-bold border-t border-gray-100 pt-3">
            {lmsTypeData.map((item, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-gray-600">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0F2C3A] flex items-center gap-2 mb-1">
              <BarChart3 className="w-5 h-5 text-[#0F2C3A]" />
              Grafik Standar Kelulusan (KKM) per Modul
            </h3>
            <p className="text-xs text-gray-400">Batas ambang nilai kelulusan tugas & kuis</p>
          </div>
          <div className="h-44 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDistributionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="kkm" fill="#0F2C3A" radius={[6, 6, 0, 0]} name="Standar KKM" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
            <span className="font-bold text-gray-400">Total Modul: <span className="text-[#0F2C3A] font-black">{modules.length}</span></span>
            <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Standar KKM Nasional (75)</span>
          </div>
        </div>
      </div>

      {/* Filter Batch Selection & Sub Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Layers className="w-5 h-5 text-[#0F2C3A]" />
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Pilih Batch Pelatihan:</span>
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

        {/* Tab Switcher Internal */}
        <div className="flex items-center bg-gray-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveSubTab('modules')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
              activeSubTab === 'modules' ? 'bg-[#0F2C3A] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Modul & Kurikulum ({modules.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('live')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
              activeSubTab === 'live' ? 'bg-[#0F2C3A] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Jadwal Live Mentor ({sessions.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MODUL & KURIKULUM */}
      {activeSubTab === 'modules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loadingModules ? (
            <div className="col-span-full p-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#0F2C3A]" />
              <p className="text-sm font-semibold">Memuat kurikulum LMS...</p>
            </div>
          ) : modules.length === 0 ? (
            <div className="col-span-full p-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">
              <GraduationCap className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p className="text-sm font-bold text-gray-600">Belum ada modul LMS untuk batch ini.</p>
            </div>
          ) : (
            modules.map((mod, idx) => (
              <div key={mod.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-800 text-[10px] font-extrabold rounded-md border border-amber-200 uppercase">
                      MODUL {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-[#F5C748]" /> KKM: {mod.passing_score}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#0F2C3A] mb-2">{mod.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">{mod.description || 'Tidak ada deskripsi.'}</p>
                </div>

                {mod.resource_url && (
                  <a
                    href={mod.resource_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-bold text-[#0F2C3A] rounded-xl transition cursor-pointer mt-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#F5C748]" />
                    <span>Buka Tautan Materi LMS</span>
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: LIVE MENTOR SESSIONS */}
      {activeSubTab === 'live' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loadingSessions ? (
            <div className="col-span-full p-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#0F2C3A]" />
              <p className="text-sm font-semibold">Memuat jadwal live mentoring...</p>
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
                      <UserCheck className="w-3.5 h-3.5 text-[#0F2C3A]" /> {ses.mentor_name}
                    </span>
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
                  <span>Join Virtual Room (Google Meet/Zoom)</span>
                </a>
              </div>
            ))
          )}
        </div>
      )}

      {/* MODAL MODUL */}
      {showModuleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl relative font-sans">
            <button type="button" onClick={() => setShowModuleModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-[#0F2C3A] mb-1">Tambah Materi LMS Baru</h3>
            <p className="text-xs text-gray-500 mb-6">Tambahkan materi, tautan Google Classroom, atau assignment TOT.</p>

            <form onSubmit={handleCreateModule} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Judul Modul *</label>
                <input type="text" value={modTitle} onChange={(e) => setModTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none" required />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Deskripsi Singkat</label>
                <textarea rows={2} value={modDesc} onChange={(e) => setModDesc(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Link LMS / Drive</label>
                  <input type="url" value={modUrl} onChange={(e) => setModUrl(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">KKM</label>
                  <input type="number" value={modScore} onChange={(e) => setModScore(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <button type="button" onClick={() => setShowModuleModal(false)} className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-bold rounded-xl">Batal</button>
                <button type="submit" disabled={savingLoading} className="px-5 py-2.5 bg-[#0F2C3A] text-white text-sm font-bold rounded-xl disabled:opacity-50">
                  {savingLoading ? 'Menyimpan...' : 'Simpan Modul'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL LIVE MENTOR */}
      {showLiveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl relative font-sans">
            <button type="button" onClick={() => setShowLiveModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-[#0F2C3A] mb-1">Jadwalkan Live Mentor Baru</h3>
            <p className="text-xs text-gray-500 mb-6">Atur jadwal webinar, pemateri, dan tautan virtual room.</p>

            <form onSubmit={handleCreateLive} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Judul Sesi *</label>
                <input type="text" value={liveTitle} onChange={(e) => setLiveTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none" required />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nama Pemateri</label>
                <input type="text" value={liveMentor} onChange={(e) => setLiveMentor(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Link Room (Meet/Zoom) *</label>
                <input type="url" value={liveMeetUrl} onChange={(e) => setLiveMeetUrl(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Waktu & Tanggal</label>
                  <input type="datetime-local" value={liveDate} onChange={(e) => setLiveDate(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Status</label>
                  <select value={liveStatus} onChange={(e) => setLiveStatus(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none">
                    <option value="upcoming">Akan Datang</option>
                    <option value="live">Sedang Live</option>
                    <option value="finished">Selesai</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <button type="button" onClick={() => setShowLiveModal(false)} className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-bold rounded-xl">Batal</button>
                <button type="submit" disabled={savingLoading} className="px-5 py-2.5 bg-[#0F2C3A] text-white text-sm font-bold rounded-xl disabled:opacity-50">
                  {savingLoading ? 'Menyimpan...' : 'Simpan Sesi Live'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LmsIntegration;