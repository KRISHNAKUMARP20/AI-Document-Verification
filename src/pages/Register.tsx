import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Check, X, AlertCircle, Lock, Mail, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface RegisterPageProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSuccess, onSwitchToLogin }) => {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Password strength checks
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const passedChecksCount = [hasMinLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  const isPasswordStrong = passedChecksCount === 5;

  const getStrengthLabel = () => {
    if (!password) return { text: '', color: 'bg-slate-700' };
    if (passedChecksCount <= 2) return { text: 'Weak', color: 'bg-rose-500' };
    if (passedChecksCount <= 4) return { text: 'Moderate', color: 'bg-amber-500' };
    return { text: 'Strong & Secure', color: 'bg-emerald-500' };
  };

  const strength = getStrengthLabel();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = fullName.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      setError('Please enter your full name.');
      return;
    }

    // Formal Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(cleanEmail)) {
      setError('Please provide a valid formal email address (e.g., name@domain.com).');
      return;
    }

    // Strong password validation
    if (!isPasswordStrong) {
      setError('Password does not meet all security criteria. Please make it strong.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (!agreeTerms) {
      setError('Please accept the Terms & Conditions and Verification Policy to proceed.');
      return;
    }

    setLoading(true);
    try {
      await register({
        fullName: cleanName,
        email: cleanEmail.toLowerCase(),
        password,
        organization: 'Independent Verification User',
        role: 'USER'
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center p-4">
      {/* Background Subtle Constellation Effect */}
      <div className="absolute inset-0 bg-[#070d1e] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(29,78,216,0.25),rgba(255,255,255,0))] pointer-events-none rounded-3xl" />

      <div className="relative w-full max-w-md space-y-5 z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-[#0b1329] rounded-2xl flex items-center justify-center relative">
              <Shield className="w-8 h-8 text-blue-500" fill="currentColor" fillOpacity={0.15} />
              <span className="absolute font-black text-white text-xs tracking-wider">AI</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Document Verification</h1>
          <p className="text-xs text-slate-400">Create a New User Account</p>
        </div>

        {/* Card: Create New Account */}
        <div className="p-7 sm:p-8 rounded-2xl bg-[#0e172e]/95 border border-slate-800 shadow-2xl backdrop-blur-md space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-sm font-semibold text-white">Sign Up for Verification Portal</h2>
            <p className="text-[11px] text-slate-400">Set up your credentials with strong security encryption</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>Full Name</span>
              </label>
              <input
                id="signup-fullname"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoComplete="name"
                placeholder="e.g. Krishna Kumar"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#080e1e] border border-slate-700/80 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Formal Email Address</span>
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="name@domain.com"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#080e1e] border border-slate-700/80 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Strong Password</span>
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Create strong password"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#080e1e] border border-slate-700/80 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 text-xs p-0.5"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {password && (
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Password Strength:</span>
                    <span className={`font-semibold ${passedChecksCount === 5 ? 'text-emerald-400' : passedChecksCount >= 3 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {strength.text}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden flex gap-1">
                    {[1, 2, 3, 4, 5].map((index) => (
                      <div
                        key={index}
                        className={`h-full flex-1 rounded-full transition-all duration-300 ${
                          index <= passedChecksCount ? strength.color : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Live Interactive Checklist */}
              <div className="p-2.5 rounded-lg bg-[#080d1a] border border-slate-800/80 mt-1.5 space-y-1">
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Password Requirements:
                </p>
                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                    {hasMinLength ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-600" />}
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasUpper ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                    {hasUpper ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-600" />}
                    <span>Uppercase (A-Z)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasLower ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                    {hasLower ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-600" />}
                    <span>Lowercase (a-z)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                    {hasNumber ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-600" />}
                    <span>Number (0-9)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 col-span-2 ${hasSpecial ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                    {hasSpecial ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-600" />}
                    <span>Special character (!@#$%^&*)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Confirm Password</span>
              </label>
              <div className="relative">
                <input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#080e1e] border border-slate-700/80 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 text-xs p-0.5"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-[10px] text-rose-400">Passwords do not match.</p>
              )}
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-3.5 h-3.5 mt-0.5 rounded bg-[#080e1e] border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
                />
                <span className="text-[11px] leading-snug">
                  I agree to the{' '}
                  <span className="text-blue-400 hover:underline">Terms of Service</span> and{' '}
                  <span className="text-blue-400 hover:underline">Privacy & Security Policies</span>
                </span>
              </label>
            </div>

            <button
              id="btn-submit-signup"
              type="submit"
              disabled={loading || !isPasswordStrong || !agreeTerms || password !== confirmPassword}
              className="w-full py-2.5 mt-1 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              {loading ? 'Creating Secure Account...' : 'Create Account'}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-800/80">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <button
                id="link-to-login"
                onClick={onSwitchToLogin}
                className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
