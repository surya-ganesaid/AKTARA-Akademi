import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Plus, 
  Search, 
  Loader2, 
  CheckCircle, 
  Clock, 
  Archive, 
  Trash2, 
  Edit3, 
  X,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../../utils/supabase';

interface BatchItem {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'upcoming' | 'archived' | string;
  created_at: string;
}

export const BatchManagement: React.FC = () => {
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State Modal Create / Edit
  const [showModal, setShowModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState<BatchItem | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<string>('active');
  const [savingLoading, setSavingLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch Data Batch dari Supabase
  const fetchBatches = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('batches')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBatches(data || []);
    } catch (err: any) {
      console.error('Error fetching batches:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  // Open Modal Tambah / Edit
  const handleOpenModal = (batch?: BatchItem) => {
    if (batch) {
      setEditingBatch(batch);
      setTitle(batch.title);
      setDescription(batch.description || '');
      setStatus(batch.status || 'active');
    } else {
      setEditingBatch(null);
      setTitle('');
      setDescription('');
      setStatus('active');
    }
    setErrorMessage('');
    setShowModal(true);
  };

  // Simpan / Update Batch ke Supabase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSavingLoading(true);
    setErrorMessage('');

    try {
      if (editingBatch) {
        // Update Batch
        const { error } = await supabase
          .from('batches')
          .update({ title, description, status })
          .eq('id', editingBatch.id);

        if (error) throw error;

        // Log Audit
        await supabase.from('audit_logs').insert({
          action: 'UPDATE_BATCH',
          user_email: 'admin@aktara.com',
          details: `Memperbarui batch: ${title}`
        });
      } else {
        // Tambah Batch Baru
        const { error } = await supabase
          .from('batches')
          .insert([{ title, description, status }]);

        if (error) throw error;

        // Log Audit
        await supabase.from('audit_logs').insert({
          action: 'CREATE_BATCH',
          user_email: 'admin@aktara.com',
          details: `Membuat batch baru: ${title}`
        });
      }

      setShowModal(false);
      fetchBatches();
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menyimpan batch');
    } finally {
      setSavingLoading(false);
    }
  };

  // Hapus Batch
  const handleDeleteBatch = async (id: string, batchTitle: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus "${batchTitle}"?`)) return;

    try {
      const { error } = await supabase
        .from('batches')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await supabase.from('audit_logs').insert({
        action: 'DELETE_BATCH',
        user_email: 'admin@aktara.com',
        details: `Menghapus batch: ${batchTitle}`
      });

      fetchBatches();
    } catch (err: any) {
      alert(`Gagal menghapus batch: ${err.message}`);
    }
  };

  // Filter Search
  const filteredBatches = batches.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.description && b.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusBadge = (bStatus: string) => {
    switch (bStatus) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200">
            <CheckCircle className="w-3.5 h-3.5" />
            Active
          </span>
        );
      case 'upcoming':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            Upcoming
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full border border-gray-200">
            <Archive className="w-3.5 h-3.5" />
            Archived
          </span>
        );
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto font-sans">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2C3A] flex items-center gap-2">
            <Layers className="w-7 h-7 text-[#F5C748]" />
            Manajemen Batch Pelatihan
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola gelombang pelatihan Training of Trainers (TOT) AKTARA Academy.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0F2C3A] hover:bg-[#183d50] text-white text-sm font-bold rounded-xl transition cursor-pointer self-start md:self-auto shadow-md"
        >
          <Plus className="w-4 h-4 text-[#F5C748]" />
          <span>Tambah Batch Baru</span>
        </button>
      </div>

      {/* Bar Pencarian & Stats */}
      <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama batch atau deskripsi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C3A]"
          />
        </div>

        <div className="text-xs font-bold text-gray-500 self-end md:self-auto">
          Total Batch: <span className="text-[#0F2C3A] text-sm font-black">{batches.length}</span>
        </div>
      </div>

      {/* Tabel Data Batch */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#0F2C3A]" />
            <p className="text-sm font-semibold">Memuat data batch dari Supabase...</p>
          </div>
        ) : filteredBatches.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Layers className="w-10 h-10 mx-auto mb-2 text-gray-300" />
            <p className="text-sm font-bold text-gray-600">Belum ada batch pelatihan.</p>
            <p className="text-xs text-gray-400 mt-1">Klik tombol "Tambah Batch Baru" untuk membuat batch pertama.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Nama Batch</th>
                  <th className="py-4 px-6">Deskripsi</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Tanggal Dibuat</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredBatches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 px-6 font-bold text-[#0F2C3A]">
                      {batch.title}
                    </td>
                    <td className="py-4 px-6 text-gray-600 max-w-xs truncate">
                      {batch.description || '-'}
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(batch.status)}
                    </td>
                    <td className="py-4 px-6 text-gray-500 text-xs">
                      {new Date(batch.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenModal(batch)}
                          className="p-2 text-gray-500 hover:text-[#0F2C3A] hover:bg-gray-100 rounded-lg transition cursor-pointer"
                          title="Edit Batch"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBatch(batch.id, batch.title)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Hapus Batch"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Tambah / Edit Batch */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl relative">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-[#0F2C3A] mb-1">
              {editingBatch ? 'Edit Batch Pelatihan' : 'Buat Batch Pelatihan Baru'}
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Isi informasi detail batch untuk mengelompokkan peserta TOT.
            </p>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Nama Batch <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: TOT Aktara Batch 1 - Jawa Barat"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C3A]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Deskripsi Pelatihan
                </label>
                <textarea
                  rows={3}
                  placeholder="Keterangan singkat fokus/target peserta..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C3A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Status Pelatihan
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C3A]"
                >
                  <option value="active">Active (Sedang Berjalan)</option>
                  <option value="upcoming">Upcoming (Akan Datang)</option>
                  <option value="archived">Archived (Selesai/Arsip)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingLoading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#0F2C3A] hover:bg-[#183d50] text-white text-sm font-bold rounded-xl disabled:opacity-50 cursor-pointer shadow-md"
                >
                  {savingLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{savingLoading ? 'Menyimpan...' : 'Simpan Batch'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchManagement;