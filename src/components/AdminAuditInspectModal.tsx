import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  User, 
  Mail, 
  Globe, 
  Smartphone, 
  FileText, 
  Award, 
  Calendar, 
  Building, 
  CheckCircle2, 
  FileSearch,
  Download,
  Fingerprint,
  RefreshCw,
  Clock
} from 'lucide-react';
import { UserActivityItem } from '../types/AdminActivity';

interface AdminAuditInspectModalProps {
  activity: UserActivityItem | null;
  onClose: () => void;
  onUpdateStatus?: (activityId: string, newStatus: UserActivityItem['status']) => void;
}

export const AdminAuditInspectModal: React.FC<AdminAuditInspectModalProps> = ({
  activity,
  onClose,
  onUpdateStatus
}) => {
  if (!activity) return null;

  const [activeStatus, setActiveStatus] = useState<UserActivityItem['status']>(activity.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = (newStatus: UserActivityItem['status']) => {
    setIsUpdating(true);
    setTimeout(() => {
      setActiveStatus(newStatus);
      if (onUpdateStatus) {
        onUpdateStatus(activity.id, newStatus);
      }
      setIsUpdating(false);
    }, 400);
  };

  const getStatusBadge = (status: UserActivityItem['status']) => {
    switch (status) {
      case 'VERIFIED_VALID':
        return {
          label: 'VERIFIED VALID',
          bg: 'bg-emerald-950/80',
          border: 'border-emerald-700',
          text: 'text-emerald-300',
          icon: ShieldCheck
        };
      case 'SUSPICIOUS_FLAGGED':
        return {
          label: 'SUSPICIOUS FLAGGED',
          bg: 'bg-amber-950/80',
          border: 'border-amber-700',
          text: 'text-amber-300',
          icon: AlertTriangle
        };
      case 'REJECTED_FRAUDULENT':
        return {
          label: 'REJECTED FRAUDULENT',
          bg: 'bg-rose-950/80',
          border: 'border-rose-700',
          text: 'text-rose-300',
          icon: XCircle
        };
      default:
        return {
          label: 'PENDING PROCESSING',
          bg: 'bg-blue-950/80',
          border: 'border-blue-700',
          text: 'text-blue-300',
          icon: Clock
        };
    }
  };

  const badge = getStatusBadge(activeStatus);
  const StatusIcon = badge.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-4xl bg-[#0c1326] border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Top Bar Header */}
          <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-slate-800 bg-[#090e1c]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <FileSearch className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                    AUDIT RECORD #{activity.id}
                  </span>
                  <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                    {new Date(activity.submittedAt).toLocaleString()}
                  </span>
                </div>
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight mt-0.5">
                  User Certificate Forensic Audit Inspection
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body: Scrollable Content */}
          <div className="p-5 sm:p-7 space-y-6 overflow-y-auto flex-1">
            {/* User & Document Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* User Identity Box */}
              <div className="p-4 rounded-2xl bg-[#0e172e] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span>User Profile Information</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">ID: {activity.userId}</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Full Name:</span>
                    <span className="font-semibold text-white">{activity.userName}</span>
                  </div>
                  <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-500" />
                      <span>Email:</span>
                    </span>
                    <span className="font-mono text-cyan-300">{activity.userEmail}</span>
                  </div>
                  <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-slate-500" />
                      <span>IP Address:</span>
                    </span>
                    <span className="font-mono text-slate-300">{activity.userIp}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Smartphone className="w-3 h-3 text-slate-500" />
                      <span>Device / Platform:</span>
                    </span>
                    <span className="text-slate-300 text-[11px] truncate max-w-[200px]">{activity.device}</span>
                  </div>
                </div>
              </div>

              {/* Certificate Submission Box */}
              <div className="p-4 rounded-2xl bg-[#0e172e] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Submitted Document Details</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {activity.certificateType}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Document Title:</span>
                    <span className="font-semibold text-white truncate max-w-[220px]">{activity.documentTitle}</span>
                  </div>
                  <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-500" />
                      <span>Issuing Authority:</span>
                    </span>
                    <span className="text-slate-200 truncate max-w-[200px]">{activity.issuerName}</span>
                  </div>
                  <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
                    <span className="text-slate-400 flex items-center gap-1">
                      <FileText className="w-3 h-3 text-slate-500" />
                      <span>Filename & Size:</span>
                    </span>
                    <span className="font-mono text-slate-300 text-[11px]">
                      {activity.originalFilename} ({(activity.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Fingerprint className="w-3 h-3 text-slate-500" />
                      <span>Format:</span>
                    </span>
                    <span className="font-mono text-cyan-400">{activity.fileFormat} Document</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Forensic Outcome Banner */}
            <div className={`p-4 sm:p-5 rounded-2xl border ${badge.border} ${badge.bg} space-y-3`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center">
                    <StatusIcon className={`w-6 h-6 ${badge.text}`} />
                  </div>
                  <div>
                    <span className={`text-xs font-black tracking-wide ${badge.text}`}>
                      {badge.label}
                    </span>
                    <p className="text-xs text-slate-200 mt-0.5">{activity.resultSummary}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-black/40 px-3.5 py-2 rounded-xl border border-white/10 shrink-0">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-mono">CONFIDENCE</p>
                    <p className="text-base font-black text-white font-mono">{activity.confidenceScore}%</p>
                  </div>
                  <div className="w-px h-7 bg-white/10" />
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-mono">TRUST SCORE</p>
                    <p className={`text-base font-black font-mono ${activity.trustScore >= 80 ? 'text-emerald-400' : activity.trustScore >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {activity.trustScore}/100
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/30 border border-white/5 text-xs text-slate-300">
                <span className="font-semibold text-white">Forensic Key Finding: </span>
                <span>{activity.keyFinding}</span>
              </div>
            </div>

            {/* OCR Extracted Information Grid */}
            <div className="space-y-2">
              <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>Extracted OCR Data Fields</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-[#080e1e] border border-slate-800">
                  <p className="text-[10px] text-slate-400">Recipient Name</p>
                  <p className="text-xs font-semibold text-white mt-0.5">{activity.ocrExtracted.recipientName}</p>
                </div>
                <div className="p-3 rounded-xl bg-[#080e1e] border border-slate-800">
                  <p className="text-[10px] text-slate-400">Certificate / Reg ID</p>
                  <p className="text-xs font-mono font-semibold text-cyan-300 mt-0.5">{activity.ocrExtracted.idNumber}</p>
                </div>
                <div className="p-3 rounded-xl bg-[#080e1e] border border-slate-800">
                  <p className="text-[10px] text-slate-400">Issuing Institution</p>
                  <p className="text-xs font-semibold text-white mt-0.5 truncate">{activity.ocrExtracted.institution}</p>
                </div>
                <div className="p-3 rounded-xl bg-[#080e1e] border border-slate-800">
                  <p className="text-[10px] text-slate-400">Issue Date</p>
                  <p className="text-xs font-mono text-slate-300 mt-0.5">{activity.ocrExtracted.issueDate}</p>
                </div>
                <div className="p-3 rounded-xl bg-[#080e1e] border border-slate-800">
                  <p className="text-[10px] text-slate-400">Course / Specialization</p>
                  <p className="text-xs font-medium text-slate-200 mt-0.5 truncate">{activity.ocrExtracted.courseOrSpecialization || 'N/A'}</p>
                </div>
                <div className="p-3 rounded-xl bg-[#080e1e] border border-slate-800">
                  <p className="text-[10px] text-slate-400">Score / Grade Conferred</p>
                  <p className="text-xs font-semibold text-emerald-400 mt-0.5">{activity.ocrExtracted.scoreOrGrade || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Forensic Checks Pipeline */}
            <div className="space-y-2">
              <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Multi-Layer Forensic Verification Checks</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activity.forensicChecks.map((chk) => (
                  <div key={chk.id} className="p-3 rounded-xl bg-[#080e1e] border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200">{chk.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        chk.status === 'PASSED'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : chk.status === 'WARNING'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}>
                        {chk.status} ({chk.score}%)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{chk.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cryptographic SHA-256 Stamp */}
            <div className="p-3 rounded-xl bg-[#070b16] border border-slate-800 font-mono text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-slate-400 truncate">
                <Fingerprint className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-slate-500">SHA256:</span>
                <span className="text-slate-300 truncate">{activity.sha256Hash}</span>
              </div>
              <span className="text-[10px] text-emerald-400 shrink-0 font-bold">
                ✓ HSM TIMESTAMPED
              </span>
            </div>
          </div>

          {/* Bottom Bar: Admin Action Controls */}
          <div className="p-4 sm:p-5 border-t border-slate-800 bg-[#090e1c] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400">Admin Override:</span>
              <div className="flex items-center gap-1.5 flex-1 sm:flex-initial">
                <button
                  type="button"
                  onClick={() => handleStatusChange('VERIFIED_VALID')}
                  disabled={isUpdating}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeStatus === 'VERIFIED_VALID'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Verify
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange('SUSPICIOUS_FLAGGED')}
                  disabled={isUpdating}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeStatus === 'SUSPICIOUS_FLAGGED'
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Flag
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange('REJECTED_FRAUDULENT')}
                  disabled={isUpdating}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeStatus === 'REJECTED_FRAUDULENT'
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Reject
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
