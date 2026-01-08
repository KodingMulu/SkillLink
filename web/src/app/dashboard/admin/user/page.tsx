'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users, UserPlus, Search, Filter,
  Mail, UserCheck, Ban, Edit2,
  ChevronLeft, ChevronRight, Download,
  CheckCircle2, Clock,
  type LucideIcon
} from 'lucide-react';
import DashboardLayout from '../../DashboardLayout';
import AddUserModal from '../components/AddUserModal';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
  projects: number;
  rating: number;
}

interface UserStatApi {
  type: "total_users" | "pending_verification" | "active_monthly";
  label: string;
  value: number;
  prefix?: string;
  icon: string;
  color: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface AdminStatsResponse {
  userStats: UserStatApi[];
}

interface UserListResponse {
  data: UserData[];
  pagination: PaginationMeta;
}

interface UserManagementPageProps {
  backgroundImage?: string;
  backgroundColor?: string;
}

export default function UserManagementPage({ backgroundImage, backgroundColor }: UserManagementPageProps) {
  const defaultBackground = '/images/bg.webp';
  const backgroundStyle = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }
    : backgroundColor
      ? { backgroundColor: backgroundColor }
      : { backgroundImage: `url(${defaultBackground})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' };

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const [users, setUsers] = useState<UserData[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1, limit: 10, total: 0, totalPages: 1
  });

  const [stats, setStats] = useState<UserStatApi[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get<AdminStatsResponse>(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/user/admin/stats`,
          { withCredentials: true }
        );
        setStats(res.data?.userStats || []);
      } catch (error) {
        console.error(error);
        setStats([]); 
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const res = await axios.get<UserListResponse>(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/user/admin/list-user`,
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
        setUsers(res.data?.data || []);
        if (res.data?.pagination) {
          setPagination(prev => ({ ...prev, ...res.data.pagination }));
        }
      } catch (error) {
        console.error(error);
        setUsers([]); 
      } finally {
        setLoadingUsers(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter, pagination.page]);

  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [searchTerm, statusFilter]);

  const getIcon = (iconName: string): LucideIcon => {
    switch (iconName) {
      case 'users': return Users;
      case 'clock': return Clock;
      case 'check': return CheckCircle2;
      default: return Users;
    }
  };

  const getColorStyles = (colorName: string) => {
    switch (colorName) {
      case 'blue': return { bg: 'bg-blue-50', text: 'text-blue-600' };
      case 'orange': return { bg: 'bg-orange-50', text: 'text-orange-600' };
      case 'emerald': return { bg: 'bg-emerald-50', text: 'text-emerald-600' };
      default: return { bg: 'bg-slate-50', text: 'text-slate-600' };
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20';
      case 'pending': return 'bg-orange-100 text-orange-700 ring-1 ring-orange-600/20';
      case 'suspended': return 'bg-red-100 text-red-700 ring-1 ring-red-600/20';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(u => u.id));
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div style={backgroundStyle} className="min-h-screen">
      <DashboardLayout role="admin">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Manajemen User</h1>
              <p className="text-slate-500 text-sm">Kelola, verifikasi, dan pantau seluruh pengguna platform.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition text-sm font-medium">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={() => setIsAddUserModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-sm text-sm font-medium"
              >
                <UserPlus className="w-4 h-4" />
                Tambah User
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {loadingStats ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-slate-200 h-24 animate-pulse" />
              ))
            ) : (
              (stats || []).map((stat, idx) => {
                const IconComponent = getIcon(stat.icon);
                const styles = getColorStyles(stat.color);

                return (
                  <div key={idx} className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-slate-200 flex items-center gap-4 hover:shadow-md transition-all">
                    <div className={`w-12 h-12 ${styles.bg} rounded-xl flex items-center justify-center`}>
                      <IconComponent className={`w-6 h-6 ${styles.text}`} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                      <h3 className="text-xl font-bold text-slate-900">
                        {stat.prefix}{stat.value.toLocaleString('id-ID')}
                      </h3>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row gap-4 justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari nama atau email..."
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
                {['all', 'active', 'pending', 'suspended'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors whitespace-nowrap ${statusFilter === status
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
                    <th className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        disabled={loadingUsers || users.length === 0}
                        checked={users.length > 0 && selectedUsers.length === users.length}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Peran</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Bergabung</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Proyek</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingUsers ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-500">Memuat data pengguna...</td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-500">
                        {searchTerm ? "Tidak ada user yang cocok dengan pencarian." : "Belum ada data user."}
                      </td>
                    </tr>
                  ) : (
                    (users || []).map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => {
                              setSelectedUsers(prev =>
                                prev.includes(user.id) ? prev.filter(id => id !== user.id) : [...prev, user.id]
                              );
                            }}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-900">{user.name}</div>
                              <div className="text-xs text-slate-500 flex items-center gap-1">
                                <Mail className="w-3 h-3" /> {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${user.role === 'FREELANCER' ? 'text-purple-700 bg-purple-50' : 'text-blue-700 bg-blue-50'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(user.status)}`}>
                            {user.status === 'active' ? 'Aktif' : user.status === 'pending' ? 'Pending' : 'Suspended'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(user.joined).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                          {user.projects} Proyek
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {user.status === 'pending' && (
                              <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition shadow-sm border border-emerald-100 bg-white">
                                <UserCheck className="w-4 h-4" />
                              </button>
                            )}
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition shadow-sm border border-blue-100 bg-white">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition shadow-sm border border-red-100 bg-white">
                              <Ban className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
              <p className="text-sm text-slate-500">
                Menampilkan <span className="font-medium text-slate-900">{users.length}</span> dari <span className="font-medium text-slate-900">{pagination.total}</span> user
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1 || loadingUsers}
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
                  disabled={pagination.page >= pagination.totalPages || loadingUsers}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <AddUserModal
          isOpen={isAddUserModalOpen}
          onClose={() => setIsAddUserModalOpen(false)}
          onSuccess={() => console.log('User added')}
        />
      </DashboardLayout>
    </div>
  );
}