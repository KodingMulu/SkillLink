'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from "../../DashboardLayout";
import { Plus, ExternalLink, Trash2, Edit3, Image as ImageIcon, X, Loader2 } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  description?: string;
}

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [activeFilter, setActiveFilter] = useState('Semua');
  const categories = ['Semua', 'Web Development', 'UI/UX Design', 'Graphic Design'];

  const [formData, setFormData] = useState({
    title: '',
    category: 'Web Development',
    image: '', 
    description: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/freelancer/portfolio`, { withCredentials: true });
      setProjects(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.image) return alert("Judul dan URL Gambar wajib diisi");
    
    setIsSubmitting(true);
    try {
      await axios.post('/api/portfolio', formData, { withCredentials: true });
      await fetchProjects();
      setIsModalOpen(false);
      setFormData({ title: '', category: 'Web Development', image: '', description: '' });
    } catch (error) {
      alert("Gagal menyimpan portfolio");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProjects = activeFilter === 'Semua' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  return (
    <DashboardLayout role="freelancer">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-black">Portofolio Saya</h1>
          <p className="text-slate-500">Pamerkan hasil kerja terbaik Anda untuk menarik klien</p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition font-bold shadow-lg shadow-blue-600/20 active:scale-95"
        >
          <Plus size={18} />
          <span>Tambah Proyek</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-8 p-1.5 bg-slate-100/50 w-fit rounded-2xl border border-slate-200">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === cat 
                ? 'bg-white text-blue-600 shadow-sm border border-slate-200' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 flex flex-col animate-in fade-in slide-in-from-bottom-4">
              <div className="relative h-52 bg-slate-100 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/500?text=No+Image")}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 gap-3">
                  <button className="flex-1 bg-white text-slate-900 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500">
                    <Edit3 size={14} /> Edit
                  </button>
                  <button className="p-2.5 bg-white/20 backdrop-blur-md text-white rounded-xl hover:bg-red-600 transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 delay-75">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <span className="inline-block px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-3 w-fit">
                  {project.category}
                </span>
                <h3 className="font-bold text-slate-900 text-lg mb-4 group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h3>
                <div className="mt-auto pt-5 border-t border-slate-50">
                  <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors">
                    <ExternalLink size={14} /> Lihat Detail Proyek
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 hover:bg-white hover:border-blue-400 hover:shadow-xl hover:shadow-blue-900/5 transition-all group min-h-[320px] bg-slate-50/50"
          >
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-90 transition-all duration-500 group-hover:text-blue-600">
              <Plus size={32} />
            </div>
            <span className="text-sm font-bold text-slate-900">Tambah Karya Baru</span>
            <p className="text-xs text-slate-400 mt-1">Klik untuk menambahkan portofolio</p>
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden border border-white/20">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Tambah Proyek</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={20}/></button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Nama Proyek</label>
                <input 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  type="text" 
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" 
                  placeholder="Masukkan judul karya..." 
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Kategori</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none font-medium"
                >
                  {categories.filter(c => c !== 'Semua').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">URL Gambar</label>
                <div className="relative">
                  <input 
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    type="text" 
                    className="w-full px-4 py-4 pl-12 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" 
                    placeholder="https://..." 
                  />
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Deskripsi</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium resize-none" 
                  placeholder="Deskripsi singkat..." 
                />
              </div>
            </div>
            <div className="p-8 border-t border-slate-100 flex gap-4">
              <button 
                onClick={() => setIsModalOpen(false)} 
                disabled={isSubmitting}
                className="flex-1 py-4 font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-all"
              >
                Batal
              </button>
              <button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex justify-center items-center gap-2"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Simpan Karya'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}