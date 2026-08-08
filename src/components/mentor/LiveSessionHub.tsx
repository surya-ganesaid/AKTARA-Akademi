import React, { useState } from 'react';
import { LiveSession } from '../../types';
import {
  Calendar,
  Video,
  Link,
  Plus,
  ExternalLink,
  CheckCircle2,
  Users,
  Clock,
  Sparkles,
  Send,
  Copy
} from 'lucide-react';

interface LiveSessionHubProps {
  sessions: LiveSession[];
  onAddSession: (session: Partial<LiveSession>) => void;
}

export const LiveSessionHub: React.FC<LiveSessionHubProps> = ({ sessions, onAddSession }) => {
  const [sessionTitle, setSessionTitle] = useState('Sesi Sync #6: Coaching Clinic Portofolio AI & Review Asesmen');
  const [sessionDate, setSessionDate] = useState('05 Juni 2026');
  const [sessionTime, setSessionTime] = useState('19:30 - 21:00 WIB');
  const [description, setDescription] = useState('Sesi tanya jawab interaktif pra-sidang portofolio kelulusan.');
  const [meetLink, setMeetLink] = useState('https://meet.google.com/akt-tot-2026');
  const [isCopiedToast, setIsCopiedToast] = useState(false);

  const generateRandomMeetLink = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const randPart = (len: number) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const newLink = `https://meet.google.com/${randPart(3)}-${randPart(4)}-${randPart(3)}`;
    setMeetLink(newLink);
  };

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSession({
      title: sessionTitle,
      batchName: 'Batch 5 - TOT AKTARA 2026',
      date: sessionDate,
      time: sessionTime,
      trainer: 'Dr. Hendra Wijaya',
      meetUrl: meetLink,
      description: description,
      status: 'upcoming',
      attendanceCount: 0
    });
    alert('Sesi Google Meet baru berhasil dibuat & dipublikasikan ke kalender peserta!');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(meetLink);
    setIsCopiedToast(true);
    setTimeout(() => setIsCopiedToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#0F2C3A] font-bold uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4 text-[#F5C748]" />
            <span>Manajemen Jadwal & Sesi Live Google Meet</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Live Session Hub & Generator Tautan Meet
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Buat jadwal sesi synchronous, auto-generate link Google Meet, dan pantau log kehadiran peserta.
          </p>
        </div>
      </div>

      {/* Grid: Session Form Generator & Upcoming Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form Generator (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
              <Video className="w-4 h-4 text-[#0F2C3A]" />
              <span>Generator Sesi Google Meet Baru</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Otomatisasi pembuat link rapat terverifikasi</p>
          </div>

          <form onSubmit={handleCreateSession} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Judul Sesi Synchronous
              </label>
              <input
                type="text"
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F2C3A] focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Tanggal Sesi
                </label>
                <input
                  type="text"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F2C3A] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Waktu Pelaksanaan
                </label>
                <input
                  type="text"
                  value={sessionTime}
                  onChange={(e) => setSessionTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F2C3A] focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Deskripsi Singkat
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F2C3A] focus:outline-none"
              />
            </div>

            {/* Google Meet Link Auto Generator Box */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 flex items-center space-x-1">
                  <Video className="w-4 h-4 text-emerald-600" />
                  <span>Google Meet Link Tergenerasi:</span>
                </span>

                <button
                  type="button"
                  onClick={generateRandomMeetLink}
                  className="text-[10px] font-extrabold text-emerald-700 hover:underline"
                >
                  ⚡ Acak Link Baru
                </button>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={meetLink}
                  className="flex-1 px-3 py-2 text-xs bg-white border border-emerald-300 rounded-xl font-mono text-emerald-900 font-bold"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition"
                  title="Salin Link"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              {isCopiedToast && (
                <span className="text-[10px] font-bold text-emerald-700 block">
                  ✓ Link Google Meet disalin ke clipboard!
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#0F2C3A] hover:bg-[#163f52] text-[#F5C748] font-bold text-xs rounded-xl shadow transition flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Simpan & Bagikan Jadwal ke Peserta</span>
            </button>
          </form>
        </div>

        {/* Right Column: Active & Upcoming Sessions List (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900">
              Daftar Sesi Sync Active & Mendatang
            </h3>
            <p className="text-xs text-slate-500">
              Jadwal yang telah terpublikasikan pada dashboard peserta
            </p>
          </div>

          <div className="space-y-3">
            {sessions.map((sess) => (
              <div
                key={sess.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                        sess.status === 'live'
                          ? 'bg-red-100 text-red-700 animate-pulse'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {sess.status === 'live' ? '● LIVE SEKARANG' : 'Mendatang'}
                    </span>
                    <span className="text-[11px] text-slate-500 font-bold">{sess.batchName}</span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{sess.title}</h4>
                  <p className="text-[11px] text-slate-500">{sess.description}</p>
                  
                  <div className="flex items-center space-x-3 text-[11px] text-slate-600 pt-1">
                    <span className="font-bold text-slate-800">{sess.date}</span>
                    <span>•</span>
                    <span className="font-bold text-[#0F2C3A]">{sess.time}</span>
                  </div>
                </div>

                <a
                  href={sess.meetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-[#0F2C3A] hover:bg-[#163f52] text-[#F5C748] font-bold text-xs rounded-xl shadow transition flex items-center justify-center space-x-1.5 whitespace-nowrap"
                >
                  <span>Buka Meet</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>

          {/* Attendance Log Preview Table */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Log Kehadiran Peserta (Sesi Terakhir)
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 font-bold">
                    <th className="p-2">Nama Peserta</th>
                    <th className="p-2">Instansi</th>
                    <th className="p-2">Waktu Masuk Meet</th>
                    <th className="p-2 text-right">Status Absen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="p-2 font-bold">Budi Santoso, S.Pd</td>
                    <td className="p-2">SMA Negeri 1 Jakarta</td>
                    <td className="p-2 font-mono">19:31 WIB</td>
                    <td className="p-2 text-right font-bold text-emerald-600">Hadir Full</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">Siti Aminah, M.Pd</td>
                    <td className="p-2">SMP Negeri 2 Bandung</td>
                    <td className="p-2 font-mono">19:30 WIB</td>
                    <td className="p-2 text-right font-bold text-emerald-600">Hadir Full</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">Agus Wijaya, S.ST</td>
                    <td className="p-2">SMK Negeri 1 Surabaya</td>
                    <td className="p-2 font-mono">19:42 WIB</td>
                    <td className="p-2 text-right font-bold text-amber-600">Hadir Terlambat</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
