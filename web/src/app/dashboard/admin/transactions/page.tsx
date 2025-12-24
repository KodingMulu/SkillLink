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

const TRANSACTIONS_DATA = [
  { id: "TX-90210", user: "Budi Santoso", project: "Redesain Aplikasi Mobile", amount: "Rp 15.000.000", method: "Bank Transfer", status: "success", date: "2023-12-15 14:30" },
  { id: "TX-90211", user: "PT Digital Innovation", project: "Top Up Saldo", amount: "Rp 25.000.000", method: "Landmark", status: "pending", date: "2023-12-16 09:15" },
  { id: "TX-90212", user: "Sarah Wijaya", project: "Withdrawal", amount: "Rp 5.200.000", method: "Wallet", status: "success", date: "2023-12-16 10:45" },
  { id: "TX-90213", user: "Ahmad Rizki", project: "Audit Keamanan", amount: "Rp 40.000.000", method: "Bank Transfer", status: "failed", date: "2023-12-14 16:20" },
  { id: "TX-90214", user: "Indah Permata", project: "Landing Page", amount: "Rp 3.500.000", method: "Credit Card", status: "success", date: "2023-12-17 08:00" },
  { id: "TX-90215", user: "Rizky Fauzi", project: "API E-commerce", amount: "Rp 8.500.000", method: "Wallet", status: "pending", date: "2023-12-17 11:30" },
];

export default function TransactionManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
  
  // State untuk Data Statistik dari API
  const [stats, setStats] = useState<TransactionStatApi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get<AdminStatsResponse>(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/user/admin/stats`
        );
        setStats(res.data.transactionStats);
      } catch (error) {
        console.error("Gagal mengambil transaction stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const filteredTransactions = TRANSACTIONS_DATA.filter(tx => {
    const matchesSearch = tx.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         tx.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'success': return 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20';
      case 'pending': return 'bg-orange-100 text-orange-700 ring-1 ring-orange-600/20';
      case 'failed': return 'bg-red-100 text-red-700 ring-1 ring-red-600/20';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getMethodIcon = (method: string) => {
    switch(method) {
      case 'Bank Transfer': return <Landmark className="w-3 h-3" />;
      case 'Wallet': return <Wallet className="w-3 h-3" />;
      case 'Credit Card': return <CreditCard className="w-3 h-3" />;
      default: return <DollarSign className="w-3 h-3" />;
    }
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
        {/* Header Section */}
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
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

        {/* Table Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Table Filters */}
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

          {/* Table Body */}
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
                {filteredTransactions.map((tx) => (
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
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
            <p className="text-sm text-slate-500">
              Menampilkan <span className="font-medium text-slate-900">{filteredTransactions.length}</span> transaksi
            </p>
            <div className="flex items-center gap-2">
              <button className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 transition" disabled>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium">1</button>
              <button className="p-2 border border-slate-200 rounded-lg hover:bg-white transition">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Report Modal */}
      <TaxReportModal 
        isOpen={isTaxModalOpen} 
        onClose={() => setIsTaxModalOpen(false)} 
        onSuccess={() => console.log("Report generated successfully!")}
      />
    </DashboardLayout>
  );
}

/**
 * Reusable Stat Card Component for cleaner code
 */
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