import React, { useState } from 'react';
import { 
  QrCode, 
  Search, 
  ShieldCheck, 
  XCircle, 
  CheckCircle2, 
  Calendar, 
  Building, 
  User, 
  FileCheck,
  ExternalLink
} from 'lucide-react';
import { verificationService } from '../../services/verificationService';

interface QRResultProps {
  initialToken?: string;
  onClose?: () => void;
}

export const QRResult: React.FC<QRResultProps> = ({ initialToken = '', onClose }) => {
  const [tokenInput, setTokenInput] = useState(initialToken || 'tok_verify_pass_990142');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleVerify = async (tokenToTest?: string) => {
    const targetToken = tokenToTest || tokenInput;
    if (!targetToken.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setVerificationResult(null);

    try {
      const res = await verificationService.verifyQrToken(targetToken.trim());
      if (res.valid) {
        setVerificationResult(res.certificate);
      } else {
        setErrorMsg(res.message || 'Token not recognized in the cryptographic ledger.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification lookup failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="qr-result-container" className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Public Certificate QR & Token Verification</h3>
            <p className="text-xs text-slate-400">Validate digital credential signatures against the immutable registry</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 text-sm rounded-lg hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Input Search Box */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-300">
          Enter QR Verification Token or Certificate Serial Number
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              id="qr-token-input"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="e.g. tok_verify_pass_990142 or ADV-2026-USPASS-990142"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs font-mono focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>
          <button
            onClick={() => handleVerify()}
            disabled={isLoading}
            id="query-qr-token-btn"
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors flex items-center gap-2"
          >
            {isLoading ? 'Verifying...' : 'Verify Token'}
          </button>
        </div>
      </div>

      {/* Quick Test Token Shortcuts */}
      <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400">
        <span>Test Samples:</span>
        <button
          type="button"
          onClick={() => { setTokenInput('tok_verify_pass_990142'); handleVerify('tok_verify_pass_990142'); }}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-[11px] border border-slate-700"
        >
          Valid Passport Token
        </button>
        <button
          type="button"
          onClick={() => { setTokenInput('tok_verify_deg_881290'); handleVerify('tok_verify_deg_881290'); }}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-[11px] border border-slate-700"
        >
          Valid Degree Token
        </button>
      </div>

      {/* Verification Result Card */}
      {verificationResult && (
        <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-700/60 space-y-4 animate-in fade-in-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <div>
                <h4 className="text-sm font-bold text-white">Cryptographically Verified Certificate</h4>
                <p className="text-xs text-emerald-300">Authenticity signature verified and validated in registry.</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-900/80 text-emerald-200 border border-emerald-600 font-mono text-xs font-bold">
              AUTHENTIC
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-emerald-900/40 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400">Subject:</span>
              <p className="font-bold text-slate-100">{verificationResult.issuedToName}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400">Issuing Body:</span>
              <p className="font-bold text-slate-100">{verificationResult.issuerAuthority}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400">Document Type:</span>
              <p className="font-bold text-slate-100">{verificationResult.documentType}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400">Composite Score:</span>
              <p className="font-bold font-mono text-emerald-400">{verificationResult.verificationScore}%</p>
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/60 flex items-center gap-3 text-rose-300 text-xs">
          <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
