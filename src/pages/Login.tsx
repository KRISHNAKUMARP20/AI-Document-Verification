import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  User as UserIcon, 
  ShieldAlert, 
  Lock, 
  Mail, 
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ForgotPasswordModal } from '../components/ForgotPasswordModal';

interface LoginPageProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onSwitchToRegister }) => {
  const { login } = useAuth();
  const [loginType, setLoginType] = useState<'USER' | 'ADMIN'>('USER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const handleTabChange = (type: 'USER' | 'ADMIN') => {
    setLoginType(type);
    setError(null);
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    // Validation
    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (!cleanPassword) {
      setError('Please enter your password.');
      return;
    }

    // Formal Email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(cleanEmail)) {
      setError('Please enter a valid formal email address (e.g., name@domain.com).');
      return;
    }

    if (loginType === 'ADMIN') {
      if (cleanEmail.toLowerCase() !== 'kk6308608@gmail.com' || cleanPassword !== 'krishna@6308') {
        setError('Invalid admin credentials. Please enter the authorized admin email and password.');
        return;
      }
    }

    setLoading(true);
    try {
      await login(cleanEmail, cleanPassword, loginType);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] w-full flex items-center justify-center p-3 sm:p-6">
      {/* Background Subtle Constellation Glow */}
      <div className="absolute inset-0 bg-[#070d1e] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(29,78,216,0.22),rgba(255,255,255,0))] pointer-events-none rounded-3xl" />

      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative w-full max-w-md z-10 space-y-5"
      >
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-[#0b1329] rounded-2xl flex items-center justify-center relative">
              <Shield className="w-8 h-8 text-blue-500" fill="currentColor" fillOpacity={0.2} />
              <span className="absolute font-black text-white text-xs tracking-wider">AI</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Document Verification</h1>
          <p className="text-xs text-slate-400">Trust Documents. Build a Safer World.</p>
        </div>

        {/* The Clean Login Card */}
        <div className="p-7 sm:p-8 rounded-3xl bg-[#0e172e]/95 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-5">
          {/* User vs Admin Mode Switcher */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-[#080d1a] border border-slate-800">
            <button
              id="tab-user-login"
              type="button"
              onClick={() => handleTabChange('USER')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                loginType === 'USER'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>User Login</span>
            </button>
            <button
              id="tab-admin-login"
              type="button"
              onClick={() => handleTabChange('ADMIN')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                loginType === 'ADMIN'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin Login</span>
            </button>
          </div>

          {/* Mode Title & Description */}
          <div className="space-y-1 text-center">
            <h2 className="text-sm font-semibold text-white flex items-center justify-center gap-1.5">
              {loginType === 'ADMIN' ? (
                <>
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Admin Security Portal</span>
                </>
              ) : (
                <>
                  <UserIcon className="w-4 h-4 text-blue-400" />
                  <span>User Portal Sign In</span>
                </>
              )}
            </h2>
            <p className="text-[11px] text-slate-400">
              {loginType === 'ADMIN'
                ? 'Authorized administrator login with audit tracking'
                : 'Sign in to submit and track your document verifications'}
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{loginType === 'ADMIN' ? 'Admin Email Address' : 'Formal Email Address'}</span>
              </label>
              <input
                id="login-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder={loginType === 'ADMIN' ? 'admin@example.com' : 'name@domain.com'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080e1e] border border-slate-700/80 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>{loginType === 'ADMIN' ? 'Admin Password' : 'Password'}</span>
              </label>
              <div className="relative">
                <input
                  id="login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080e1e] border border-slate-700/80 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors pr-10"
                />
                <button
                  type="button"
                  id="btn-toggle-login-pwd-visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 text-xs p-1"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* In USER mode only: Remember me & Forgot Password */}
            {loginType === 'USER' && (
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-[#080e1e] border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  id="btn-open-forgot-pwd"
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-blue-400 hover:text-blue-300 text-xs font-medium cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              id="btn-submit-login"
              type="submit"
              disabled={loading}
              className={`w-full min-h-[44px] py-2.5 rounded-xl text-white text-xs font-semibold shadow-lg transition-all cursor-pointer ${
                loginType === 'ADMIN'
                  ? 'bg-amber-600 hover:bg-amber-500 active:bg-amber-700 shadow-amber-600/30'
                  : 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-blue-600/30'
              }`}
            >
              {loading 
                ? 'Authenticating...' 
                : (loginType === 'ADMIN' ? 'Login to Admin Console' : 'Sign In as User')}
            </motion.button>
          </form>

          {/* Bottom Footer Action */}
          {loginType === 'USER' ? (
            <div className="text-center pt-2 border-t border-slate-800/80">
              <p className="text-xs text-slate-400">
                Don't have an account?{' '}
                <button
                  id="link-to-register"
                  onClick={onSwitchToRegister}
                  className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                >
                  Create Account (Sign Up)
                </button>
              </p>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-800/80 text-center">
              <p className="text-[11px] text-amber-400/90 flex items-center justify-center gap-1.5 font-medium">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Restricted Administrative Terminal • Authorized Personnel Only</span>
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Forgot Password Modal (User Only) */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        initialEmail={email}
        onPasswordResetSuccess={(resetEmail) => {
          setEmail(resetEmail);
          setError(null);
        }}
      />
    </div>
  );
};
