import React, { useState } from 'react';
import { 
  Shield, 
  CheckCircle2, 
  Download, 
  Printer, 
  X, 
  Check, 
  ShieldCheck 
} from 'lucide-react';
import { CertificateDocument } from '../certificate/CertificateDocument';
import { DocumentRecord } from '../../types/Document';
import { VerificationResultPayload } from '../../types/Verification';
import { generateVerificationPdfReport } from '../../utils/pdfReportGenerator';

interface DownloadReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  document?: DocumentRecord | null;
  result?: VerificationResultPayload | null;
}

export const DownloadReportModal: React.FC<DownloadReportModalProps> = ({
  isOpen,
  onClose,
  document,
  result
}) => {
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    try {
      if (document && result) {
        generateVerificationPdfReport(document, result);
      } else {
        // Fallback demo document & result matching Screen 11
        const fallbackDoc: any = {
          id: 'doc-001',
          title: 'Certificate of Completion - Rohan Kumar',
          documentType: 'CERTIFICATE',
          originalFilename: 'certificate.jpg',
          sha256Hash: 'a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8',
          fileSizeBytes: 2516582,
          mimeType: 'image/jpeg',
          status: 'VERIFIED_VALID',
          overallConfidenceScore: 98.4,
          createdAt: new Date().toISOString()
        };
        const fallbackResult: any = {
          status: 'VERIFIED_VALID',
          verificationLogId: 'VR20250114001',
          compositeAuthenticityScore: 98.4,
          tamperConfidenceScore: 2.1,
          executionTimeMs: 1120,
          summaryReport: 'No significant visual anomalies detected. The document appears to be genuine.',
          checksMatrix: [],
          ocrData: {
            extractedText: 'ABC INSTITUTE OF TECHNOLOGY Certificate of Completion Rohan Kumar Java Programming Course',
            confidenceScore: 98.4,
            language: 'en',
            fields: []
          },
          tamperDetection: {
            isTampered: false,
            spliceScore: 0.02,
            fontAnomalyDetected: false,
            compressionDiscrepancy: false,
            exifModified: false,
            suspiciousBoundingBoxes: []
          },
          issuerMatch: {
            isMatchFound: true,
            issuerName: 'ABC Institute of Technology',
            confidenceScore: 99.1,
            isAccredited: true
          }
        };
        generateVerificationPdfReport(fallbackDoc, fallbackResult);
      }
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (err) {
      console.error('Error generating PDF:', err);
    }
  };

  const checklist = [
    'File Integrity Check',
    'OCR Text Extraction',
    'QR Code Verification',
    'Issuer Database Check',
    'Certificate Details Match',
    'Digital Signature Check',
    'AI Tamper Detection',
    'Template Analysis'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0e172e] border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 my-8 text-white">
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Report Top Header matching Screen 11 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                AI Document Verification Report
              </h1>
              <p className="text-xs text-slate-400">Trusted. Accurate. Secure.</p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold tracking-wide">
              VERIFIED
            </span>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">
              Generated on: 14 Jan 2025, 10:24 AM
            </p>
          </div>
        </div>

        {/* Top Grid: Certificate Document Scan + Certificate Details matching Screen 11 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#080e1e] p-1.5 shadow-md">
            <CertificateDocument compact={true} />
          </div>

          <div className="p-4 rounded-xl bg-[#080e1e] border border-slate-800 space-y-2 text-xs">
            <h3 className="font-semibold text-white text-xs border-b border-slate-800 pb-2">
              Certificate Details
            </h3>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Name</span>
                <span className="font-semibold text-white">Rohan Kumar</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Certificate ID</span>
                <span className="font-mono text-slate-200">CERT-2023-00125</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Institution</span>
                <span className="text-slate-200">ABC Institute of Technology</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Course</span>
                <span className="text-slate-200">Java Programming</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Issue Date</span>
                <span className="text-slate-200">20 Aug 2023</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Document Type</span>
                <span className="text-slate-200">Certificate</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-800">
                <span className="text-slate-400">Verification ID</span>
                <span className="font-mono text-emerald-400">#VR20250114001</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid: Verification Checklist + AI Analysis Summary matching Screen 11 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Checklist */}
          <div className="p-4 rounded-xl bg-[#080e1e] border border-slate-800 space-y-2 text-xs">
            <h3 className="font-semibold text-white text-xs border-b border-slate-800 pb-2">
              Verification Checklist
            </h3>
            <div className="space-y-1.5">
              {checklist.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-slate-300">{item}</span>
                  <div className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Passed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Analysis Summary */}
          <div className="p-4 rounded-xl bg-[#080e1e] border border-slate-800 space-y-3 text-xs">
            <h3 className="font-semibold text-white text-xs border-b border-slate-800 pb-2">
              AI Analysis Summary
            </h3>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Classification</span>
                <span className="text-slate-200">Certificate</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">OCR Confidence</span>
                <span className="font-mono text-emerald-400 font-semibold">98.4%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Template Similarity</span>
                <span className="font-mono text-blue-400 font-semibold">94%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Possible Manipulation</span>
                <span className="text-emerald-400 font-semibold">Low</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Suspicious Regions</span>
                <span className="text-slate-200">None Detected</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-300">
                <strong className="text-emerald-300">AI Assessment:</strong> No significant visual anomalies detected. The document appears to be genuine.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Report</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-blue-600/30 cursor-pointer"
            >
              {downloaded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>PDF Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download PDF Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
