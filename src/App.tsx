import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { UploadDocumentPage } from './pages/UploadDocument';
import { AIProcessingPage } from './pages/AIProcessing';
import { ExtractedInformationPage } from './pages/ExtractedInformation';
import { VerificationChecksPage } from './pages/VerificationChecks';
import { VerificationResultPage } from './pages/VerificationResult';
import { DetailedAnalysisPage } from './pages/DetailedAnalysis';
import { VerificationHistoryPage } from './pages/VerificationHistory';
import { ProfilePage } from './pages/Profile';
import { SettingsPage } from './pages/Settings';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import { LogoutScreen } from './pages/LogoutScreen';
import { AdminUserActivityPage } from './pages/AdminUserActivity';
import { DownloadReportModal } from './components/report/DownloadReportModal';
import { documentService } from './services/documentService';
import { verificationService } from './services/verificationService';
import { DocumentRecord, IssuerRecord } from './types/Document';
import { VerificationResultPayload } from './types/Verification';

function MainAppContent() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('login');
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [issuers, setIssuers] = useState<IssuerRecord[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>('doc-001');
  const [selectedResult, setSelectedResult] = useState<VerificationResultPayload | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Load initial documents & issuers
  useEffect(() => {
    async function loadData() {
      try {
        const [docs, issuerList] = await Promise.all([
          documentService.getDocuments(),
          documentService.getAccreditedIssuers()
        ]);
        setDocuments(docs);
        setIssuers(issuerList);

        if (docs.length > 0) {
          const defaultDoc = docs[0];
          setSelectedDocId(defaultDoc.id);
          const result = await verificationService.getVerificationResult(defaultDoc.id);
          setSelectedResult(result);
        }
      } catch (err) {
        console.error('Failed to load initial data:', err);
      }
    }
    loadData();
  }, []);

  const handleSelectDocument = async (docId: string) => {
    setSelectedDocId(docId);
    try {
      const res = await verificationService.getVerificationResult(docId);
      setSelectedResult(res);
      setActiveTab('result');
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadAndVerify = async (uploadPayload: any) => {
    setActiveTab('processing');
  };

  const handleLogout = () => {
    logout();
    setActiveTab('logout-screen');
  };

  const activeDoc = documents.find(d => d.id === selectedDocId) || documents[0] || {
    id: 'doc-001',
    userId: 'usr_krishna',
    title: 'Certificate of Completion - Rohan Kumar',
    documentType: 'CERTIFICATE',
    originalFilename: 'certificate.jpg',
    fileSizeBytes: 2516582,
    mimeType: 'image/jpeg',
    sha256Hash: 'a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8',
    status: 'VERIFIED_VALID',
    overallConfidenceScore: 98.4,
    createdAt: '2025-01-14T10:34:00.000Z',
    updatedAt: '2025-01-14T10:34:00.000Z'
  };

  // Determine current effective screen based on authentication
  const currentTab = !user
    ? (activeTab === 'register' ? 'register' : (activeTab === 'logout-screen' ? 'logout-screen' : 'login'))
    : (activeTab === 'login' || activeTab === 'register' ? 'dashboard' : activeTab);

  // Check if current view is a standalone auth/logout card view
  const isStandaloneCardView = currentTab === 'login' || currentTab === 'register' || currentTab === 'logout-screen';

  return (
    <div className="min-h-screen bg-[#070b16] text-slate-100 flex flex-col font-['Inter']">
      {/* Top Header Navbar */}
      <Navbar
        activeTab={currentTab}
        setActiveTab={setActiveTab}
        onLogoutClick={handleLogout}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Container */}
      {isStandaloneCardView ? (
        <div className="flex-1 flex items-center justify-center p-3 sm:p-6 w-full">
          {currentTab === 'login' && (
            <LoginPage
              onSuccess={() => setActiveTab('dashboard')}
              onSwitchToRegister={() => setActiveTab('register')}
            />
          )}

          {currentTab === 'register' && (
            <RegisterPage
              onSuccess={() => setActiveTab('dashboard')}
              onSwitchToLogin={() => setActiveTab('login')}
            />
          )}

          {currentTab === 'logout-screen' && (
            <LogoutScreen
              onBackToLogin={() => setActiveTab('login')}
            />
          )}
        </div>
      ) : (
        <div className="flex-1 flex max-w-7xl w-full mx-auto p-3 sm:p-6 gap-6">
          {/* Left Sidebar (Desktop persistent + Mobile drawer) */}
          <Sidebar
            activeTab={currentTab}
            setActiveTab={setActiveTab}
            selectedDocId={selectedDocId}
            onLogoutClick={handleLogout}
            isMobileOpen={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
          />

          {/* Center Main Stage */}
          <main className="flex-1 min-w-0">
            {/* Screen 3: Dashboard */}
            {currentTab === 'dashboard' && (
              <Dashboard
                documents={documents}
                onSelectDocument={handleSelectDocument}
                onNavigate={setActiveTab}
              />
            )}

            {/* Admin Dedicated View: User Full Activity */}
            {currentTab === 'admin-activity' && (
              <AdminUserActivityPage />
            )}

            {/* Screen 4: Upload Document */}
            {currentTab === 'upload' && (
              <UploadDocumentPage
                issuers={issuers}
                onUploadAndVerify={handleUploadAndVerify}
                onAnalyzeDirect={() => setActiveTab('processing')}
              />
            )}

            {/* Screen 5: AI Processing */}
            {currentTab === 'processing' && (
              <AIProcessingPage
                onComplete={() => setActiveTab('extracted-info')}
                autoAdvance={true}
              />
            )}

            {/* Screen 6: Extracted Information */}
            {currentTab === 'extracted-info' && (
              <ExtractedInformationPage
                document={activeDoc}
                ocrData={selectedResult?.ocr || null}
                onNext={() => setActiveTab('checks')}
              />
            )}

            {/* Screen 7: Verification Checks */}
            {currentTab === 'checks' && (
              <VerificationChecksPage
                document={activeDoc}
                checks={selectedResult?.checks || []}
                onNext={() => setActiveTab('result')}
                onBackToOverview={() => setActiveTab('result')}
              />
            )}

            {/* Screen 8: Final Result */}
            {currentTab === 'result' && (
              <VerificationResultPage
                document={activeDoc}
                result={selectedResult || ({} as any)}
                onNavigateTab={setActiveTab}
                onOpenReportModal={() => setIsReportModalOpen(true)}
              />
            )}

            {/* Screen 9: Detailed Analysis */}
            {currentTab === 'detailed-analysis' && (
              <DetailedAnalysisPage
                document={activeDoc}
                tamper={selectedResult?.tamper || null}
                risk={selectedResult?.risk || null}
              />
            )}

            {/* Screen 10: Verification History */}
            {currentTab === 'history' && (
              <VerificationHistoryPage
                documents={documents}
                onSelectDoc={handleSelectDocument}
                onViewRecord={() => setActiveTab('result')}
              />
            )}

            {/* Settings & Profile views */}
            {currentTab === 'profile' && <ProfilePage />}
            {currentTab === 'settings' && <SettingsPage />}
          </main>
        </div>
      )}

      {/* Screen 11: Download Report Modal */}
      <DownloadReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        document={activeDoc}
        result={selectedResult}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
