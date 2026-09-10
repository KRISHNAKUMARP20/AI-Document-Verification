import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Download, 
  Share2, 
  ArrowRight, 
  Check, 
  ShieldCheck,
  ExternalLink 
} from 'lucide-react';
import { CertificateDocument } from '../components/certificate/CertificateDocument';
import { DocumentRecord } from '../types/Document';
import { VerificationResultPayload } from '../types/Verification';
import { generateVerificationPdfReport } from '../utils/pdfReportGenerator';

interface VerificationResultPageProps {
  document: DocumentRecord;
  result: VerificationResultPayload;
  onNavigateTab: (tab: string) => void;
  onOpenReportModal?: () => void;
  onReverify?: () => void;
  isProcessing?: boolean;
}

export const VerificationResultPage: React.FC<VerificationResultPageProps> = ({
  document,
  result,
  onNavigateTab,
  onOpenReportModal
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [shared, setShared] = useState(false);

  const handleDownload = () => {
    try {
      generateVerificationPdfReport(document, result);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
      if (onOpenReportModal) {
        onOpenReportModal();
      }
    } catch (err) {
      console.error('Failed generating PDF:', err);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    }
  };

  const pdfBlobUrl = React.useMemo(() => {
    if (!document?.fileDataUrl?.startsWith('data:application/pdf')) return null;
    try {
      const base64 = document.fileDataUrl.split(',')[1];
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      return URL.createObjectURL(blob);
    } catch (e) {
      return null;
    }
  }, [document?.fileDataUrl]);

  return (
    <div id="verification-result-screen" className="max-w-4xl mx-auto space-y-6">
      {/* Top Dynamic Verification Card */}
      <div 
        className={`p-5 rounded-2xl border shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          result.status === 'FLAGGED' || result.status === 'REJECTED'
            ? 'bg-gradient-to-r from-red-950/80 via-red-900/60 to-red-950/80 border-red-500/40 animate-[pulse_2s_ease-in-out_infinite]'
            : 'bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-emerald-950/80 border-emerald-500/40'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div 
            className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-lg ${
              result.status === 'FLAGGED' || result.status === 'REJECTED'
                ? 'bg-red-500 text-white shadow-red-500/30'
                : 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
            }`}
          >
            {result.status === 'FLAGGED' || result.status === 'REJECTED' ? (
              <span className="text-2xl font-bold">!</span>
            ) : (
              <Check className="w-7 h-7 stroke-[3]" />
            )}
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {result.status === 'FLAGGED' || result.status === 'REJECTED' 
                ? 'Fraud / Tampering Detected' 
                : 'Certificate Verified'}
            </h1>
            <p className={`text-xs font-medium ${
              result.status === 'FLAGGED' || result.status === 'REJECTED' ? 'text-red-300/90' : 'text-emerald-200/90'
            }`}>
              {result.status === 'FLAGGED' || result.status === 'REJECTED' 
                ? 'This document shows signs of modification or manipulation.' 
                : 'This document is authentic and valid.'}
            </p>
          </div>
        </div>

        <div className={`text-left sm:text-right text-xs space-y-0.5 border-t sm:border-t-0 pt-2 sm:pt-0 ${
          result.status === 'FLAGGED' || result.status === 'REJECTED' ? 'border-red-800/60' : 'border-emerald-800/60'
        }`}>
          <p className={`font-mono font-semibold ${
            result.status === 'FLAGGED' || result.status === 'REJECTED' ? 'text-red-400' : 'text-emerald-400'
          }`}>
            Verification ID #{result.verificationLogId || 'VR20250114001'}
          </p>
          <p className="text-slate-400 text-[11px]">
            Verified on {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      {/* 2-Column Content matching Screen 8 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left: Certificate Preview Document */}
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-[#0e172e] p-2 flex items-center justify-center min-h-[300px]">
          {document?.fileDataUrl ? (
            document.fileDataUrl.startsWith('data:application/pdf') ? (
              <iframe src={pdfBlobUrl || ''} title="PDF Preview" className="w-full h-[500px] rounded-xl bg-white border-0" />
            ) : (
              <img src={document.fileDataUrl} alt="Uploaded document" className="w-full h-auto rounded-xl object-contain max-h-[600px] bg-white" />
            )
          ) : (
            <CertificateDocument 
              compact={true} 
              name={(result.ocr.extractedFields?.fullName as string) || undefined}
              certificateId={result.certificate?.certificateNumber || (result.ocr.extractedFields?.documentNumber as string) || undefined}
              institution={result.certificate?.issuerAuthority || (result.ocr.extractedFields?.issuingAuthority as string) || undefined}
              course={document?.documentType || 'Document'}
              issueDate={(result.ocr.extractedFields?.dateOfIssue as string) || undefined}
            />
          )}
        </div>

        {/* Right: Verification Summary Card matching Screen 8 */}
        <div className="p-6 rounded-2xl bg-[#0e172e] border border-slate-800 space-y-6 shadow-xl">
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-white border-b border-slate-800 pb-3">
              Verification Summary
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-400">Name</span>
                <span className="font-semibold text-white">{(result.ocr.extractedFields?.fullName as string) || 'N/A'}</span>
              </div>

              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-400">Certificate ID</span>
                <span className="font-mono text-slate-200">{result.certificate?.certificateNumber || (result.ocr.extractedFields?.documentNumber as string) || 'N/A'}</span>
              </div>

              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-400">Institution</span>
                <span className="font-medium text-slate-200">{result.certificate?.issuerAuthority || (result.ocr.extractedFields?.issuingAuthority as string) || 'N/A'}</span>
              </div>

              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-400">Document Type</span>
                <span className="font-medium text-slate-200">{document?.documentType || 'N/A'}</span>
              </div>

              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-400">Issue Date</span>
                <span className="font-medium text-slate-200">{(result.ocr.extractedFields?.dateOfIssue as string) || 'N/A'}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-slate-800/80">
                <span className="text-slate-400 font-semibold">Status</span>
                <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold tracking-wide ${result.status === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : result.status === 'FLAGGED' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}>
                  {result.status}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons matching Screen 8 */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center gap-3">
              <button
                id="btn-download-report"
                onClick={handleDownload}
                className="flex-1 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                {downloadSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Report Generated!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Report</span>
                  </>
                )}
              </button>

              <button
                id="btn-share-result"
                onClick={handleShare}
                className="py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-slate-400" />
                <span>{shared ? 'Copied Link!' : 'Share Result'}</span>
              </button>
            </div>

            {/* View Detailed Analysis Link / Button matching Screen 8 */}
            <button
              id="btn-view-detailed-analysis"
              onClick={() => onNavigateTab('detailed-analysis')}
              className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-blue-400 hover:text-blue-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-800 transition-colors cursor-pointer"
            >
              <span>View Detailed Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
