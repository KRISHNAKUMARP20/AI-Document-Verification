import React from 'react';
import { Eye, FileText } from 'lucide-react';
import { DocumentRecord } from '../types/Document';

interface VerificationHistoryProps {
  documents?: DocumentRecord[];
  onSelectDoc?: (id: string) => void;
  onViewRecord?: (record: any) => void;
}

export const VerificationHistoryPage: React.FC<VerificationHistoryProps> = ({ 
  documents = [], 
  onSelectDoc,
  onViewRecord 
}) => {
  const handleAction = (item: any) => {
    if (onSelectDoc) {
      onSelectDoc(item.id);
    } else if (onViewRecord) {
      onViewRecord(item);
    }
  };

  return (
    <div id="verification-history-screen" className="max-w-4xl mx-auto space-y-6">
      {/* Header matching Screen 10 */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Verification History
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          View all your past document verifications
        </p>
      </div>

      {/* History Table Container matching Screen 10 */}
      <div className="rounded-2xl bg-[#0e172e] border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400">
                <th className="py-3.5 px-4 font-normal text-slate-400">#</th>
                <th className="py-3.5 px-4">Document Name</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {documents.map((doc, index) => (
                <tr key={doc.id} className="hover:bg-slate-850/40 transition-colors">
                  <td className="py-3.5 px-4 text-slate-400 font-mono">{index + 1}</td>
                  <td className="py-3.5 px-4 font-semibold text-white">{doc.originalFilename || doc.title}</td>
                  <td className="py-3.5 px-4 text-slate-300">{doc.documentType}</td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {new Date(doc.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-3.5 px-4">
                    {doc.status === 'VERIFIED_VALID' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                        Verified
                      </span>
                    )}
                    {doc.status === 'SUSPICIOUS_FLAGGED' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-semibold">
                        Suspicious
                      </span>
                    )}
                    {doc.status === 'REJECTED_FRAUDULENT' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-semibold">
                        Invalid
                      </span>
                    )}
                    {(doc.status === 'PENDING' || doc.status === 'PROCESSING') && (
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-semibold">
                        Processing
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      id={`btn-view-history-${index}`}
                      onClick={() => handleAction(doc)}
                      className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {documents.length === 0 && (
          <div className="p-8 text-center space-y-2">
            <FileText className="w-8 h-8 mx-auto text-slate-600" />
            <p className="text-xs text-slate-400">You have not verified any documents yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
