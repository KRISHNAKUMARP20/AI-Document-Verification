import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  FileCheck, 
  History, 
  User, 
  Settings, 
  LogOut,
  Cpu,
  FileText,
  CheckSquare,
  ScanSearch,
  Award,
  Users,
  X,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedDocId?: string | null;
  onLogoutClick?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab,
  onLogoutClick,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  // Primary navigation
  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ...(isAdmin ? [
      { id: 'admin-activity', label: 'User Full Activity', icon: Users, badge: 'Audit' }
    ] : []),
    { id: 'upload', label: 'Verify Document', icon: FileCheck },
    { id: 'history', label: 'Verification History', icon: History },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Pipeline navigation items
  const pipelineNavItems = [
    { id: 'processing', label: 'AI Processing', icon: Cpu },
    { id: 'extracted-info', label: 'Extracted Info', icon: FileText },
    { id: 'checks', label: 'Verification Checks', icon: CheckSquare },
    { id: 'result', label: 'Final Result', icon: Award },
    { id: 'detailed-analysis', label: 'Detailed Analysis', icon: ScanSearch },
  ];

  const handleLogout = () => {
    if (onLogoutClick) {
      onLogoutClick();
    } else {
      logout();
    }
  };

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full py-5 px-3">
      <div className="space-y-4">
        {/* Mobile Header in Drawer */}
        <div className="flex md:hidden items-center justify-between pb-3 px-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-xs">
              AI
            </div>
            <span className="font-bold text-sm text-white">Menu Navigation</span>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Role Notice on top of sidebar */}
        {isAdmin && (
          <div className="px-3 py-2 rounded-xl bg-amber-950/40 border border-amber-800/60 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="leading-tight">
              <p className="text-[10px] uppercase font-mono font-bold text-amber-400">Admin Clearance</p>
              <p className="text-[10px] text-slate-400">Audit & Supervision Mode</p>
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full min-h-[42px] flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                  isActive 
                    ? (item.id === 'admin-activity' ? 'bg-amber-600 text-white font-semibold shadow-md shadow-amber-600/30' : 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30')
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-black/30 text-white' : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Verification Pipeline Steps */}
        <div className="pt-2 border-t border-slate-800/80">
          <p className="px-3.5 pb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Verification Pipeline
          </p>
          <div className="space-y-1">
            {pipelineNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-pipeline-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full min-h-[38px] flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-blue-950/60 text-blue-300 font-semibold border border-blue-800/50' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Sign Out */}
      <div className="pt-4 border-t border-slate-800/80">
        <button
          id="sidebar-logout-btn"
          onClick={handleLogout}
          className="w-full min-h-[42px] flex items-center gap-3 px-3.5 py-2.5 text-xs text-slate-400 hover:text-rose-300 hover:bg-rose-950/20 rounded-xl transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (Visible on md and above) */}
      <aside 
        id="main-sidebar" 
        className="hidden md:flex w-64 bg-[#0a0f1d] border border-slate-800/90 rounded-2xl shrink-0 flex-col self-start sticky top-20 min-h-[calc(100vh-6rem)] shadow-xl"
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Visible on phones / Android mobile when isMobileOpen is true) */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Slide-over Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="relative w-4/5 max-w-xs bg-[#0a0f1d] border-r border-slate-800 h-full z-10 shadow-2xl flex flex-col"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
