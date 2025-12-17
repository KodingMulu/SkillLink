'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Briefcase, LayoutDashboard, MessageSquare, 
  Settings, LogOut, Bell, Search, Menu, X, User,
  CheckCircle, FileText, TrendingUp, Users, DollarSign, Flag
} from 'lucide-react';
import Link from 'next/link';
// 1. Impor usePathname dari next/navigation
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ 
  children, 
  role = 'freelancer' 
}: { 
  children: React.ReactNode; 
  role?: 'freelancer' | 'client' | 'admin'; 
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // 2. Inisialisasi pathname
  const pathname = usePathname();
  
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

  const getMenuItems = () => {
    switch (role) {
      case 'admin':
        return [
          { icon: TrendingUp, label: 'Overview', href: '/dashboard/admin' },
          { icon: Users, label: 'Manajemen User', href: '/dashboard/admin/user' },
          { icon: Briefcase, label: 'Manajemen Proyek', href: '/dashboard/admin/project' },
          { icon: DollarSign, label: 'Transaksi', href: '/dashboard/admin/transactions' },
          { icon: Flag, label: 'Laporan', href: '/dashboard/admin/reports' },
        ];
      case 'client':
        return [
          { icon: LayoutDashboard, label: 'Overview', href: '/dashboard/client' },
          { icon: Briefcase, label: 'Posting Proyek', href: '/dashboard/client/jobs' },
          { icon: User, label: 'Talenta', href: '/dashboard/client/talents' },
          { icon: MessageSquare, label: 'Pesan', href: '/dashboard/client/messages' },
        ];
      default:
        return [
          { icon: LayoutDashboard, label: 'Overview', href: '/dashboard/freelancer' },
          { icon: Briefcase, label: 'Pekerjaan Saya', href: '/dashboard/freelancer/jobs' },
          { icon: MessageSquare, label: 'Pesan', href: '/dashboard/freelancer/messages' },
          { icon: User, label: 'Profil', href: '/dashboard/freelancer/profile' },
        ];
    }
  };

  const menuItems = getMenuItems();

  // Data dummy notifikasi (tetap sama)
  const notifications = [
    { id: 1, type: 'success', icon: CheckCircle, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', title: 'Pekerjaan Selesai', message: 'Nazril Afandi menyelesaikan tugas', time: '2 mnt lalu', unread: true },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0
      `}>
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="ml-3 text-lg font-bold text-slate-800 tracking-tight">
              {role === 'admin' ? 'Admin Panel' : 'SkillLink'}
            </span>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden ml-auto">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            {menuItems.map((item) => {
              // 3. Logika pengecekan apakah link aktif
              const isActive = pathname === item.href;

              return (
                <Link 
                  key={item.label} 
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-100 space-y-1">
            {/* 4. Terapkan juga untuk Settings */}
            <Link 
              href="/dashboard/settings" 
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                pathname === '/dashboard/settings' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Settings className={`w-5 h-5 mr-3 ${pathname === '/dashboard/settings' ? 'text-blue-600' : 'text-slate-400'}`} />
              Pengaturan
            </Link>
            <button className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors">
              <LogOut className="w-5 h-5 mr-3" />
              Keluar
            </button>
          </div>
        </div>
      </aside>

      {/* Sisa Header dan Main Content (tetap sama) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 -ml-2 text-slate-500">
            <Menu className="w-6 h-6" />
          </button>
          {/* ... bagian header lainnya ... */}
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative">
           {children}
        </main>
      </div>
    </div>
  );
}