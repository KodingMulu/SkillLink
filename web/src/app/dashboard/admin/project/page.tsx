'use client';

import { useState } from 'react';
import { 
  Briefcase, Plus, Search, Filter, 
  ExternalLink, Edit2, Trash2, ChevronLeft, 
  ChevronRight, Download, Clock, CheckCircle2,
  AlertCircle, DollarSign, User, Building2
} from 'lucide-react';
import DashboardLayout from '../../DashboardLayout';

const PROJECTS_DATA = [
  { id: 1, title: "Redesain Aplikasi Mobile", client: "PT Tech Solution", freelancer: "Nazril Afandi", budget: "Rp 15.000.000", status: "active", deadline: "2024-01-20", progress: 65 },
  { id: 2, title: "Pengembangan API E-commerce", client: "Budi Santoso", freelancer: "Siska Putri", budget: "Rp 8.500.000", status: "completed", deadline: "2023-12-15", progress: 100 },
  { id: 3, title: "Sistem Manajemen Inventori", client: "Global Mart", freelancer: "Belum Ada", budget: "Rp 25.000.000", status: "pending", deadline: "2024-02-10", progress: 0 },
  { id: 4, title: "Landing Page Marketing", client: "Startup XYZ", freelancer: "Rizky Fauzi", budget: "Rp 3.500.000", status: "active", deadline: "2024-01-05", progress: 30 },
  { id: 5, title: "Audit Keamanan Website", client: "Bank Lokal", freelancer: "Ahmad Rizki", budget: "Rp 40.000.000", status: "canceled", deadline: "2023-11-30", progress: 0 },
  { id: 6, title: "Aplikasi Kasir Berbasis Cloud", client: "Toko Berkah", freelancer: "Indah Permata", budget: "Rp 12.000.000", status: "active", deadline: "2024-03-15", progress: 45 },
];

export default function ProjectManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredProjects = PROJECTS_DATA.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'active': return 'bg-blue-100 text-blue-700 ring-1 ring-blue-600/20';
      case 'completed': return 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20';
      case 'pending': return 'bg-orange-100 text-orange-700 ring-1 ring-orange-600/20';
      case 'canceled': return 'bg-red-100 text-red-700 ring-1 ring-red-600/20';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Manajemen Proyek</h1>
            <p className="text-slate-500 text-sm">Monitor progres, anggaran, dan status seluruh proyek.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition text-sm font-medium">
              <Download className="w-4 h-4" />
              Laporan
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-sm text-sm font-medium">
              <Plus className="w-4 h-4" />
              Buat Proyek
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Proyek</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">1,234</h3>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Selesai</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">856</h3>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Berjalan</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">342</h3>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Nilai</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Rp 1.2M</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row gap-4 justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Cari judul proyek atau klien..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="p-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50">
                <Filter className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0">
              {['all', 'active', 'completed', 'pending', 'canceled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors whitespace-nowrap ${
                    statusFilter === status 
                    ? 'bg-blue-600 text-white' 
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
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Informasi Proyek</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Klien & Freelancer</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Anggaran</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status & Progres</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="max-w-[250px]">
                        <div className="text-sm font-bold text-slate-900 truncate">{project.title}</div>
                        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Deadline: {new Date(project.deadline).toLocaleDateString('id-ID')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                          <Building2 className="w-3 h-3 text-slate-400" /> {project.client}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <User className="w-3 h-3 text-slate-400" /> {project.freelancer}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-900">{project.budget}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2 min-w-[120px]">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(project.status)}`}>
                          {project.status}
                        </span>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${project.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition border border-blue-100 bg-white shadow-sm">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition border border-slate-200 bg-white shadow-sm">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition border border-red-100 bg-white shadow-sm">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
            <p className="text-sm text-slate-500 text-xs md:text-sm">
              Menampilkan <span className="font-medium text-slate-900">{filteredProjects.length}</span> proyek
            </p>
            <div className="flex items-center gap-1 md:gap-2">
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
    </DashboardLayout>
  );
}