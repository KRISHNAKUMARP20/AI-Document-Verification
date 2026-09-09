import React from 'react';
import { Check, Shield } from 'lucide-react';

interface LogoutScreenProps {
  onBackToLogin: () => void;
}

export const LogoutScreen: React.FC<LogoutScreenProps> = ({ onBackToLogin }) => {
  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center p-4">
      {/* Background Subtle Constellation Effect */}
      <div className="absolute inset-0 bg-[#070d1e] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(29,78,216,0.25),rgba(255,255,255,0))] pointer-events-none rounded-3xl" />

      <div className="relative w-full max-w-md space-y-8 z-10 text-center">
        {/* Card matching Screen 12 */}
        <div className="p-8 sm:p-10 rounded-2xl bg-[#0e172e]/95 border border-slate-800 shadow-2xl backdrop-blur-md space-y-6">
          {/* Big Green Circular Checkmark */}
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Check className="w-9 h-9 stroke-[3]" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Thank You!
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              You have been logged out successfully.
            </p>
          </div>

          <button
            id="btn-back-to-login"
            onClick={onBackToLogin}
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            Back to Login
          </button>
        </div>

        {/* Footer Brand matching Screen 12 */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-white">AI Document Verification</span>
          </div>
          <p className="text-[11px] text-slate-500">Trust Documents. Build a Safer World.</p>
        </div>
      </div>
    </div>
  );
};
