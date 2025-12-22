'use client';

import { useState } from 'react';
import DashboardLayout from "../../DashboardLayout";
import { Search, MapPin, DollarSign, Briefcase, Clock, Filter, ChevronRight, Star, Bookmark, Zap, TrendingUp } from 'lucide-react';

export default function FindJobsPage() {
  const [activeTab, setActiveTab] = useState('Semua');
  const categories = ['Semua', 'Web Development', 'UI/UX Design', 'Mobile App', 'Writing'];

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
      isTrending: true,
      category: "Web Development",
      skills: ["React", "Next.js", "TypeScript"],
      description: "Kami mencari pengembang React yang berpengalaman untuk membantu tim kami menyelesaikan beberapa bug kritis di platform e-commerce kami."
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
      isTrending: false,
      category: "UI/UX Design",
      skills: ["Figma", "UI/UX", "Mobile Design"],
      description: "Dibutuhkan desainer UI/UX untuk merancang 15-20 layar aplikasi kesehatan. Harus memiliki portofolio aplikasi mobile yang kuat."
    },
    {
      id: 3,
      title: "Optimasi Database PostgreSQL Skala Besar",
      client: "DataCorp Global",
      location: "Remote",
      budget: "Rp 12.000.000",
      type: "Proyek",
      postedAt: "10 jam yang lalu",
      difficulty: "Expert",
      isTrending: true,
      category: "Web Development",
      skills: ["PostgreSQL", "Backend", "Optimization"],
      description: "Membantu kami mengoptimalkan query database yang lambat pada sistem produksi kami yang memiliki jutaan baris data."
    }
  ]);

  const filteredJobs = activeTab === 'Semua' 
    ? jobs 
    : jobs.filter(job => job.category === activeTab);

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
          <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition font-bold shadow-lg shadow-blue-600/20">
            Cari
          </button>
        </div>
      </div>

      {/* FILTER TABS (TAHAP 3) */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === cat 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job.id} className="bg-white border border-slate-200 rounded-[32px] p-6 hover:border-blue-500 hover:shadow-xl transition-all group relative overflow-hidden">
                {/* Indikator Trending */}
                {job.isTrending && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-amber-100 text-amber-700 px-4 py-1 rounded-bl-2xl text-[10px] font-black uppercase tracking-tighter flex items-center gap-1">
                      <TrendingUp size={12} /> Sedang Tren
                    </div>
                  </div>
                )}

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
            ))
          ) : (
            <div className="p-12 bg-white border border-slate-200 rounded-[32px] text-center">
               <Search size={48} className="mx-auto text-slate-200 mb-4" />
               <p className="text-slate-500 font-bold">Tidak ada pekerjaan ditemukan untuk kategori ini.</p>
            </div>
          )}
        </div>
        
        {/* SIDEBAR INFO */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-4">
                <Zap size={24} className="fill-white" />
              </div>
              <h3 className="font-bold text-xl mb-3">Lamar Cepat?</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">Gunakan fitur "Auto-Apply" untuk mendapatkan notifikasi instan saat proyek yang cocok diposting.</p>
              <button className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2">
                Pelajari Selengkapnya <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}