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
  type LucideIcon
} from "lucide-react";
import DashboardLayout from '../DashboardLayout';
import ExportModal from './components/ExportModal';
import AddUserModal from './components/AddUserModal';
import axios from 'axios';

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

interface ApiProjectStat {
  type: "total" | "completed" | "in_progress" | "value";
  label: string;
  value: number;
  color: string;
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
  projectStats: ApiProjectStat[];
  recentUsers: User[];
}

interface AdminDashboardProps {
  backgroundImage?: string;
  backgroundColor?: string;
}

export default function AdminDashboard({ backgroundImage, backgroundColor }: AdminDashboardProps) {
  const defaultBackground = '/images/bg.webp';
  const backgroundStyle = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }
    : backgroundColor
      ? { backgroundColor: backgroundColor }
      : { backgroundImage: `url(${defaultBackground})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' };

  const [selectedPeriod, setSelectedPeriod] = useState<string>('30days');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState<boolean>(false);
  const [stats, setStats] = useState<Stat[]>([]);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);

  const statConfig = {
    users: { icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    active_projects: { icon: Briefcase, color: "text-emerald-600", bg: "bg-emerald-50" },
    revenue: { icon: DollarSign, color: "text-purple-600", bg: "bg-purple-50" },
    pending: { icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-50" },
  };

  const getStatusBadge = (status: User['status']) => {
    const styles: Record<User['status'], string> = {
      active: "bg-emerald-100 text-emerald-700",
      pending: "bg-orange-100 text-orange-700",
      suspended: "bg-red-100 text-red-700"
    };

    const labels: Record<User['status'], string> = {
      active: "AKTIF",
      pending: "PENDING",
      suspended: "SUSPENDED"
    };

    return (
      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const handleUserAdded = () => {
    console.log('User berhasil ditambahkan!');
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL 
          ? `${process.env.NEXT_PUBLIC_API_URL}/user/admin/stats` 
          : '/api/user/admin/stats';

        const res = await axios.get<AdminStatsResponse>(apiUrl, {
          withCredentials: true 
        });

        if (res.data.recentUsers) {
          setRecentUsers(res.data.recentUsers);
        }

        const mappedStats: Stat[] = res.data.mainStats.map((item) => {
          const config = statConfig[item.type] || statConfig.users;
          let displayValue = item.value.toString();

          if (item.type === "revenue") {
            displayValue = new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              notation: "compact",
              maximumFractionDigits: 1
            }).format(item.value);
          } else {
            displayValue = new Intl.NumberFormat("en-US").format(item.value);
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
      } catch (error) {
        console.error("Gagal mengambil data stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div style={backgroundStyle} className="min-h-screen">
      <DashboardLayout role="admin">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-slate-900">Dashboard Admin</h1>
            <div className="flex items-center gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="30days">30 Hari Terakhir</option>
              </select>
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium shadow-sm"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
          <p className="text-slate-500">Kelola dan pantau aktivitas platform secara real-time.</p>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.length === 0 ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl h-40 animate-pulse border border-slate-200"></div>
            ))
          ) : (
            stats.map((stat, idx) => {
              const IconComponent = stat.icon;
              return (
                <div key={idx} className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bg}`}>
                      <IconComponent className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-md ${stat.trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="text-xs text-slate-400 mt-2">{stat.detail}</p>
                </div>
              );
            })
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <section className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h2 className="font-bold text-slate-900 text-lg">Manajemen User Terbaru</h2>
                  <p className="text-sm text-slate-500 mt-1">Daftar user yang baru bergabung</p>
                </div>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <Filter className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {recentUsers.length === 0 ? (
                  <div className="p-6 text-center text-slate-500">Belum ada data user terbaru.</div>
                ) : (
                  recentUsers.map((user) => (
                    <div key={user.id} className="p-6 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center font-bold text-white shadow-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900 text-sm">{user.name}</h4>
                            <p className="text-xs text-slate-500">{user.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-slate-400">{user.role}</span>
                              <span className="text-slate-300">•</span>
                              <span className="text-xs text-slate-400">
                                {new Date(user.joined).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        {getStatusBadge(user.status)}
                      </div>

                      <div className="flex items-center gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">{user.projects} proyek</span>
                        </div>
                        {user.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-slate-600">{user.rating}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors">
                          <Eye className="w-3 h-3" />
                          Detail
                        </button>
                        <button className="flex-1 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-medium flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors">
                          <UserCheck className="w-3 h-3" />
                          Approve
                        </button>
                        <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors flex items-center gap-2">
                          <Ban className="w-3 h-3" />
                          Suspend
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50">
                <button className="w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  Lihat Semua User →
                </button>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-bold text-slate-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => setIsAddUserModalOpen(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition text-sm font-medium text-left"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-slate-700">Tambah User Baru</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition text-sm font-medium text-left">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="text-slate-700">Kirim Broadcast</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition text-sm font-medium text-left">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="text-slate-700">Monitor Proyek</span>
                </button>
              </div>
            </section>

            <section className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-bold text-slate-900 mb-4">Aktivitas Terbaru</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-700">User baru mendaftar</p>
                    <p className="text-xs text-slate-400 mt-1">2 menit lalu</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-700">Proyek diselesaikan</p>
                    <p className="text-xs text-slate-400 mt-1">15 menit lalu</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-700">Laporan baru diterima</p>
                    <p className="text-xs text-slate-400 mt-1">1 jam lalu</p>
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
          onSuccess={handleUserAdded}
        />
      </DashboardLayout>
    </div>
  );
}