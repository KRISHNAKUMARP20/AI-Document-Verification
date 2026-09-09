import React from 'react';
import { Shield, LogOut, Menu, X, Users, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogoutClick?: () => void;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onLogoutClick,
  isMobileMenuOpen,
  setIsMobileMenuOpen
}) => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const handleLogout = () => {
    if (onLogoutClick) {
      onLogoutClick();
    } else {
      logout();
      setActiveTab('logout-screen');
    }
  };

  return (
    <header id="main-app-header" className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0a0f1d]/95 backdrop-blur-md">
      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Left: Hamburger (on mobile) + Shield AI Logo + App Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user && setIsMobileMenuOpen && (
            <button
              type="button"
              id="mobile-nav-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-[#0e172e] border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <button 
            id="brand-home-btn"
            onClick={() => {
              if (user) {
                setActiveTab('dashboard');
              } else {
                setActiveTab('login');
              }
            }} 
            className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-xl group-hover:bg-blue-400/30 transition-all duration-300"></div>
              <div className="relative bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/50 backdrop-blur-md shadow-inner shadow-blue-900/20">
                <img src="/logo.jpg" alt="Verifact AI Logo" className="w-8 h-8 rounded-md object-contain" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-sm sm:text-base text-white tracking-tight leading-none group-hover:text-blue-400 transition-colors">
                  AI Document Verification
                </h1>
                {isAdmin && (
                  <span className="hidden lg:inline-flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                    <ShieldAlert className="w-2.5 h-2.5" />
                    <span>Admin</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 hidden sm:block">
                Trust Documents. Build a Safer World.
              </p>
            </div>
          </button>
        </div>

        {/* Right: User Avatar & Name */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              {/* Quick Jump for Admin: User Full Activity */}
              {isAdmin && (
                <button
                  id="nav-quick-admin-activity"
                  onClick={() => setActiveTab('admin-activity')}
                  className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'admin-activity'
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                      : 'bg-[#0e172e] border border-amber-900/60 text-amber-300 hover:bg-amber-950/40'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>User Activity</span>
                </button>
              )}

              <div 
                id="header-user-profile-badge"
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-2.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#0e172e] border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0 ${
                  user.role === 'ADMIN'
                    ? 'bg-gradient-to-tr from-amber-600 to-rose-600 ring-1 ring-amber-400/50'
                    : 'bg-gradient-to-tr from-blue-600 to-indigo-600'
                }`}>
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'K'}
                </div>
                <div className="text-left leading-tight hidden sm:block">
                  <p className="text-xs font-semibold text-white truncate max-w-[120px]">
                    {user.fullName || 'Krishna Kumar'}
                  </p>
                  <p className={`text-[10px] font-medium ${user.role === 'ADMIN' ? 'text-amber-400' : 'text-slate-400'}`}>
                    {user.role === 'ADMIN' ? 'Administrator' : 'User'}
                  </p>
                </div>
              </div>

              <button
                id="header-logout-btn"
                title="Log Out"
                onClick={handleLogout}
                className="p-2 rounded-xl bg-[#0e172e] border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-900/50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {activeTab !== 'login' && (
                <button
                  id="nav-login-btn"
                  onClick={() => setActiveTab('login')}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all cursor-pointer"
                >
                  Sign In
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
