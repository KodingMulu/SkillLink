'use client';

import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Briefcase,
  CheckCircle,
  Clock,
  XCircle,
  type LucideIcon
} from "lucide-react";
import DashboardLayout from '../../DashboardLayout';
import CreateProjectModal from './components/CreateProjectModal';

interface Stat {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

interface Project {
  id: number;
  title: string;
  client: string;
  freelancer: string;
  budget: string;
  deadline: string;
  status: 'active' | 'completed' | 'pending' | 'cancelled';
  progress: number;
}

interface ProjectPageProps {
  backgroundImage?: string;
  backgroundColor?: string;
}

export default function ProjectManagement({ backgroundImage, backgroundColor }: ProjectPageProps) {
  // Background configuration
  const defaultBackground = '/images/bg.webp';
  const backgroundStyle = backgroundImage 
    ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }
    : backgroundColor 
      ? { backgroundColor: backgroundColor }
      : { backgroundImage: `url(${defaultBackground})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' };

  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const stats: Stat[] = [
    { 
      label: "TOTAL PROYEK", 
      value: "1,234", 
      icon: Briefcase, 
      color: "text-blue-600", 
      bg: "bg-blue-50"
    },
    { 
      label: "SELESAI", 
      value: "856", 
      icon: CheckCircle, 
      color: "text-emerald-600", 
      bg: "bg-emerald-50"
    },
    { 
      label: "BERJALAN", 
      value: "342", 
      icon: Clock, 
      color: "text-orange-600", 
      bg: "bg-orange-50"
    },
    { 
      label: "TOTAL NILAI", 
      value: "Rp 1.2M", 
      icon: Briefcase, 
      color: "text-purple-600", 
      bg: "bg-purple-50"
    },
  ];

  const projects: Project[] = [
    {
      id: 1,
      title: "Redesain Aplikasi Mobile",
      client: "PT Tech Solution",
      freelancer: "Nazril Afandi",
      budget: "Rp 15.000.000",
      deadline: "20/1/2024",
      status: "active",
      progress: 65
    },
    {
      id: 2,
      title: "Pengembangan API E-commerce",
      client: "Budi Santoso",
      freelancer: "Siska Putri",
      budget: "Rp 8.500.000",
      deadline: "15/12/2023",
      status: "completed",
      progress: 100
    },
    {
      id: 3,
      title: "Sistem Manajemen Inventori",
      client: "Global Mandiri",
      freelancer: "Ahmad Rivai",
      budget: "Rp 12.000.000",
      deadline: "10/2/2024",
      status: "pending",
      progress: 20
    }
  ];

  const getStatusBadge = (status: Project['status']) => {
    const styles: Record<Project['status'], string> = {
      active: "bg-blue-100 text-blue-700",
      completed: "bg-emerald-100 text-emerald-700",
      pending: "bg-orange-100 text-orange-700",
      cancelled: "bg-red-100 text-red-700"
    };
    
    const labels: Record<Project['status'], string> = {
      active: "ACTIVE",
      completed: "COMPLETED",
      pending: "PENDING",
      cancelled: "CANCELLED"
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const handleProjectCreated = () => {
    console.log('Proyek berhasil dibuat!');
    // Refresh data atau update state di sini
  };

  return (
    <div style={backgroundStyle} className="min-h-screen">
      <DashboardLayout role="admin">
        {/* Header */}
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

        {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div key={stat.label} className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <IconComponent className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                <p className="text-xs text-slate-500 font-semibold">{stat.label}</p>
              </div>
            );
          })}
        </section>

        {/* Search and Filter */}
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

          {/* Filter Tabs */}
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

        {/* Projects Table */}
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
                {projects.map((project) => (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        <CreateProjectModal 
          isOpen={isCreateProjectModalOpen}
          onClose={() => setIsCreateProjectModalOpen(false)}
          onSuccess={handleProjectCreated}
        />
      </DashboardLayout>
    </div>
  );
}