import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { VerificationCheckItem } from '../types/Verification';
import { DocumentRecord } from '../types/Document';

interface VerificationChecksPageProps {
  document?: DocumentRecord | null;
  checks?: VerificationCheckItem[];
  onNext?: () => void;
  onBackToOverview?: () => void;
}

export const VerificationChecksPage: React.FC<VerificationChecksPageProps> = ({
  document,
  checks = [],
  onNext
}) => {
  const defaultChecklist = [
    { title: 'File Integrity Check', status: 'Passed' },
    { title: 'OCR Text Extraction', status: 'Passed' },
    { title: 'QR Code Verification', status: 'Passed' },
    { title: 'Issuer Database Check', status: 'Passed' },
    { title: 'Certificate Details Match', status: 'Passed' },
    { title: 'Digital Signature Check', status: 'Passed' },
    { title: 'AI Tamper Detection', status: 'Passed' },
    { title: 'Template Analysis', status: 'Passed' },
  ];

  return (
    <div id="verification-checks-screen" className="max-w-2xl mx-auto space-y-6">
      {/* Header matching Screen 7 */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Running Verification Checks
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          We are verifying your document through multiple layers
        </p>
      </div>

      {/* Main Container matching Screen 7 */}
      <div className="p-6 rounded-2xl bg-[#0e172e] border border-slate-800 shadow-xl space-y-4">
        <div className="divide-y divide-slate-800/80">
          {defaultChecklist.map((item, idx) => (
            <div
              key={idx}
              className="py-3.5 flex items-center justify-between text-xs first:pt-1 last:pb-1"
            >
              <span className="text-slate-200 font-medium">{item.title}</span>
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{item.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Button matching Screen 7 */}
        <div className="pt-3">
          <button
            id="btn-checks-next"
            onClick={onNext}
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            <span>Next: Final Result</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
