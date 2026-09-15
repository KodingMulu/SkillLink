'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Briefcase,
  DollarSign,
  AlertTriangle,
  Filter,
  Download,
  Eye,
  Ban,
  UserCheck,
  Plus,
  ArrowUpRight,
  type LucideIcon
} from "lucide-react";
import DashboardLayout from '../DashboardLayout';
import ExportModal from './components/ExportModal';
import AddUserModal from './components/AddUserModal';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';

interface Stat {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  color: string;
  bg: string;
  detail: string;
}

interface ApiMainStat {
  type: "users" | "active_projects" | "revenue" | "pending";
  label: string;
  value: number;
  growth: number;
  subtext: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'pending' | 'suspended';
  joined: string;
  projects: number;
  rating: number;
}

interface AdminStatsResponse {
  mainStats: ApiMainStat[];
  recentUsers: User[];
}

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('30days');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState<boolean>(false);
  const [stats, setStats] = useState<Stat[]>([]);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const statConfig = {
    users: { icon: Users, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
    active_projects: { icon: Briefcase, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
    revenue: { icon: DollarSign, color: "text-purple-600", bg: "bg-purple-50 border-purple-100" },
    pending: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
  };

  const getStatusBadge = (status: User['status']) => {
    const styles: Record<User['status'], string> = {
      active: "bg-emerald-100 text-emerald-700 border-emerald-200",
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      suspended: "bg-red-100 text-red-700 border-red-200"
    };

    const labels: Record<User['status'], string> = {
      active: "AKTIF",
      pending: "PENDING",
      suspended: "SUSPENDED"
    };

    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const apiUrl = getApiUrl();
      const res = await axios.get<AdminStatsResponse>(`${apiUrl}/user/admin/stats`, {
        withCredentials: true 
      });

      if (res.data.recentUsers) {
        setRecentUsers(res.data.recentUsers);
      }

      if (res.data.mainStats) {
        const mappedStats: Stat[] = res.data.mainStats.map((item) => {
          const config = statConfig[item.type] || statConfig.users;
          let displayValue = item.value.toString();

          if (item.type === "revenue") {
            displayValue = new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0
            }).format(item.value);
          } else {
            displayValue = new Intl.NumberFormat("id-ID").format(item.value);
          }

          return {
            label: item.label,
            value: displayValue,
            change: `${item.growth >= 0 ? "+" : ""}${item.growth}%`,
            trend: item.growth >= 0 ? "up" : "down",
            icon: config.icon,
            color: config.color,
            bg: config.bg,
            detail: item.subtext,
          };
        });

        setStats(mappedStats);
      }
    } catch (error) {
      console.error("Gagal mengambil data stats admin:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <DashboardLayout role="admin">
      {/* Top Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 md:p-8 text-white mb-8 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full text-xs text-emerald-400 font-semibold border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> System Control Panel
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Dashboard Administrator</h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Pantau statistik utama, verifikasi pengguna baru, dan kelola arus proyek secara realtime.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 outline-none"
            >
              <option value="30days">30 Hari Terakhir</option>
            </select>
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition border border-slate-700"
            >
              <Download className="w-4 h-4" /> Export Data
            </button>
            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              <Plus className="w-4 h-4" /> Tambah User
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl h-36 animate-pulse border border-slate-200"></div>
          ))
        ) : (
          stats.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2.5 rounded-xl border ${stat.bg}`}>
                    <IconComponent className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${stat.trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-0.5">{stat.value}</h3>
                <p className="text-xs text-slate-500 font-semibold">{stat.label}</p>
                <p className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-100">{stat.detail}</p>
              </div>
            );
          })
        )}
      </section>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Users */}
        <div className="lg:col-span-2">
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="font-bold text-slate-900 text-base">Pengguna Terbaru</h2>
                <p className="text-xs text-slate-500">Pendaftaran akun pengguna yang memerlukan pantauan</p>
              </div>
              <a href="/dashboard/admin/user" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                Kelola Semua User <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
            
            <div className="divide-y divide-slate-100">
              {recentUsers.length === 0 ? (
                <div className="p-10 text-center text-slate-500 text-sm">Belum ada data user terbaru.</div>
              ) : (
                recentUsers.map((user) => (
                  <div key={user.id} className="p-5 hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm uppercase">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-sm">{user.name}</h4>
                            {getStatusBadge(user.status)}
                          </div>
                          <p className="text-xs text-slate-500">{user.email}</p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                            <span className="font-semibold text-slate-600">{user.role}</span>
                            <span>•</span>
                            <span>{new Date(user.joined).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <a href="/dashboard/admin/user" className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" /> Detail
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Quick Actions & Activity */}
        <div className="space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="font-bold text-slate-900 text-base mb-4">Aksi Cepat Admin</h2>
            <div className="space-y-2.5">
              <button
                onClick={() => setIsAddUserModalOpen(true)}
                className="w-full flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl transition text-left"
              >
                <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Tambah Pengguna Baru</span>
                  <span className="text-[10px] text-slate-500">Buat akun admin/client/freelancer</span>
                </div>
              </button>

              <a 
                href="/dashboard/admin/project"
                className="w-full flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl transition text-left"
              >
                <div className="w-9 h-9 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Monitor Proyek Aktif</span>
                  <span className="text-[10px] text-slate-500">Lihat seluruh progres & status proyek</span>
                </div>
              </a>

              <a 
                href="/dashboard/admin/transactions"
                className="w-full flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl transition text-left"
              >
                <div className="w-9 h-9 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Audit Transaksi</span>
                  <span className="text-[10px] text-slate-500">Riwayat arus kas & gateway deposit</span>
                </div>
              </a>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="font-bold text-slate-900 text-base mb-4">Log Sistem Terbaru</h2>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
                <div>
                  <p className="font-bold text-slate-800">Pendaftaran Pengguna Baru</p>
                  <p className="text-slate-400 text-[10px]">Baru saja • Sistem Otomatis</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mt-1.5"></div>
                <div>
                  <p className="font-bold text-slate-800">Verifikasi Deposit Midtrans</p>
                  <p className="text-slate-400 text-[10px]">10 menit lalu • Payment Gateway</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        selectedPeriod={selectedPeriod}
      />

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSuccess={fetchStats}
      />
    </DashboardLayout>
  );
}