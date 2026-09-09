import React, { useRef } from 'react';
import { 
  Award, 
  ShieldCheck, 
  QrCode, 
  Printer, 
  Download, 
  ExternalLink, 
  Lock, 
  CheckCircle2, 
  Share2 
} from 'lucide-react';
import { VerificationCertificate } from '../../types/Verification';

interface CertificatePreviewProps {
  certificate: VerificationCertificate;
  documentTitle?: string;
  sha256Hash?: string;
  onDownloadPdf?: () => void;
}

export const CertificatePreview: React.FC<CertificatePreviewProps> = ({ 
  certificate,
  documentTitle,
  sha256Hash,
  onDownloadPdf
}) => {
  const certRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="certificate-preview-container" className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>Digital Certificate of Authenticity</span>
          </h3>
          <p className="text-xs text-slate-400">Cryptographically verifiable certificate with embedded QR verification token</p>
        </div>

        <div className="flex items-center gap-2">
          {onDownloadPdf && (
            <button
              onClick={onDownloadPdf}
              id="download-cert-pdf-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-950/40 border border-cyan-400/40 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF Summary</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            id="print-cert-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span>Print Certificate</span>
          </button>
        </div>
      </div>

      {/* Official Certificate Visual Canvas */}
      <div 
        ref={certRef}
        id="printable-certificate"
        className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border-2 border-cyan-500/40 shadow-2xl shadow-cyan-950/40 text-slate-100 overflow-hidden"
      >
        {/* Subtle Watermark Background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center">
          <ShieldCheck className="w-[500px] h-[500px] text-white" />
        </div>

        {/* Decorative Guilloche Border Accents */}
        <div className="absolute top-3 left-3 w-12 h-12 border-t-2 border-l-2 border-cyan-400/60 rounded-tl-xl" />
        <div className="absolute top-3 right-3 w-12 h-12 border-t-2 border-r-2 border-cyan-400/60 rounded-tr-xl" />
        <div className="absolute bottom-3 left-3 w-12 h-12 border-b-2 border-l-2 border-cyan-400/60 rounded-bl-xl" />
        <div className="absolute bottom-3 right-3 w-12 h-12 border-b-2 border-r-2 border-cyan-400/60 rounded-br-xl" />

        {/* Certificate Header */}
        <div className="text-center space-y-3 pb-8 border-b border-slate-800 relative z-10">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-8 h-8" />
            </div>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
              GLOBAL TRUST VERIFICATION NETWORK
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans'] mt-1">
              CERTIFICATE OF AUTHENTICITY
            </h1>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Issued under the Automated Neural Forensics & Cryptographic Ledger Framework
            </p>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="py-8 space-y-6 relative z-10">
          <div className="text-center space-y-2">
            <p className="text-xs uppercase tracking-wider text-slate-400">This is to officially certify that</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 font-serif">
              {certificate.issuedToName}
            </h2>
            <p className="text-xs text-slate-400">
              has submitted the following legal instrument for forensic AI validation:
            </p>
            <div className="inline-block px-4 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 text-sm font-semibold">
              {certificate.documentType.replace(/_/g, ' ')} — {documentTitle || 'Verified Document'}
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Accredited Issuer</span>
              <p className="text-xs font-bold text-slate-200 mt-1 truncate">{certificate.issuerAuthority}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Authenticity Score</span>
              <p className="text-sm font-black text-emerald-400 font-mono mt-1">
                {certificate.verificationScore.toFixed(1)}% (VERIFIED)
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Validity Period</span>
              <p className="text-xs font-medium text-slate-200 mt-1">
                {new Date(certificate.issuedAt).toLocaleDateString()} — {new Date(certificate.expiresAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Cryptographic Proof and QR Section */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-900/40 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Cryptographic Integrity Seal
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 block font-mono">Certificate Serial No:</span>
                <span className="text-xs font-mono font-bold text-cyan-300 block select-all">
                  {certificate.certificateNumber}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 block font-mono">Digital Signature:</span>
                <span className="text-[10px] font-mono text-slate-400 break-all block bg-slate-900 p-1.5 rounded border border-slate-800">
                  {certificate.cryptographicSignature}
                </span>
              </div>
            </div>

            {/* QR Code */}
            <div className="shrink-0 flex flex-col items-center justify-center p-3 rounded-xl bg-white text-slate-900 shadow-md">
              {certificate.qrCodeImageUri ? (
                <img 
                  src={certificate.qrCodeImageUri} 
                  alt="Verification QR" 
                  className="w-24 h-24 object-contain"
                />
              ) : (
                <div className="w-24 h-24 bg-slate-100 flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-slate-800" />
                </div>
              )}
              <span className="text-[9px] font-mono font-bold text-slate-700 mt-1 uppercase tracking-tight">
                Scan to Verify
              </span>
            </div>
          </div>
        </div>

        {/* Certificate Footer */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 relative z-10">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Cryptographically sealed & anchored in audit log</span>
          </div>
          <div className="font-mono text-[10px]">
            Token: {certificate.qrVerificationToken}
          </div>
        </div>
      </div>
    </div>
  );
};
