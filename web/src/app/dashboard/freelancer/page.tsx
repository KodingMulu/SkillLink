'use client';

import { useState } from 'react'; // ← TAMBAHKAN INI
import DashboardLayout from "../DashboardLayout";
import ProfilePopup from "../../components/ProfilePopup"; // ← TAMBAHKAN INI
import { Wallet, Clock, CheckCircle2, Star, TrendingUp, MoreHorizontal } from "lucide-react";

export default function FreelancerDashboard() {
  const [isProfileOpen, setIsProfileOpen] = useState(false); // ← TAMBAHKAN INI

  const stats = [
    { label: "Total Pendapatan", value: "Rp 12.500.000", icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Proyek Aktif", value: "3", icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Selesai", value: "12", icon: CheckCircle2, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Rating", value: "4.9/5.0", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
  ];

  const activeProjects = [
    { title: "Redesain UI/UX Aplikasi E-Wallet", client: "FinTech Asia", deadline: "2 Hari lagi", progress: 75, status: "Revisi" },
    { title: "Backend API untuk LMS Kampus", client: "Univ. Teknokrat", deadline: "1 Minggu lagi", progress: 40, status: "On Progress" },
    { title: "Artikel SEO Teknologi AI", client: "Media Tech", deadline: "Hari ini", progress: 90, status: "Review" },
  ];

  return (
    <DashboardLayout role="freelancer">
      {/* ← TAMBAHKAN BUTTON INI */}
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={() => setIsProfileOpen(true)}
          className="w-12 h-12 bg-purple-600 text-white rounded-full font-bold hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center text-sm"
        >
          ME
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Halo, Nazril! 👋</h1>
        <p className="text-slate-500">Berikut adalah aktivitas terbaru proyekmu.</p>
      </div>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3 mr-1" /> +12%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Active Projects */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-bold text-slate-900">Proyek Sedang Berjalan</h2>
              <button className="text-sm text-blue-600 hover:underline">Lihat Semua</button>
            </div>
            <div className="divide-y divide-slate-100">
              {activeProjects.map((project, idx) => (
                <div key={idx} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-slate-900">{project.title}</h4>
                      <p className="text-sm text-slate-500">{project.client} • Deadline: <span className="text-red-500 font-medium">{project.deadline}</span></p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium 
                      ${project.status === 'Revisi' ? 'bg-orange-100 text-orange-600' : 
                        project.status === 'Review' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {project.status}
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">Progress</span>
                      <span className="font-medium text-slate-700">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Col: Recommended Jobs */}
        <div className="space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-bold text-slate-900 mb-4">Rekomendasi Pekerjaan</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="p-4 border border-slate-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">Frontend Developer React</h4>
                    <span className="text-xs font-bold text-slate-900">Rp 5jt</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">Membuat dashboard admin menggunakan Next.js dan Tailwind CSS...</p>
                  <div className="mt-3 flex gap-2">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] rounded-md">Remote</span>
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] rounded-md">Project</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              Cari Lebih Banyak
            </button>
          </section>
        </div>

      </div>

      {/* ← TAMBAHKAN COMPONENT INI DI AKHIR, SEBELUM PENUTUP </DashboardLayout> */}
      <ProfilePopup 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userName="Nazril"
        userInitial="N"
        completedProjects={12}
        rating="4.9/5.0"
        activeProjects={activeProjects}
      />
    </DashboardLayout>
  );
}