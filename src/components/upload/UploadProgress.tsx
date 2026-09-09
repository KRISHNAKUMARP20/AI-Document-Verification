import React from 'react';
import { CheckCircle2, Loader2, Sparkles, Shield, Cpu, Lock } from 'lucide-react';

interface UploadProgressProps {
  currentStage: number; // 0 to 4
  stages: Array<{ name: string; description: string }>;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({ 
  currentStage, 
  stages 
}) => {
  return (
    <div id="ai-pipeline-progress" className="p-6 rounded-2xl bg-slate-850 border border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center animate-pulse">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">AI Verification Engine Processing</h3>
            <p className="text-xs text-slate-400">Executing multi-layer forensic inspection and cross-ledger validation</p>
          </div>
        </div>
        <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
          Stage {Math.min(currentStage + 1, stages.length)} of {stages.length}
        </span>
      </div>

      <div className="space-y-3">
        {stages.map((stage, idx) => {
          const isDone = idx < currentStage;
          const isCurrent = idx === currentStage;
          const isPending = idx > currentStage;

          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                  : isCurrent
                  ? 'bg-cyan-950/40 border-cyan-700 text-cyan-200 shadow-md shadow-cyan-950/50'
                  : 'bg-slate-900/40 border-slate-800/60 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-500 font-mono">
                      {idx + 1}
                    </div>
                  )}
                </div>
                <div>
                  <p className={`text-xs font-semibold ${isCurrent ? 'text-cyan-200 font-bold' : isDone ? 'text-emerald-300' : 'text-slate-400'}`}>
                    {stage.name}
                  </p>
                  <p className="text-[11px] text-slate-400">{stage.description}</p>
                </div>
              </div>

              <div>
                {isDone && <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">Verified</span>}
                {isCurrent && <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase animate-pulse">Running</span>}
                {isPending && <span className="text-[10px] font-mono text-slate-600 uppercase">Queued</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
