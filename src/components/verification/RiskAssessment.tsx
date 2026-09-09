import React from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  ScanSearch, 
  Layers, 
  Eye, 
  FileWarning, 
  Flame,
  CheckCircle
} from 'lucide-react';
import { RiskAssessmentData, TamperDetectionData } from '../../types/Verification';

interface RiskAssessmentProps {
  risk: RiskAssessmentData;
  tamper?: TamperDetectionData;
}

export const RiskAssessment: React.FC<RiskAssessmentProps> = ({ risk, tamper }) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW':
        return {
          text: 'text-emerald-400',
          bg: 'bg-emerald-950/40',
          border: 'border-emerald-800/60',
          icon: ShieldCheck,
          label: 'Low Risk - Minimal Fraud Probability'
        };
      case 'MEDIUM':
        return {
          text: 'text-amber-400',
          bg: 'bg-amber-950/40',
          border: 'border-amber-800/60',
          icon: AlertTriangle,
          label: 'Medium Risk - Needs Verifier Review'
        };
      case 'HIGH':
      case 'CRITICAL':
        return {
          text: 'text-rose-400',
          bg: 'bg-rose-950/40',
          border: 'border-rose-800/60',
          icon: ShieldAlert,
          label: 'High Fraud Probability - Flagged'
        };
      default:
        return {
          text: 'text-cyan-400',
          bg: 'bg-cyan-950/40',
          border: 'border-cyan-800/60',
          icon: ShieldCheck,
          label: 'Under Inspection'
        };
    }
  };

  const riskStyle = getRiskColor(risk.riskLevel);
  const RiskIcon = riskStyle.icon;

  return (
    <div id="risk-assessment-widget" className="p-6 rounded-2xl bg-slate-850 border border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <ScanSearch className="w-4 h-4 text-cyan-400" />
            <span>Forensic Tamper & Risk Assessment</span>
          </h3>
          <p className="text-xs text-slate-400">Deep neural pixel analysis, font baseline kerning, and fraud scoring</p>
        </div>

        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${riskStyle.bg} ${riskStyle.border} ${riskStyle.text}`}>
          <RiskIcon className="w-4 h-4 shrink-0" />
          <span className="text-xs font-bold uppercase">{risk.riskLevel} RISK • {(risk.fraudProbability * 100).toFixed(1)}% FRAUD PROBABILITY</span>
        </div>
      </div>

      {/* Forensic Deep Dive Grid */}
      {tamper && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Font Consistency Score</span>
            <div className="flex items-center justify-between">
              <span className={`text-base font-bold font-mono ${tamper.fontInconsistencyDetected ? 'text-rose-400' : 'text-emerald-400'}`}>
                {tamper.fontInconsistencyDetected ? 'Mismatch Alert' : 'Consistent'}
              </span>
              <span className="text-xs font-mono text-slate-400">{tamper.fontAnalysisScore}%</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Pixel Splice & Clone</span>
            <div className="flex items-center justify-between">
              <span className={`text-base font-bold font-mono ${tamper.pixelCloneAnomalyDetected ? 'text-rose-400' : 'text-emerald-400'}`}>
                {tamper.pixelCloneAnomalyDetected ? 'Cloned Pixels' : 'Clean'}
              </span>
              <span className="text-xs font-mono text-slate-400">{tamper.pixelAnomalyScore}%</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Edge Discontinuity</span>
            <div className="flex items-center justify-between">
              <span className={`text-base font-bold font-mono ${tamper.edgeArtifactDetected ? 'text-rose-400' : 'text-emerald-400'}`}>
                {tamper.edgeArtifactDetected ? 'Artifacts' : 'Smooth'}
              </span>
              <span className="text-xs font-mono text-slate-400">{tamper.edgeArtifactScore}%</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">EXIF & Structure</span>
            <div className="flex items-center justify-between">
              <span className={`text-base font-bold font-mono ${tamper.metadataExifAnomalyDetected ? 'text-rose-400' : 'text-emerald-400'}`}>
                {tamper.metadataExifAnomalyDetected ? 'Edited Exif' : 'Pristine'}
              </span>
              <span className="text-xs font-mono text-emerald-400">Valid</span>
            </div>
          </div>
        </div>
      )}

      {/* Tamper flags / factors */}
      {risk.riskFactors.length > 0 ? (
        <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-900/50 space-y-2">
          <div className="flex items-center gap-2 text-rose-300 font-semibold text-xs">
            <FileWarning className="w-4 h-4" />
            <span>Identified Risk Anomaly Factors ({risk.riskFactors.length}):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {risk.riskFactors.map((factor, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-md bg-rose-900/40 text-rose-300 border border-rose-700/60 font-mono text-[10px]">
                {factor}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-900/40 flex items-center gap-2 text-emerald-300 text-xs">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Zero critical tamper flags detected. Document conforms to pristine visual distribution standards.</span>
        </div>
      )}

      {/* Forensic explanation if any */}
      {tamper?.aiForensicExplanation && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">AI Forensic Model Analysis:</span>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {tamper.aiForensicExplanation}
          </p>
        </div>
      )}

      {/* Recommendation Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
        <span className="text-xs text-slate-400">
          Engine Recommended Action:
        </span>
        <span className={`text-xs font-mono font-bold px-3 py-1 rounded-lg border ${
          risk.recommendedAction === 'AUTO_APPROVE'
            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
            : risk.recommendedAction === 'AUTO_REJECT'
            ? 'bg-rose-950 text-rose-300 border-rose-800'
            : 'bg-amber-950 text-amber-300 border-amber-800'
        }`}>
          {risk.recommendedAction.replace(/_/g, ' ')}
        </span>
      </div>
    </div>
  );
};
