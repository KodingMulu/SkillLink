'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Briefcase,
  CheckCircle,
  Clock,
  Banknote,
  ChevronLeft,
  ChevronRight,
  type LucideIcon
} from "lucide-react";
import DashboardLayout from '../../DashboardLayout';
import CreateProjectModal from './components/CreateProjectModal';

interface ApiMainStat {
  type: "users" | "active_projects" | "revenue" | "pending";
  label: string;
  value: number;
  growth: number;
  subtext: string;
}

interface Stat {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

interface Project {
  id: string;
  title: string;
  client: string;
  freelancer: string;
  budget: string;
  deadline: string;
  status: 'active' | 'completed' | 'pending' | 'cancelled';
  progress: number;
}

interface ApiProjectStat {
    type: "total" | "completed" | "in_progress" | "value";
    label: string;
    value: number;
    color: "blue" | "emerald" | "orange" | "purple";
}

interface AdminStatsResponse {
    mainStats: ApiMainStat[];
    projectStats: ApiProjectStat[]; 
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ProjectListResponse {
  data: Project[];
  pagination: PaginationMeta;
}

interface ProjectPageProps {
  backgroundImage?: string;
  backgroundColor?: string;
}

export default function ProjectManagement({ backgroundImage, backgroundColor }: ProjectPageProps) {
  const defaultBackground = '/images/bg.webp';
  const backgroundStyle = backgroundImage 
    ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }
    : backgroundColor 
      ? { backgroundColor: backgroundColor }
      : { backgroundImage: `url(${defaultBackground})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' };

  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [stats, setStats] = useState<Stat[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1, limit: 10, total: 0, totalPages: 1
  });

  const getStatusBadge = (status: Project['status']) => {
    const styles: Record<string, string> = {
      active: "bg-blue-100 text-blue-700",
      completed: "bg-emerald-100 text-emerald-700",
      pending: "bg-orange-100 text-orange-700",
      cancelled: "bg-red-100 text-red-700"
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status]}`}>{status.toUpperCase()}</span>;
  };

  const getColorClasses = (colorName: string) => {
      switch(colorName) {
          case 'blue': return { color: "text-blue-600", bg: "bg-blue-50" };
          case 'emerald': return { color: "text-emerald-600", bg: "bg-emerald-50" };
          case 'orange': return { color: "text-orange-600", bg: "bg-orange-50" };
          case 'purple': return { color: "text-purple-600", bg: "bg-purple-50" };
          default: return { color: "text-slate-600", bg: "bg-slate-50" };
      }
  };

  const getIcon = (type: string) => {
      switch(type) {
          case 'total': return Briefcase;
          case 'completed': return CheckCircle;
          case 'in_progress': return Clock;
          case 'value': return Banknote;
          default: return Briefcase;
      }
  }

  useEffect(() => {
    const fetchStats = async () => {
        try {
            const res = await axios.get<AdminStatsResponse>(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/user/admin/stats`,
                { withCredentials: true }
            );
            
            const mappedStats: Stat[] = (res.data.projectStats || []).map((item) => {
                const styles = getColorClasses(item.color);
                
                let displayValue = item.value.toString();
                if (item.type === 'value') {
                    displayValue = new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        notation: "compact", 
                        maximumFractionDigits: 1
                    }).format(item.value);
                }

                return {
                    label: item.label,
                    value: displayValue,
                    icon: getIcon(item.type),
                    color: styles.color,
                    bg: styles.bg
                };
            });

            setStats(mappedStats);
        } catch (error) {
            setStats([]);
        } finally {
            setLoading(false);
        }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true);
      try {
        const res = await axios.get<ProjectListResponse>(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/user/admin/projects`,
          {
            params: {
              page: pagination.page,
              limit: 10,
              search: searchQuery,
              status: filterStatus
            },
            withCredentials: true
          }
        );
        setProjects(res.data.data || []);
        if (res.data.pagination) {
            setPagination(prev => ({ ...prev, ...res.data.pagination }));
        }
      } catch (error) {
        setProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchProjects();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, filterStatus, pagination.page]);

  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [searchQuery, filterStatus]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div style={backgroundStyle} className="min-h-screen">
      <DashboardLayout role="admin">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Manajemen Proyek</h1>
              <p className="text-slate-500">Monitor progres, anggaran, dan status seluruh proyek.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-medium">
                <Download className="w-4 h-4" /> 
                Laporan
              </button>
              <button 
                onClick={() => setIsCreateProjectModalOpen(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium shadow-sm hover:shadow-md"
              >
                <Plus className="w-5 h-5" /> 
                Buat Proyek
              </button>
            </div>
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {loading ? (
             [...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl h-32 animate-pulse border border-slate-200"></div>
             ))
          ) : (
            stats.map((stat, idx) => {
                const IconComponent = stat.icon;
                return (
                <div key={idx} className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                    <div className={`p-3 rounded-xl ${stat.bg}`}>
                        <IconComponent className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                    <p className="text-xs text-slate-500 font-semibold">{stat.label}</p>
                </div>
                );
            })
          )}
        </section>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul proyek atau klien..."
                className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors">
              <Filter className="w-5 h-5" />
              <span className="font-medium">Filter</span>
            </button>
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto">
            {['all', 'active', 'completed', 'pending', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  filterStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Informasi Proyek
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Klien & Freelancer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Anggaran
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Status & Progres
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loadingProjects ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-500">Memuat data proyek...</td>
                  </tr>
                ) : projects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-500">
                      {searchQuery ? "Tidak ada proyek yang cocok." : "Belum ada data proyek."}
                    </td>
                  </tr>
                ) : (
                  projects.map((project) => (
                    <tr key={project.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <h4 className="font-semibold text-slate-900">{project.title}</h4>
                          <p className="text-xs text-slate-500 mt-1">
                            <Clock className="w-3 h-3 inline mr-1" />
                            Deadline: {project.deadline}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="text-slate-700">🏢 {project.client}</p>
                          <p className="text-slate-500">👤 {project.freelancer}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">{project.budget}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          {getStatusBadge(project.status)}
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-slate-500">{project.progress}% Complete</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                          Detail
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
              Menampilkan <span className="font-medium text-slate-900">{projects.length}</span> dari <span className="font-medium text-slate-900">{pagination.total}</span> proyek
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1 || loadingProjects}
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
                disabled={pagination.page >= pagination.totalPages || loadingProjects}
                className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <CreateProjectModal 
          isOpen={isCreateProjectModalOpen}
          onClose={() => setIsCreateProjectModalOpen(false)}
          onSuccess={() => console.log("Created")}
        />
      </DashboardLayout>
    </div>
  );
}