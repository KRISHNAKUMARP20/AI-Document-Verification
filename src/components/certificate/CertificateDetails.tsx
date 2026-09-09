import React from 'react';
import { 
  Award, 
  ShieldCheck, 
  Key, 
  Calendar, 
  Building, 
  User, 
  FileText, 
  CheckCircle, 
  Copy, 
  Check 
} from 'lucide-react';
import { VerificationCertificate } from '../../types/Verification';

interface CertificateDetailsProps {
  certificate: VerificationCertificate;
}

export const CertificateDetails: React.FC<CertificateDetailsProps> = ({ certificate }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopySerial = () => {
    navigator.clipboard.writeText(certificate.certificateNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="certificate-details-widget" className="p-6 rounded-2xl bg-slate-850 border border-slate-800 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Key className="w-4 h-4 text-cyan-400" />
          <span>Certificate Metadata & Cryptographic Proof</span>
        </h3>
        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
          VALID & ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400 font-medium">Certificate Identifier</span>
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-cyan-300">{certificate.certificateNumber}</span>
            <button
              onClick={handleCopySerial}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
              title="Copy Serial Number"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400 font-medium">Issued To</span>
          <p className="font-semibold text-slate-200">{certificate.issuedToName}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400 font-medium">Accredited Authority</span>
          <p className="font-semibold text-slate-200">{certificate.issuerAuthority}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400 font-medium">Document Type</span>
          <p className="font-semibold text-slate-200">{certificate.documentType.replace(/_/g, ' ')}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400 font-medium">Issue Timestamp</span>
          <p className="font-mono text-slate-300">{new Date(certificate.issuedAt).toUTCString()}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400 font-medium">Expiration Timestamp</span>
          <p className="font-mono text-slate-300">{new Date(certificate.expiresAt).toUTCString()}</p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
          HMAC-SHA256 Digital Signature
        </span>
        <p className="font-mono text-[11px] text-cyan-400/90 break-all bg-slate-950 p-2.5 rounded-lg border border-slate-800">
          {certificate.cryptographicSignature}
        </p>
      </div>
    </div>
  );
};
