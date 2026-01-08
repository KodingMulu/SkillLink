'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  DollarSign, Search, Filter, Download, 
  ArrowUpRight, Clock, CheckCircle2, XCircle, 
  MoreVertical, ChevronLeft, ChevronRight, FileText,
  CreditCard, Wallet, Landmark,
  type LucideIcon 
} from 'lucide-react';
import DashboardLayout from '../../DashboardLayout';
import TaxReportModal from './components/TaxReportModal';

interface TransactionStatApi {
  type: "total_volume" | "success" | "pending" | "failed";
  label: string;
  value: number;
  growth?: number;
  color: "blue" | "emerald" | "orange" | "red";
  icon?: string;
}

interface AdminStatsResponse {
  transactionStats: TransactionStatApi[];
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: string;
  color: "blue" | "emerald" | "orange" | "red";
}

interface TransactionRow {
  id: string;
  user: string;
  project: string;
  amount: string;
  method: string;
  status: 'success' | 'pending' | 'failed';
  date: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface TransactionListResponse {
  data: TransactionRow[];
  pagination: PaginationMeta;
}

export default function TransactionManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
  
  const [stats, setStats] = useState<TransactionStatApi[]>([]);
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingTable, setLoadingTable] = useState(true);

  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1, limit: 10, total: 0, totalPages: 1
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get<AdminStatsResponse>(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/user/admin/stats`,
          { withCredentials: true }
        );
        setStats(res.data.transactionStats || []);
      } catch (error) {
        setStats([]);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoadingTable(true);
      try {
        const res = await axios.get<TransactionListResponse>(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/user/admin/transactions`,
          {
            params: {
              page: pagination.page,
              limit: 10,
              search: searchTerm,
              status: statusFilter
            },
            withCredentials: true
          }
        );
        setTransactions(res.data.data || []);
        if (res.data.pagination) {
          setPagination(prev => ({ ...prev, ...res.data.pagination }));
        }
      } catch (error) {
        setTransactions([]);
      } finally {
        setLoadingTable(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchTransactions();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter, pagination.page]);

  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [searchTerm, statusFilter]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'success': return 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20';
      case 'pending': return 'bg-orange-100 text-orange-700 ring-1 ring-orange-600/20';
      case 'failed': return 'bg-red-100 text-red-700 ring-1 ring-red-600/20';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getMethodIcon = (method: string) => {
    const normalized = method.toLowerCase();
    if (normalized.includes('bank') || normalized.includes('landmark')) return <Landmark className="w-3 h-3" />;
    if (normalized.includes('card')) return <CreditCard className="w-3 h-3" />;
    return <Wallet className="w-3 h-3" />;
  };

  const getStatIcon = (type: string) => {
    switch(type) {
      case 'total_volume': return <ArrowUpRight className="text-blue-600 w-6 h-6" />;
      case 'success': return <CheckCircle2 className="text-emerald-600 w-6 h-6" />;
      case 'pending': return <Clock className="text-orange-600 w-6 h-6" />;
      case 'failed': return <XCircle className="text-red-600 w-6 h-6" />;
      default: return <DollarSign className="text-slate-600 w-6 h-6" />;
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Manajemen Transaksi</h1>
            <p className="text-slate-500 text-sm">Pantau arus kas, pembayaran proyek, dan penarikan dana.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition text-sm font-medium shadow-sm">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button 
              onClick={() => setIsTaxModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-md text-sm font-medium"
            >
              <FileText className="w-4 h-4" />
              Laporan Pajak
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {loadingStats ? (
             [...Array(4)].map((_, i) => (
               <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 h-32 animate-pulse" />
             ))
          ) : (
            stats.map((stat, idx) => {
              let displayValue = stat.value.toString();
              if (stat.type === 'total_volume') {
                displayValue = new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  notation: "compact", 
                  maximumFractionDigits: 1
                }).format(stat.value);
              } else {
                displayValue = stat.value.toLocaleString('id-ID');
              }

              return (
                <StatCard 
                  key={idx}
                  icon={getStatIcon(stat.type)} 
                  label={stat.label} 
                  value={displayValue} 
                  trend={stat.growth ? `${stat.growth > 0 ? '+' : ''}${stat.growth}%` : undefined} 
                  color={stat.color} 
                />
              );
            })
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row gap-4 justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Cari ID transaksi atau nama user..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="p-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 transition">
                <Filter className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0">
              {['all', 'success', 'pending', 'failed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all whitespace-nowrap ${
                    statusFilter === status 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID & Tanggal</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pengguna & Proyek</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Metode</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nominal</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadingTable ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500">Memuat data transaksi...</td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500">
                      {searchTerm ? "Tidak ada transaksi yang cocok." : "Belum ada riwayat transaksi."}
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-slate-900">{tx.id}</div>
                        <div className="text-[10px] text-slate-400 mt-1">{tx.date}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-slate-800">{tx.user}</div>
                        <div className="text-xs text-slate-500 truncate max-w-[180px]">{tx.project}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-100 w-fit px-2 py-1 rounded-md font-medium">
                          {getMethodIcon(tx.method)}
                          {tx.method}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-slate-900">{tx.amount}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(tx.status)}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition border border-transparent hover:border-slate-200">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
            <p className="text-sm text-slate-500">
              Menampilkan <span className="font-medium text-slate-900">{transactions.length}</span> dari <span className="font-medium text-slate-900">{pagination.total}</span> transaksi
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1 || loadingTable}
                className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => {
                  if (pageNum === 1 || pageNum === pagination.totalPages || (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition ${pagination.page === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-white border border-transparent hover:border-slate-200 text-slate-600'
                          }`}
                      >
                        {pageNum}
                      </button>
                    )
                  }
                  if (pageNum === 2 && pagination.page > 4) return <span key={pageNum} className="px-1">...</span>;
                  if (pageNum === pagination.totalPages - 1 && pagination.page < pagination.totalPages - 3) return <span key={pageNum} className="px-1">...</span>;
                  return null;
                })}

              <button 
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages || loadingTable}
                className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <TaxReportModal 
        isOpen={isTaxModalOpen} 
        onClose={() => setIsTaxModalOpen(false)} 
        onSuccess={() => console.log("Report generated successfully!")}
      />
    </DashboardLayout>
  );
}

function StatCard({ icon, label, value, trend, color }: StatCardProps) {
  const colorMap: Record<StatCardProps['color'], string> = {
    blue: "bg-blue-50",
    emerald: "bg-emerald-50",
    orange: "bg-orange-50",
    red: "bg-red-50"
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 ${colorMap[color]} rounded-lg`}>
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
            {trend}
          </span>
        )}
      </div>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
    </div>
  );
}