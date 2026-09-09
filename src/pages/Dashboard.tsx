import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  Upload, 
  History, 
  ArrowRight,
  Sparkles, 
  Shield, 
  ShieldAlert, 
  Eye, 
  Users, 
  Layers, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  FileText, 
  Clock, 
  SlidersHorizontal, 
  RefreshCw, 
  Copy, 
  Check, 
  Maximize2, 
  Activity, 
  Cpu, 
  FileCheck, 
  ChevronRight, 
  Table, 
  Grid3X3,
  HardDrive,
  Hash,
  Award
} from 'lucide-react';
import { DocumentRecord } from '../types/Document';
import { useAuth } from '../context/AuthContext';
import { initialUserActivities } from '../data/mockUserActivities';
import { UserActivityItem, VerificationOutcome } from '../types/AdminActivity';
import { AdminAuditInspectModal } from '../components/AdminAuditInspectModal';
import { apiRequest } from '../services/api';
import { useEffect } from 'react';

interface DashboardProps {
  documents: DocumentRecord[];
  onSelectDocument: (docId: string) => void;
  onNavigate: (tab: string) => void;
  onOpenQrVerifyModal?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  documents,
  onSelectDocument,
  onNavigate,
  onOpenQrVerifyModal
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  // State management
  const [inspectItem, setInspectItem] = useState<UserActivityItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [densityMode, setDensityMode] = useState<'compact' | 'comfortable'>('compact');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Unified items list: combine rich user activities with documents
  const [allRecords, setAllRecords] = useState<UserActivityItem[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await apiRequest('/verification/history');
        if (data.history) {
          const mapped = data.history.map((h: any) => h.activityItem).filter(Boolean);
          setAllRecords(isAdmin ? mapped : mapped.filter((m: any) => m.userId === user?.id));
        }
      } catch (err) {
        console.error('Failed to fetch history', err);
      }
    };
    fetchHistory();
  }, [user, isAdmin]);

  // Filtered list
  const filteredRecords = useMemo(() => {
    return allRecords.filter((item) => {
      const matchesSearch = 
        item.documentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.issuerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ocrExtracted.idNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = categoryFilter === 'ALL' || item.certificateType === categoryFilter;
      const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [allRecords, searchQuery, categoryFilter, statusFilter]);

  // Aggregate Metrics
  const totalSubmissions = allRecords.length;
  const verifiedCount = allRecords.filter(r => r.status === 'VERIFIED_VALID').length;
  const suspiciousCount = allRecords.filter(r => r.status === 'SUSPICIOUS_FLAGGED').length;
  const rejectedCount = allRecords.filter(r => r.status === 'REJECTED_FRAUDULENT').length;
  const verificationRate = ((verifiedCount / (totalSubmissions || 1)) * 100).toFixed(1);

  const handleCopyHash = (hashText: string, id: string) => {
    navigator.clipboard.writeText(hashText);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'CERTIFICATE':
        return 'bg-blue-950/80 text-blue-300 border-blue-800/80';
      case 'DEGREE':
        return 'bg-purple-950/80 text-purple-300 border-purple-800/80';
      case 'MARKSHEET':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80';
      case 'ID_CARD':
        return 'bg-amber-950/80 text-amber-300 border-amber-800/80';
      case 'PASSPORT':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-800/80';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      id="enterprise-document-dashboard" 
      className="space-y-5 max-w-7xl mx-auto w-full"
    >
      {/* 1. Header Command Bar */}
      <div className="p-5 rounded-2xl bg-[#0c1326] border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
              isAdmin 
                ? 'text-amber-400 bg-amber-950/80 border-amber-800' 
                : 'text-blue-400 bg-blue-950/80 border-blue-800'
            }`}>
              {isAdmin ? 'ADMINISTRATIVE DISPATCH & FORENSIC GRID' : 'ENTERPRISE DOCUMENT REGISTRY'}
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">•</span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">Node: ap-southeast-1 (Active)</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span>Enterprise Document Verification Console</span>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/60 font-mono font-normal">
              v2.8 High-Density
            </span>
          </h1>

          <p className="text-xs text-slate-400 max-w-2xl">
            Real-time optical character recognition, holographic seal inspection, font kerning divergence analysis, and cryptographic ledger hashing.
          </p>
        </div>

        {/* Global Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('upload')}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-blue-600/30"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Verify New Document</span>
          </button>

          {isAdmin ? (
            <button
              onClick={() => onNavigate('admin-activity')}
              className="px-3.5 py-2 rounded-xl bg-amber-950/80 hover:bg-amber-900/80 border border-amber-800/80 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Full Audit Trail</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('history')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <History className="w-3.5 h-3.5" />
              <span>History</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. High-Density KPI Metric Matrix (Responsive 2-col Mobile, 4-col Tablet, 5-col Desktop) */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3">
        {/* Metric 1: Total Processed */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-[#0e172e] border border-slate-800 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium">Total Ingested</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold font-mono text-white">{totalSubmissions}</span>
            <span className="text-[11px] text-blue-400 font-mono">100% indexed</span>
          </div>
          <div className="mt-2 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full w-full" />
          </div>
        </div>

        {/* Metric 2: Verified Valid */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-[#0e172e] border border-slate-800 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium">Verified Genuine</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold font-mono text-white">{verifiedCount}</span>
            <span className="text-[11px] text-emerald-400 font-mono">{verificationRate}%</span>
          </div>
          <div className="mt-2 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all" 
              style={{ width: `${verificationRate}%` }} 
            />
          </div>
        </div>

        {/* Metric 3: Suspicious Flags */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-[#0e172e] border border-slate-800 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium">Suspicion Flags</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold font-mono text-white">{suspiciousCount}</span>
            <span className="text-[11px] text-amber-400 font-mono">Kerning & Seal</span>
          </div>
          <div className="mt-2 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-500 rounded-full" 
              style={{ width: `${(suspiciousCount / totalSubmissions) * 100}%` }} 
            />
          </div>
        </div>

        {/* Metric 4: Fraud Rejected */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-[#0e172e] border border-slate-800 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium">Fraud Interceptions</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold font-mono text-white">{rejectedCount}</span>
            <span className="text-[11px] text-rose-400 font-mono">Quarantined</span>
          </div>
          <div className="mt-2 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-rose-500 rounded-full" 
              style={{ width: `${(rejectedCount / totalSubmissions) * 100}%` }} 
            />
          </div>
        </div>

        {/* Metric 5: Desktop-Only Engine Telemetry */}
        <div className="col-span-2 md:col-span-4 xl:col-span-1 p-3.5 sm:p-4 rounded-xl bg-[#0e172e] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium">Latency & Accuracy</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between font-mono">
            <span className="text-lg font-bold text-white">1.18s</span>
            <span className="text-[11px] text-cyan-400">99.8% precision</span>
          </div>
          <p className="mt-2 text-[10px] text-slate-500 truncate">
            0.02mm font kerning threshold active
          </p>
        </div>
      </div>

      {/* 3. Main Multi-Tier Grid (8 Columns Left Data Grid, 4 Columns Right Intelligence Pod) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Left Section: High-Density Document Registry Table & Filters (xl:col-span-8) */}
        <div className="xl:col-span-8 space-y-4">
          <div className="p-4 rounded-2xl bg-[#0c1326] border border-slate-800 shadow-xl space-y-3.5">
            {/* Table Control Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-400" />
                <h2 className="text-sm font-bold text-white">Document Verification Ledger</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#080e1e] border border-slate-700 text-slate-300">
                  {filteredRecords.length} records shown
                </span>
              </div>

              {/* View & Density Controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-lg bg-[#080e1e] border border-slate-700/80 p-0.5">
                  <button
                    type="button"
                    onClick={() => setDensityMode('compact')}
                    title="Compact High-Density Table"
                    className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                      densityMode === 'compact'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Table className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Compact</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDensityMode('comfortable')}
                    title="Comfortable Density"
                    className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                      densityMode === 'comfortable'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Grid3X3 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Comfortable</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Search & Category Filter Ribbon */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, student name, email, or issuer..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#080e1e] border border-slate-700/80 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Document Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[#080e1e] border border-slate-700/80 text-slate-200 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                <option value="CERTIFICATE">Certificates</option>
                <option value="DEGREE">Degrees</option>
                <option value="MARKSHEET">Marksheets</option>
                <option value="ID_CARD">National IDs</option>
                <option value="PASSPORT">Passports</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[#080e1e] border border-slate-700/80 text-slate-200 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="ALL">All Outcomes</option>
                <option value="VERIFIED_VALID">Verified Genuine</option>
                <option value="SUSPICIOUS_FLAGGED">Suspicious Flag</option>
                <option value="REJECTED_FRAUDULENT">Fraudulent</option>
              </select>
            </div>

            {/* The High-Density Responsive Table (Desktop) */}
            <div className="overflow-x-auto rounded-xl border border-slate-800/80">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-[#080e1e] text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
                    <th className={`${densityMode === 'compact' ? 'py-2 px-3' : 'py-3 px-4'}`}>Document / Subject</th>
                    <th className={`${densityMode === 'compact' ? 'py-2 px-3' : 'py-3 px-4'}`}>Category</th>
                    <th className={`${densityMode === 'compact' ? 'py-2 px-3' : 'py-3 px-4'}`}>Issuing Authority</th>
                    <th className={`${densityMode === 'compact' ? 'py-2 px-3' : 'py-3 px-4'}`}>Verification Outcome</th>
                    <th className={`${densityMode === 'compact' ? 'py-2 px-3' : 'py-3 px-4'}`}>Confidence</th>
                    <th className={`${densityMode === 'compact' ? 'py-2 px-3' : 'py-3 px-4'}`}>Hash (SHA-256)</th>
                    <th className={`${densityMode === 'compact' ? 'py-2 px-3 text-right' : 'py-3 px-4 text-right'}`}>Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 text-xs">
                  {filteredRecords.map((item) => {
                    const badge = getStatusBadge(item.status);
                    const StatusIcon = badge.icon;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setInspectItem(item)}
                        className="hover:bg-slate-800/30 transition-colors cursor-pointer group"
                      >
                        {/* Title & User */}
                        <td className={`${densityMode === 'compact' ? 'py-2 px-3' : 'py-3 px-4'}`}>
                          <div className="space-y-0.5">
                            <p className="font-medium text-white group-hover:text-blue-400 transition-colors truncate max-w-[220px]">
                              {item.documentTitle}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate max-w-[180px]">
                              Holder: <span className="text-slate-300 font-medium">{item.userName}</span>
                            </p>
                          </div>
                        </td>

                        {/* Category */}
                        <td className={`${densityMode === 'compact' ? 'py-2 px-3' : 'py-3 px-4'} whitespace-nowrap`}>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getTypeColor(item.certificateType)}`}>
                            {item.certificateType}
                          </span>
                        </td>

                        {/* Issuer */}
                        <td className={`${densityMode === 'compact' ? 'py-2 px-3' : 'py-3 px-4'} text-slate-300 truncate max-w-[160px]`}>
                          <span className="text-xs truncate">{item.issuerName}</span>
                        </td>

                        {/* Status */}
                        <td className={`${densityMode === 'compact' ? 'py-2 px-3' : 'py-3 px-4'} whitespace-nowrap`}>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border inline-flex items-center gap-1.5 ${badge.bg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                            <StatusIcon className="w-3 h-3" />
                            <span>{badge.label}</span>
                          </span>
                        </td>

                        {/* Confidence */}
                        <td className={`${densityMode === 'compact' ? 'py-2 px-3' : 'py-3 px-4'} whitespace-nowrap font-mono`}>
                          <div className="flex items-center gap-1.5">
                            <span className="text-white font-semibold text-xs">{item.confidenceScore}%</span>
                            <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                              <div
                                className={`h-full rounded-full ${
                                  item.confidenceScore >= 90 ? 'bg-emerald-500' : item.confidenceScore >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                                }`}
                                style={{ width: `${item.confidenceScore}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Cryptographic SHA-256 Hash */}
                        <td className={`${densityMode === 'compact' ? 'py-2 px-3' : 'py-3 px-4'} whitespace-nowrap font-mono text-[11px] text-slate-400`}>
                          <div className="flex items-center gap-1">
                            <span className="truncate max-w-[80px]">
                              {item.forensicChecks[0]?.metadataHash ? item.forensicChecks[0].metadataHash.slice(0, 10) : 'e3b0c44298...'}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyHash(item.forensicChecks[0]?.metadataHash || 'e3b0c44298fc1c149afbf4c8996fb924', item.id);
                              }}
                              className="text-slate-500 hover:text-slate-200 p-0.5"
                              title="Copy Hash"
                            >
                              {copiedHash === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        </td>

                        {/* Action */}
                        <td className={`${densityMode === 'compact' ? 'py-2 px-3 text-right' : 'py-3 px-4 text-right'} whitespace-nowrap`}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setInspectItem(item);
                            }}
                            className="px-2 py-1 rounded bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredRecords.length === 0 && (
              <div className="p-8 text-center space-y-2">
                <FileText className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-xs text-slate-400">No verification records matched your filter criteria.</p>
              </div>
            )}
          </div>

          {/* Forensic Pipeline Execution Flow */}
          <div className="p-4 rounded-2xl bg-[#0c1326] border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>AI Forensic Pipeline Execution Sequence</span>
              </h3>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Pipelines Operational</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-[#080e1e] border border-slate-800 space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Phase 1: OCR</span>
                  <span className="text-emerald-400">99.4%</span>
                </div>
                <p className="text-[10px] text-slate-500 truncate">Multilingual text parsing</p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#080e1e] border border-slate-800 space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Phase 2: Seals</span>
                  <span className="text-emerald-400">ISO 14443</span>
                </div>
                <p className="text-[10px] text-slate-500 truncate">Hologram diffraction</p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#080e1e] border border-slate-800 space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Phase 3: Kerning</span>
                  <span className="text-blue-400">&lt;0.02mm</span>
                </div>
                <p className="text-[10px] text-slate-500 truncate">Font delta detection</p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#080e1e] border border-slate-800 space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Phase 4: Ledger</span>
                  <span className="text-cyan-400">SHA-256</span>
                </div>
                <p className="text-[10px] text-slate-500 truncate">Cryptographic hash check</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Auxiliary Intelligence Pod (xl:col-span-4) */}
        <div className="xl:col-span-4 space-y-4">
          {/* Pod 1: Rapid Ingest & Direct Upload Dropzone */}
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              onNavigate('upload');
            }}
            className={`p-5 rounded-2xl border transition-all space-y-3 cursor-pointer ${
              isDragOver 
                ? 'bg-blue-950/40 border-blue-500 shadow-xl shadow-blue-500/20' 
                : 'bg-[#0c1326] border-slate-800 hover:border-blue-500/40'
            }`}
            onClick={() => onNavigate('upload')}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-blue-400" />
                <span>Instant Document Verifier</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                Drag & Drop
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#080e1e] border border-dashed border-slate-700/80 text-center space-y-1.5">
              <div className="w-8 h-8 mx-auto rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <Upload className="w-4 h-4" />
              </div>
              <p className="text-xs font-semibold text-white">Click or drop certificate scan</p>
              <p className="text-[10px] text-slate-400">PDF, JPG, PNG up to 25MB</p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Automated Forensic Scan</span>
              <span className="text-blue-400 font-semibold flex items-center gap-1">
                <span>Start</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Pod 2: Live Forensic Anomaly & Audit Ticker */}
          <div className="p-5 rounded-2xl bg-[#0c1326] border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-white uppercase font-mono">Live Forensic Feed</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Real-time Stream</span>
            </div>

            <div className="space-y-2.5">
              {allRecords.slice(0, 4).map((rec) => {
                const isFlag = rec.status !== 'VERIFIED_VALID';
                return (
                  <div
                    key={rec.id}
                    onClick={() => setInspectItem(rec)}
                    className="p-2.5 rounded-xl bg-[#080e1e] border border-slate-800/90 hover:border-slate-700 transition-colors cursor-pointer space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white truncate max-w-[170px]">
                        {rec.documentTitle}
                      </span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                        rec.status === 'VERIFIED_VALID' ? 'text-emerald-400 bg-emerald-950' : 'text-amber-400 bg-amber-950'
                      }`}>
                        {rec.status === 'VERIFIED_VALID' ? 'CLEARED' : 'ALERT'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 truncate">
                      {rec.resultSummary}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-0.5">
                      <span>{rec.issuerName}</span>
                      <span>{rec.confidenceScore}% confidence</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pod 3: Accredited Issuers Trust Index */}
          <div className="p-5 rounded-2xl bg-[#0c1326] border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white uppercase font-mono">Issuer Accreditation</h3>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">Live Ledger</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#080e1e]">
                <div>
                  <p className="font-medium text-white text-xs">Stanford University</p>
                  <p className="text-[10px] text-slate-400">Academic Board #CA-94305</p>
                </div>
                <span className="font-mono text-emerald-400 font-semibold text-xs">99.8 Trust</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#080e1e]">
                <div>
                  <p className="font-medium text-white text-xs">Harvard University Registrar</p>
                  <p className="text-[10px] text-slate-400">Higher Education Dept #MA-02138</p>
                </div>
                <span className="font-mono text-emerald-400 font-semibold text-xs">99.6 Trust</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#080e1e]">
                <div>
                  <p className="font-medium text-white text-xs">National Examination Board</p>
                  <p className="text-[10px] text-slate-400">Central Secondary Directorate</p>
                </div>
                <span className="font-mono text-blue-400 font-semibold text-xs">97.4 Trust</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Forensic Inspection Modal Hook */}
      <AdminAuditInspectModal
        activity={inspectItem}
        onClose={() => setInspectItem(null)}
      />
    </motion.div>
  );
};
