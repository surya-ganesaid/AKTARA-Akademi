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
  Check,
  Lock,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { generateCertificatePDF } from '../../utils/certificateGenerator';

interface LmsModule {
  id: string;
  title: string;
  description: string;
  resource_url: string;
  passing_score: number;
  batch_id?: string;
}

interface LiveSession {
  id: string;
  title: string;
  mentor_name: string;
  meet_url: string;
  session_date: string;
  status: 'upcoming' | 'live' | 'finished' | string;
  batch_id?: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  mentor_name: string;
  created_at: string;
  batch_id?: string;
}

interface QuizItem {
  id: string;
  title: string;
  question: string;
  created_at: string;
  batch_id?: string;
}

interface TraineeProfile {
  score: number;
  feedback: string;
  institution: string;
  batch_id: string | null;
}

interface TraineePortalProps {
  userName: string;
  userEmail: string;
  activeTab?: string;
}

export const TraineePortal: React.FC<TraineePortalProps> = ({ userName, userEmail, activeTab = 'modules' }) => {
  const [modules, setModules] = useState<LmsModule[]>([]);
  const [completedModuleIds, setCompletedModuleIds] = useState<string[]>([]);
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [traineeProfile, setTraineeProfile] = useState<TraineeProfile>({ score: 0, feedback: '', institution: 'Peserta AKTARA', batch_id: null });
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
        const emailLower = userEmail.trim().toLowerCase();

        // 1. Fetch Profil Trainee & batch_id miliknya
        const { data: profData } = await supabase
          .from('profiles')
          .select('score, feedback, institution, batch_id')
          .eq('email', emailLower)
          .maybeSingle();

        const userBatchId = profData?.batch_id || null;

        if (profData) {
          setTraineeProfile({
            score: profData.score || 0,
            feedback: profData.feedback || 'Progres pengerjaan modul terpantau di sistem.',
            institution: profData.institution || 'Peserta AKTARA Academy',
            batch_id: userBatchId
          });
        }

        // 2. Fetch Modul LMS (Filter berdasarkan batch_id jika ada)
        let modQuery = supabase.from('lms_modules').select('*').order('created_at', { ascending: true });
        if (userBatchId) {
          modQuery = modQuery.or(`batch_id.eq.${userBatchId},batch_id.is.null`);
        }
        const { data: modData } = await modQuery;
        setModules(modData || []);

        // 3. Fetch Modul Selesai dari Supabase
        const { data: progData } = await supabase
          .from('trainee_module_progress')
          .select('module_id')
          .eq('user_email', emailLower);
        
        if (progData) {
          setCompletedModuleIds(progData.map(p => p.module_id));
        }

        // 4. Fetch Live Sessions (Filter berdasarkan batch_id)
        let sesQuery = supabase.from('live_sessions').select('*').order('session_date', { ascending: true });
        if (userBatchId) {
          sesQuery = sesQuery.or(`batch_id.eq.${userBatchId},batch_id.is.null`);
        }
        const { data: sesData } = await sesQuery;
        setSessions(sesData || []);

        // 5. Fetch Announcements (Filter berdasarkan batch_id)
        let annQuery = supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(2);
        if (userBatchId) {
          annQuery = annQuery.or(`batch_id.eq.${userBatchId},batch_id.is.null`);
        }
        const { data: annData } = await annQuery;
        setAnnouncements(annData || []);

        // 6. Fetch Quizzes (Filter berdasarkan batch_id)
        let quizQuery = supabase.from('quizzes').select('*').order('created_at', { ascending: false });
        if (userBatchId) {
          quizQuery = quizQuery.or(`batch_id.eq.${userBatchId},batch_id.is.null`);
        }
        const { data: quizData } = await quizQuery;
        setQuizzes(quizData || []);

        // 7. Fetch Riwayat Jawaban Kuis yang Pernah Dikirim Peserta Ini
        const { data: userAnsData } = await supabase
          .from('quiz_answers')
          .select('quiz_id')
          .eq('trainee_email', emailLower);

        if (userAnsData) {
          const doneMap: { [quizId: string]: boolean } = {};
          userAnsData.forEach(ans => {
            doneMap[ans.quiz_id] = true;
          });
          setSubmittedQuiz(doneMap);
        }

      } catch (err) {
        console.error('Error loading trainee portal data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTraineeData();
  }, [userEmail]);

  // Menandai modul selesai saat dibuka
  const handleOpenModuleResource = async (moduleId: string, resourceUrl: string, moduleTitle: string) => {
    window.open(resourceUrl, '_blank', 'noopener,noreferrer');

    if (!completedModuleIds.includes(moduleId)) {
      try {
        const emailLower = userEmail.trim().toLowerCase();
        await supabase.from('trainee_module_progress').upsert([{
          user_email: emailLower,
          module_id: moduleId
        }], { onConflict: 'user_email,module_id' });

        const newCompleted = [...completedModuleIds, moduleId];
        setCompletedModuleIds(newCompleted);

        await supabase
          .from('profiles')
          .update({ completed_modules: newCompleted.length })
          .eq('email', emailLower);

        await supabase.from('audit_logs').insert({
          action: 'COMPLETE_LMS_MODULE',
          user_email: userEmail,
          details: `Peserta ${userName} menyelesaikan modul LMS: "${moduleTitle}"`
        });
      } catch (err) {
        console.error('Gagal memperbarui progres modul:', err);
      }
    }
  };

  // Unduh Sertifikat
  const handleDownloadCertificate = async () => {
    if (traineeProfile.score < 75) {
      alert('Maaf, nilai Anda belum memenuhi KKM (minimal 75). Silakan hubungi Mentor Anda.');
      return;
    }

    setGeneratingCert(true);
    try {
      const certNum = `AKTARA/CERT/${Date.now().toString().slice(-6)}`;
      
      await generateCertificatePDF({
        participantName: userName,
        participantInstitution: traineeProfile.institution || 'Peserta AKTARA Academy',
        batchTitle: 'TOT Master Trainer AKTARA 2026',
        certificateNumber: certNum
      });

      await supabase.from('audit_logs').insert({
        action: 'DOWNLOAD_CERTIFICATE',
        user_email: userEmail,
        details: `Peserta ${userName} mendownload e-Sertifikat (${certNum}) dengan nilai ${traineeProfile.score}`
      });
    } catch (err: any) {
      alert(`Gagal menerbitkan sertifikat: ${err.message}`);
    } finally {
      setGeneratingCert(false);
    }
  };

  // Submit Kuis
  const handleSubmitQuizAnswer = async (quizId: string, quizTitle: string) => {
    const answer = quizAnswers[quizId];
    if (!answer || answer.trim() === '') {
      alert('Silakan tuliskan jawaban refleksi Anda sebelum mengirim.');
      return;
    }

    setSubmittingQuiz(prev => ({ ...prev, [quizId]: true }));
    try {
      const emailLower = userEmail.trim().toLowerCase();
      const { error } = await supabase.from('quiz_answers').insert([{
        quiz_id: quizId,
        trainee_name: userName,
        trainee_email: emailLower,
        answer: answer
      }]);

      if (error) throw error;

      await supabase.from('audit_logs').insert({
        action: 'SUBMIT_QUIZ_ANSWER',
        user_email: emailLower,
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

  const currentTab = activeTab === 'trainee' ? 'modules' : activeTab;
  const progressPct = modules.length > 0 ? Math.round((completedModuleIds.length / modules.length) * 100) : 0;
  const isEligibleForCert = traineeProfile.score >= 75;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto font-sans space-y-8">
      {/* BANNER PENGUMUMAN DARI MENTOR */}
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
              Progres Pembelajaran Anda: <span className="font-bold text-[#F5C748]">{completedModuleIds.length} dari {modules.length} Modul Selesai ({progressPct}%)</span>
            </p>
          </div>

          <div className="bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0 text-center md:text-right">
            <p className="text-[11px] font-bold text-gray-400 uppercase">Nilai Akhir (KKM: 75)</p>
            <p className={`text-lg font-black ${isEligibleForCert ? 'text-green-400' : 'text-[#F5C748]'}`}>
              {traineeProfile.score > 0 ? `${traineeProfile.score} / 100` : 'Belum Dinilai'}
            </p>
          </div>
        </div>
      </div>

      {/* 1. MATERI LMS */}
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
              <p className="text-sm font-bold text-gray-600">Belum ada modul yang ditugaskan untuk batch Anda.</p>
            </div>
          ) : (
            modules.map((mod, idx) => {
              const isCompleted = completedModuleIds.includes(mod.id);

              return (
                <div key={mod.id} className={`bg-white p-6 rounded-2xl border shadow-sm flex flex-col justify-between transition ${isCompleted ? 'border-green-300 bg-green-50/20' : 'border-gray-100 hover:border-[#0F2C3A]/30'}`}>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-800 text-[10px] font-extrabold rounded-md border border-amber-200 uppercase">
                        MODUL {idx + 1}
                      </span>
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> SELESAI
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-[#F5C748]" /> KKM: {mod.passing_score}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-[#0F2C3A] mb-2">{mod.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed mb-4">{mod.description || 'Pelajari materi dan selesaikan tugas sebelum batas waktu.'}</p>
                  </div>

                  {mod.resource_url && (
                    <button
                      type="button"
                      onClick={() => handleOpenModuleResource(mod.id, mod.resource_url, mod.title)}
                      className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer mt-2 ${
                        isCompleted 
                          ? 'bg-green-700 hover:bg-green-800 text-white' 
                          : 'bg-[#0F2C3A] hover:bg-[#183d50] text-white'
                      }`}
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#F5C748]" />
                      <span>{isCompleted ? 'Pelajari Ulang Materi LMS (Selesai)' : 'Buka Tautan Materi & Tandai Selesai'}</span>
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 2. LIVE MENTORING */}
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
              <p className="text-sm font-bold text-gray-600">Belum ada sesi live mendatang untuk batch Anda.</p>
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

      {/* 3. KUIS REFLEKSI */}
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

      {/* 4. E-SERTIFIKAT */}
      {currentTab === 'certificate' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center max-w-2xl mx-auto space-y-6">
          <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mx-auto ${isEligibleForCert ? 'bg-amber-50 border-amber-200 text-[#F5C748]' : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
            {isEligibleForCert ? <Award className="w-8 h-8 text-amber-600" /> : <Lock className="w-8 h-8 text-gray-400" />}
          </div>

          <div>
            <h3 className="text-xl font-bold text-[#0F2C3A]">
              {isEligibleForCert ? 'E-Sertifikat Kelulusan Siap Diterbitkan' : 'E-Sertifikat Terkunci (Belum Memenuhi KKM)'}
            </h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              {isEligibleForCert 
                ? 'Selamat! Nilai evaluasi portofolio Anda telah memenuhi KKM (minimal 75). Silakan unduh sertifikat resmi ber-QR Code di bawah ini.'
                : 'Sertifikat kelulusan hanya dapat diklaim jika Anda telah mendapatkan nilai evaluasi dari Mentor dengan skor minimal 75/100.'}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-2 text-left">
            <div className="flex justify-between border-b border-gray-200/60 pb-1.5">
              <span className="font-bold text-gray-600">Nama Pemilik:</span>
              <span className="font-bold text-[#0F2C3A]">{userName}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200/60 pb-1.5">
              <span className="font-bold text-gray-600">Instansi:</span>
              <span className="font-bold text-[#0F2C3A]">{traineeProfile.institution}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200/60 pb-1.5">
              <span className="font-bold text-gray-600">Nilai Evaluasi Mentor:</span>
              <span className={`font-black ${isEligibleForCert ? 'text-green-600' : 'text-amber-600'}`}>
                {traineeProfile.score > 0 ? `${traineeProfile.score} / 100` : 'Belum Ada Nilai'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-gray-600">Status KKM (75):</span>
              <span className={`font-black ${isEligibleForCert ? 'text-green-600' : 'text-red-600'}`}>
                {isEligibleForCert ? 'LULUS (ELIGIBLE)' : 'BELUM LULUS'}
              </span>
            </div>
          </div>

          {isEligibleForCert ? (
            <button
              type="button"
              disabled={generatingCert}
              onClick={handleDownloadCertificate}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0F2C3A] hover:bg-[#183d50] text-white text-sm font-bold rounded-xl transition cursor-pointer shadow-md disabled:opacity-50"
            >
              {generatingCert ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-[#F5C748]" />}
              <span>{generatingCert ? 'Memproses PDF...' : 'Unduh E-Sertifikat PDF Sekarang'}</span>
            </button>
          ) : (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center gap-3 text-left">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                <strong>Catatan Mentor:</strong> "{traineeProfile.feedback || 'Selesaikan modul dan kuis refleksi Anda agar Mentor dapat memberikan nilai.'}"
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TraineePortal;