'use client';

import { useState } from 'react';
import DashboardLayout from "../../DashboardLayout";
import { Plus, Layout, ExternalLink, Trash2, Edit3, Image as ImageIcon, X, Save } from 'lucide-react';

export default function PortfolioPage() {
  // State untuk menyimpan daftar proyek
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
    }
  ]);

  // --- STATE BARU TAHAP 3 ---
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <DashboardLayout role="freelancer">
      {/* HEADER SECTION */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Portofolio Saya</h1>
          <p className="text-slate-500">Pamerkan hasil kerja terbaik Anda untuk menarik klien</p>
        </div>

        {/* Tombol pemicu modal */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-bold shadow-lg shadow-blue-600/20"
        >
          <Plus size={18} />
          <span>Tambah Proyek Baru</span>
        </button>
      </div>

      {/* PORTFOLIO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
            <div className="relative h-48 bg-slate-100 overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button className="p-2.5 bg-white rounded-xl text-slate-900 hover:bg-blue-600 hover:text-white transition-all">
                  <Edit3 size={18} />
                </button>
                <button className="p-2.5 bg-white rounded-xl text-red-600 hover:bg-red-600 hover:text-white transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{project.category}</div>
              <h3 className="font-bold text-slate-900 mb-4">{project.title}</h3>
              <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition">
                  <ExternalLink size={14} /> Live Preview
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Tombol Tambah Cepat (juga memicu modal) */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 hover:bg-slate-50 hover:border-blue-400 transition group min-h-[280px]"
        >
          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all">
            <Plus size={28} />
          </div>
          <span className="text-sm font-bold text-slate-500 group-hover:text-blue-600">Tambah Proyek Lainnya</span>
        </button>
      </div>

      {/* --- MODAL INPUT (TAHAP 3) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in duration-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-900">Tambah Proyek Baru</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20}/>
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Proyek</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Contoh: Aplikasi Kasir Digital" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Kategori Proyek</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none">
                  <option>Web Development</option>
                  <option>Mobile App Development</option>
                  <option>UI/UX Design</option>
                  <option>Graphic Design</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Upload Sampul Proyek</label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-blue-300 transition-all cursor-pointer">
                  <ImageIcon size={32} className="mb-2 opacity-50" />
                  <p className="text-xs font-bold uppercase tracking-wider">Klik atau tarik gambar ke sini</p>
                  <p className="text-[10px] mt-1">Maksimal 5MB (JPG, PNG)</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3 bg-slate-50/50">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="flex-1 py-3 font-bold text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all"
              >
                Batal
              </button>
              <button className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
                <Save size={18} />
                Simpan Proyek
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}