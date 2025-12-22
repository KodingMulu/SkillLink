'use client';

import React, { useState, useMemo } from 'react';
import DashboardLayout from '../../DashboardLayout';
import { 
  Search, MapPin, DollarSign, Clock, Filter, 
  Bookmark, Building2, ChevronDown, Sparkles,
  TrendingUp, Zap, CheckCircle2
} from "lucide-react";

export default function JobSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [savedJobs, setSavedJobs] = useState<number[]>([]);

  // Data Pekerjaan Lengkap (Pastikan semua properti ada)
  const jobs = [
    {
      id: 1,
      title: "Frontend Developer (Next.js + Tailwind)",
      client: "TechFlow Startup",
      category: "Development",
      verified: true,
      location: "Remote",
      budget: "Rp 5.000.000 - Rp 8.000.000",
      type: "Project Based", // Properti type harus konsisten dengan filter
      posted: "2 jam yang lalu",
      tags: ["React", "TypeScript", "Frontend"],
      desc: "Kami mencari developer mahasiswa untuk membantu menyelesaikan modul dashboard. Wajib menguasai Next.js App Router dan Tailwind CSS."
    },
    {
      id: 2,
      title: "Desain Logo & Brand Identity UMKM",
      client: "Kopi Senja",
      category: "Design",
      verified: false,
      location: "Jakarta (Hybrid)",
      budget: "Rp 1.500.000",
      type: "Freelance",
      posted: "5 jam yang lalu",
      tags: ["Design", "Branding", "Illustrator"],
      desc: "Membutuhkan desainer grafis untuk rebranding kedai kopi kami. Lingkup kerja meliputi Logo, Menu, dan Packaging cup."
    },
    {
      id: 3,
      title: "Content Writer Artikel SEO Teknologi",
      client: "Media Gadget Indo",
      category: "Writing",
      verified: true,
      location: "Remote",
      budget: "Rp 50.000 / artikel",
      type: "Part-time",
      posted: "1 hari yang lalu",
      tags: ["Writing", "SEO", "Teknologi"],
      desc: "Dicari penulis artikel gadget yang paham SEO dasar. Target 5 artikel per minggu. Cocok untuk mahasiswa jurnalistik/sastra."
    }
  ];

  const categories = ["All", "Development", "Design", "Writing", "Marketing", "Video"];

  // Logika Filter yang Diperbaiki
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            job.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(job.type);
      
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [searchQuery, selectedCategory, selectedTypes]);

  const handleTypeChange = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleSaveJob = (id: number) => {
    setSavedJobs(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  return (
    <DashboardLayout role="freelancer">
      {/* 1. HERO STATS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Pekerjaan Baru", value: "124", icon: Sparkles, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Rata-rata Budget", value: "Rp 4.5jt", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Klien Aktif", value: "89", icon: Building2, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((stat, i) => (
          <div key={i} className={`${stat.bg} p-6 rounded-[2rem] border border-white/50 shadow-sm flex items-center gap-4`}>
            <div className={`w-12 h-12 rounded-2xl bg-white flex items-center justify-center ${stat.color} shadow-sm`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* 2. SIDEBAR FILTER */}
        <aside className="lg:w-72 space-y-6 flex-shrink-0">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm sticky top-24">
            <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2">
              <Filter size={18} /> Filter Lanjutan
            </h3>
            
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Tipe Kontrak</p>
                <div className="space-y-3">
                  {['Project Based', 'Freelance', 'Part-time'].map((type) => (
                    <label key={type} className="flex items-center gap-3 group cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedTypes.includes(type)}
                        onChange={() => handleTypeChange(type)}
                        className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500" 
                      />
                      <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600 transition">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-xl shadow-blue-200">
            <Zap className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 rotate-12" />
            <h4 className="font-black text-lg mb-2 relative z-10">SkillLink Pro</h4>
            <p className="text-blue-100 text-xs mb-6 relative z-10 font-medium leading-relaxed">Notifikasi 30 menit lebih cepat.</p>
            <button className="w-full py-3 bg-white text-blue-700 font-black rounded-xl text-xs hover:bg-blue-50 transition relative z-10">Upgrade</button>
          </div>
        </aside>

        {/* 3. MAIN CONTENT */}
        <div className="flex-1 space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600" />
              <input 
                type="text" 
                placeholder="Cari keahlian..." 
                className="w-full pl-16 pr-6 py-5 bg-white border-2 border-slate-100 rounded-[2rem] focus:outline-none focus:border-blue-500 focus:ring-8 focus:ring-blue-500/5 transition-all font-bold text-slate-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-xs font-black transition-all border-2 ${
                    selectedCategory === cat 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' 
                    : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200'
                  }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div key={job.id} className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-blue-200 hover:shadow-2xl transition-all duration-300">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                      <Building2 size={32} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-bold text-slate-500">{job.client}</span>
                            {job.verified && <CheckCircle2 size={14} className="text-blue-500" />}
                          </div>
                        </div>
                        <button 
                          onClick={() => toggleSaveJob(job.id)}
                          className={`p-3 rounded-2xl transition-all ${
                            savedJobs.includes(job.id) ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'
                          }`}
                        >
                          <Bookmark size={20} className={savedJobs.includes(job.id) ? 'fill-current' : ''} />
                        </button>
                      </div>

                      <p className="text-sm text-slate-500 font-medium mb-6 line-clamp-2 leading-relaxed">
                        {job.desc}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-50">
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-1.5 text-emerald-600 font-black text-sm">
                            <DollarSign size={16} /> {job.budget}
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400 font-bold text-sm">
                            <MapPin size={16} /> {job.location}
                          </div>
                          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-wider self-center">
                            {job.type}
                          </span>
                        </div>
                        
                        <button className="px-8 py-3 bg-slate-900 text-white font-black rounded-xl hover:bg-blue-600 transition-all shadow-lg active:scale-95">
                          Lamar Sekarang
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold">Pekerjaan tidak ditemukan.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}