import React, { useEffect, useState } from 'react';
import { ShieldAlert, Search, RefreshCw, Loader2, Clock, CheckCircle, PieChart as PieIcon } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { supabase } from '../../utils/supabase';

interface AuditLogItem {
  id: string;
  action: string;
  user_email: string;
  details: string;
  created_at: string;
}

export const SecurityAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setLogs(data || []);
    } catch (err: any) {
      console.error('Gagal mengambil audit log:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Kategori Action Log Chart
  const createCount = logs.filter(l => l.action.includes('CREATE')).length;
  const updateCount = logs.filter(l => l.action.includes('UPDATE') || l.action.includes('PROMOTE')).length;
  const deleteCount = logs.filter(l => l.action.includes('DELETE')).length;

  const actionCategoryData = [
    { name: 'Pembuatan Data', value: createCount || 1, color: '#10B981' },
    { name: 'Perubahan/Promosi', value: updateCount || 1, color: '#3B82F6' },
    { name: 'Penghapusan', value: deleteCount || 0, color: '#EF4444' },
  ];

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto font-sans space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2C3A] flex items-center gap-2">
            <ShieldAlert className="w-7 h-7 text-[#F5C748]" />
            Audit Keamanan & Log Aktivitas
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Rekam jejak dan log aktivitas pengubahan sistem secara real-time dari database Supabase.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchLogs}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-bold rounded-xl shadow-sm cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 text-[#0F2C3A] ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Log</span>
        </button>
      </div>

      {/* CHART SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0F2C3A] flex items-center gap-2 mb-1">
              <PieIcon className="w-5 h-5 text-[#F5C748]" />
              Kategori Aksi Keamanan
            </h3>
            <p className="text-xs text-gray-400">Proporsi Create, Update, & Delete</p>
          </div>
          <div className="h-44 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={actionCategoryData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={4} dataKey="value">
                  {actionCategoryData.map((item, i) => <Cell key={i} fill={item.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-2 text-[10px] font-bold border-t border-gray-100 pt-3">
            {actionCategoryData.map((item, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 bg-[#0F2C3A] text-white p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <span className="px-2.5 py-1 bg-white/10 text-[#F5C748] text-[10px] font-extrabold rounded-md border border-white/10 uppercase">
              STATUS KEAMANAN
            </span>
            <h3 className="text-lg font-bold text-white mt-3">Sistem Pengawasan Real-Time Aktif</h3>
            <p className="text-xs text-gray-300 mt-1 max-w-lg leading-relaxed">
              Setiap penambahan batch, pengubahan role mentor, serta modul LMS otomatis tercatat tanpa cela dengan pengaman Row Level Security (RLS).
            </p>
          </div>
          <div className="flex items-center justify-between text-xs font-bold pt-4 border-t border-white/10 text-gray-400">
            <span>Total Catatan Terekam: <span className="text-white font-black">{logs.length} Log</span></span>
            <span className="text-green-400 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Database Protected</span>
          </div>
        </div>
      </div>

      {/* SEARCH & TABLE */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
        <div className="mb-6">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari aksi, email, atau detail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#0F2C3A]" />
            <p className="text-sm font-semibold">Memuat log keamanan...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <CheckCircle className="w-10 h-10 mx-auto mb-2 text-green-500" />
            <p className="text-sm font-bold text-gray-600">Belum ada catatan log keamanan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase">
                  <th className="py-4 px-6">Waktu</th>
                  <th className="py-4 px-6">Aksi Log</th>
                  <th className="py-4 px-6">Pengguna</th>
                  <th className="py-4 px-6">Detail Aktivitas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 px-6 text-gray-500 text-xs whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{new Date(log.created_at).toLocaleString('id-ID')}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded-lg border border-blue-100 uppercase">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-[#0F2C3A]">{log.user_email}</td>
                    <td className="py-4 px-6 text-gray-600">{log.details || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityAuditLogs;