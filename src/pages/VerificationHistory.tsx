import React from 'react';
import { Eye } from 'lucide-react';
import { DocumentRecord } from '../types/Document';

interface VerificationHistoryProps {
  documents?: DocumentRecord[];
  onSelectDoc?: (id: string) => void;
  onViewRecord?: (record: any) => void;
}

export const VerificationHistoryPage: React.FC<VerificationHistoryProps> = ({ 
  documents, 
  onSelectDoc,
  onViewRecord 
}) => {
  // 5 Rows matching Screen 10
  const historyItems = [
    {
      id: 'doc-001',
      index: 1,
      name: 'certificate.jpg',
      type: 'Certificate',
      date: '14 Jan 2025',
      status: 'Verified',
      statusVariant: 'success'
    },
    {
      id: 'doc-002',
      index: 2,
      name: 'marksheet.pdf',
      type: 'Marksheet',
      date: '10 Jan 2025',
      status: 'Verified',
      statusVariant: 'success'
    },
    {
      id: 'doc-003',
      index: 3,
      name: 'id_card.jpg',
      type: 'ID Card',
      date: '06 Jan 2025',
      status: 'Suspicious',
      statusVariant: 'warning'
    },
    {
      id: 'doc-004',
      index: 4,
      name: 'degree.pdf',
      type: 'Degree',
      date: '01 Jan 2025',
      status: 'Verified',
      statusVariant: 'success'
    },
    {
      id: 'doc-005',
      index: 5,
      name: 'sample.jpg',
      type: 'Certificate',
      date: '25 Dec 2024',
      status: 'Invalid',
      statusVariant: 'danger'
    }
  ];

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
              {historyItems.map((item) => (
                <tr key={item.index} className="hover:bg-slate-850/40 transition-colors">
                  <td className="py-3.5 px-4 text-slate-400 font-mono">{item.index}</td>
                  <td className="py-3.5 px-4 font-semibold text-white">{item.name}</td>
                  <td className="py-3.5 px-4 text-slate-300">{item.type}</td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{item.date}</td>
                  <td className="py-3.5 px-4">
                    {item.statusVariant === 'success' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                        Verified
                      </span>
                    )}
                    {item.statusVariant === 'warning' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-semibold">
                        Suspicious
                      </span>
                    )}
                    {item.statusVariant === 'danger' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-semibold">
                        Invalid
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      id={`btn-view-history-${item.index}`}
                      onClick={() => handleAction(item)}
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
      </div>
    </div>
  );
};
