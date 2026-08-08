import {
  LMSModule,
  TraineeTask,
  GradingSubmission,
  LiveSession,
  TraineeDirectoryItem,
  PromotionCandidate,
  ProfileUnlockRequest,
  AuditLog,
  CertVariable
} from './types';

export const INITIAL_MODULES: LMSModule[] = [
  {
    id: 1,
    title: 'Modul 1: Landasan Pedagogik Digital & Generative AI',
    subtitle: 'Konsep Dasar AI dalam Pembelajaran Modern',
    duration: '45 Menit • 3 Video • 2 File Kit',
    status: 'completed',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Modul ini membahas integrasi etis Generative AI dalam penyusunan modul ajar, kerangka TPACK, dan pemanfaatan prompt engineering dasar untuk guru Indonesia.',
    resources: [
      { id: 'r1', name: 'Panduan_Pedagogik_AI_v2.pdf', type: 'pdf', size: '2.4 MB', url: '#' },
      { id: 'r2', name: 'Template_Prompting_Dasar.docx', type: 'docx', size: '1.1 MB', url: '#' }
    ],
    discussions: [
      { id: 'd1', author: 'Siti Aminah, S.Pd', role: 'Trainee', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', text: 'Apakah penggunaan ChatGPT dalam menyusun RPP diperbolehkan untuk verifikasi Kurikulum Merdeka?', time: '2 jam lalu' },
      { id: 'd2', author: 'Dr. Hendra Wijaya', role: 'Mentor', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', text: 'Sangat diperbolehkan Ibu Siti! Namun pastikan hasil akhir selalu dikurasi sesuai konteks kelas masing-masing.', time: '1 jam lalu' }
    ]
  },
  {
    id: 2,
    title: 'Modul 2: Prompt Engineering untuk Kurikulum Merdeka',
    subtitle: 'Teknik Crafting Prompt Efektif untuk Modul Ajar',
    duration: '60 Menit • 4 Video • 3 File Kit',
    status: 'completed',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Memahami struktur Role, Task, Context, & Constraint (RTCC) dalam pembuatan skenario pembelajaran interaktif dan diferensiasi murid.',
    resources: [
      { id: 'r3', name: 'Formula_RTCC_Prompt_Master.pdf', type: 'pdf', size: '3.8 MB', url: '#' },
      { id: 'r4', name: 'Bank_Prompt_Mata_Pelajaran.docx', type: 'docx', size: '1.9 MB', url: '#' }
    ],
    discussions: [
      { id: 'd3', author: 'Agus Wijaya, M.Pd', role: 'Trainee', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', text: 'Materi sangat aplikatif! Saya sudah mencoba membuat 5 prompt untuk asesmen diagnostik.', time: '3 jam lalu' }
    ]
  },
  {
    id: 3,
    title: 'Modul 3: Asesmen Interaktif & Media Pembelajaran Visual AI',
    subtitle: 'Pembuatan Quiz, Rubrik, dan Visual Media',
    duration: '50 Menit • 3 Video • 2 File Kit',
    status: 'completed',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Praktik membuat kuis otomatis, infografis pembelajaran, dan audio visual interaktif menggunakan alat AI mutakhir.',
    resources: [
      { id: 'r5', name: 'Rubrik_Penilaian_Otomatis.pdf', type: 'pdf', size: '1.5 MB', url: '#' }
    ],
    discussions: []
  },
  {
    id: 4,
    title: 'Modul 4: Integrasi AI dalam Analisis Performa & Portofolio Guru',
    subtitle: 'Penyusunan Portofolio Digital & Proyek Akhir',
    duration: '75 Menit • 5 Video • 4 File Kit',
    status: 'active',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Menyusun laporan portofolio digital berbasis AI dan mempersiapkan tugas akhir untuk evaluasi akhir sertifikasi Mentor AKTARA.',
    resources: [
      { id: 'r6', name: 'Sistematika_Portofolio_TOT.pdf', type: 'pdf', size: '4.1 MB', url: '#' },
      { id: 'r7', name: 'Format_RPP_Integrasi_AI.docx', type: 'docx', size: '850 KB', url: '#' }
    ],
    discussions: [
      { id: 'd4', author: 'Budi Santoso, S.Pd', role: 'Trainee', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', text: 'Mohon konfirmasi batas waktu pengumpulan tugas RPP berbasis AI modul 4 ini.', time: '30 menit lalu' }
    ]
  },
  {
    id: 5,
    title: 'Modul 5: Sidang Portofolio & Sertifikasi Facilitator Master',
    subtitle: 'Tahap Akhir Kelulusan & Pengikatan Sertifikat',
    duration: '90 Menit • Live Review Session',
    status: 'locked',
    videoUrl: '',
    description: 'Tahap evaluasi komprehensif oleh tim evaluator AKTARA Academy dan penerbitan sertifikat resmi terverifikasi QR Code.',
    resources: [],
    discussions: []
  }
];

export const INITIAL_TRAINEE_TASKS: TraineeTask[] = [
  {
    id: 'TSK-001',
    moduleName: 'Modul 1: Landasan Pedagogik Digital',
    title: 'Analisis Kurikulum & Peta AI Pembelajaran',
    submittedAt: '12 Mei 2026, 14:30 WIB',
    status: 'lulus',
    fileName: 'Analisis_Kurikulum_AI_BudiSantoso.pdf',
    fileType: 'pdf',
    score: 92,
    feedback: 'Analisis komprehensif dan sangat sesuai dengan Kurikulum Merdeka. Kerangka TPACK dijelaskan secara runtut.',
    mentorName: 'Dr. Hendra Wijaya'
  },
  {
    id: 'TSK-002',
    moduleName: 'Modul 2: Prompt Engineering',
    title: 'Bank Prompt Skenario Pembelajaran Diferensiasi',
    submittedAt: '18 Mei 2026, 09:15 WIB',
    status: 'lulus',
    fileName: 'Bank_Prompt_Diferensiasi.docx',
    fileType: 'docx',
    score: 88,
    feedback: 'Prompt RTCC diformulasikan dengan sangat tajam. Variasi mata pelajaran lengkap.',
    mentorName: 'Dr. Hendra Wijaya'
  },
  {
    id: 'TSK-003',
    moduleName: 'Modul 4: Integrasi AI & Portofolio',
    title: 'RPP Berbasis AI & Modul Ajar Interaktif',
    submittedAt: '24 Mei 2026, 16:45 WIB',
    status: 'perlu_revisi',
    fileName: 'RPP_Berbasis_AI_v1_Budi.pdf',
    fileType: 'pdf',
    score: 68,
    feedback: 'Catatan Mentor: Silakan sesuaikan bagian rubrik asesmen diagnostik agar lebih spesifik pada poin literasi digital peserta didik. Tambahkan bukti prompt di lampiran.',
    mentorName: 'Dr. Hendra Wijaya',
    revisionNotes: 'Perhatikan bobot rubrik pada aspek Metodologi & AI Tools. Mohon perbaiki dan unggah ulang.'
  }
];

export const INITIAL_GRADING_QUEUE: GradingSubmission[] = [
  {
    id: 'SUB-101',
    traineeId: 'TR-1001',
    traineeName: 'Budi Santoso, S.Pd',
    traineeEmail: 'budi.santoso@sma1jakarta.sch.id',
    traineeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    taskTitle: 'RPP Berbasis AI & Modul Ajar Interaktif',
    moduleName: 'Modul 4: Integrasi AI & Portofolio',
    submittedDate: '24 Mei 2026, 16:45 WIB',
    docType: 'pdf',
    fileName: 'RPP_Berbasis_AI_v1_Budi.pdf',
    fileSize: '3.2 MB',
    contentSnippet: 'LEMBAR KERJA RENCANA PELAKSANAAN PEMBELAJARAN (RPP) BERBASIS AI\n\nNama Satuan Pendidikan: SMA Negeri 1 Jakarta\nMata Pelajaran: Biologi / Fisiologi Tumbuhan\nKelas/Semester: XI / Ganjil\nAlokasi Waktu: 2 x 45 Menit\n\n1. CAPAIAN PEMBELAJARAN (CP)\nPeserta didik mampu menganalisis mekanisme transpor pada membran sel dan penerapannya dalam kehidupan sehari-hari.\n\n2. INTEGRASI ALAT AI (PROMPT ENGINEERING)\nPrompt AI yang digunakan:\n"Bertindaklah sebagai Ahli Fisiologi Tumbuhan dan Perancang Kurikulum Merdeka. Buatlah skenario simulasi laboratorium virtual untuk eksperimen osmosis menggunakan bahan sehari-hari..."\n\n3. RUBRIK ASESMEN DIAGNOSTIK & FORMATIF\nKriteria penilaian melingkupi pemahaman konsep, keterampilan proses, dan literasi digital.',
    scores: {
      kurikulum: 80,
      aiTools: 85,
      metodologi: 70
    },
    weightedTotal: 79.0,
    status: 'menunggu',
    feedbackText: 'Penggunaan prompt sudah runtut. Mohon pertajam kriteria asesmen diagnostik.',
    revisionCount: 1
  },
  {
    id: 'SUB-102',
    traineeId: 'TR-1002',
    traineeName: 'Siti Aminah, M.Pd',
    traineeEmail: 'siti.aminah@smp2bandung.sch.id',
    traineeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    taskTitle: 'Desain Kuis & Rubrik Penilaian Otomatis',
    moduleName: 'Modul 3: Asesmen Interaktif',
    submittedDate: '25 Mei 2026, 11:20 WIB',
    docType: 'docx',
    fileName: 'Kuis_Rubrik_SitiAminah.docx',
    fileSize: '1.8 MB',
    contentSnippet: 'RANCANGAN ASESMEN INTERAKTIF DENGAN KHOOT & GEMINI AI\n\nKompetensi Dasar: Bahasa Indonesia - Teks Laporan Hasil Observasi\nIntegrasi Quizizz & Prompt AI Generatif untuk soal HOTS (Higher Order Thinking Skills)...',
    scores: {
      kurikulum: 92,
      aiTools: 95,
      metodologi: 90
    },
    weightedTotal: 92.6,
    status: 'menunggu',
    feedbackText: 'Sangat bagus, kuis HOTS yang dirancang sangat adaptif!',
    revisionCount: 0
  },
  {
    id: 'SUB-103',
    traineeId: 'TR-1003',
    traineeName: 'Agus Wijaya, S.ST',
    traineeEmail: 'agus.wijaya@smkn1surabaya.sch.id',
    traineeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    taskTitle: 'RPP Berbasis AI & Modul Ajar Interaktif',
    moduleName: 'Modul 4: Integrasi AI & Portofolio',
    submittedDate: '25 Mei 2026, 14:00 WIB',
    docType: 'pdf',
    fileName: 'RPP_SMK_Teknik_Agus.pdf',
    fileSize: '4.1 MB',
    contentSnippet: 'RPP KEJURUAN TEKNIK INFORMATIKA & AI\nModel Pembelajaran Project Based Learning (PjBL) terintegrasi dengan pemrosesan logika AI...',
    scores: {
      kurikulum: 85,
      aiTools: 88,
      metodologi: 84
    },
    weightedTotal: 85.9,
    status: 'menunggu',
    feedbackText: '',
    revisionCount: 0
  }
];

export const INITIAL_LIVE_SESSIONS: LiveSession[] = [
  {
    id: 'SESS-01',
    title: 'Sesi Sync #4: Pedagogik Digital & Prompting AI Lanjutan',
    batchName: 'Batch 5 - TOT AKTARA 2026',
    date: '28 Mei 2026',
    time: '19:30 - 21:00 WIB',
    trainer: 'Dr. Hendra Wijaya',
    meetUrl: 'https://meet.google.com/akt-tot-2026',
    description: 'Sesi interaktif tanya jawab, bedah RPP berbasis AI, dan live coaching pembuatan prompt draf portofolio kelulusan.',
    status: 'live',
    attendanceCount: 38
  },
  {
    id: 'SESS-02',
    title: 'Sesi Sync #5: Persiapan Sidang Portofolio & Demo Teaching',
    batchName: 'Batch 5 - TOT AKTARA 2026',
    date: '02 Juni 2026',
    time: '19:30 - 21:00 WIB',
    trainer: 'Prof. Ratna Juwita, M.Ed',
    meetUrl: 'https://meet.google.com/akt-demo-teaching',
    description: 'Panduan teknis pelaksanaan sidang portofolio digital dan standar evaluasi kelulusan fasilitator nasional.',
    status: 'upcoming',
    attendanceCount: 0
  }
];

export const INITIAL_TRAINEE_DIRECTORY: TraineeDirectoryItem[] = [
  {
    id: 'TR-1001',
    name: 'Budi Santoso, S.Pd',
    nip: '198803122014021003',
    instansi: 'SMA Negeri 1 Jakarta',
    email: 'budi.santoso@sma1jakarta.sch.id',
    phone: '6281234567890',
    progressPercent: 75,
    completedModules: 3,
    status: 'Perlu Perhatian',
    pendingTasks: 1,
    scoreAvg: 82.5
  },
  {
    id: 'TR-1002',
    name: 'Siti Aminah, M.Pd',
    nip: '199005182015032001',
    instansi: 'SMP Negeri 2 Bandung',
    email: 'siti.aminah@smp2bandung.sch.id',
    phone: '6281398765432',
    progressPercent: 100,
    completedModules: 5,
    status: 'Selesai',
    pendingTasks: 0,
    scoreAvg: 93.8
  },
  {
    id: 'TR-1003',
    name: 'Agus Wijaya, S.ST',
    nip: '198511202010011005',
    instansi: 'SMK Negeri 1 Surabaya',
    email: 'agus.wijaya@smkn1surabaya.sch.id',
    phone: '6281567890123',
    progressPercent: 80,
    completedModules: 4,
    status: 'Lancar',
    pendingTasks: 1,
    scoreAvg: 88.2
  },
  {
    id: 'TR-1004',
    name: 'Nadia Fitriani, S.Pd',
    nip: '199208042018012004',
    instansi: 'SDN 01 Menteng Jakarta',
    email: 'nadia.fitriani@sdn01menteng.sch.id',
    phone: '6281789012345',
    progressPercent: 100,
    completedModules: 5,
    status: 'Selesai',
    pendingTasks: 0,
    scoreAvg: 95.0
  },
  {
    id: 'TR-1005',
    name: 'Dedi Kurniawan, M.Si',
    nip: '198402112009021001',
    instansi: 'SMA Negeri 3 Yogyakarta',
    email: 'dedi.kurniawan@sma3yogya.sch.id',
    phone: '6281901234567',
    progressPercent: 60,
    completedModules: 3,
    status: 'Perlu Perhatian',
    pendingTasks: 2,
    scoreAvg: 76.0
  }
];

export const INITIAL_PROMOTION_CANDIDATES: PromotionCandidate[] = [
  {
    id: 'PROM-01',
    name: 'Nadia Fitriani, S.Pd',
    nip: '199208042018012004',
    instansi: 'SDN 01 Menteng Jakarta',
    avgScore: 95.0,
    completedAt: '20 Mei 2026',
    status: 'eligible'
  },
  {
    id: 'PROM-02',
    name: 'Siti Aminah, M.Pd',
    nip: '199005182015032001',
    instansi: 'SMP Negeri 2 Bandung',
    avgScore: 93.8,
    completedAt: '22 Mei 2026',
    status: 'eligible'
  },
  {
    id: 'PROM-03',
    name: 'Agus Wijaya, S.ST',
    nip: '198511202010011005',
    instansi: 'SMK Negeri 1 Surabaya',
    avgScore: 88.2,
    completedAt: '24 Mei 2026',
    status: 'eligible'
  }
];

export const INITIAL_UNLOCK_REQUESTS: ProfileUnlockRequest[] = [
  {
    id: 'REQ-801',
    traineeId: 'TR-1001',
    traineeName: 'Budi Santoso, S.Pd',
    nip: '198803122014021003',
    instansi: 'SMA Negeri 1 Jakarta',
    requestedFields: ['Gelar Akademik', 'NIP/NIK', 'Instansi Pembina'],
    reason: 'Penambahan gelar magister pendidikan (M.Pd) yang baru disahkan dan koreksi penulisan NIP dinas.',
    requestedAt: '25 Mei 2026, 10:15 WIB',
    status: 'pending'
  },
  {
    id: 'REQ-802',
    traineeId: 'TR-1005',
    traineeName: 'Dedi Kurniawan, M.Si',
    nip: '198402112009021001',
    instansi: 'SMA Negeri 3 Yogyakarta',
    requestedFields: ['Instansi / Sekolah'],
    reason: 'Mutasi tugas mengajar ke SMAN 1 Sleman Yogyakarta per 1 Mei 2026.',
    requestedAt: '23 Mei 2026, 16:30 WIB',
    status: 'pending'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'LOG-9901',
    timestamp: '25 Mei 2026 14:45:10',
    actor: 'Dr. Hendra Wijaya',
    role: 'Mentor',
    action: 'Grading Submission',
    target: 'Trainee: Budi Santoso (TSK-003)',
    ipAddress: '180.252.12.89',
    status: 'Success'
  },
  {
    id: 'LOG-9902',
    timestamp: '25 Mei 2026 10:15:22',
    actor: 'Budi Santoso, S.Pd',
    role: 'Trainee',
    action: 'Request Profile Unlock',
    target: 'Profile Field Revision Request #REQ-801',
    ipAddress: '114.124.201.5',
    status: 'Success'
  },
  {
    id: 'LOG-9903',
    timestamp: '24 Mei 2026 18:30:00',
    actor: 'Super Admin AKTARA',
    role: 'Admin',
    action: 'Promote User to Mentor',
    target: 'User: Retno Hapsari, M.Pd promoted to Mentor',
    ipAddress: '103.111.90.12',
    status: 'Success'
  },
  {
    id: 'LOG-9904',
    timestamp: '24 Mei 2026 11:20:05',
    actor: 'System Security',
    role: 'System',
    action: 'Failed Login Attempt',
    target: 'User: admin_test@aktara.id',
    ipAddress: '36.88.10.4',
    status: 'Warning'
  }
];

export const DEFAULT_CERT_VARIABLES: CertVariable[] = [
  { id: 'v1', label: 'Nama Lengkap Peserta', tag: '{nama_lengkap}', x: 50, y: 38, fontSize: 26, color: '#0F2C3A', isBold: true, visible: true },
  { id: 'v2', label: 'NIP / NIK Peserta', tag: '{nip_nik}', x: 50, y: 44, fontSize: 14, color: '#475569', isBold: false, visible: true },
  { id: 'v3', label: 'Instansi / Satuan Pendidikan', tag: '{instansi}', x: 50, y: 49, fontSize: 16, color: '#0F2C3A', isBold: true, visible: true },
  { id: 'v4', label: 'Nomor Sertifikat Resm', tag: '{nomor_sertifikat}', x: 50, y: 18, fontSize: 13, color: '#0F2C3A', isBold: true, visible: true },
  { id: 'v5', label: 'Nama Program TOT', tag: '{nama_program}', x: 50, y: 62, fontSize: 18, color: '#C68E28', isBold: true, visible: true },
  { id: 'v6', label: 'Tanggal Kelulusan', tag: '{tanggal_lulus}', x: 30, y: 80, fontSize: 12, color: '#334155', isBold: false, visible: true },
  { id: 'v7', label: 'Verifikasi QR Code', tag: '{qr_code}', x: 80, y: 78, fontSize: 10, color: '#0F2C3A', isBold: false, visible: true }
];
