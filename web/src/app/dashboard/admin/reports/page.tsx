'use client';

import { useState } from 'react';
import {
  Flag, Search, Filter, Download,
  AlertTriangle, CheckCircle, XCircle,
  Eye, MoreVertical, ChevronLeft,
  ChevronRight, ShieldAlert, MessageSquare,
  User, Briefcase, Clock
} from 'lucide-react';
import DashboardLayout from '../../DashboardLayout';
// Import komponen modal yang baru dibuat
import ModerationPolicyModal from '../components/ModerationPolicyModal';

const REPORTS_DATA = [
  { id: "REP-001", reporter: "Budi Santoso", reportedItem: "Nazril Afandi", type: "User", reason: "Penipuan / Scam", date: "2023-12-17 14:30", priority: "high", status: "pending" },
  { id: "REP-002", reporter: "Siska Putri", reportedItem: "Project Landing Page", type: "Project", reason: "Konten Tidak Pantas", date: "2023-12-17 10:15", priority: "medium", status: "resolved" },
  { id: "REP-003", reporter: "Ahmad Rizki", reportedItem: "Chat ID #8821", type: "Message", reason: "Pelecehan / Harassment", date: "2023-12-16 16:45", priority: "high", status: "pending" },
  { id: "REP-004", reporter: "Indah Permata", reportedItem: "PT Startup Jaya", type: "User", reason: "Spam", date: "2023-12-16 09:20", priority: "low", status: "dismissed" },
  { id: "REP-005", reporter: "Rizky Fauzi", reportedItem: "Desain Logo V2", type: "Project", reason: "Pelanggaran Hak Cipta", date: "2023-12-15 11:30", priority: "high", status: "pending" },
  { id: "REP-006", reporter: "Sarah Wijaya", reportedItem: "Budi Santoso", type: "User", reason: "Profil Palsu", date: "2023-12-15 08:00", priority: "medium", status: "resolved" },
];

export default function ReportsManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // State untuk mengontrol kemunculan Modal Kebijakan Moderasi
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);

  const filteredReports = REPORTS_DATA.filter(report => {
    const matchesSearch = report.reporter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedItem.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20';
      case 'pending': return 'bg-orange-100 text-orange-700 ring-1 ring-orange-600/20';
      case 'dismissed': return 'bg-slate-100 text-slate-700 ring-1 ring-slate-600/20';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      case 'low': return 'text-blue-600';
      default: return 'text-slate-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'User': return <User className="w-3 h-3" />;
      case 'Project': return <Briefcase className="w-3 h-3" />;
      case 'Message': return <MessageSquare className="w-3 h-3" />;
      default: return <Flag className="w-3 h-3" />;
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Manajemen Laporan</h1>
            <p className="text-slate-500 text-sm">Tinjau dan tindak lanjuti laporan dari pengguna platform.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition text-sm font-medium shadow-sm">
              <Download className="w-4 h-4" />
              Export Laporan
            </button>
            {/* Tombol Kebijakan Moderasi sekarang memiliki onClick untuk membuka modal */}
            <button
              onClick={() => setIsPolicyModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition shadow-md text-sm font-medium active:scale-95 transition-transform"
            >
              <ShieldAlert className="w-4 h-4" />
              Kebijakan Moderasi
            </button>
          </div>
        </div>

        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<Flag className="text-red-600" />} label="Total Laporan" value="156" color="red" />
          <StatCard icon={<AlertTriangle className="text-orange-600" />} label="Menunggu Tindakan" value="23" color="orange" />
          <StatCard icon={<CheckCircle className="text-emerald-600" />} label="Selesai" value="128" color="emerald" />
          <StatCard icon={<Clock className="text-slate-600" />} label="Rata-rata Respon" value="4.2 Jam" color="slate" />
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row gap-4 justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari pelapor atau item yang dilaporkan..."
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
              {['all', 'pending', 'resolved', 'dismissed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all whitespace-nowrap ${statusFilter === status
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
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID & Waktu</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pelapor</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Subjek Laporan</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Alasan & Prioritas</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-900">{report.id}</div>
                      <div className="text-[10px] text-slate-400 mt-1">{report.date}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-800">{report.reporter}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-100 w-fit px-2 py-1 rounded-md mb-1">
                        {getTypeIcon(report.type)}
                        {report.type}
                      </div>
                      <div className="text-sm font-medium text-slate-900 truncate max-w-[150px]">{report.reportedItem}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-700 mb-1">{report.reason}</div>
                      <div className={`text-[10px] font-bold uppercase flex items-center gap-1 ${getPriorityStyle(report.priority)}`}>
                        <AlertTriangle className="w-3 h-3" /> {report.priority} Priority
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition border border-blue-100 bg-white shadow-sm" title="Lihat Detail">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition border border-transparent hover:border-slate-200">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
            <p className="text-sm text-slate-500">
              Menampilkan <span className="font-medium text-slate-900">{filteredReports.length}</span> laporan
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

      {/* Modal Kebijakan Moderasi dipasang di sini */}
      <ModerationPolicyModal
        isOpen={isPolicyModalOpen}
        onClose={() => setIsPolicyModalOpen(false)}
      />
    </DashboardLayout>
  );
}

/**
 * Komponen lokal untuk merapikan Cards agar tidak duplikasi kode
 */
function StatCard({ icon, label, value, color }: any) {
  const colorMap: any = {
    red: "bg-red-50",
    orange: "bg-orange-50",
    emerald: "bg-emerald-50",
    slate: "bg-slate-50"
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 ${colorMap[color]} rounded-lg`}>
          {icon}
        </div>
      </div>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
    </div>
  );
}