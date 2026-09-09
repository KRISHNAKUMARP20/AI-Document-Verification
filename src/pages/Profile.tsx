import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  ShieldCheck, 
  ShieldAlert, 
  Calendar, 
  Lock, 
  Save, 
  CheckCircle2, 
  FileCheck,
  Award,
  KeyRound,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  // Form states
  const [fullName, setFullName] = useState(user?.fullName || (isAdmin ? 'Krishna Kumar' : 'Krishna Kumar'));
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [organization, setOrganization] = useState(
    isAdmin ? 'Central Document Audit & Verification Authority' : 'National Accreditation & Academic Board'
  );
  const [designation, setDesignation] = useState(
    isAdmin ? 'Principal Security Auditor' : 'Verified Applicant / Document Holder'
  );
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      id="profile-page-view" 
      className="max-w-5xl mx-auto space-y-6 w-full"
    >
      {/* Page Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0c1326] border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
              isAdmin 
                ? 'text-amber-400 bg-amber-950/80 border-amber-800' 
                : 'text-blue-400 bg-blue-950/80 border-blue-800'
            }`}>
              {isAdmin ? 'ADMINISTRATOR PROFILE' : 'USER PROFILE'}
            </span>
            <span className="text-xs text-slate-400">Account Identity & Verification Details</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            My Account Profile
          </h1>
          <p className="text-xs text-slate-400">
            View and manage your personal credentials, contact details, and platform clearance status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-[#080e1e] border border-slate-700 text-slate-300 text-xs font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ID: {isAdmin ? 'ADM-90214' : 'USR-48190'}</span>
          </div>
        </div>
      </div>

      {isSaved && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 shadow-lg"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Profile information updated successfully! Changes are saved to your account.</span>
        </motion.div>
      )}

      {/* Profile Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Avatar & Summary Card */}
        <div className="md:col-span-4 space-y-4">
          <div className="p-6 rounded-2xl bg-[#0e172e] border border-slate-800 text-center space-y-4 shadow-lg">
            <div className="relative w-24 h-24 mx-auto">
              <div className={`w-full h-full rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-xl ${
                isAdmin 
                  ? 'bg-gradient-to-tr from-amber-600 to-rose-600 ring-2 ring-amber-400/50' 
                  : 'bg-gradient-to-tr from-blue-600 to-cyan-600 ring-2 ring-blue-400/50'
              }`}>
                {fullName.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400" title="Active">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <h2 className="text-base font-bold text-white tracking-tight">{fullName}</h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{email}</p>
              
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${
                isAdmin 
                  ? 'bg-amber-950/80 text-amber-300 border-amber-800' 
                  : 'bg-blue-950/80 text-blue-300 border-blue-800'
              }">
                {isAdmin ? <ShieldAlert className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                <span>{isAdmin ? 'System Administrator' : 'Accredited User'}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2.5 text-left text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{organization}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Member Since: January 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-emerald-400 font-medium">Clearance: Level {isAdmin ? '4 (Full Audit)' : '1 (Standard)'}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Card */}
          <div className="p-5 rounded-2xl bg-[#0e172e] border border-slate-800 space-y-3 shadow-lg">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Verification Record Summary
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Total Records</span>
                <span className="text-white font-mono font-semibold">{isAdmin ? '8 Submissions' : '12 Documents'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Verification Rate</span>
                <span className="text-emerald-400 font-mono font-semibold">100% Genuine</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Trust Score</span>
                <span className="text-blue-400 font-mono font-semibold">98.5 / 100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="md:col-span-8 space-y-4">
          <div className="p-6 sm:p-7 rounded-2xl bg-[#0e172e] border border-slate-800 shadow-lg space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" />
                <span>Personal & Professional Information</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Update your contact details and official designation associated with verification logs.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Full Name</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080e1e] border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isAdmin}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080e1e] border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
                  />
                  {isAdmin && (
                    <span className="text-[10px] text-amber-400">Admin primary address locked by security policy</span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Contact Phone</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080e1e] border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-slate-400" />
                    <span>Designation</span>
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080e1e] border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>Organization / Institution</span>
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080e1e] border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  className="min-h-[42px] px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-600/30"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile Updates</span>
                </button>
              </div>
            </form>
          </div>

          {/* Account Security & Key Authorization Summary */}
          <div className="p-6 rounded-2xl bg-[#0e172e] border border-slate-800 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-cyan-400" />
              <span>Authentication & Security Status</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#080e1e] border border-slate-800 space-y-1">
                <span className="text-slate-400 font-medium">Multi-Factor Authentication</span>
                <p className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Enabled (Mobile Authenticator)</span>
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#080e1e] border border-slate-800 space-y-1">
                <span className="text-slate-400 font-medium">Session Status</span>
                <p className="text-slate-200 font-mono">Active (Current Device)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
