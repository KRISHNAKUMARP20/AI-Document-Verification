import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  FileText, 
  Sparkles, 
  User, 
  Calendar, 
  Clock, 
  Smartphone, 
  Monitor, 
  CheckCircle2, 
  ArrowUpDown,
  RefreshCw,
  Shield,
  Layers,
  ChevronRight
} from 'lucide-react';
import { initialUserActivities } from '../data/mockUserActivities';
import { UserActivityItem, CertificateCategory, VerificationOutcome } from '../types/AdminActivity';
import { AdminAuditInspectModal } from '../components/AdminAuditInspectModal';

import { apiRequest } from '../services/api';
import { useEffect } from 'react';

export const AdminUserActivityPage: React.FC = () => {
  const [activities, setActivities] = useState<UserActivityItem[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await apiRequest('/verification/history');
        if (data.history) {
          const mapped = data.history.map((h: any) => h.activityItem).filter(Boolean);
          setActivities(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch history', err);
      }
    };
    fetchHistory();
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [inspectItem, setInspectItem] = useState<UserActivityItem | null>(null);

  // Filter logic
  const filteredActivities = useMemo(() => {
    return activities.filter((item) => {
      const matchesSearch = 
        item.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.documentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.issuerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ocrExtracted.idNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === 'ALL' || item.certificateType === selectedType;
      const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [activities, searchQuery, selectedType, selectedStatus]);

  // Statistics calculation
  const totalCount = activities.length;
  const verifiedCount = activities.filter(a => a.status === 'VERIFIED_VALID').length;
  const suspiciousCount = activities.filter(a => a.status === 'SUSPICIOUS_FLAGGED').length;
  const rejectedCount = activities.filter(a => a.status === 'REJECTED_FRAUDULENT').length;

  const handleUpdateStatus = (activityId: string, newStatus: VerificationOutcome) => {
    setActivities(prev => prev.map(item => {
      if (item.id === activityId) {
        return {
          ...item,
          status: newStatus,
          resultSummary: newStatus === 'VERIFIED_VALID'
            ? 'Manually verified by Administrator. Status confirmed authentic.'
            : newStatus === 'SUSPICIOUS_FLAGGED'
            ? 'Flagged for secondary manual review by Administrator.'
            : 'Rejected as fraudulent by Administrator.'
        };
      }
      return item;
    }));
  };

  const getStatusBadge = (status: VerificationOutcome) => {
    switch (status) {
      case 'VERIFIED_VALID':
        return {
          label: 'VERIFIED',
          bg: 'bg-emerald-950/70 border-emerald-800 text-emerald-400',
          dot: 'bg-emerald-400',
          icon: ShieldCheck
        };
      case 'SUSPICIOUS_FLAGGED':
        return {
          label: 'SUSPICIOUS',
          bg: 'bg-amber-950/70 border-amber-800 text-amber-400',
          dot: 'bg-amber-400',
          icon: AlertTriangle
        };
      case 'REJECTED_FRAUDULENT':
        return {
          label: 'REJECTED',
          bg: 'bg-rose-950/70 border-rose-800 text-rose-400',
          dot: 'bg-rose-400',
          icon: XCircle
        };
      default:
        return {
          label: 'PENDING',
          bg: 'bg-blue-950/70 border-blue-800 text-blue-400',
          dot: 'bg-blue-400',
          icon: Clock
        };
    }
  };

  const getTypeBadge = (type: CertificateCategory) => {
    switch (type) {
      case 'CERTIFICATE':
        return 'bg-blue-950/80 text-blue-300 border-blue-800';
      case 'DEGREE':
        return 'bg-purple-950/80 text-purple-300 border-purple-800';
      case 'MARKSHEET':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800';
      case 'ID_CARD':
        return 'bg-amber-950/80 text-amber-300 border-amber-800';
      case 'PASSPORT':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      id="admin-user-activity-view" 
      className="space-y-6 max-w-7xl mx-auto w-full"
    >
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-[#0c1326] border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-800/80">
              ADMINISTRATIVE AUDIT
            </span>
            <span className="text-xs text-slate-400">Live User Submissions & Document Forensic Logs</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            User Full Verification Activity
          </h1>
          <p className="text-xs text-slate-400">
            Real-time monitoring of uploaded certificates, marksheets, degrees, and identity records with AI forensic outcomes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8," + 
                ["User,Email,Document Title,Type,Result,Confidence,Date"].concat(
                  activities.map(a => `"${a.userName}","${a.userEmail}","${a.documentTitle}","${a.certificateType}","${a.status}",${a.confidenceScore}%,"${a.submittedAt}"`)
                ).join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "user_verification_activity_audit.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Log</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Metric Cards (Responsive Desktop 4-col, Mobile 2-col) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <motion.div 
          whileHover={{ y: -2 }}
          className="p-4 sm:p-5 rounded-2xl bg-[#0e172e] border border-slate-800 flex items-center gap-3.5 shadow-lg"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-white font-mono">{totalCount}</p>
            <p className="text-[11px] text-slate-400">Total User Submissions</p>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          className="p-4 sm:p-5 rounded-2xl bg-[#0e172e] border border-slate-800 flex items-center gap-3.5 shadow-lg"
        >
          <div className="w-11 h-11 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-white font-mono">{verifiedCount}</p>
            <p className="text-[11px] text-slate-400">Verified Valid ({(verifiedCount / totalCount * 100).toFixed(0)}%)</p>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          className="p-4 sm:p-5 rounded-2xl bg-[#0e172e] border border-slate-800 flex items-center gap-3.5 shadow-lg"
        >
          <div className="w-11 h-11 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-white font-mono">{suspiciousCount}</p>
            <p className="text-[11px] text-slate-400">Suspicious Flagged</p>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          className="p-4 sm:p-5 rounded-2xl bg-[#0e172e] border border-slate-800 flex items-center gap-3.5 shadow-lg"
        >
          <div className="w-11 h-11 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-white font-mono">{rejectedCount}</p>
            <p className="text-[11px] text-slate-400">Fraudulent Rejected</p>
          </div>
        </motion.div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-[#0c1326] border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-md">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by user name, email, certificate name, or ID..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#070b16] border border-slate-700/80 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Certificate Type Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 hidden sm:inline">Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#070b16] border border-slate-700/80 text-slate-200 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="ALL">All Document Types</option>
              <option value="CERTIFICATE">Certificate</option>
              <option value="MARKSHEET">Marksheet</option>
              <option value="DEGREE">Degree</option>
              <option value="ID_CARD">ID Card</option>
              <option value="PASSPORT">Passport</option>
            </select>
          </div>

          {/* Outcome Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 hidden sm:inline">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#070b16] border border-slate-700/80 text-slate-200 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="ALL">All Results</option>
              <option value="VERIFIED_VALID">Verified</option>
              <option value="SUSPICIOUS_FLAGGED">Suspicious</option>
              <option value="REJECTED_FRAUDULENT">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Data Presentation: Responsive Desktop Table & Android Mobile Cards */}
      <div className="rounded-2xl bg-[#0c1326] border border-slate-800 shadow-xl overflow-hidden">
        {/* Desktop Table (Visible on md & above) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-[#080e1e] text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
                <th className="py-3.5 px-4">User Details</th>
                <th className="py-3.5 px-4">Certificate / Document</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">AI Verification Result</th>
                <th className="py-3.5 px-4">Confidence</th>
                <th className="py-3.5 px-4">Submission Time</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs">
              {filteredActivities.map((act) => {
                const badge = getStatusBadge(act.status);
                const StatusIcon = badge.icon;
                return (
                  <motion.tr
                    key={act.id}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                    className="transition-colors group cursor-pointer"
                    onClick={() => setInspectItem(act)}
                  >
                    {/* User */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
                          {act.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {act.userName}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">{act.userEmail}</p>
                        </div>
                      </div>
                    </td>

                    {/* Document */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div>
                        <p className="font-medium text-slate-200 truncate">{act.documentTitle}</p>
                        <p className="text-[11px] text-slate-400 truncate">{act.issuerName}</p>
                      </div>
                    </td>

                    {/* Certificate Type */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getTypeBadge(act.certificateType)}`}>
                        {act.certificateType}
                      </span>
                    </td>

                    {/* Outcome Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 ${badge.bg}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          <span>{badge.label}</span>
                        </span>
                      </div>
                    </td>

                    {/* Confidence */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold">{act.confidenceScore}%</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded ${
                            act.trustScore >= 80 ? 'text-emerald-400 bg-emerald-950' : act.trustScore >= 50 ? 'text-amber-400 bg-amber-950' : 'text-rose-400 bg-rose-950'
                          }`}>
                            Trust: {act.trustScore}
                          </span>
                        </div>
                        <div className="w-20 h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${act.confidenceScore >= 80 ? 'bg-emerald-500' : act.confidenceScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                            style={{ width: `${act.confidenceScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Time */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                      {new Date(act.submittedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectItem(act);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 border border-blue-500/30 hover:border-blue-500 text-blue-300 hover:text-white text-xs font-semibold inline-flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile / Android Phone Cards (Visible on screens < md) */}
        <div className="md:hidden divide-y divide-slate-800/80 p-3 space-y-3">
          {filteredActivities.map((act) => {
            const badge = getStatusBadge(act.status);
            const StatusIcon = badge.icon;
            return (
              <motion.div
                key={act.id}
                whileTap={{ scale: 0.99 }}
                onClick={() => setInspectItem(act)}
                className="p-4 rounded-xl bg-[#0e172e] border border-slate-800 space-y-3 cursor-pointer shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
                      {act.userName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">{act.userName}</h3>
                      <p className="text-[11px] text-slate-400 font-mono">{act.userEmail}</p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getTypeBadge(act.certificateType)}`}>
                    {act.certificateType}
                  </span>
                </div>

                {/* Certificate info */}
                <div className="p-2.5 rounded-lg bg-[#070b16] border border-slate-800 space-y-1">
                  <p className="text-xs font-medium text-slate-200">{act.documentTitle}</p>
                  <p className="text-[11px] text-slate-400">{act.issuerName}</p>
                </div>

                {/* Outcome Status & Confidence */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 ${badge.bg}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    <span>{badge.label}</span>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-white font-bold text-xs">{act.confidenceScore}% AI Confidence</span>
                  </div>
                </div>

                {/* Mobile Touch-Friendly Action Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setInspectItem(act);
                  }}
                  className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>Inspect Forensic Audit</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>
              </motion.div>
            );
          })}
        </div>

        {filteredActivities.length === 0 && (
          <div className="p-12 text-center space-y-3">
            <FileText className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-sm font-semibold text-slate-300">No user verification records matched</p>
            <p className="text-xs text-slate-500">Try adjusting your search query or filter settings</p>
          </div>
        )}
      </div>

      {/* Forensic Audit Inspector Modal */}
      <AdminAuditInspectModal
        activity={inspectItem}
        onClose={() => setInspectItem(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </motion.div>
  );
};
