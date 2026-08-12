import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Video, 
  Award, 
  ExternalLink, 
  Loader2, 
  Clock, 
  UserCheck, 
  Radio, 
  CheckCircle2, 
  Sparkles,
  GraduationCap,
  Megaphone,
  HelpCircle,
  Send,
  Check
} from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { generateCertificatePDF } from '../../utils/certificateGenerator';

interface LmsModule {
  id: string;
  title: string;
  description: string;
  resource_url: string;
  passing_score: number;
}

interface LiveSession {
  id: string;
  title: string;
  mentor_name: string;
  meet_url: string;
  session_date: string;
  status: 'upcoming' | 'live' | 'finished' | string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  mentor_name: string;
  created_at: string;
}

interface QuizItem {
  id: string;
  title: string;
  question: string;
  created_at: string;
}

interface TraineePortalProps {
  userName: string;
  userEmail: string;
  activeTab?: string;
}

export const TraineePortal: React.FC<TraineePortalProps> = ({ userName, userEmail, activeTab = 'modules' }) => {
  const [modules, setModules] = useState<LmsModule[]>([]);
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingCert, setGeneratingCert] = useState(false);

  // Form Kuis Refleksi State
  const [quizAnswers, setQuizAnswers] = useState<{ [quizId: string]: string }>({});
  const [submittingQuiz, setSubmittingQuiz] = useState<{ [quizId: string]: boolean }>({});
  const [submittedQuiz, setSubmittedQuiz] = useState<{ [quizId: string]: boolean }>({});

  useEffect(() => {
    const fetchTraineeData = async () => {
      setLoading(true);
      try {
        const { data: modData } = await supabase.from('lms_modules').select('*').order('created_at', { ascending: true });
        setModules(modData || []);

        const { data: sesData } = await supabase.from('live_sessions').select('*').order('session_date', { ascending: true });
        setSessions(sesData || []);

        const { data: annData } = await supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(2);
        setAnnouncements(annData || []);

        const { data: quizData } = await supabase.from('quizzes').select('*').order('created_at', { ascending: false });
        setQuizzes(quizData || []);
      } catch (err) {
        console.error('Error loading trainee portal data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTraineeData();
  }, []);

  const handleDownloadCertificate = async () => {
    setGeneratingCert(true);
    try {
      await generateCertificatePDF({
        participantName: userName,
        participantInstitution: 'Peserta AKTARA Academy',
        batchTitle: 'TOT Master Trainer AKTARA 2026',
        certificateNumber: `AKTARA/CERT/${Date.now().toString().slice(-6)}`
      });
    } catch (err: any) {
      alert(`Gagal menerbitkan sertifikat: ${err.message}`);
    } finally {
      setGeneratingCert(false);
    }
  };

  const handleSubmitQuizAnswer = async (quizId: string, quizTitle: string) => {
    const answer = quizAnswers[quizId];
    if (!answer || answer.trim() === '') {
      alert('Silakan tuliskan jawaban refleksi Anda sebelum mengirim.');
      return;
    }

    setSubmittingQuiz(prev => ({ ...prev, [quizId]: true }));
    try {
      const { error } = await supabase.from('quiz_answers').insert([{
        quiz_id: quizId,
        trainee_name: userName,
        trainee_email: userEmail,
        answer: answer
      }]);

      if (error) throw error;

      await supabase.from('audit_logs').insert({
        action: 'SUBMIT_QUIZ_ANSWER',
        user_email: userEmail,
        details: `Peserta ${userName} menjawab kuis "${quizTitle}": ${answer}`
      });

      setSubmittedQuiz(prev => ({ ...prev, [quizId]: true }));
      alert('Jawaban refleksi Anda berhasil dikirim ke Mentor!');
    } catch (err: any) {
      alert(`Gagal mengirim jawaban: ${err.message}`);
    } finally {
      setSubmittingQuiz(prev => ({ ...prev, [quizId]: false }));
    }
  };

  // Penyesuaian tab
  const currentTab = activeTab === 'trainee' ? 'modules' : activeTab;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto font-sans space-y-8">
      {/* BANNER BROADCAST PENGUMUMAN DARI MENTOR */}
      {announcements.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm space-y-3">
          {announcements.map((ann) => (
            <div key={ann.id} className="flex items-start gap-3">
              <Megaphone className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-amber-900 uppercase">PENGUMUMAN MENTOR ({ann.mentor_name}):</span>
                  <span className="text-[10px] text-amber-700 font-bold">{ann.title}</span>
                </div>
                <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">{ann.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Banner Header Peserta Guru */}
      <div className="bg-[#0F2C3A] text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg text-[11px] font-bold text-[#F5C748] mb-3 border border-white/10">
              <GraduationCap className="w-3.5 h-3.5" />
              Ruang Belajar Peserta Guru
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              Selamat Belajar, {userName}!
            </h1>
            <p className="text-xs md:text-sm text-gray-300 mt-1 max-w-xl">
              Gunakan menu navigasi di sebelah kiri untuk mengakses modul pelatihan, jadwal live session, kuis refleksi, dan sertifikat.
            </p>
          </div>

          <div className="bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0 text-center md:text-right">
            <p className="text-[11px] font-bold text-gray-400 uppercase">Status Peserta</p>
            <p className="text-lg font-black text-[#F5C748]">AKTIF (Lulus KKM)</p>
          </div>
        </div>
      </div>

      {/* 1. KONTEN MATERI LMS */}
      {(currentTab === 'modules' || currentTab === 'trainee') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-full p-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#0F2C3A]" />
              <p className="text-sm font-semibold">Memuat materi pelatihan...</p>
            </div>
          ) : modules.length === 0 ? (
            <div className="col-span-full p-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">
              <BookOpen className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p className="text-sm font-bold text-gray-600">Belum ada modul yang ditugaskan.</p>
            </div>
          ) : (
            modules.map((mod, idx) => (
              <div key={mod.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:border-[#0F2C3A]/30 transition">
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
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">{mod.description || 'Pelajari materi dan selesaikan tugas sebelum batas waktu.'}</p>
                </div>

                {mod.resource_url && (
                  <a
                    href={mod.resource_url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0F2C3A] hover:bg-[#183d50] text-white text-xs font-bold rounded-xl transition cursor-pointer mt-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#F5C748]" />
                    <span>Buka Tautan Materi & Tugas LMS</span>
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* 2. KONTEN LIVE MENTORING */}
      {currentTab === 'live' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-full p-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#0F2C3A]" />
              <p className="text-sm font-semibold">Memuat jadwal webinar...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="col-span-full p-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">
              <Video className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p className="text-sm font-bold text-gray-600">Belum ada sesi live mendatang.</p>
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
                    <Clock className="w-4 h-4 text-[#F5C748]" />
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

      {/* 3. KONTEN KUIS REFLEKSI */}
      {currentTab === 'quizzes' && (
        <div className="space-y-6">
          {loading ? (
            <div className="p-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#0F2C3A]" />
              <p className="text-sm font-semibold">Memuat daftar kuis refleksi...</p>
            </div>
          ) : quizzes.length === 0 ? (
            <div className="p-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">
              <HelpCircle className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p className="text-sm font-bold text-gray-600">Belum ada kuis refleksi yang diterbitkan oleh Mentor.</p>
            </div>
          ) : (
            quizzes.map((quiz) => {
              const isDone = submittedQuiz[quiz.id];

              return (
                <div key={quiz.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2 text-[#0F2C3A]">
                      <HelpCircle className="w-5 h-5 text-[#F5C748]" />
                      <h3 className="text-base font-bold">{quiz.title}</h3>
                    </div>
                    {isDone ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-xs font-extrabold rounded-full border border-green-200">
                        <Check className="w-3.5 h-3.5" /> TERKIRIM
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-full border border-amber-200">
                        PERLU DIISI
                      </span>
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-700 uppercase mb-1">Pertanyaan Refleksi:</p>
                    <p className="text-sm text-gray-800 bg-gray-50 p-4 rounded-xl border border-gray-100 leading-relaxed font-medium">
                      {quiz.question}
                    </p>
                  </div>

                  {!isDone ? (
                    <div className="space-y-3 pt-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase">Jawaban / Refleksi Anda *</label>
                      <textarea
                        rows={3}
                        placeholder="Tuliskan pemahaman atau refleksi Anda di sini..."
                        value={quizAnswers[quiz.id] || ''}
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, [quiz.id]: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C3A]"
                      />

                      <button
                        type="button"
                        disabled={submittingQuiz[quiz.id]}
                        onClick={() => handleSubmitQuizAnswer(quiz.id, quiz.title)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F2C3A] hover:bg-[#183d50] text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer disabled:opacity-50"
                      >
                        {submittingQuiz[quiz.id] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 text-[#F5C748]" />}
                        <span>{submittingQuiz[quiz.id] ? 'Mengirim...' : 'Kirim Jawaban Refleksi'}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 bg-green-50/60 rounded-xl border border-green-100 text-xs text-green-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                      <span>Terima kasih! Jawaban refleksi Anda sudah terekam dan akan ditinjau oleh Mentor.</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 4. KONTEN E-SERTIFIKAT */}
      {currentTab === 'certificate' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-[#F5C748]">
            <Award className="w-8 h-8 text-amber-600" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-[#0F2C3A]">E-Sertifikat Kelulusan Siap Diterbitkan</h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Selamat! Kamu telah memenuhi seluruh ambang batas KKM pelatihan TOT AKTARA Academy. Silakan unduh sertifikat resmi ber-QR Code verifikasi di bawah ini.
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-1 text-left">
            <p><span className="font-bold text-gray-600">Nama Pemilik:</span> {userName}</p>
            <p><span className="font-bold text-gray-600">Email Terdaftar:</span> {userEmail}</p>
            <p><span className="font-bold text-gray-600">Format:</span> Digital PDF A4 (High Quality Print)</p>
          </div>

          <button
            type="button"
            disabled={generatingCert}
            onClick={handleDownloadCertificate}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0F2C3A] hover:bg-[#183d50] text-white text-sm font-bold rounded-xl transition cursor-pointer shadow-md disabled:opacity-50"
          >
            {generatingCert ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-[#F5C748]" />}
            <span>{generatingCert ? 'Memproses PDF...' : 'Unduh E-Sertifikat PDF Sekarang'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default TraineePortal;