import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  FileCheck2,
  Lock,
  ExternalLink,
  Download
} from 'lucide-react';
import { VerificationStatusType } from '../../types/Verification';

interface VerificationStatusProps {
  status: VerificationStatusType;
  verificationLogId: string;
  executionTimeMs: number;
  documentTitle: string;
  summaryReport: string;
  onDownloadPdf?: () => void;
}

export const VerificationStatus: React.FC<VerificationStatusProps> = ({
  status,
  verificationLogId,
  executionTimeMs,
  documentTitle,
  summaryReport,
  onDownloadPdf
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'VERIFIED':
        return {
          title: 'Document Legally Verified & Certified Authentic',
          badgeText: 'OFFICIALLY VERIFIED',
          bgClass: 'bg-emerald-950/40 border-emerald-700/60 text-emerald-200',
          badgeClass: 'bg-emerald-900/80 text-emerald-300 border-emerald-600',
          icon: CheckCircle2,
          iconColor: 'text-emerald-400'
        };
      case 'FLAGGED':
        return {
          title: 'Manual Review Required - Anomalies Detected',
          badgeText: 'SECURITY FLAGGED',
          bgClass: 'bg-amber-950/40 border-amber-700/60 text-amber-200',
          badgeClass: 'bg-amber-900/80 text-amber-300 border-amber-600',
          icon: AlertTriangle,
          iconColor: 'text-amber-400'
        };
      case 'REJECTED':
        return {
          title: 'Verification Failed - High Risk / Fraudulent Markers',
          badgeText: 'REJECTED / FRAUD DETECTED',
          bgClass: 'bg-rose-950/40 border-rose-700/60 text-rose-200',
          badgeClass: 'bg-rose-900/80 text-rose-300 border-rose-600',
          icon: XCircle,
          iconColor: 'text-rose-400'
        };
      default:
        return {
          title: 'Verification Pending In-Depth Forensic Analysis',
          badgeText: 'IN REVIEW',
          bgClass: 'bg-cyan-950/40 border-cyan-700/60 text-cyan-200',
          badgeClass: 'bg-cyan-900/80 text-cyan-300 border-cyan-600',
          icon: Clock,
          iconColor: 'text-cyan-400'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div id="verification-status-banner" className={`p-6 rounded-2xl border ${config.bgClass} shadow-lg space-y-4`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700 shrink-0 mt-0.5">
            <Icon className={`w-6 h-6 ${config.iconColor}`} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-[10px] font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${config.badgeClass}`}>
                {config.badgeText}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Log ID: #{verificationLogId}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">{config.title}</h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto text-xs text-slate-400">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/70 border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Exec: {executionTimeMs}ms</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/70 border border-slate-800">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Secured Audit Trail</span>
          </div>
          {onDownloadPdf && (
            <button
              id="btn-download-pdf-summary"
              onClick={onDownloadPdf}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-md shadow-cyan-900/40 border border-cyan-400/50 transition-all cursor-pointer"
              title="Download official forensic verification summary report in PDF format"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF Report</span>
            </button>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-700/50">
        <p className="text-xs text-slate-300 leading-relaxed">
          {summaryReport}
        </p>
      </div>
    </div>
  );
};
