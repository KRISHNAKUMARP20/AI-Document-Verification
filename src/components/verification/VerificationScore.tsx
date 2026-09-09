import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, XCircle, TrendingUp, Award } from 'lucide-react';

interface VerificationScoreProps {
  score: number; // 0 to 100
  subScores?: {
    hashIntegrity: number;
    ocrConsistency: number;
    tamperResistance: number;
    issuerTrust: number;
  };
}

export const VerificationScore: React.FC<VerificationScoreProps> = ({ 
  score, 
  subScores = {
    hashIntegrity: 100,
    ocrConsistency: 96,
    tamperResistance: 98,
    issuerTrust: 99
  } 
}) => {
  const getScoreTier = (val: number) => {
    if (val >= 90) return { label: 'AUTHENTIC & TRUSTED', color: 'text-emerald-400', bg: 'bg-emerald-950/60', border: 'border-emerald-700/50', icon: ShieldCheck };
    if (val >= 75) return { label: 'LOW RISK - ACCEPTABLE', color: 'text-cyan-400', bg: 'bg-cyan-950/60', border: 'border-cyan-700/50', icon: ShieldCheck };
    if (val >= 60) return { label: 'SUSPICIOUS - FLAGGED', color: 'text-amber-400', bg: 'bg-amber-950/60', border: 'border-amber-700/50', icon: AlertTriangle };
    return { label: 'CRITICAL FRAUD ALERT', color: 'text-rose-400', bg: 'bg-rose-950/60', border: 'border-rose-700/50', icon: XCircle };
  };

  const tier = getScoreTier(score);
  const Icon = tier.icon;

  // Circumference for stroke-dasharray (radius = 54)
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div id="verification-score-widget" className="p-6 rounded-2xl bg-slate-850 border border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>Composite Authenticity Score</span>
          </h3>
          <p className="text-xs text-slate-400">Weighted aggregate of cryptographic & AI forensic checks</p>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border flex items-center gap-1.5 ${tier.bg} ${tier.color} ${tier.border}`}>
          <Icon className="w-3.5 h-3.5" />
          <span>{tier.label}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Radial Meter */}
        <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
            <circle
              cx="64"
              cy="64"
              r={radius}
              className="text-slate-800"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              className={score >= 90 ? 'text-emerald-500' : score >= 75 ? 'text-cyan-400' : score >= 60 ? 'text-amber-500' : 'text-rose-500'}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-black tracking-tight text-white font-mono">
              {score.toFixed(1)}
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">out of 100</span>
          </div>
        </div>

        {/* Sub-scores breakdown */}
        <div className="flex-1 w-full space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Cryptographic Hash Integrity</span>
              <span className="font-mono text-cyan-400">{subScores.hashIntegrity}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${subScores.hashIntegrity}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">AI Lexical & OCR Field Accuracy</span>
              <span className="font-mono text-blue-400">{subScores.ocrConsistency}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${subScores.ocrConsistency}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Tamper & Splice Resistance</span>
              <span className={`font-mono ${subScores.tamperResistance < 70 ? 'text-rose-400 font-bold' : 'text-emerald-400'}`}>
                {subScores.tamperResistance}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className={`h-full rounded-full ${subScores.tamperResistance < 70 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                style={{ width: `${subScores.tamperResistance}%` }} 
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Issuer Accreditation Trust</span>
              <span className="font-mono text-purple-400">{subScores.issuerTrust}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${subScores.issuerTrust}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
