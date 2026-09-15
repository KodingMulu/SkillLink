'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Briefcase, LayoutDashboard, MessageSquare,
  Settings, LogOut, Bell, Search, Menu, User,
  TrendingUp, Users, DollarSign,
  Wallet, BookCheck, Paperclip,
  X, Check, ChevronRight, Sparkles, ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role?: string;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  link: string;
}

export default function DashboardLayout({
  children,
  role: propRole,
}: DashboardLayoutProps) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'Pembayaran Diterima',
      message: 'Dana sebesar Rp 2.500.000 telah masuk ke saldo dompet Anda.',
      time: '5 menit lalu',
      read: false,
      link: '/dashboard/freelancer/wallet'
    },
    {
      id: '2',
      title: 'Lamaran Disetujui',
      message: 'Klien menyetujui tawaran Anda pada proyek Website Redesign.',
      time: '1 jam lalu',
      read: false,
      link: '/dashboard/freelancer/contracts'
    },
    {
      id: '3',
      title: 'Rekomendasi Pekerjaan',
      message: 'Ada 3 proyek baru yang sesuai dengan keahlian React & Node.js Anda.',
      time: '3 jam lalu',
      read: true,
      link: '/dashboard/freelancer/jobs'
    }
  ]);

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const apiUrl = getApiUrl();
      await axios.post(`${apiUrl}/auth/logout`, {}, { withCredentials: true });
      router.replace('/auth/login');
    } catch (error) {
      alert('Gagal logout, coba lagi');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchOpen(false);
    
    if (user?.role === 'FREELANCER') {
      router.push(`/dashboard/freelancer/jobs?q=${encodeURIComponent(searchQuery.trim())}`);
    } else if (user?.role === 'CLIENT') {
      router.push(`/dashboard/client/talents?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push(`/dashboard/admin/project?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="h-screen w-full bg-slate-900 flex flex-col items-center justify-center gap-3 text-white">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Memuat SkillLink...</span>
      </div>
    );
  }

  if (!user) return null;

  const activeRole = user.role.toLowerCase() as 'admin' | 'client' | 'freelancer';

  const getMenuItems = () => {
    switch (activeRole) {
      case 'admin':
        return [
          { icon: TrendingUp, label: 'Overview', href: '/dashboard/admin' },
          { icon: Users, label: 'Manajemen User', href: '/dashboard/admin/user' },
          { icon: Briefcase, label: 'Manajemen Proyek', href: '/dashboard/admin/project' },
          { icon: DollarSign, label: 'Transaksi', href: '/dashboard/admin/transactions' },
        ];
      case 'client':
        return [
          { icon: LayoutDashboard, label: 'Overview', href: '/dashboard/client' },
          { icon: Briefcase, label: 'Proyek Saya', href: '/dashboard/client/jobs' },
          { icon: User, label: 'Cari Talenta', href: '/dashboard/client/talents' },
          { icon: MessageSquare, label: 'Pesan', href: '/dashboard/client/messages' },
          { icon: DollarSign, label: 'Saldo Saya', href: '/dashboard/client/wallet' },
        ];
      default:
        return [
          { icon: LayoutDashboard, label: 'Overview', href: '/dashboard/freelancer' },
          { icon: Search, label: 'Cari Kerja', href: '/dashboard/freelancer/jobs' },
          { icon: MessageSquare, label: 'Pesan', href: '/dashboard/freelancer/messages' },
          { icon: Wallet, label: 'Saldo Saya', href: '/dashboard/freelancer/wallet' },
          { icon: BookCheck, label: 'Portofolio', href: '/dashboard/freelancer/portfolio' },
          { icon: Paperclip, label: 'Manajemen Kontrak', href: '/dashboard/freelancer/contracts' },
        ];
    }
  };

  const menuItems = getMenuItems();
  const avatarLetter = (user.username || user.email || 'U').substring(0, 2).toUpperCase();

  return (
    <div className="h-screen w-full bg-slate-50 flex font-sans overflow-hidden">
      
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0
        flex flex-col h-full border-r border-slate-800
      `}>
        <div className="h-20 flex-shrink-0 flex items-center justify-between px-6 border-b border-slate-800">
          <Link href={`/dashboard/${activeRole}`} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white block leading-none">SkillLink</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mt-1 block">Platform Pro</span>
            </div>
          </Link>

          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <p className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Navigasi Utama</p>
          {menuItems.map((item) => {
            const isRoot = item.href === `/dashboard/${activeRole}`;
            const active = isRoot
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center justify-between px-4 py-3 text-xs font-bold rounded-2xl transition-all ${
                  active
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {active && <ChevronRight size={14} className="text-white/70" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-black shrink-0">
                {avatarLetter}
              </div>
              <div className="overflow-hidden text-xs">
                <p className="font-bold text-white truncate">{user.username || 'User'}</p>
                <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                  {activeRole}
                </span>
              </div>
            </div>

            <Link 
              href={`/dashboard/${activeRole}/settings`}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-700 transition"
              title="Pengaturan"
            >
              <Settings size={16} />
            </Link>
          </div>
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden"
        ></div>
      )}

      <div className="flex-1 flex flex-col h-full min-w-0">
        
        <header className="h-20 flex-shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-10 z-30">
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="relative" ref={searchRef}>
              <form 
                onSubmit={handleSearchSubmit}
                className="hidden md:flex items-center bg-slate-50 px-4 py-2.5 rounded-2xl w-80 lg:w-96 border border-slate-200 focus-within:border-blue-500 focus-within:bg-white transition-all"
              >
                <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                <input 
                  type="text" 
                  placeholder={
                    activeRole === 'freelancer' ? 'Cari pekerjaan, proyek, atau keahlian...' :
                    activeRole === 'client' ? 'Cari talenta freelancer...' :
                    'Cari proyek atau user...'
                  }
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  className="bg-transparent text-xs font-medium outline-none w-full text-slate-900 placeholder:text-slate-400" 
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                    <X size={14} />
                  </button>
                )}
              </form>

              {isSearchOpen && searchQuery.trim() && (
                <div className="absolute left-0 mt-2 w-80 lg:w-96 bg-white border border-slate-200 rounded-2xl shadow-lg py-3 z-50">
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hasil Pencarian</span>
                    <span className="text-[10px] text-blue-600 font-bold">Tekan Enter untuk cari</span>
                  </div>

                  <div className="p-2 space-y-1">
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 flex items-center justify-between text-xs cursor-pointer group"
                    >
                      <span className="font-semibold text-slate-700 group-hover:text-blue-600 truncate">
                        Cari &quot;<strong className="text-slate-900">{searchQuery}</strong>&quot; di daftar {activeRole === 'freelancer' ? 'Pekerjaan' : 'Talenta'}
                      </span>
                      <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-600" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-2xl relative border border-slate-200 transition-all cursor-pointer"
                title="Notifikasi"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white border border-slate-200 rounded-3xl shadow-lg py-3 z-50">
                  <div className="px-5 py-2.5 border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900">Notifikasi</span>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full border border-blue-100">
                          {unreadCount} Baru
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] text-blue-600 hover:underline font-bold cursor-pointer"
                    >
                      Tandai Dibaca
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                    {notifications.map((n) => (
                      <Link
                        key={n.id}
                        href={n.link}
                        onClick={() => {
                          setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item));
                          setIsNotificationOpen(false);
                        }}
                        className={`p-4 hover:bg-slate-50 transition-all block cursor-pointer ${!n.read ? 'bg-blue-50/20' : ''}`}
                      >
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <p className="text-xs font-bold text-slate-900">{n.title}</p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{n.message}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2.5 p-1.5 hover:bg-slate-50 rounded-2xl border border-slate-200 transition-all cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xs">
                  {avatarLetter}
                </div>
                <div className="hidden sm:block text-left pr-1">
                  <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">
                    {user.username || user.email}
                  </p>
                  <p className="text-[10px] capitalize font-semibold text-slate-400">{activeRole}</p>
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-white border border-slate-200 rounded-3xl shadow-lg py-3 z-50">
                  <div className="px-5 py-2.5 border-b border-slate-100 mb-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{user.username || 'User'}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  </div>

                  <Link
                    href={`/dashboard/${activeRole}/profile`}
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                  >
                    <User className="w-4 h-4 mr-3 text-slate-400" /> Profil Saya
                  </Link>
                  <Link
                    href={`/dashboard/${activeRole}/settings`}
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-3 text-slate-400" /> Pengaturan Akun
                  </Link>

                  <div className="border-t border-slate-100 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-5 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-3" /> Keluar dari Akun
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}