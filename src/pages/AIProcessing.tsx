import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

interface AIProcessingProps {
  onComplete?: () => void;
  autoAdvance?: boolean;
}

export const AIProcessingPage: React.FC<AIProcessingProps> = ({ 
  onComplete, 
  autoAdvance = true 
}) => {
  const [progress, setProgress] = useState(65);
  const [currentStep, setCurrentStep] = useState(4); // 0-indexed: 4 is "Checking with issuer database"

  const steps = [
    { label: 'Uploading document', id: 'upload' },
    { label: 'Extracting text (OCR)', id: 'ocr' },
    { label: 'Detecting QR code', id: 'qr' },
    { label: 'Analyzing document structure', id: 'structure' },
    { label: 'Checking with issuer database', id: 'issuer' },
    { label: 'Running AI tamper detection', id: 'tamper' },
    { label: 'Generating final report', id: 'report' },
  ];

  useEffect(() => {
    // Smooth progress simulation from 65% up to 100%
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (autoAdvance && onComplete) {
            setTimeout(onComplete, 1200);
          }
          return 100;
        }
        const next = prev + 5;
        if (next >= 80 && currentStep < 5) setCurrentStep(5);
        if (next >= 95 && currentStep < 6) setCurrentStep(6);
        return next;
      });
    }, 450);

    return () => clearInterval(interval);
  }, [autoAdvance, currentStep, onComplete]);

  // Circle radius calculation for SVG progress ring
  const size = 160;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div id="ai-processing-screen" className="max-w-2xl mx-auto space-y-8 py-4">
      {/* Header matching Screen 5 */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Analyzing Document...
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Our AI is analyzing your document, Please wait...
        </p>
      </div>

      {/* Main Container */}
      <div className="p-8 rounded-2xl bg-[#0e172e] border border-slate-800 flex flex-col items-center space-y-8 shadow-xl">
        {/* Glowing Circular Progress Ring */}
        <div className="relative flex items-center justify-center">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#1e293b"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Animated Progress Ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#2563eb"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-300 ease-out"
              style={{ filter: 'drop-shadow(0 0 8px rgba(37, 99, 235, 0.6))' }}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold text-white font-mono">{progress}%</span>
          </div>
        </div>

        {/* Vertical Stepper Checklist matching Screen 5 */}
        <div className="w-full max-w-md space-y-3.5 pt-2">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStep || progress === 100;
            const isCurrent = idx === currentStep && progress < 100;

            return (
              <div
                key={step.id}
                className="flex items-center gap-3.5 text-xs transition-colors"
              >
                {/* Status Indicator Icon */}
                <div className="shrink-0 flex items-center justify-center">
                  {isCompleted ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                    </div>
                  )}
                </div>

                {/* Step Label */}
                <span
                  className={`font-medium ${
                    isCompleted
                      ? 'text-slate-200'
                      : isCurrent
                      ? 'text-blue-400 font-semibold'
                      : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Direct Action button if completed or user wants to jump */}
        {onComplete && (
          <div className="w-full max-w-md pt-2">
            <button
              id="btn-skip-processing"
              onClick={onComplete}
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{progress === 100 ? 'View Extracted Information' : 'Proceed to Extracted Info'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
