'use client';

import { useState } from 'react';
import { 
  Users, Briefcase, DollarSign, TrendingUp, 
  AlertTriangle, CheckCircle, XCircle, Clock,
  MoreVertical, Search, Filter, Download,
  Eye, Ban, UserCheck, Flag
} from "lucide-react";

// Simplified DashboardLayout untuk demo
function DashboardLayout({ children, role }: { children: React.ReactNode; role: string }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const menuItems = [
    { icon: TrendingUp, label: 'Overview', active: true },
    { icon: Users, label: 'Manajemen User', active: false },
    { icon: Briefcase, label: 'Manajemen Proyek', active: false },
    { icon: DollarSign, label: 'Transaksi', active: false },
    { icon: Flag, label: 'Laporan', active: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:block">
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="ml-3 text-lg font-bold text-slate-800">Admin</span>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                  item.active 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 ${item.active ? 'text-blue-600' : 'text-slate-400'}`} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari user, proyek, atau transaksi..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full">
              <Download className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
              AD
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('30days');

  const stats = [
    { 
      label: "Total User", 
      value: "2,847", 
      change: "+12.5%", 
      trend: "up",
      icon: Users, 
      color: "text-blue-600", 
      bg: "bg-blue-50",
      detail: "245 user baru bulan ini"
    },
    
  ];

  const recentUsers: Array<{
    id: number;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'pending' | 'suspended';
    joined: string;
    projects: number;
    rating: number;
  }> = [
    { 
      id: 1,
      name: "Budi Santoso", 
      email: "budi@email.com",
      role: "Freelancer", 
      status: "active",
      joined: "2 jam lalu",
      projects: 3,
      rating: 4.8
    },
    { 
      id: 2,
      name: "PT Digital Innovation", 
      email: "contact@digital.com",
      role: "Client", 
      status: "active",
      joined: "5 jam lalu",
      projects: 8,
      rating: 4.9
    },
    { 
      id: 3,
      name: "Sarah Wijaya", 
      email: "sarah@email.com",
      role: "Freelancer", 
      status: "pending",
      joined: "1 hari lalu",
      projects: 0,
      rating: 0
    },
    { 
      id: 4,
      name: "Ahmad Rizki", 
      email: "ahmad@email.com",
      role: "Freelancer", 
      status: "suspended",
      joined: "2 hari lalu",
      projects: 5,
      rating: 3.2
    },
  ];

  const recentReports: Array<{
    id: number;
    type: string;
    reporter: string;
    reported: string;
    project: string;
    date: string;
    status: 'pending' | 'investigating' | 'resolved';
    priority: 'high' | 'medium' | 'low';
  }> = [
    {
      id: 1,
      type: "Penipuan",
      reporter: "John Doe",
      reported: "Jane Smith",
      project: "Web Development",
      date: "1 jam lalu",
      status: "pending",
      priority: "high"
    },
    {
      id: 2,
      type: "Konten Tidak Pantas",
      reporter: "Ahmad K.",
      reported: "Budi S.",
      project: "Graphic Design",
      date: "3 jam lalu",
      status: "investigating",
      priority: "medium"
    },
    {
      id: 3,
      type: "Spam",
      reporter: "Sarah W.",
      reported: "Spammer123",
      project: "-",
      date: "1 hari lalu",
      status: "resolved",
      priority: "low"
    },
  ];

  const getStatusBadge = (status: 'active' | 'pending' | 'suspended' | 'investigating' | 'resolved') => {
    const styles: Record<string, string> = {
      active: "bg-emerald-100 text-emerald-700",
      pending: "bg-orange-100 text-orange-700",
      suspended: "bg-red-100 text-red-700",
      investigating: "bg-blue-100 text-blue-700",
      resolved: "bg-slate-100 text-slate-700"
    };
    
    const labels: Record<string, string> = {
      active: "Aktif",
      pending: "Pending",
      suspended: "Suspended",
      investigating: "Ditinjau",
      resolved: "Selesai"
    };

    return (
      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
    const styles: Record<string, string> = {
      high: "bg-red-100 text-red-700",
      medium: "bg-orange-100 text-orange-700",
      low: "bg-slate-100 text-slate-700"
    };
    
    const labels: Record<string, string> = {
      high: "Tinggi",
      medium: "Sedang",
      low: "Rendah"
    };

    return (
      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${styles[priority]}`}>
        {labels[priority]}
      </span>
    );
  };

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Admin</h1>
          <div className="flex items-center gap-3">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7days">7 Hari Terakhir</option>
              <option value="30days">30 Hari Terakhir</option>
              <option value="90days">90 Hari Terakhir</option>
              <option value="1year">1 Tahun Terakhir</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
              <Download className="w-4 h-4" />
              Export Laporan
            </button>
          </div>
        </div>
        <p className="text-slate-500">Kelola dan pantau aktivitas platform</p>
      </div>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                stat.trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
            <p className="text-xs text-slate-400">{stat.detail}</p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Users Management */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="font-bold text-slate-900">Manajemen User</h2>
                <p className="text-sm text-slate-500 mt-1">User terbaru yang perlu diverifikasi</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                  <Filter className="w-4 h-4 text-slate-500" />
                </button>
                <button className="text-sm text-blue-600 hover:underline font-medium">
                  Lihat Semua
                </button>
              </div>
            </div>
            
            <div className="divide-y divide-slate-100">
              {recentUsers.map((user) => (
                <div key={user.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">{user.name}</h4>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    {getStatusBadge(user.status)}
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-slate-600 mb-4">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {user.role}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {user.projects} proyek
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {user.joined}
                    </span>
                    {user.rating > 0 && (
                      <span className="flex items-center gap-1">
                        ⭐ {user.rating}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium flex items-center justify-center gap-2">
                      <Eye className="w-4 h-4" />
                      Lihat Detail
                    </button>
                    {user.status === 'pending' && (
                      <button className="flex-1 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition text-sm font-medium flex items-center justify-center gap-2">
                        <UserCheck className="w-4 h-4" />
                        Verifikasi
                      </button>
                    )}
                    {user.status === 'active' && (
                      <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium flex items-center justify-center gap-2">
                        <Ban className="w-4 h-4" />
                        Suspend
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Reports & Issues */}
        <div className="space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-bold text-slate-900">Laporan & Keluhan</h2>
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-bold">
                  {recentReports.filter(r => r.status === 'pending').length} Baru
                </span>
              </div>
              <p className="text-sm text-slate-500">Yang perlu ditindaklanjuti</p>
            </div>
            
            <div className="p-4 space-y-3">
              {recentReports.map((report) => (
                <div key={report.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-slate-900 text-sm">
                          {report.type}
                        </span>
                        {getPriorityBadge(report.priority)}
                      </div>
                      <p className="text-xs text-slate-500 mb-1">
                        Dilaporkan oleh: <span className="font-medium text-slate-700">{report.reporter}</span>
                      </p>
                      <p className="text-xs text-slate-500">
                        Target: <span className="font-medium text-slate-700">{report.reported}</span>
                      </p>
                    </div>
                  </div>
                  
                  {report.project !== "-" && (
                    <p className="text-xs text-slate-600 mb-3 flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {report.project}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{report.date}</span>
                    {getStatusBadge(report.status)}
                  </div>
                  
                  {report.status === 'pending' && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-slate-200">
                      <button className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs font-medium">
                        Tinjau
                      </button>
                      <button className="flex-1 px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition text-xs font-medium">
                        Abaikan
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-100">
              <button className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 py-2">
                Lihat Semua Laporan
              </button>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-bold text-slate-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition text-left">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-slate-700">Tambah User Manual</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition text-left">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-slate-700">Broadcast Notifikasi</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition text-left">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-slate-700">Review Transaksi</span>
              </button>
            </div>
          </section>
        </div>

      </div>
    </DashboardLayout>
  );
}