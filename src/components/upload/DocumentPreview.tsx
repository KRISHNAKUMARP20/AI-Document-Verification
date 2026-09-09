import React from 'react';
import { FileText, Hash, CheckCircle, AlertTriangle, Eye, ShieldCheck } from 'lucide-react';
import { DocumentRecord } from '../../types/Document';

interface DocumentPreviewProps {
  document: DocumentRecord;
  onRunVerification?: () => void;
  isProcessing?: boolean;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ 
  document, 
  onRunVerification,
  isProcessing 
}) => {
  return (
    <div id={`doc-preview-${document.id}`} className="rounded-2xl bg-slate-850 border border-slate-800 overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-800 text-cyan-400 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200 truncate max-w-[200px] sm:max-w-xs">{document.title}</h4>
            <span className="text-[10px] text-slate-400">{document.documentType} • {(document.fileSizeBytes / (1024*1024)).toFixed(2)} MB</span>
          </div>
        </div>

        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
          document.status === 'VERIFIED_VALID'
            ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
            : document.status === 'SUSPICIOUS_FLAGGED'
            ? 'bg-amber-950 text-amber-400 border-amber-800'
            : document.status === 'REJECTED_FRAUDULENT'
            ? 'bg-rose-950 text-rose-400 border-rose-800'
            : 'bg-cyan-950 text-cyan-400 border-cyan-800'
        }`}>
          {document.status.replace(/_/g, ' ')}
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Document Thumbnail / Visualization Canvas */}
        <div className="relative aspect-[4/3] rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden group">
          {document.fileDataUrl ? (
            <img 
              src={document.fileDataUrl} 
              alt={document.title}
              className="w-full h-full object-contain p-2" 
            />
          ) : (
            <div className="text-center p-6 space-y-2">
              <FileText className="w-12 h-12 text-slate-700 mx-auto" />
              <p className="text-xs font-mono text-slate-400">{document.originalFilename}</p>
              <p className="text-[10px] text-slate-500 font-mono">Secured Encrypted Storage</p>
            </div>
          )}

          <div className="absolute bottom-2 left-2 right-2 p-2 rounded-lg bg-slate-950/90 border border-slate-800 backdrop-blur-sm flex items-center justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1">
              <Hash className="w-3 h-3 text-cyan-400" />
              <span className="font-mono text-[10px] text-cyan-300 truncate max-w-[180px]">
                {document.sha256Hash.substring(0, 16)}...
              </span>
            </span>
            <span className="text-emerald-400 text-[10px] font-semibold">Integrity Verified</span>
          </div>
        </div>

        {/* Action Button */}
        {onRunVerification && (
          <button
            onClick={onRunVerification}
            disabled={isProcessing}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-950 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isProcessing ? 'Verifying...' : 'Re-Run Verification Pipeline'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
