import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  FileCheck, 
  ShieldCheck, 
  Sparkles,
  Info
} from 'lucide-react';
import { VerificationCheckItem, CheckStatus } from '../../types/Verification';

interface VerificationChecksProps {
  checks: VerificationCheckItem[];
}

export const VerificationChecks: React.FC<VerificationChecksProps> = ({ checks }) => {
  const [filter, setFilter] = useState<'ALL' | 'PASSED' | 'WARNING' | 'FAILED'>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredChecks = checks.filter((c) => {
    if (filter === 'ALL') return true;
    return c.status === filter;
  });

  const getStatusBadge = (status: CheckStatus) => {
    switch (status) {
      case 'PASSED':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" /> Passed
          </span>
        );
      case 'WARNING':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-950/70 border border-amber-800/60 px-2 py-0.5 rounded-full">
            <AlertTriangle className="w-3.5 h-3.5" /> Warning
          </span>
        );
      case 'FAILED':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-950/70 border border-rose-800/60 px-2 py-0.5 rounded-full">
            <XCircle className="w-3.5 h-3.5" /> Failed
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
            Skipped
          </span>
        );
    }
  };

  return (
    <div id="forensic-verification-checks-widget" className="p-6 rounded-2xl bg-slate-850 border border-slate-800 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Granular Forensic Verification Checks</span>
          </h3>
          <p className="text-xs text-slate-400">Multi-point rule engine evaluations and neural anomaly detections</p>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-900 border border-slate-800 self-start sm:self-auto text-xs">
          {(['ALL', 'PASSED', 'WARNING', 'FAILED'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                filter === mode
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        {filteredChecks.map((item) => {
          const isExpanded = expandedId === item.id;

          return (
            <div
              key={item.id}
              className="rounded-xl border border-slate-750 bg-slate-900/80 overflow-hidden transition-colors hover:border-slate-700"
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="p-3.5 flex items-center justify-between gap-4 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 shrink-0">
                    <FileCheck className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-200 truncate">{item.checkName}</span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded hidden sm:inline">
                        {item.checkCode}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate max-w-sm sm:max-w-md mt-0.5">{item.details}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden md:block">
                    <span className="text-xs font-mono font-bold text-slate-200">{item.score}%</span>
                    <span className="block text-[10px] text-slate-400">confidence</span>
                  </div>
                  {getStatusBadge(item.status)}
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="p-4 border-t border-slate-800 bg-slate-950/60 text-xs space-y-3">
                  <div className="flex items-start gap-2 text-slate-300">
                    <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white">Evaluation Findings: </span>
                      <span>{item.details}</span>
                    </div>
                  </div>

                  {item.evidenceData && (
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-cyan-300/90 overflow-x-auto">
                      <pre>{JSON.stringify(item.evidenceData, null, 2)}</pre>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Category: <strong className="text-slate-300">{item.category}</strong></span>
                    <span>Validation standard: <strong>ICAO 9303 / ISO-18013</strong></span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredChecks.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-xs rounded-xl bg-slate-900/40 border border-slate-800">
            No verification checks matching current filter "{filter}".
          </div>
        )}
      </div>
    </div>
  );
};
