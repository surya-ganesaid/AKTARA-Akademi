import React, { useEffect, useState } from 'react';
import { UserCheck, Shield, Loader2, RefreshCw, PieChart as PieIcon, BarChart3 } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { supabase } from '../../utils/supabase';

interface ProfileItem {
  id: string;
  name: string;
  email: string;
  role: string;
  institution?: string;
}

export const PromotionApproval: React.FC = () => {
  const [trainees, setTrainees] = useState<ProfileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchTrainees = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setTrainees(data || []);
    } catch (err: any) {
      console.error('Error fetching profiles:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainees();
  }, []);

  const handlePromote = async (id: string, currentRole: string, email: string) => {
    const nextRole = currentRole === 'trainee' ? 'mentor' : 'trainee';
    setUpdatingId(id);

    try {
      const { error } = await supabase.from('profiles').update({ role: nextRole }).eq('id', id);
      if (error) throw error;

      await supabase.from('audit_logs').insert({
        action: 'PROMOTE_ROLE',
        user_email: email,
        details: `Mengubah role ${email} menjadi ${nextRole.toUpperCase()}`
      });

      fetchTrainees();
    } catch (err: any) {
      alert(`Gagal merubah role: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  // Chart Data Computation
  const traineeCount = trainees.filter(t => t.role === 'trainee').length;
  const mentorCount = trainees.filter(t => t.role === 'mentor').length;
  const adminCount = trainees.filter(t => t.role === 'admin').length;

  const roleData = [
    { name: 'Trainee', value: traineeCount || 1, color: '#3B82F6' },
    { name: 'Mentor', value: mentorCount || 0, color: '#8B5CF6' },
    { name: 'Admin', value: adminCount || 0, color: '#F5C748' },
  ];

  const instData = [
    { inst: 'SMAN 18', total: 12 },
    { inst: 'SMK Al Wafa', total: 8 },
    { inst: 'Uniku', total: 6 },
    { inst: 'Lainnya', total: 15 },
  ];

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto font-sans space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2C3A] flex items-center gap-2">
            <UserCheck className="w-7 h-7 text-[#F5C748]" />
            Persetujuan Promosi Mentor & Demografi
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Ubah hak akses peserta (Trainee) menjadi Mentor / Trainer serta pantau rasio peran.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchTrainees}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-bold rounded-xl shadow-sm cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 text-[#0F2C3A] ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0F2C3A] flex items-center gap-2 mb-1">
              <PieIcon className="w-5 h-5 text-[#F5C748]" />
              Komposisi Pengguna
            </h3>
            <p className="text-xs text-gray-400">Rasio Trainee vs Mentor aktif</p>
          </div>
          <div className="h-48 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={roleData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4} dataKey="value">
                  {roleData.map((item, i) => <Cell key={i} fill={item.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-3 text-[11px] font-bold border-t border-gray-100 pt-3">
            {roleData.map((item, i) => (
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
              Sebaran Asal Instansi Peserta
            </h3>
            <p className="text-xs text-gray-400">Distribusi sekolah/universitas peserta TOT</p>
          </div>
          <div className="h-48 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={instData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="inst" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Bar dataKey="total" fill="#8B5CF6" radius={[6, 6, 0, 0]} name="Total Peserta" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-right text-xs font-bold text-gray-400 border-t border-gray-100 pt-3">
            Total Terdaftar: <span className="text-[#0F2C3A] font-black">{trainees.length} Pengguna</span>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#0F2C3A]" />
            <p className="text-sm font-semibold">Memuat data peserta...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase">
                  <th className="py-4 px-6">Nama Peserta</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Instansi</th>
                  <th className="py-4 px-6">Role Saat Ini</th>
                  <th className="py-4 px-6 text-right">Aksi Promosi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {trainees.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 px-6 font-bold text-[#0F2C3A]">{item.name}</td>
                    <td className="py-4 px-6 text-gray-600">{item.email}</td>
                    <td className="py-4 px-6 text-gray-500">{item.institution || '-'}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 text-xs font-extrabold rounded-full border ${
                        item.role === 'mentor' 
                          ? 'bg-purple-50 text-purple-700 border-purple-200 uppercase' 
                          : 'bg-gray-100 text-gray-600 border-gray-200 uppercase'
                      }`}>
                        {item.role || 'TRAINEE'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        disabled={updatingId === item.id}
                        onClick={() => handlePromote(item.id, item.role || 'trainee', item.email)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0F2C3A] hover:bg-[#183d50] text-white text-xs font-bold rounded-xl transition cursor-pointer disabled:opacity-50"
                      >
                        {updatingId === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Shield className="w-3.5 h-3.5 text-[#F5C748]" />}
                        <span>{item.role === 'mentor' ? 'Ubah ke Trainee' : 'Promosikan ke Mentor'}</span>
                      </button>
                    </td>
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

export default PromotionApproval;