import React, { useState, useEffect } from 'react';
import { Award, FileText, CheckCircle, Upload, Loader2, Sparkles, PieChart as PieIcon, BarChart3 } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { generateCertificatePDF } from '../../utils/certificateGenerator';
import { supabase } from '../../utils/supabase';

export const BatchCertificateMapper: React.FC = () => {
  const [templateName, setTemplateName] = useState('Sertifikat_Kelulusan_TOT_AKTARA_2026.pdf');
  const [saved, setSaved] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [batches, setBatches] = useState<any[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>('TOT AKTARA Batch 1');
  const [sampleName, setSampleName] = useState('Dr. Kusmawan, M.Pd.');
  const [sampleInst, setSampleInst] = useState('SMAN 18 Bandung');

  // Dummy Chart Data
  const certStatusData = [
    { name: 'Sertifikat Terbit', value: 142, color: '#10B981' },
    { name: 'Menunggu Klaim', value: 38, color: '#F5C748' },
    { name: 'Ditolak/Revisi', value: 8, color: '#EF4444' },
  ];

  const certTrendData = [
    { batch: 'Batch 1', count: 45 },
    { batch: 'Batch 2', count: 52 },
    { batch: 'Batch 3', count: 45 },
  ];

  useEffect(() => {
    const loadBatches = async () => {
      const { data } = await supabase.from('batches').select('title');
      if (data && data.length > 0) {
        setBatches(data);
        setSelectedBatch(data[0].title);
      }
    };
    loadBatches();
  }, []);

  const handleGeneratePreview = async () => {
    setGenerating(true);
    try {
      await generateCertificatePDF({
        participantName: sampleName,
        participantInstitution: sampleInst,
        batchTitle: selectedBatch,
        certificateNumber: `AKTARA/TOT/2026/${Date.now().toString().slice(-6)}`
      });
    } catch (err: any) {
      alert(`Gagal generate PDF: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto font-sans space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2C3A] flex items-center gap-2">
            <Award className="w-7 h-7 text-[#F5C748]" />
            Pemetaan Sertifikat & Visualisasi Terbit
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Konfigurasi template e-Sertifikat, pemantauan status penerbitan, dan uji cetak PDF.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGeneratePreview}
          disabled={generating}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0F2C3A] hover:bg-[#183d50] text-white text-sm font-bold rounded-xl transition cursor-pointer shadow-md disabled:opacity-50"
        >
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-[#F5C748]" />}
          <span>{generating ? 'Menerbitkan...' : 'Test Cetak Sertifikat PDF'}</span>
        </button>
      </div>

      {saved && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span>Konfigurasi pemetaan sertifikat berhasil disimpan!</span>
        </div>
      )}

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0F2C3A] flex items-center gap-2 mb-1">
              <PieIcon className="w-5 h-5 text-[#F5C748]" />
              Status Penerbitan Sertifikat
            </h3>
            <p className="text-xs text-gray-400">Rasio sertifikat diterbitkan vs pending</p>
          </div>
          <div className="h-48 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={certStatusData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4} dataKey="value">
                  {certStatusData.map((item, i) => <Cell key={i} fill={item.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-3 text-[11px] font-bold border-t border-gray-100 pt-3">
            {certStatusData.map((item, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0F2C3A] flex items-center gap-2 mb-1">
              <BarChart3 className="w-5 h-5 text-[#0F2C3A]" />
              Tren Sertifikat Terbit per Batch
            </h3>
            <p className="text-xs text-gray-400">Jumlah sertifikat terdaftar di QR Code Verifikasi</p>
          </div>
          <div className="h-48 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={certTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="batch" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#0F2C3A" radius={[6, 6, 0, 0]} name="Sertifikat Terbit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-right text-xs font-bold text-gray-400 border-t border-gray-100 pt-3">
            Total Terbit: <span className="text-[#0F2C3A] font-black">188 Sertifikat</span>
          </div>
        </div>
      </div>

      {/* FORM CONFIG SECTION */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          <h2 className="text-lg font-bold text-[#0F2C3A]">Parameter Pengujian & Konfigurasi Template</h2>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Template Aktif</label>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <FileText className="w-6 h-6 text-[#0F2C3A]" />
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-gray-800 truncate">{templateName}</p>
                <p className="text-xs text-gray-400">PDF Auto Generator Layout A4</p>
              </div>
              <label className="px-4 py-2 bg-[#0F2C3A] text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-[#F5C748]" />
                <span>Upload Baru</span>
                <input type="file" accept=".pdf,.png" className="hidden" onChange={(e) => e.target.files?.[0] && setTemplateName(e.target.files[0].name)} />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Nama Peserta Uji</label>
              <input type="text" value={sampleName} onChange={(e) => setSampleName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Instansi / Sekolah</label>
              <input type="text" value={sampleInst} onChange={(e) => setSampleInst(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Batch Pelatihan</label>
              <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none">
                {batches.length > 0 ? batches.map((b, i) => <option key={i} value={b.title}>{b.title}</option>) : <option value="TOT AKTARA Batch 1">TOT AKTARA Batch 1</option>}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button type="submit" className="px-6 py-3 bg-[#0F2C3A] text-white text-sm font-bold rounded-xl shadow-md cursor-pointer">Simpan Pemetaan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BatchCertificateMapper;