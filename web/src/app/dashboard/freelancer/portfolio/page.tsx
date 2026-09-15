'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from "../../DashboardLayout";
import {
  Plus,
  ExternalLink,
  Image as ImageIcon,
  X,
  Loader2,
  Briefcase,
  Layers,
  Eye,
  Sparkles,
  Search,
  CheckCircle2,
  FolderPlus
} from 'lucide-react';
import { getApiUrl } from '@/lib/api';

interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  description?: string;
  link?: string;
}

const PRESET_SAMPLES = [
  { name: 'Dashboard SaaS', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=60&w=600&auto=format&fit=crop', category: 'Web Development' },
  { name: 'Mobile E-Commerce', url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=60&w=600&auto=format&fit=crop', category: 'Mobile App' },
  { name: 'Brand Identity Design', url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=60&w=600&auto=format&fit=crop', category: 'Graphic Design' },
  { name: 'UI/UX Mobile Redesign', url: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=60&w=600&auto=format&fit=crop', category: 'UI/UX Design' },
];

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [activeFilter, setActiveFilter] = useState('Semua');
  const categories = ['Semua', 'Web Development', 'UI/UX Design', 'Graphic Design', 'Mobile App', 'Branding & Content'];

  const [formData, setFormData] = useState({
    title: '',
    category: 'Web Development',
    image: '',
    description: '',
    link: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const apiUrl = getApiUrl();
      const res = await axios.get(`${apiUrl}/user/freelancer/portfolio`, { withCredentials: true });
      if (res.data && res.data.data) {
        setProjects(res.data.data);
      }
    } catch (error) {
      console.error("Gagal mengambil daftar portofolio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const applyPreset = (preset: typeof PRESET_SAMPLES[0]) => {
    setFormData({
      ...formData,
      image: preset.url,
      category: preset.category,
      title: formData.title || preset.name
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.image) {
      alert("Judul proyek dan URL Gambar wajib diisi!");
      return;
    }

    setIsSubmitting(true);
    try {
      const apiUrl = getApiUrl();
      await axios.post(`${apiUrl}/user/freelancer/portfolio`, formData, { withCredentials: true });
      await fetchProjects();
      setIsModalOpen(false);
      setFormData({ title: '', category: 'Web Development', image: '', description: '', link: '' });
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Gagal menyimpan portofolio baru.");
      } else {
        alert("Gagal menyimpan portofolio baru.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesCategory = activeFilter === 'Semua' || p.category === activeFilter;
    const matchesQuery = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  return (
    <DashboardLayout role="freelancer">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Banner Section */}
        <div className="relative rounded-3xl bg-slate-900 p-8 text-white shadow-lg">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                Portofolio & Galeri Karya
              </h1>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                Tampilkan portofolio terbaik Anda untuk menarik minat klien potensial. Proyek portofolio berkualitas meningkatkan peluang diterima proyek hingga 3x lipat.
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2.5 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-500 hover:to-indigo-500 transition-all font-bold shadow-xl shadow-blue-600/30 active:scale-95 text-sm shrink-0 cursor-pointer"
            >
              <Plus size={18} />
              <span>Tambah Karya Baru</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Briefcase size={26} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Portofolio</p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">{projects.length} Karya</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <Layers size={26} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kategori Teraktif</p>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                {projects.length > 0 ? (projects[0]?.category || 'Web Development') : 'Belum Ada'}
              </h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <Eye size={26} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Portofolio</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-base font-bold text-slate-900">Publik & Terverifikasi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeFilter === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72 shrink-0">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari karya..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Portfolio Content Grid */}
        {isLoading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-slate-500 font-medium text-sm">Memuat portofolio Anda...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Project Cards */}
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group bg-white rounded-3xl border border-slate-200/80 overflow-hidden hover:shadow-xl hover:shadow-slate-200 hover:border-blue-200 transition-all duration-300 flex flex-col"
              >
                {/* Image Container */}
                <div className="relative h-56 bg-slate-100 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-5">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="w-full bg-white text-slate-900 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all shadow-lg"
                    >
                      <Eye size={16} /> Lihat Pratinjau Detail
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-bold uppercase tracking-wider border border-blue-100">
                        {project.category}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
                      {project.title}
                    </h3>

                    <p className="text-slate-500 text-xs mt-2 line-clamp-2 leading-relaxed">
                      {project.description || 'Tidak ada deskripsi rinci untuk proyek ini.'}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      <span>Lihat Rincian</span>
                    </button>

                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        title="Buka tautan proyek"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Add Project Card CTA Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 hover:bg-blue-50/50 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-900/5 transition-all group min-h-[360px] bg-slate-50/40 cursor-pointer text-center"
            >
              <div className="w-16 h-16 bg-white rounded-2xl shadow-md border border-slate-200 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 text-blue-600">
                <FolderPlus size={32} />
              </div>
              <span className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Tambah Karya Baru</span>
              <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">Pamerkan karya terbaru Anda untuk memperluas peluang mendapatkan proyek.</p>
            </button>
          </div>
        )}

      </div>

      {/* Modal Preview Detail Proyek */}
      {selectedProject && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden border border-white/20">
            <div className="relative h-64 md:h-80 bg-slate-900 overflow-hidden">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop";
                }}
              />
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2.5 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full transition-all backdrop-blur-sm cursor-pointer"
              >
                <X size={18} />
              </button>
              <div className="absolute bottom-4 left-6">
                <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold shadow-lg">
                  {selectedProject.category}
                </span>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-4">
              <h2 className="text-2xl font-black text-slate-900">{selectedProject.title}</h2>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Deskripsi Karya</h4>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {selectedProject.description || 'Portofolio ini menampilkan hasil pengerjaan proyek profesional dengan mengutamakan standar kualitas terbaik.'}
                </p>
              </div>

              {selectedProject.link && (
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <a
                    href={selectedProject.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
                  >
                    <ExternalLink size={14} /> Kunjungi Tautan Proyek
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Proyek */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden border border-white/20 max-h-[90vh] flex flex-col">

            {/* Modal Header */}
            <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-900">Tambah Karya Portofolio</h3>
                <p className="text-xs text-slate-500 mt-0.5">Lengkapi rincian proyek yang ingin Anda tampilkan</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2.5 hover:bg-slate-200/60 rounded-full text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5 overflow-y-auto flex-1">

              {/* Nama Proyek */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Nama Proyek <span className="text-red-500">*</span>
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  type="text"
                  required
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm font-medium text-slate-900"
                  placeholder="Contoh: Redesign Aplikasi Mobile Bank ABC"
                />
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Kategori Proyek <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-medium text-sm text-slate-900 cursor-pointer"
                >
                  {categories.filter(c => c !== 'Semua').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Preset Quick Samples */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Pilih Contoh Gambar Cepat (Opsional)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_SAMPLES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className="p-2 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50/50 text-left transition-all flex items-center gap-2 cursor-pointer text-xs"
                    >
                      <img src={preset.url} alt="" className="w-7 h-7 rounded-lg object-cover" />
                      <span className="font-semibold text-slate-700 truncate">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* URL Gambar */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  URL Gambar Preview <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    type="url"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm font-medium text-slate-900"
                    placeholder="https://images.unsplash.com/..."
                  />
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </div>
              </div>

              {/* Live Preview Box */}
              {formData.image && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-4">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                    onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop")}
                  />
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 size={14} /> Live Gambar Terpasang
                    </p>
                    <p className="text-slate-400 truncate max-w-xs">{formData.image}</p>
                  </div>
                </div>
              )}

              {/* Deskripsi */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Deskripsi Proyek
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm font-medium text-slate-900 resize-none"
                  placeholder="Jelaskan peran Anda, teknologi yang digunakan, serta tantangan yang diselesaikan..."
                />
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 font-bold text-slate-600 hover:bg-slate-100 rounded-2xl transition-all text-sm cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm rounded-2xl hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-600/20 flex justify-center items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan Portofolio</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}