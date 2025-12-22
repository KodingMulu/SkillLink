'use client';

import { useState } from 'react';
import DashboardLayout from "../../DashboardLayout";
import { Search, MapPin, DollarSign, Briefcase, Clock, Filter, ChevronRight, Star, Bookmark } from 'lucide-react';

export default function FindJobsPage() {
  // Data dummy untuk daftar pekerjaan
  const [jobs] = useState([
    {
      id: 1,
      title: "Senior React Developer - Perbaikan Bug E-Commerce",
      client: "Tech Solutions Inc.",
      location: "Remote",
      budget: "Rp 5.000.000 - Rp 8.000.000",
      type: "Proyek",
      postedAt: "2 jam yang lalu",
      difficulty: "Intermediate",
      skills: ["React", "Next.js", "TypeScript"],
      description: "Kami mencari pengembang React yang berpengalaman untuk membantu tim kami menyelesaikan beberapa bug kritis di platform e-commerce kami sebelum peluncuran besar bulan depan."
    },
    {
      id: 2,
      title: "Desain UI/UX Aplikasi Mobile Kesehatan",
      client: "HealthGo Startup",
      location: "Jakarta (Hybrid)",
      budget: "Rp 150.000 / Jam",
      type: "Kontrak Per Jam",
      postedAt: "5 jam yang lalu",
      difficulty: "Expert",
      skills: ["Figma", "UI/UX", "Mobile Design"],
      description: "Dibutuhkan desainer UI/UX untuk merancang 15-20 layar aplikasi kesehatan. Harus memiliki portofolio aplikasi mobile yang kuat."
    }
  ]);

  return (
    <DashboardLayout role="freelancer">
      {/* HEADER & SEARCH SECTION */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 font-black">Cari Pekerjaan</h1>
        <p className="text-slate-500 mb-6">Temukan proyek yang sesuai dengan keahlian Anda</p>
        
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Cari desain UI, pengembang React, dsb..." 
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50 transition font-bold shadow-sm">
            <Filter size={18} />
            <span>Filter</span>
          </button>
          <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition font-bold shadow-lg shadow-blue-600/20">
            Cari
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* DAFTAR PEKERJAAN (TAHAP 2) */}
        <div className="lg:col-span-2 space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white border border-slate-200 rounded-[32px] p-6 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-900/5 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                      {job.type}
                    </span>
                    <span className="text-slate-400 text-xs flex items-center gap-1">
                      <Clock size={14} /> {job.postedAt}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
                    {job.title}
                  </h2>
                  <p className="text-sm text-slate-500 flex items-center gap-1 font-medium">
                    {job.client} • <Star size={14} className="text-amber-400 fill-amber-400" /> 4.9
                  </p>
                </div>
                <button className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all">
                  <Bookmark size={20} />
                </button>
              </div>

              <p className="text-slate-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                {job.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {job.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1.5 bg-slate-50 border border-slate-100 text-slate-600 text-xs font-bold rounded-xl">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Budget</span>
                    <span className="text-slate-900 font-bold">{job.budget}</span>
                  </div>
                  <div className="w-px h-8 bg-slate-100 hidden sm:block"></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kesulitan</span>
                    <span className="text-slate-900 font-bold">{job.difficulty}</span>
                  </div>
                </div>
                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all font-bold text-sm">
                  Lamar Sekarang
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* SIDEBAR INFO */}
        <div className="space-y-6">
          <div className="bg-blue-600 rounded-[32px] p-8 text-white shadow-xl shadow-blue-600/20 relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="font-bold text-xl mb-3">Tingkatkan Profil! 🚀</h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-6">Lengkapi portofolio Anda untuk mendapatkan peluang 2x lebih besar dilirik klien.</p>
              <button className="w-full py-3 bg-white text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
                Edit Portofolio
              </button>
            </div>
            <Briefcase size={120} className="absolute -right-8 -bottom-8 text-blue-500/20 rotate-12 group-hover:scale-110 transition-transform duration-500" />
          </div>

          <div className="bg-white border border-slate-200 rounded-[32px] p-6">
            <h3 className="font-bold text-slate-900 mb-4">Pekerjaan Tersimpan</h3>
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-3">
                <Bookmark size={24} />
              </div>
              <p className="text-xs text-slate-500 font-medium">Belum ada pekerjaan yang disimpan.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}