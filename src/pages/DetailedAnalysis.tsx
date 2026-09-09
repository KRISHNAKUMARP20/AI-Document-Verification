import React, { useState } from 'react';
import { ShieldCheck, Cpu, Building2, Binary, AlertCircle } from 'lucide-react';
import { DocumentRecord } from '../types/Document';
import { TamperDetectionData, RiskAssessmentData } from '../types/Verification';

interface DetailedAnalysisProps {
  document?: DocumentRecord | null;
  tamper?: TamperDetectionData | null;
  risk?: RiskAssessmentData | null;
}

export const DetailedAnalysisPage: React.FC<DetailedAnalysisProps> = ({
  document,
  tamper,
  risk
}) => {
  const [activeTab, setActiveTab] = useState<'AI' | 'ISSUER' | 'TECHNICAL' | 'RISK'>('AI');

  const tabs = [
    { id: 'AI', label: 'AI Analysis' },
    { id: 'ISSUER', label: 'Issuer Verification' },
    { id: 'TECHNICAL', label: 'Technical Details' },
    { id: 'RISK', label: 'Risk Assessment' },
  ];

  return (
    <div id="detailed-analysis-screen" className="max-w-4xl mx-auto space-y-6">
      {/* Page Header matching Screen 9 */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Detailed Analysis
        </h1>
      </div>

      {/* 4 Tabs Bar matching Screen 9 */}
      <div className="flex border-b border-slate-800 gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-3 text-xs font-semibold transition-all relative cursor-pointer ${
                isActive
                  ? 'text-blue-400 border-b-2 border-blue-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: AI Analysis matching Screen 9 */}
      {activeTab === 'AI' && (
        <div className="p-6 rounded-2xl bg-[#0e172e] border border-slate-800 space-y-6 shadow-xl">
          <div>
            <h2 className="text-sm font-semibold text-white border-b border-slate-800 pb-3">
              AI Analysis Results
            </h2>

            <div className="divide-y divide-slate-800/60 text-xs">
              <div className="py-3 flex justify-between items-center">
                <span className="text-slate-400">Document Classification</span>
                <span className="font-semibold text-white">Certificate</span>
              </div>

              <div className="py-3 flex justify-between items-center">
                <span className="text-slate-400">OCR Confidence</span>
                <span className="font-mono font-semibold text-emerald-400">98.4%</span>
              </div>

              <div className="py-3 flex justify-between items-center">
                <span className="text-slate-400">Template Similarity</span>
                <span className="font-mono font-semibold text-blue-400">94%</span>
              </div>

              <div className="py-3 flex justify-between items-center">
                <span className="text-slate-400">Possible Manipulation</span>
                <span className="font-semibold text-emerald-400">Low</span>
              </div>

              <div className="py-3 flex justify-between items-center">
                <span className="text-slate-400">Suspicious Regions</span>
                <span className="font-semibold text-white">None Detected</span>
              </div>
            </div>
          </div>

          {/* Green Callout Banner matching Screen 9 */}
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-emerald-300">AI Assessment</p>
              <p className="text-xs text-slate-300 leading-relaxed">
                No significant visual anomalies detected. The document appears to be genuine.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Issuer Verification */}
      {activeTab === 'ISSUER' && (
        <div className="p-6 rounded-2xl bg-[#0e172e] border border-slate-800 space-y-4 shadow-xl">
          <h2 className="text-sm font-semibold text-white border-b border-slate-800 pb-3">
            Accredited Issuer Registry
          </h2>
          <div className="divide-y divide-slate-800/60 text-xs">
            <div className="py-3 flex justify-between items-center">
              <span className="text-slate-400">Issuer Institution</span>
              <span className="font-semibold text-white">ABC Institute of Technology</span>
            </div>
            <div className="py-3 flex justify-between items-center">
              <span className="text-slate-400">Accreditation Status</span>
              <span className="text-emerald-400 font-semibold">Accredited & Active</span>
            </div>
            <div className="py-3 flex justify-between items-center">
              <span className="text-slate-400">Verification Endpoint</span>
              <span className="text-blue-400 font-mono">https://abctech.edu/verify</span>
            </div>
            <div className="py-3 flex justify-between items-center">
              <span className="text-slate-400">Public Signing Key</span>
              <span className="text-slate-300 font-mono text-[11px]">RSA-4096 (SHA-256 with RSA)</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Technical Details */}
      {activeTab === 'TECHNICAL' && (
        <div className="p-6 rounded-2xl bg-[#0e172e] border border-slate-800 space-y-4 shadow-xl">
          <h2 className="text-sm font-semibold text-white border-b border-slate-800 pb-3">
            Cryptographic & File Fingerprint
          </h2>
          <div className="divide-y divide-slate-800/60 text-xs font-mono">
            <div className="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
              <span className="text-slate-400 font-sans">SHA-256 Hash</span>
              <span className="text-cyan-300 text-[11px] break-all">
                a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8
              </span>
            </div>
            <div className="py-3 flex justify-between items-center">
              <span className="text-slate-400 font-sans">File Size</span>
              <span className="text-white">2.4 MB (2,516,582 bytes)</span>
            </div>
            <div className="py-3 flex justify-between items-center">
              <span className="text-slate-400 font-sans">MIME Type</span>
              <span className="text-white">image/jpeg</span>
            </div>
            <div className="py-3 flex justify-between items-center">
              <span className="text-slate-400 font-sans">Color Space</span>
              <span className="text-white">24-bit sRGB</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Risk Assessment */}
      {activeTab === 'RISK' && (
        <div className="p-6 rounded-2xl bg-[#0e172e] border border-slate-800 space-y-4 shadow-xl">
          <h2 className="text-sm font-semibold text-white border-b border-slate-800 pb-3">
            Composite Fraud & Tamper Risk
          </h2>
          <div className="divide-y divide-slate-800/60 text-xs">
            <div className="py-3 flex justify-between items-center">
              <span className="text-slate-400">Calculated Risk Index</span>
              <span className="text-emerald-400 font-semibold font-mono">Low (2.1%)</span>
            </div>
            <div className="py-3 flex justify-between items-center">
              <span className="text-slate-400">Neural Splice Score</span>
              <span className="text-emerald-400 font-semibold font-mono">0.02 (Minimal)</span>
            </div>
            <div className="py-3 flex justify-between items-center">
              <span className="text-slate-400">Revocation Status</span>
              <span className="text-emerald-400 font-semibold">Active (Not Revoked)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
