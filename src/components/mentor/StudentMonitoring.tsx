import React, { useState } from 'react';
import { TraineeDirectoryItem } from '../../types';
import {
  Users,
  Search,
  Filter,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  X,
  PhoneCall,
  Send
} from 'lucide-react';

interface StudentMonitoringProps {
  trainees: TraineeDirectoryItem[];
}

export const StudentMonitoring: React.FC<StudentMonitoringProps> = ({ trainees }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeWaModalItem, setActiveWaModalItem] = useState<TraineeDirectoryItem | null>(null);
  const [waCustomText, setWaCustomText] = useState('');

  const filteredTrainees = trainees.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.instansi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.nip.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || t.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const openWaReminderModal = (trainee: TraineeDirectoryItem) => {
    setActiveWaModalItem(trainee);
    setWaCustomText(
      `Halo Yth. Bapak/Ibu ${trainee.name} (${trainee.instansi}), salam dari Mentor AKTARA Academy.\n\n` +
      `Kami menginfokan bahwa progres LMS Anda saat ini berada pada ${trainee.progressPercent}%. Mohon dapat melengkapi pengumpulan tugas modul yang masih tertunda agar dapat diterbitkan e-sertifikat tepat waktu.\n\n` +
      `Terima kasih dan salam semangat belajar!`
    );
  };

  const handleSendWa = () => {
    if (!activeWaModalItem) return;
    const encodedText = encodeURIComponent(waCustomText);
    const url = `https://wa.me/${activeWaModalItem.phone}?text=${encodedText}`;
    window.open(url, '_blank');
    setActiveWaModalItem(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#0F2C3A] font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4 text-[#F5C748]" />
            <span>Monitoring & Pengawasan Progres Peserta</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Direktori Trainee & Remind WhatsApp
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pantau persentase kelulusan, tingkat keaktifan, dan kirimkan pengingat WhatsApp langsung ke peserta.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama peserta, NIP, atau sekolah..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F2C3A] focus:outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterStatus === 'all'
                ? 'bg-[#0F2C3A] text-[#F5C748]'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({trainees.length})
          </button>
          <button
            onClick={() => setFilterStatus('Lancar')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterStatus === 'Lancar'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Lancar
          </button>
          <button
            onClick={() => setFilterStatus('Perlu Perhatian')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterStatus === 'Perlu Perhatian'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Perlu Perhatian
          </button>
          <button
            onClick={() => setFilterStatus('Selesai')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterStatus === 'Selesai'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Selesai 100%
          </button>
        </div>
      </div>

      {/* Trainee Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTrainees.map((item) => {
          const isAttention = item.status === 'Perlu Perhatian';
          const isFinished = item.status === 'Selesai';

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl p-5 border transition shadow-sm hover:shadow-md flex flex-col justify-between space-y-4 ${
                isAttention
                  ? 'border-amber-300 ring-1 ring-amber-400/30'
                  : isFinished
                  ? 'border-emerald-300'
                  : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#0F2C3A] text-[#F5C748] font-bold flex items-center justify-center text-sm shadow">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xs font-extrabold text-slate-900 line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{item.instansi}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                      isFinished
                        ? 'bg-emerald-100 text-emerald-800'
                        : isAttention
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-600">Progres Modul Belajar</span>
                    <span className="text-[#0F2C3A]">{item.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        isFinished
                          ? 'bg-emerald-500'
                          : isAttention
                          ? 'bg-amber-500'
                          : 'bg-[#0F2C3A]'
                      }`}
                      style={{ width: `${item.progressPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Mini Stats */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block">Rata-Rata Nilai:</span>
                    <span className="font-extrabold text-[#0F2C3A] text-xs">{item.scoreAvg} / 100</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Tugas Tertunda:</span>
                    <span className="font-extrabold text-amber-600 text-xs">{item.pendingTasks} Berkas</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => openWaReminderModal(item)}
                className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Remind via WhatsApp</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* WhatsApp Prefilled Reminder Modal */}
      {activeWaModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setActiveWaModalItem(null)}
              className="absolute top-4 right-4 p-1 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2 text-emerald-700 font-extrabold text-xs uppercase mb-2">
              <MessageSquare className="w-4 h-4" />
              <span>Kirim Pengingat WhatsApp Langsung</span>
            </div>

            <h3 className="text-base font-extrabold text-slate-900 mb-1">
              Pesan Pengingat untuk {activeWaModalItem.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Nomor WhatsApp Tujuan: <span className="font-mono font-bold text-slate-800">+{activeWaModalItem.phone}</span>
            </p>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Pratinjau Teks Pesan (Dapat Disesuaikan)
              </label>
              <textarea
                value={waCustomText}
                onChange={(e) => setWaCustomText(e.target.value)}
                rows={5}
                className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={() => setActiveWaModalItem(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSendWa}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow flex items-center justify-center space-x-1"
              >
                <Send className="w-4 h-4" />
                <span>Buka Aplikasi WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
