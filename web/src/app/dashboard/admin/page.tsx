'use client';

import { useState } from 'react';
import { 
  Users, Briefcase, DollarSign, 
  AlertTriangle, Filter, Download,
  Eye, Ban, UserCheck, Clock
} from "lucide-react";
import DashboardLayout from '../DashboardLayout';

export default function AdminDashboard() {
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
    { 
      label: "Proyek Aktif", 
      value: "1,234", 
      change: "+8.2%", 
      trend: "up",
      icon: Briefcase, 
      color: "text-emerald-600", 
      bg: "bg-emerald-50",
      detail: "156 proyek baru"
    },
    { 
      label: "Total Transaksi", 
      value: "Rp 2.4M", 
      change: "+23.1%", 
      trend: "up",
      icon: DollarSign, 
      color: "text-purple-600", 
      bg: "bg-purple-50",
      detail: "Revenue bulan ini"
    },
    { 
      label: "Laporan Pending", 
      value: "23", 
      change: "-5.3%", 
      trend: "down",
      icon: AlertTriangle, 
      color: "text-orange-600", 
      bg: "bg-orange-50",
      detail: "Perlu ditinjau"
    },
  ];

  const recentUsers = [
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
    }
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: "bg-emerald-100 text-emerald-700",
      pending: "bg-orange-100 text-orange-700",
      suspended: "bg-red-100 text-red-700"
    };
    return (
      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${styles[status]}`}>
        {status.toUpperCase()}
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
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>
        <p className="text-slate-500">Kelola dan pantau aktivitas platform secara real-time.</p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
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
            <p className="text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-bold text-slate-900">Manajemen User Terbaru</h2>
              <Filter className="w-4 h-4 text-slate-400 cursor-pointer" />
            </div>
            <div className="divide-y divide-slate-100">
              {recentUsers.map((user) => (
                <div key={user.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">{user.name}</h4>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    {getStatusBadge(user.status)}
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium flex items-center justify-center gap-2">
                      <Eye className="w-3 h-3" /> Detail
                    </button>
                    <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-medium">
                      Suspend
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition text-sm font-medium">
              <Users className="w-4 h-4 text-blue-600" /> Tambah User
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition text-sm font-medium">
              <AlertTriangle className="w-4 h-4 text-orange-600" /> Broadcast
            </button>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}