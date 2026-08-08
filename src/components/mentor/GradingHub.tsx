import React, { useState } from 'react';
import { GradingSubmission } from '../../types';
import {
  FileCheck2,
  Sliders,
  CheckCircle2,
  AlertCircle,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileText,
  Save,
  Send,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface GradingHubProps {
  queue: GradingSubmission[];
  selectedSubmissionId: string | null;
  onSelectSubmission: (id: string | null) => void;
  onSaveGrading: (
    id: string,
    scores: { kurikulum: number; aiTools: number; metodologi: number },
    status: 'lulus' | 'perlu_revisi',
    feedback: string
  ) => void;
}

export const GradingHub: React.FC<GradingHubProps> = ({
  queue,
  selectedSubmissionId,
  onSelectSubmission,
  onSaveGrading
}) => {
  const activeSubmission = queue.find((s) => s.id === selectedSubmissionId) || null;

  // Local state for Rubric Scoring when modal is open
  const [kurikulumScore, setKurikulumScore] = useState(80);
  const [aiToolsScore, setAiToolsScore] = useState(85);
  const [metodologiScore, setMetodologiScore] = useState(70);
  const [statusDecision, setStatusDecision] = useState<'lulus' | 'perlu_revisi'>('perlu_revisi');
  const [feedbackText, setFeedbackText] = useState(
    'Catatan Mentor: Silakan sesuaikan bagian rubrik asesmen diagnostik agar lebih spesifik pada poin literasi digital peserta didik. Tambahkan bukti prompt di lampiran.'
  );
  const [zoomLevel, setZoomLevel] = useState(100);

  // Auto-calculated weighted score: 30% Kurikulum + 40% AI Tools + 30% Metodologi
  const weightedTotal = Math.round((kurikulumScore * 0.3 + aiToolsScore * 0.4 + metodologiScore * 0.3) * 10) / 10;

  const handleOpenModal = (sub: GradingSubmission) => {
    onSelectSubmission(sub.id);
    setKurikulumScore(sub.scores.kurikulum || 80);
    setAiToolsScore(sub.scores.aiTools || 85);
    setMetodologiScore(sub.scores.metodologi || 70);
    setStatusDecision(sub.status === 'lulus' ? 'lulus' : 'perlu_revisi');
    setFeedbackText(sub.feedbackText || 'Catatan Evaluator...');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmission) return;

    onSaveGrading(
      activeSubmission.id,
      { kurikulum: kurikulumScore, aiTools: aiToolsScore, metodologi: metodologiScore },
      statusDecision,
      feedbackText
    );
    onSelectSubmission(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#0F2C3A] font-bold uppercase tracking-wider mb-1">
            <FileCheck2 className="w-4 h-4 text-[#F5C748]" />
            <span>Penilaian Portofolio Digital & Rubrik Evaluasi</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Antrean Periksa Tugas (Grading Hub)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Evaluasi berkas RPP, modul ajar berbasis AI, dan video aksi nyata dengan kalkulator rubrik 3-kriteria terintegrasi.
          </p>
        </div>
      </div>

      {/* Submissions Queue List Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900">
          Daftar Antrean Tugas Masuk ({queue.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-3 px-3">Peserta & Instansi</th>
                <th className="py-3 px-3">Judul Berkas / Tugas</th>
                <th className="py-3 px-3">Waktu Kirim</th>
                <th className="py-3 px-3">Status Saat Ini</th>
                <th className="py-3 px-3 text-right">Aksi Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {queue.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.traineeAvatar}
                        alt={item.traineeName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{item.traineeName}</p>
                        <p className="text-[10px] text-slate-500">{item.traineeEmail}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <p className="font-bold text-slate-800">{item.taskTitle}</p>
                    <p className="text-[10px] text-slate-500">{item.moduleName}</p>
                    <span className="inline-block mt-0.5 text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                      {item.fileName}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap">
                    {item.submittedDate}
                  </td>

                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        item.status === 'lulus'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'perlu_revisi'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800 animate-pulse'
                      }`}
                    >
                      {item.status === 'lulus'
                        ? 'Lulus'
                        : item.status === 'perlu_revisi'
                        ? 'Perlu Revisi'
                        : 'Menunggu Review'}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="px-4 py-2 bg-[#0F2C3A] hover:bg-[#163f52] text-[#F5C748] font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5 ml-auto"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Buka Split-Screen Review</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SPLIT-SCREEN REVIEW MODAL */}
      {activeSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-6xl h-[92vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            
            {/* Modal Header Bar */}
            <div className="px-6 py-4 bg-[#0F2C3A] text-white flex items-center justify-between border-b border-slate-800">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-[#F5C748] uppercase tracking-wider">
                    Split-Screen Review & Scoring System
                  </span>
                  <span className="text-xs text-slate-400">• ID: {activeSubmission.id}</span>
                </div>
                <h3 className="text-sm font-extrabold text-white mt-0.5">
                  Tugas: {activeSubmission.taskTitle} ({activeSubmission.traineeName})
                </h3>
              </div>

              <button
                onClick={() => onSelectSubmission(null)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Split Screen Container */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-slate-100">
              
              {/* LEFT SIDE: Document Viewer (7 Cols) */}
              <div className="lg:col-span-7 bg-slate-900 text-slate-100 p-4 flex flex-col border-r border-slate-800 overflow-hidden">
                {/* Viewer Toolbar */}
                <div className="bg-slate-800/90 p-2.5 rounded-xl border border-slate-700 flex items-center justify-between text-xs mb-3">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-[#F5C748]" />
                    <span className="font-bold text-slate-200">{activeSubmission.fileName}</span>
                    <span className="text-[10px] text-slate-400">({activeSubmission.fileSize})</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setZoomLevel(Math.max(75, zoomLevel - 25))}
                      className="p-1 rounded hover:bg-slate-700 text-slate-300"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] font-mono text-slate-300 font-bold">{zoomLevel}%</span>
                    <button
                      onClick={() => setZoomLevel(Math.min(150, zoomLevel + 25))}
                      className="p-1 rounded hover:bg-slate-700 text-slate-300"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Simulated Document Paper Container */}
                <div className="flex-1 overflow-y-auto p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-center">
                  <div
                    className="bg-white text-slate-900 p-8 rounded shadow-2xl w-full max-w-2xl font-serif text-xs leading-relaxed transition-all duration-200"
                    style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                  >
                    <div className="border-b-2 border-slate-900 pb-3 mb-4 flex justify-between items-start font-sans">
                      <div>
                        <h4 className="font-extrabold text-sm uppercase text-[#0F2C3A]">
                          AKTARA ACADEMY PORTOFOLIO RPP
                        </h4>
                        <p className="text-[10px] text-slate-500">
                          Penulis: {activeSubmission.traineeName} ({activeSubmission.traineeEmail})
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 rounded border">
                        Draf Versi {activeSubmission.revisionCount + 1}.0
                      </span>
                    </div>

                    <pre className="font-sans whitespace-pre-wrap text-xs text-slate-800 leading-relaxed font-normal">
                      {activeSubmission.contentSnippet}
                    </pre>

                    <div className="mt-8 pt-4 border-t border-slate-200 font-sans text-[10px] text-slate-400 flex justify-between">
                      <span>Dokumen Terverifikasi AKTARA LMS</span>
                      <span>Halaman 1 dari 3</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: Rubric Scoring Calculator (5 Cols) */}
              <div className="lg:col-span-5 bg-white p-6 overflow-y-auto flex flex-col justify-between">
                
                <form onSubmit={handleSave} className="space-y-5">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                      Rubrik Penilaian 3-Kriteria
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Bobot terintegrasi secara otomatis menghitung akumulasi skor total.
                    </p>
                  </div>

                  {/* Kriteria 1: Integrasi Kurikulum (30%) */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800">
                        1. Integrasi Kurikulum Merdeka (Bobot 30%)
                      </span>
                      <span className="font-mono font-extrabold text-[#0F2C3A]">
                        {kurikulumScore}/100
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={kurikulumScore}
                      onChange={(e) => setKurikulumScore(Number(e.target.value))}
                      className="w-full accent-[#0F2C3A] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Kurang (0)</span>
                      <span>Cukup (70)</span>
                      <span>Sangat Baik (100)</span>
                    </div>
                  </div>

                  {/* Kriteria 2: AI Tools & Prompting (40%) */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800">
                        2. AI Tools & Prompting Engineering (Bobot 40%)
                      </span>
                      <span className="font-mono font-extrabold text-[#0F2C3A]">
                        {aiToolsScore}/100
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={aiToolsScore}
                      onChange={(e) => setAiToolsScore(Number(e.target.value))}
                      className="w-full accent-[#0F2C3A] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Kurang (0)</span>
                      <span>Cukup (70)</span>
                      <span>Sangat Baik (100)</span>
                    </div>
                  </div>

                  {/* Kriteria 3: Metodologi & Asesmen (30%) */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800">
                        3. Metodologi Pembelajaran & Asesmen (Bobot 30%)
                      </span>
                      <span className="font-mono font-extrabold text-[#0F2C3A]">
                        {metodologiScore}/100
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={metodologiScore}
                      onChange={(e) => setMetodologiScore(Number(e.target.value))}
                      className="w-full accent-[#0F2C3A] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Kurang (0)</span>
                      <span>Cukup (70)</span>
                      <span>Sangat Baik (100)</span>
                    </div>
                  </div>

                  {/* Calculated Weighted Score Box */}
                  <div className="p-4 bg-gradient-to-r from-[#0F2C3A] to-[#1a4a61] text-white rounded-2xl flex items-center justify-between shadow">
                    <div>
                      <span className="text-[11px] text-slate-300 font-bold uppercase block">
                        Kalkulasi Skor Akhir Terbobot
                      </span>
                      <span className="text-[10px] text-[#F5C748]">
                        Status Kelulusan Minimal Score: 75.0
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-[#F5C748]">{weightedTotal}</span>
                      <span className="text-xs text-slate-300"> / 100</span>
                    </div>
                  </div>

                  {/* Decision Radio Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Keputusan Evaluator
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setStatusDecision('lulus')}
                        className={`py-2.5 px-3 rounded-xl border flex items-center justify-center space-x-2 transition ${
                          statusDecision === 'lulus'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Luluskan Tugas</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setStatusDecision('perlu_revisi')}
                        className={`py-2.5 px-3 rounded-xl border flex items-center justify-center space-x-2 transition ${
                          statusDecision === 'perlu_revisi'
                            ? 'bg-[#C68E28] text-white border-[#C68E28] shadow'
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>Perlu Revisi</span>
                      </button>
                    </div>
                  </div>

                  {/* Feedback Textarea */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Catatan Umpar Balik (Feedback untuk Peserta)
                    </label>
                    <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      rows={3}
                      className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F2C3A] focus:outline-none"
                      placeholder="Tuliskan catatan perbaikan mendalam untuk peserta..."
                      required
                    />
                  </div>

                  {/* Submit Action */}
                  <div className="flex gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => onSelectSubmission(null)}
                      className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-[#0F2C3A] hover:bg-[#163f52] text-[#F5C748] font-bold text-xs rounded-xl transition shadow flex items-center justify-center space-x-1"
                    >
                      <Save className="w-4 h-4" />
                      <span>Simpan & Terbitkan Hasil</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
