'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Briefcase, LayoutDashboard, MessageSquare,
  Settings, LogOut, Bell, Search, Menu, X, User,
  TrendingUp, Users, DollarSign
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

      await axios.post(`${apiUrl}/auth/logout`, {}, {
        withCredentials: true,
      });

      router.replace('/auth/login');
    } catch (error) {
      alert('Gagal logout, coba lagi');
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="text-slate-500">Loading dashboard...</span>
      </div>
    );
  }

  if (!user) return null;

  const role = user.role.toLowerCase() as 'admin' | 'client' | 'freelancer';

  const getMenuItems = () => {
    switch (role) {
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
        ];
      default:
        return [
          { icon: LayoutDashboard, label: 'Overview', href: '/dashboard/freelancer' },
          { icon: Search, label: 'Cari Kerja', href: '/dashboard/freelancer/jobs' },
          { icon: MessageSquare, label: 'Pesan', href: '/dashboard/freelancer/messages' },
          { icon: User, label: 'Profil Saya', href: '/dashboard/freelancer/profile' },
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="h-screen w-full bg-[#F8FAFC] flex font-sans overflow-hidden">
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0
        flex flex-col h-full 
      `}>
        <div className="h-20 flex-shrink-0 flex items-center px-6 border-b border-transparent">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="ml-3 text-xl font-bold text-slate-900 tracking-tight">SkillLink</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const active =
              pathname === item.href ||
              pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all group ${active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                <item.icon className={`w-5 h-5 mr-3 transition-colors`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-1 flex-shrink-0">
          <Link
            href="/dashboard/settings"
            className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all ${pathname.startsWith('/dashboard/settings') ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'
              }`}
          >
            <Settings className="w-5 h-5 mr-3" />
            Pengaturan
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            Keluar
          </button>
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/20 z-40 md:hidden glass"
        ></div>
      )}

      <div className="flex-1 flex flex-col h-full min-w-0">
        <header className="h-20 flex-shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-10 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex items-center bg-slate-100 px-4 py-2 rounded-xl w-80 border border-transparent focus-within:border-blue-300 focus-within:bg-white transition-all">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input type="text" placeholder="Cari sesuatu..." className="bg-transparent text-sm outline-none w-full text-slate-600" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl relative border border-slate-100"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-50 flex justify-between items-center">
                    <span className="font-bold text-sm text-slate-900">Notifikasi</span>
                    <button className="text-[10px] text-blue-600 font-bold uppercase">Tandai Baca</button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50">
                      <p className="text-xs font-bold text-slate-900">Pekerjaan Selesai</p>
                      <p className="text-[11px] text-slate-500">Nazril Afandi mengirim file milestone.</p>
                      <p className="text-[10px] text-blue-500 mt-1 font-medium">2 menit lalu</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded-xl border border-transparent hover:border-slate-200 transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shadow-sm">
                  SL
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold">{user.username || user.email}</p>
                  <p className="text-[10px] capitalize text-slate-400">{role}</p>
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 animate-in fade-in slide-in-from-top-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-50 mb-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{user.email}</p>
                  </div>
                  <Link href="/dashboard/profile" className="flex items-center px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                    <User className="w-4 h-4 mr-3" /> Profil Saya
                  </Link>
                  <Link href="/dashboard/settings" className="flex items-center px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                    <Settings className="w-4 h-4 mr-3" /> Pengaturan Akun
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}