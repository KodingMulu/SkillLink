'use client';

import React, { useState } from 'react';
import DashboardLayout from '../../DashboardLayout';
import { Search, MapPin, DollarSign, Clock, Filter, Briefcase, Bookmark, Building2 } from "lucide-react";

export default function JobSearchPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Dummy Data Pekerjaan
  const jobs = [
    {
      id: 1,
      title: "Frontend Developer (Next.js + Tailwind)",
      client: "TechFlow Startup",
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
      verified: false,
      location: "Bandung",
      budget: "Rp 3.000.000 / bulan",
      type: "Internship",
      posted: "3 hari yang lalu",
      tags: ["Video", "Editing", "Social Media"],
      desc: "Internship berbayar untuk mahasiswa DKV/Multimedia. Membuat konten video pendek untuk promosi skincare."
    }
  ];

  return (
    <DashboardLayout role="freelancer">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Temukan Pekerjaan</h1>
        <p className="text-slate-500">Jelajahi proyek yang sesuai dengan skill dan minatmu.</p>
      </div>

      {/* --- FILTER BAR --- */}
      <section className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 sticky top-4 z-30">
        <div className="flex flex-col md:flex-row gap-4">
          
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari posisi, skill, atau keyword..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Dropdowns (Desktop) / Filter Button (Mobile) */}
          <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <select 
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:border-blue-500 cursor-pointer hover:bg-slate-50"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">Semua Kategori</option>
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="Writing">Writing</option>
              <option value="Marketing">Marketing</option>
            </select>

            <select className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:border-blue-500 cursor-pointer hover:bg-slate-50">
              <option value="">Tipe Pekerjaan</option>
              <option value="Project">Project Based</option>
              <option value="PartTime">Part Time</option>
              <option value="FullTime">Full Time</option>
            </select>

            <button className="flex items-center px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 whitespace-nowrap">
              <Filter className="w-4 h-4 mr-2" />
              Filter Lanjutan
            </button>
          </div>
        </div>
      </section>

      {/* --- JOB LIST --- */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <div 
            key={job.id} 
            className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 relative overflow-hidden"
          >
            {/* Hover Indicator (Garis biru di kiri saat hover) */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />

            <div className="flex flex-col md:flex-row gap-6">
              
              {/* Client Logo Placeholder */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 flex items-center justify-center text-slate-500">
                  <Building2 className="w-6 h-6 md:w-7 md:h-7" />
                </div>
              </div>

              {/* Job Content */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 mb-2 md:mb-0">
                      <span className="text-sm text-slate-600 font-medium">{job.client}</span>
                      {job.verified && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                          VERIFIED
                        </span>
                      )}
                      <span className="text-slate-300 text-xs">•</span>
                      <span className="text-xs text-slate-500">{job.posted}</span>
                    </div>
                  </div>

                  {/* Price & Action (Desktop) */}
                  <div className="hidden md:flex flex-col items-end">
                    <span className="text-lg font-bold text-emerald-600">{job.budget}</span>
                    <span className="text-xs text-slate-500 mb-2">{job.type}</span>
                  </div>
                </div>

                {/* Description Snippet */}
                <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                  {job.desc}
                </p>

                {/* Tags & Metadata */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-50 md:border-none">
                  <div className="flex flex-wrap gap-2">
                    {/* Location Badge */}
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 text-xs font-medium border border-slate-200">
                      <MapPin className="w-3 h-3 mr-1" />
                      {job.location}
                    </span>
                    
                    {/* Skill Tags */}
                    {job.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium border border-blue-100">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Mobile Price (Shown only on small screens) */}
                  <div className="md:hidden w-full flex justify-between items-center mt-2">
                     <span className="font-bold text-emerald-600 text-sm">{job.budget}</span>
                     <span className="text-xs text-slate-500">{job.type}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100">
                      <Bookmark className="w-5 h-5" />
                    </button>
                    <button className="flex-1 md:flex-none px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-600/20 active:scale-95">
                      Lamar Sekarang
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* --- LOAD MORE --- */}
        <div className="pt-8 text-center">
          <button className="px-6 py-2 border border-slate-300 text-slate-600 text-sm font-medium rounded-full hover:bg-white hover:border-slate-400 hover:shadow-sm transition-all">
            Muat Lebih Banyak
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}