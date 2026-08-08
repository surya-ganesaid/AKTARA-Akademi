import React, { useState } from 'react';
import { TraineeTask } from '../../types';
import {
  FileCheck2,
  Upload,
  Link,
  Video,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  Send,
  MessageSquare,
  HelpCircle,
  FileUp
} from 'lucide-react';

interface TugasPortofolioProps {
  tasks: TraineeTask[];
  onSubmitNewTask: (newTask: Partial<TraineeTask>) => void;
}

export const TugasPortofolio: React.FC<TugasPortofolioProps> = ({ tasks, onSubmitNewTask }) => {
  const [submissionType, setSubmissionType] = useState<'file' | 'drive' | 'video'>('file');
  const [selectedModule, setSelectedModule] = useState('Modul 4: Integrasi AI & Portofolio');
  const [taskTitle, setTaskTitle] = useState('RPP Berbasis AI & Modul Ajar Interaktif (Revisi)');
  const [driveUrl, setDriveUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isSuccessToast, setIsSuccessToast] = useState(false);

  const pendingRevisionTask = tasks.find((t) => t.status === 'perlu_revisi');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fileName =
      submissionType === 'file'
        ? uploadedFileName || 'RPP_Berbasis_AI_Revisi.pdf'
        : submissionType === 'drive'
        ? 'Link Google Drive'
        : 'Link Video Youtube/Drive';

    onSubmitNewTask({
      moduleName: selectedModule,
      title: taskTitle,
      submittedAt: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) + ' WIB',
      status: 'menunggu_penilaian',
      fileName: fileName,
      fileType: submissionType === 'file' ? 'pdf' : 'link'
    });

    setIsSuccessToast(true);
    setTimeout(() => setIsSuccessToast(false), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#0F2C3A] font-bold uppercase tracking-wider mb-1">
            <FileCheck2 className="w-4 h-4 text-[#F5C748]" />
            <span>Pengumpulan Portofolio & Tugas</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Submission Engine & Evaluasi Mentor
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Unggah draf RPP, laporan aksi nyata, atau tautan portofolio digital untuk dinilai oleh Evaluator AKTARA.
          </p>
        </div>
      </div>

      {/* Success Notification Toast */}
      {isSuccessToast && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-center justify-between animate-in fade-in zoom-in-95">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <p className="text-xs font-bold text-emerald-900">
              Berhasil! Berkas portofolio telah dikirim ke Antrean Penilaian Mentor. Status: Menunggu Penilaian.
            </p>
          </div>
        </div>
      )}

      {/* Mentor Feedback Panel (If Revisions Exist) */}
      {pendingRevisionTask && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 text-amber-900">
            <AlertCircle className="w-6 h-6 text-[#C68E28] flex-shrink-0" />
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider">
                Catatan Mentor & Permintaan Revisi
              </h3>
              <p className="text-xs text-amber-800">
                Tugas: <span className="font-bold">{pendingRevisionTask.title}</span> ({pendingRevisionTask.moduleName})
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-amber-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold text-slate-800">Evaluator: {pendingRevisionTask.mentorName}</span>
              <span className="font-bold text-red-600">Nilai Sementara: {pendingRevisionTask.score}/100</span>
            </div>
            <p className="text-xs text-slate-700 italic bg-amber-50/50 p-3 rounded-lg border border-amber-100">
              "{pendingRevisionTask.feedback}"
            </p>
          </div>
        </div>
      )}

      {/* Grid: Submission Engine Form & Submission History Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Submission Form */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Formulir Unggah Portofolio
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Pilih metode pengiriman berkas tugas Anda</p>
          </div>

          {/* Submission Type Radio Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              Metode Pengumpulan
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setSubmissionType('file')}
                className={`py-2 px-2 rounded-lg transition flex items-center justify-center space-x-1 ${
                  submissionType === 'file' ? 'bg-white shadow text-[#0F2C3A]' : 'text-slate-500'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>File PDF</span>
              </button>

              <button
                type="button"
                onClick={() => setSubmissionType('drive')}
                className={`py-2 px-2 rounded-lg transition flex items-center justify-center space-x-1 ${
                  submissionType === 'drive' ? 'bg-white shadow text-[#0F2C3A]' : 'text-slate-500'
                }`}
              >
                <Link className="w-3.5 h-3.5" />
                <span>G-Drive</span>
              </button>

              <button
                type="button"
                onClick={() => setSubmissionType('video')}
                className={`py-2 px-2 rounded-lg transition flex items-center justify-center space-x-1 ${
                  submissionType === 'video' ? 'bg-white shadow text-[#0F2C3A]' : 'text-slate-500'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Video</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pilih Modul Pembelajaran
              </label>
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F2C3A] focus:outline-none"
              >
                <option value="Modul 4: Integrasi AI & Portofolio">Modul 4: Integrasi AI & Portofolio</option>
                <option value="Modul 3: Asesmen Interaktif">Modul 3: Asesmen Interaktif</option>
                <option value="Modul 2: Prompt Engineering">Modul 2: Prompt Engineering</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Judul Berkas / Tugas
              </label>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F2C3A] focus:outline-none"
                placeholder="Contoh: RPP Berbasis AI - Budi Santoso"
                required
              />
            </div>

            {/* Conditional Input based on Submission Type */}
            {submissionType === 'file' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Unggah Berkas (PDF / DOCX Max 10MB)
                </label>
                <div className="border-2 border-dashed border-slate-300 hover:border-[#0F2C3A] bg-slate-50 hover:bg-slate-100/80 rounded-2xl p-6 text-center transition cursor-pointer relative">
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <FileUp className="w-8 h-8 text-[#0F2C3A] mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-800">
                    {uploadedFileName || 'Tarik file ke sini atau klik untuk memilih'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">Format resmi: .pdf, .docx</p>
                </div>
              </div>
            )}

            {submissionType === 'drive' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tautan Google Drive (Akses Terbuka)
                </label>
                <input
                  type="url"
                  value={driveUrl}
                  onChange={(e) => setDriveUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F2C3A] focus:outline-none"
                  required
                />
              </div>
            )}

            {submissionType === 'video' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tautan Video Youtube / Drive Practice
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F2C3A] focus:outline-none"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#0F2C3A] hover:bg-[#163f52] text-[#F5C748] font-bold text-xs rounded-xl shadow transition flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Berkas ke Mentor</span>
            </button>
          </form>
        </div>

        {/* Right Column: Submission History Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Riwayat Pengumpulan & Status Penilaian
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Daftar tugas yang pernah Anda kirimkan ke tim evaluator
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="py-3 px-3">Tugas & Modul</th>
                  <th className="py-3 px-3">Dikirim Pada</th>
                  <th className="py-3 px-3">Status Evaluasi</th>
                  <th className="py-3 px-3 text-right">Nilai / Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tasks.map((task) => {
                  const isPassed = task.status === 'lulus';
                  const isPending = task.status === 'menunggu_penilaian';
                  const isRevision = task.status === 'perlu_revisi';

                  return (
                    <tr key={task.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-3">
                        <p className="font-bold text-slate-900">{task.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{task.moduleName}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{task.fileName}</p>
                      </td>

                      <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">
                        {task.submittedAt}
                      </td>

                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            isPassed
                              ? 'bg-emerald-100 text-emerald-800'
                              : isPending
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isPassed
                            ? 'Lulus'
                            : isPending
                            ? 'Menunggu Penilaian'
                            : 'Perlu Revisi'}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        {task.score !== undefined ? (
                          <span className="font-extrabold text-[#0F2C3A] text-sm">
                            {task.score}/100
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
