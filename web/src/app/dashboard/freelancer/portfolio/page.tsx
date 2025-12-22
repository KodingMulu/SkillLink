'use client';

import { useState } from 'react';
import DashboardLayout from "../../DashboardLayout";
import { Plus, Briefcase, Layout, ExternalLink, Trash2, Edit3, Image as ImageIcon } from 'lucide-react';

export default function PortfolioPage() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "E-Commerce Re-design",
      category: "Web Development",
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=500&q=80",
    },
    {
      id: 2,
      title: "Mobile Banking App",
      category: "UI/UX Design",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&q=80",
    },
    {
      id: 3,
      title: "Company Profile Website",
      category: "Web Development",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80",
    }
  ]);

  return (
    <DashboardLayout role="freelancer">
      {/* HEADER SECTION */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Portofolio Saya</h1>
          <p className="text-slate-500">Pamerkan hasil kerja terbaik Anda untuk menarik klien</p>
        </div>

        <button className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-bold shadow-lg shadow-blue-600/20">
          <Plus size={18} />
          <span>Tambah Proyek Baru</span>
        </button>
      </div>

      {/* PORTFOLIO GRID (TAHAP 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
            {/* Image Container with Hover Overlay */}
            <div className="relative h-48 bg-slate-100 overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button className="p-2.5 bg-white rounded-xl text-slate-900 hover:bg-blue-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300">
                  <Edit3 size={18} />
                </button>
                <button className="p-2.5 bg-white rounded-xl text-red-600 hover:bg-red-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex-1 flex flex-col">
              <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">
                {project.category}
              </div>
              <h3 className="font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                {project.title}
              </h3>
              
              <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition">
                  <ExternalLink size={14} />
                  Live Preview
                </button>
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition">
                  <ImageIcon size={16} />
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Quick Add Button Card */}
        <button className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 hover:bg-slate-50 hover:border-blue-400 transition group min-h-[280px]">
          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all duration-300 group-hover:rotate-90">
            <Plus size={28} />
          </div>
          <span className="text-sm font-bold text-slate-500 group-hover:text-blue-600">Tambah Proyek Lainnya</span>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tight font-medium">Format: JPG, PNG, atau GIF</p>
        </button>
      </div>
    </DashboardLayout>
  );
}