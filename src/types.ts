export type UserRole = 'trainee' | 'mentor' | 'admin';

export type TraineeTab = 'dashboard' | 'lms' | 'tasks' | 'profile' | 'certificate';
export type MentorTab = 'dashboard' | 'grading' | 'live_session' | 'trainees';
export type AdminTab = 'dashboard' | 'promotions' | 'batch_cert' | 'security_audit' | 'settings';

export interface DiscussionComment {
  id: string;
  author: string;
  role: 'Trainee' | 'Mentor' | 'Admin';
  avatar: string;
  text: string;
  time: string;
}

export interface ResourceFile {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'link';
  size: string;
  url: string;
}

export interface LMSModule {
  id: number;
  title: string;
  subtitle: string;
  duration: string;
  status: 'completed' | 'active' | 'locked';
  videoUrl: string;
  description: string;
  resources: ResourceFile[];
  discussions: DiscussionComment[];
}

export interface TraineeTask {
  id: string;
  moduleName: string;
  title: string;
  submittedAt: string;
  status: 'menunggu_penilaian' | 'perlu_revisi' | 'lulus';
  fileName?: string;
  driveLink?: string;
  feedback?: string;
  mentorName?: string;
  score?: number;
  fileType?: 'pdf' | 'docx' | 'link';
  revisionNotes?: string;
}

export interface GradingSubmission {
  id: string;
  traineeId: string;
  traineeName: string;
  traineeEmail: string;
  traineeAvatar: string;
  taskTitle: string;
  moduleName: string;
  submittedDate: string;
  docType: 'pdf' | 'docx';
  fileName: string;
  fileSize: string;
  contentSnippet: string;
  scores: {
    kurikulum: number; // 30%
    aiTools: number;   // 40%
    metodologi: number; // 30%
  };
  weightedTotal: number;
  status: 'menunggu' | 'lulus' | 'perlu_revisi';
  feedbackText: string;
  revisionCount: number;
}

export interface LiveSession {
  id: string;
  title: string;
  batchName: string;
  date: string;
  time: string;
  trainer: string;
  meetUrl: string;
  description: string;
  status: 'upcoming' | 'live' | 'ended';
  attendanceCount?: number;
}

export interface TraineeDirectoryItem {
  id: string;
  name: string;
  nip: string;
  instansi: string;
  email: string;
  phone: string;
  progressPercent: number;
  completedModules: number;
  status: 'Lancar' | 'Perlu Perhatian' | 'Selesai';
  pendingTasks: number;
  scoreAvg: number;
}

export interface PromotionCandidate {
  id: string;
  name: string;
  nip: string;
  instansi: string;
  avgScore: number;
  completedAt: string;
  status: 'eligible' | 'promoted' | 'hold';
}

export interface ProfileUnlockRequest {
  id: string;
  traineeId: string;
  traineeName: string;
  nip: string;
  instansi: string;
  requestedFields: string[];
  reason: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  ipAddress: string;
  status: 'Success' | 'Warning' | 'Error';
}

export interface CertVariable {
  id: string;
  label: string;
  tag: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  isBold: boolean;
  visible: boolean;
}
