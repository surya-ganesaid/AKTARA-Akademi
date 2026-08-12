import React, { useState } from 'react';
import { AuthPage } from './components/auth/AuthPage';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

// Import Admin Components (Modular)
import AdminDashboard from './components/admin/AdminDashboard';
import BatchManagement from './components/admin/BatchManagement';
import LmsIntegration from './components/admin/LmsIntegration';
import CertificateMapper from './components/admin/BatchCertificateMapper';
import PromotionApproval from './components/admin/PromotionApproval';
import SecurityAuditLogs from './components/admin/SecurityAuditLogs';
import SettingsPage from './components/SettingsPage';

// Import Mentor & Trainee Components
import MentorDashboard from './components/mentor/MentorDashboard';
import { TraineePortal } from './components/trainee/TraineePortal';

export function App() {
  // Set ke null agar langsung menampilkan Halaman Login & Pendaftaran Peserta saat pertama dibuka
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);

  // State Navigation Active Tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Simulated Role Switcher Handler
  const handleRoleSwitch = (newRole: string) => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        role: newRole
      });

      const roleLower = newRole.toLowerCase();
      if (roleLower === 'superadmin' || roleLower === 'admin') {
        setActiveTab('dashboard');
      } else if (roleLower === 'mentor' || roleLower === 'instructor') {
        setActiveTab('webinars');
      } else {
        setActiveTab('modules');
      }
    }
  };

  // Handler Simpan Settings
  const handleSaveSettings = (settingsData: any) => {
    alert('Pengaturan sistem berhasil diperbarui!');
  };

  // Jika belum login, tampilkan AuthPage (Form Login & Pendaftaran Peserta)
  if (!currentUser) {
    return (
      <AuthPage 
        onLoginSuccess={(userData) => {
          setCurrentUser(userData);
          const roleLower = userData.role?.toLowerCase() || 'trainee';

          if (roleLower === 'superadmin' || roleLower === 'admin') {
            setActiveTab('dashboard');
          } else if (roleLower === 'mentor' || roleLower === 'instructor') {
            setActiveTab('webinars');
          } else {
            setActiveTab('modules');
          }
        }} 
      />
    );
  }

  const userRole = currentUser.role?.toLowerCase() || 'trainee';
  const isAdmin = userRole === 'superadmin' || userRole === 'admin';
  const isMentor = userRole === 'mentor' || userRole === 'instructor';
  const isTrainee = !isAdmin && !isMentor;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar Navigasi Utama */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userRole={currentUser.role}
        onLogout={() => setCurrentUser(null)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Bar */}
        <Header 
          userName={currentUser.name} 
          userEmail={currentUser.email} 
          userRole={currentUser.role}
          onLogout={() => setCurrentUser(null)}
          onRoleSwitch={handleRoleSwitch}
        />

        {/* Dynamic Content Area (Modular Rendering) */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50 p-6">
          {/* 1. LAYAR KHUSUS SUPER ADMIN / ADMIN */}
          {isAdmin && (
            <div className="space-y-6">
              {activeTab === 'dashboard' && <AdminDashboard />}
              {activeTab === 'batches' && <BatchManagement />}
              {activeTab === 'lms' && <LmsIntegration />}
              {activeTab === 'certificate-mapper' && <CertificateMapper />}
              {activeTab === 'promotion-approval' && <PromotionApproval />}
              {activeTab === 'audit-logs' && <SecurityAuditLogs />}
              {activeTab === 'settings' && (
                <SettingsPage 
                  userRole={currentUser.role} 
                  userName={currentUser.name} 
                  userEmail={currentUser.email} 
                  onSaveSettings={handleSaveSettings}
                />
              )}
            </div>
          )}

          {/* 2. LAYAR KHUSUS MENTOR / MASTER TRAINER */}
          {isMentor && (
            <div className="space-y-6">
              <MentorDashboard 
                userName={currentUser.name} 
                activeTab={activeTab} 
              />
            </div>
          )}

          {/* 3. LAYAR KHUSUS TRAINEE / GURU */}
          {isTrainee && (
            <div className="space-y-6">
              <TraineePortal 
                userName={currentUser.name} 
                userEmail={currentUser.email} 
                activeTab={activeTab}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;