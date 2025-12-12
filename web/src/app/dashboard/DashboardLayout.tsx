'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Briefcase, LayoutDashboard, MessageSquare, 
  Settings, LogOut, Bell, Search, Menu, X, User,
  CheckCircle, AlertCircle, Clock, FileText
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({ 
  children, 
  role = 'freelancer' 
}: { 
  children: React.ReactNode; 
  role?: 'freelancer' | 'client'; 
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = role === 'freelancer' ? [
    { icon: LayoutDashboard, label: 'Overview', href: '/dashboard/freelancer', active: true },
    { icon: Briefcase, label: 'Pekerjaan Saya', href: '/dashboard/freelancer/jobs' },
    { icon: MessageSquare, label: 'Pesan', href: '/dashboard/freelancer/messages' },
    { icon: User, label: 'Profil', href: '/dashboard/freelancer/profile' },
  ] : [
    { icon: LayoutDashboard, label: 'Overview', href: '/dashboard/client', active: true },
    { icon: Briefcase, label: 'Posting Proyek', href: '/dashboard/client/jobs' },
    { icon: User, label: 'Talenta', href: '/dashboard/client/talents' },
    { icon: MessageSquare, label: 'Pesan', href: '/dashboard/client/messages' },
  ];

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      type: 'success',
      icon: CheckCircle,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      title: 'Pekerjaan Selesai',
      message: 'Nazril Afandi telah menyelesaikan "Pembuatan Dashboard V2"',
      time: '2 menit lalu',
      unread: true
    },
    {
      id: 2,
      type: 'info',
      icon: FileText,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: 'Pelamar Baru',
      message: 'Budi Santoso melamar untuk "Redesain Aplikasi Mobile"',
      time: '1 jam lalu',
      unread: true
    },
    {
      id: 3,
      type: 'warning',
      icon: Clock,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      title: 'Deadline Mendekat',
      message: 'Proyek "Logo Rebranding" akan berakhir dalam 2 hari',
      time: '3 jam lalu',
      unread: false
    },
    {
      id: 4,
      type: 'alert',
      icon: AlertCircle,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      title: 'Pembayaran Tertunda',
      message: 'Invoice #1234 menunggu pembayaran Anda',
      time: '1 hari lalu',
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkAllRead = () => {
    console.log('Mark all as read');
  };

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
            <span className="ml-3 text-lg font-bold text-slate-800 tracking-tight">SkillLink</span>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden ml-auto">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            {menuItems.map((item) => (
              <Link 
                key={item.label} 
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                  item.active 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 ${item.active ? 'text-blue-600' : 'text-slate-400'}`} />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100 space-y-1">
            <Link 
              href={role === 'freelancer' ? '/dashboard/freelancer/settings' : '/dashboard/client/settings'} 
              className="flex items-center px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <Settings className="w-5 h-5 mr-3 text-slate-400" />
              Pengaturan
            </Link>
            <button className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors">
              <LogOut className="w-5 h-5 mr-3" />
              Keluar
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 -ml-2 text-slate-500">
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden md:flex items-center flex-1 max-w-md ml-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari proyek atau pesan..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notification Dropdown */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  {/* Header */}
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900">Notifikasi</h3>
                      {unreadCount > 0 && (
                        <p className="text-xs text-slate-500 mt-0.5">{unreadCount} belum dibaca</p>
                      )}
                    </div>
                    <button 
                      onClick={handleMarkAllRead}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Tandai Semua
                    </button>
                  </div>

                  {/* Notification List */}
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${
                          notification.unread ? 'bg-blue-50/30' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className={`w-10 h-10 ${notification.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                            <notification.icon className={`w-5 h-5 ${notification.iconColor}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <h4 className="font-semibold text-slate-900 text-sm">{notification.title}</h4>
                              {notification.unread && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed mb-1">
                              {notification.message}
                            </p>
                            <span className="text-xs text-slate-400">{notification.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="p-3 border-t border-slate-100 bg-slate-50">
                    <Link 
                      href={role === 'freelancer' ? '/dashboard/freelancer/notifications' : '/dashboard/client/notifications'}
                      className="block w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 py-2"
                      onClick={() => setIsNotificationOpen(false)}
                    >
                      Lihat Semua Notifikasi
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Avatar (Display Only - Not Clickable) */}
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white shadow-sm">
              {role === 'freelancer' ? 'ME' : 'CL'}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative">
           <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-blue-200/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-[10%] left-[20%] w-[500px] h-[500px] bg-emerald-200/10 blur-[100px] rounded-full" />
           </div>
           
           <div className="relative z-10">
              {children}
           </div>
        </main>
      </div>
    </div>
  );
}