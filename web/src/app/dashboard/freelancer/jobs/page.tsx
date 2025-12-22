'use client';

import React, { useState, useMemo } from 'react';
import DashboardLayout from '../../DashboardLayout';
import { 
  Search, MapPin, DollarSign, Clock, Filter, 
  Bookmark, Building2, ChevronDown, Sparkles
} from "lucide-react";

export default function JobSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  // Dummy Data Pekerjaan (Ditambahkan properti category untuk simulasi filter)
  const jobs = [
    {
      id: 1,
      title: "Frontend Developer (Next.js + Tailwind)",
      client: "TechFlow Startup",
      category: "Development",
      verified: true,
      location: "Remote",
      budget: "Rp 5.000.000 - Rp 8.000.000",
      type: "Project Based",
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
    },
    {
      id: 4,
      title: "Backend API Golang (Microservices)",
      client: "FinTech Asia",
      category: "Development",
      verified: true,
      location: "Remote",
      budget: "Rp 10.000.000",
      type: "Contract",
      posted: "2 hari yang lalu",
      tags: ["Backend", "Golang", "Database"],
      desc: "Membangun REST API untuk sistem pembayaran. Diutamakan yang pernah belajar arsitektur Microservices."
    },
    {
      id: 5,
      title: "Videographer & Editor Reels Instagram",
      client: "Beauty Glow",
      category: "Design",
      verified: false,
      location: "Bandung",
      budget: "Rp 3.000.000 / bulan",
      type: "Internship",
      posted: "3 hari yang lalu",
      tags: ["Video", "Editing", "Social Media"],
      desc: "Internship berbayar untuk mahasiswa DKV/Multimedia. Membuat konten video pendek untuk promosi skincare."
    }
  ];

  // Logika Filter Sederhana
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <DashboardLayout role="freelancer">
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="text-blue-600 font-bold text-xs uppercase tracking-wider">Job Feed</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Temukan Pekerjaan</h1>
          <p className="text-slate-500 mt-1">Ada {filteredJobs.length} proyek yang menunggu keahlianmu.</p>
        </div>
      </div>

      {/* --- FILTER BAR --- */}
      <section className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm mb-8 sticky top-4 z-30 ring-4 ring-slate-50/50">
        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* Search Input */}
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Cari posisi, skill, atau keyword..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <select 
                className="appearance-none pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 cursor-pointer hover:bg-slate-50 transition-all min-w-[160px]"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">Semua Kategori</option>
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Writing">Writing</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select 
                className="appearance-none pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 cursor-pointer hover:bg-slate-50 transition-all min-w-[150px]"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="All">Tipe Pekerjaan</option>
                <option value="Project">Project Based</option>
                <option value="PartTime">Part Time</option>
                <option value="FullTime">Full Time</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            <button className="flex items-center px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95">
              <Filter className="w-4 h-4 mr-2" />
              Filter Lanjutan
            </button>
          </div>
        </div>
      </section>

      {/* --- JOB LIST --- */}
      <div className="space-y-5">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div 
              key={job.id} 
              className="group bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-200 transition-all duration-300 relative overflow-hidden"
            >
              {/* Garis aksen saat hover */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />

              <div className="flex flex-col md:flex-row gap-6">
                
                {/* Client Logo */}
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:border-blue-100 group-hover:text-blue-500 transition-all duration-500">
                    <Building2 className="w-7 h-7" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                        <span className="text-sm text-slate-700 font-bold">{job.client}</span>
                        {job.verified && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-600 border border-blue-100 tracking-tighter">
                            VERIFIED
                          </span>
                        )}
                        <span className="flex items-center text-xs text-slate-400">
                          <Clock className="w-3 h-3 mr-1" /> {job.posted}
                        </span>
                      </div>
                    </div>

                    <div className="hidden md:flex flex-col items-end shrink-0">
                      <span className="text-xl font-black text-emerald-600 tracking-tight">{job.budget}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{job.type}</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-500 mb-6 line-clamp-2 leading-relaxed max-w-3xl font-medium">
                    {job.desc}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-6">
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-slate-50 text-slate-600 text-xs font-bold border border-slate-100">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                        {job.location}
                      </span>
                      {job.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1.5 rounded-xl bg-blue-50/50 text-blue-700 text-xs font-bold border border-blue-100/50">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-none pt-4 md:pt-0">
                      <button className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all border border-slate-100 hover:border-blue-200">
                        <Bookmark className="w-5 h-5" />
                      </button>
                      <button className="flex-1 md:flex-none px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                        Lamar Sekarang
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center bg-white rounded-[2rem] border border-dashed border-slate-300">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Pekerjaan tidak ditemukan</h3>
            <p className="text-slate-500 text-sm">Coba gunakan kata kunci atau filter lain.</p>
          </div>
        )}

        <div className="pt-10 text-center">
          <button className="px-10 py-3 bg-white border-2 border-slate-200 text-slate-600 text-sm font-bold rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
            Muat Lebih Banyak Pekerjaan
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}