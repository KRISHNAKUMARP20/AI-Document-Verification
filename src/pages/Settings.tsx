import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Settings as SettingsIcon, 
  Sliders, 
  ShieldCheck, 
  Bell, 
  Lock, 
  Database, 
  Save, 
  CheckCircle2, 
  RefreshCw, 
  AlertTriangle,
  Smartphone,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  // Engine Settings
  const [sensitivity, setSensitivity] = useState<'STRICT' | 'BALANCED' | 'FAST'>('STRICT');
  const [autoFlagTamper, setAutoFlagTamper] = useState<boolean>(true);
  const [enforceQrCheck, setEnforceQrCheck] = useState<boolean>(true);
  const [kerningThreshold, setKerningThreshold] = useState<string>('0.02mm');

  // Security Settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(true);
  const [sessionTimeout, setSessionTimeout] = useState<string>('30');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // Notifications
  const [notifyOnFraud, setNotifyOnFraud] = useState<boolean>(true);
  const [notifyOnComplete, setNotifyOnComplete] = useState<boolean>(true);
  const [weeklyDigest, setWeeklyDigest] = useState<boolean>(false);

  // Save Banner
  const [savedBanner, setSavedBanner] = useState(false);

  const handleSaveAllSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      alert('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }
    setPasswordSuccess('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(null), 3500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      id="settings-page-view" 
      className="max-w-5xl mx-auto space-y-6 w-full"
    >
      {/* Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0c1326] border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-800">
              SYSTEM & SECURITY CONFIGURATION
            </span>
            <span className="text-xs text-slate-400">Platform Preferences</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Settings & Preferences</span>
          </h1>
          <p className="text-xs text-slate-400">
            Configure AI verification engine parameters, account authentication safeguards, and notification triggers.
          </p>
        </div>

        <button
          onClick={handleSaveAllSettings}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-blue-600/25 shrink-0"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Changes</span>
        </button>
      </div>

      {savedBanner && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 shadow-lg"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Configuration preferences saved and applied to your active session!</span>
        </motion.div>
      )}

      {/* Grid of Setting Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Module 1: AI Verification Engine Settings */}
        <div className="p-6 rounded-2xl bg-[#0e172e] border border-slate-800 space-y-5 shadow-lg">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">AI Forensic Engine Parameters</h2>
              <p className="text-[11px] text-slate-400">Document analysis & anomaly thresholds</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* Sensitivity */}
            <div className="space-y-2">
              <label className="text-slate-300 font-medium flex justify-between">
                <span>Verification Sensitivity:</span>
                <span className="text-blue-400 font-mono font-semibold">{sensitivity}</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['STRICT', 'BALANCED', 'FAST'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSensitivity(level)}
                    className={`py-2 px-2.5 rounded-xl border text-center font-semibold text-xs transition-colors cursor-pointer ${
                      sensitivity === level
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
                        : 'bg-[#080e1e] text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    {level === 'STRICT' ? 'Strict (98%)' : level === 'BALANCED' ? 'Balanced (90%)' : 'Fast (80%)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Kerning Threshold */}
            <div className="space-y-1.5 pt-1">
              <label className="text-slate-300 font-medium">Font Kerning Discrepancy Tolerance</label>
              <select
                value={kerningThreshold}
                onChange={(e) => setKerningThreshold(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#080e1e] border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="0.01mm">0.01mm (Ultra Forensic - Higher Suspicion)</option>
                <option value="0.02mm">0.02mm (Recommended Standard)</option>
                <option value="0.05mm">0.05mm (Permissive for Low-Res Scans)</option>
              </select>
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-[#080e1e] border border-slate-800 cursor-pointer">
                <div>
                  <p className="text-white font-medium">Auto-Flag Hologram Inconsistencies</p>
                  <p className="text-[10px] text-slate-400">Trigger manual audit if holographic seals fail ISO standards</p>
                </div>
                <input
                  type="checkbox"
                  checked={autoFlagTamper}
                  onChange={(e) => setAutoFlagTamper(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-[#080e1e] border border-slate-800 cursor-pointer">
                <div>
                  <p className="text-white font-medium">Enforce QR Signature Verification</p>
                  <p className="text-[10px] text-slate-400">Validate cryptographic payload against issuer public key</p>
                </div>
                <input
                  type="checkbox"
                  checked={enforceQrCheck}
                  onChange={(e) => setEnforceQrCheck(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Module 2: Notifications & Alerts */}
        <div className="p-6 rounded-2xl bg-[#0e172e] border border-slate-800 space-y-5 shadow-lg">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Alerts & Notifications</h2>
              <p className="text-[11px] text-slate-400">Audit logs & verification outcome notifications</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-[#080e1e] border border-slate-800 cursor-pointer">
              <div>
                <p className="text-white font-medium">Instant High-Risk Fraud Alert</p>
                <p className="text-[10px] text-slate-400">Send high-priority email alert when a forged certificate is flagged</p>
              </div>
              <input
                type="checkbox"
                checked={notifyOnFraud}
                onChange={(e) => setNotifyOnFraud(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[#080e1e] border border-slate-800 cursor-pointer">
              <div>
                <p className="text-white font-medium">Verification Completion Confirmation</p>
                <p className="text-[10px] text-slate-400">Email full PDF inspection summary after document processing</p>
              </div>
              <input
                type="checkbox"
                checked={notifyOnComplete}
                onChange={(e) => setNotifyOnComplete(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[#080e1e] border border-slate-800 cursor-pointer">
              <div>
                <p className="text-white font-medium">Weekly Verification Digest</p>
                <p className="text-[10px] text-slate-400">Receive aggregated statistics and total submissions every Monday</p>
              </div>
              <input
                type="checkbox"
                checked={weeklyDigest}
                onChange={(e) => setWeeklyDigest(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
              />
            </label>

            {/* Session Timeout */}
            <div className="space-y-1.5 pt-2">
              <label className="text-slate-300 font-medium">Security Idle Session Timeout</label>
              <select
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#080e1e] border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="15">15 minutes (High Security)</option>
                <option value="30">30 minutes (Standard)</option>
                <option value="60">1 hour</option>
                <option value="240">4 hours</option>
              </select>
            </div>
          </div>
        </div>

        {/* Module 3: Security & Password Update */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-[#0e172e] border border-slate-800 space-y-5 shadow-lg">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Security & Password Management</h2>
              <p className="text-[11px] text-slate-400">Safeguard your authentication credentials</p>
            </div>
          </div>

          {passwordSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Current Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080e1e] border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">New Strong Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 chars"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080e1e] border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Confirm New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080e1e] border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPassword ? 'Hide Passwords' : 'Show Passwords'}</span>
              </button>

              <button
                type="submit"
                className="min-h-[40px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};
