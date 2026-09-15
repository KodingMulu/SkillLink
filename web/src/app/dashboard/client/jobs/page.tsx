'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from "../../DashboardLayout";
import { getApiUrl } from '@/lib/api';
import { MapPin, Calendar, Clock, Edit, Trash2, Users, X, Search, Plus, Briefcase } from "lucide-react"; 
import axios from 'axios';
import Link from 'next/link';

interface Job {
  id: string;
  title: string;
  category: string;
  budget: string;      
  budgetRaw: number;   
  deadline: string;    
  deadlineRaw: string; 
  location: string;
  duration: string;
  description: string;
  experienceLevel: string;
  applicants: number;
  status: 'active' | 'closed';
  postedDate: string;
  skills: string[];
}

interface ApiJob {
  id: string;
  title: string;
  category: string;
  description: string;
  budget: number;      
  deadline: string | null;
  location: string | null;
  duration: string | null;
  experienceLevel: string | null;
  status: string;
  tags: string[];
  createdAt: string;
  _count?: { proposals: number };
}

export default function JobsPage() {
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '', category: '', description: '', budget: '', deadline: '',
    location: 'Remote', skills: '', duration: '1-3 bulan', experienceLevel: 'intermediate'
  });

  const categories = [
    { id: 'all', label: 'Semua Kategori' },
    { id: 'web-development', label: 'Web Development' },
    { id: 'mobile-development', label: 'Mobile Development' },
    { id: 'ui-ux-design', label: 'UI/UX Design' },
    { id: 'content-writing', label: 'Content Writing' },
    { id: 'digital-marketing', label: 'Digital Marketing' }
  ];

  const fetchJobs = async () => {
    setIsFetching(true);
    try {
      const apiUrl = getApiUrl();
      const response = await axios.get(`${apiUrl}/user/client/jobs`, { withCredentials: true });
      
      if (response.data.code === 200 && response.data.data) {
        const mappedJobs: Job[] = response.data.data.map((item: ApiJob) => {
          const isValidDate = (d: string | null) => d && !isNaN(new Date(d).getTime());
          return {
            id: item.id,
            title: item.title,
            category: item.category,
            description: item.description,
            location: item.location || 'Remote',
            duration: item.duration || 'Flexible',
            experienceLevel: item.experienceLevel || 'intermediate',
            skills: item.tags || [],
            applicants: item._count?.proposals || 0,
            status: (item.status === 'OPEN' || item.status === 'active') ? 'active' : 'closed',
            postedDate: isValidDate(item.createdAt) 
              ? new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) 
              : '-',
            budget: `Rp ${item.budget.toLocaleString('id-ID')}`,
            budgetRaw: item.budget, 
            deadline: isValidDate(item.deadline)
              ? new Date(item.deadline!).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
              : '-',
            deadlineRaw: isValidDate(item.deadline)
              ? new Date(item.deadline!).toISOString().split('T')[0]
              : '',
          };
        });
        setJobs(mappedJobs);
      }
    } catch (error) {
      console.error("Error fetch jobs:", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openEditModal = (job: Job) => {
    setEditingId(job.id);
    setFormData({
      title: job.title,
      category: job.category,
      description: job.description,
      budget: job.budgetRaw.toString(), 
      deadline: job.deadlineRaw,        
      location: job.location,
      skills: job.skills.join(', '),
      duration: job.duration,
      experienceLevel: job.experienceLevel
    });
    setShowPostJobModal(true);
  };

  const closeModal = () => {
    setShowPostJobModal(false);
    setEditingId(null);
    setFormData({
      title: '', category: '', description: '', budget: '', deadline: '',
      location: 'Remote', skills: '', duration: '1-3 bulan', experienceLevel: 'intermediate'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const apiUrl = getApiUrl();
      const endpoint = editingId 
        ? `${apiUrl}/user/client/jobs/${editingId}`
        : `${apiUrl}/user/client/jobs`;

      const method = editingId ? 'put' : 'post';

      await axios[method](endpoint, formData, { withCredentials: true });

      alert(`Pekerjaan berhasil ${editingId ? 'diperbarui' : 'diposting'}!`);
      closeModal();
      fetchJobs();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message || "Terjadi kesalahan pada server.";
        alert(msg);
      } else {
        console.error("Unknown error:", error);
        alert("Terjadi kesalahan sistem.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Yakin ingin menghapus lowongan pekerjaan ini?")) return;
    try {
        const apiUrl = getApiUrl();
        await axios.delete(`${apiUrl}/user/client/jobs/${id}`, { withCredentials: true });
        fetchJobs();
    } catch (error) { 
        alert("Gagal menghapus lowongan"); 
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
      job.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout role="client">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kelola Lowongan Pekerjaan</h1>
          <p className="text-slate-500 text-sm">Pantau status lowongan dan pelamar proyek Anda</p>
        </div>
        <button 
          onClick={() => { closeModal(); setShowPostJobModal(true); }} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-2 text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" /> Posting Pekerjaan Baru
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan judul, kata kunci, atau deskripsi..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-base">Daftar Pekerjaan ({filteredJobs.length})</h2>
          <span className="text-xs text-slate-500 font-medium">Total: {jobs.length} Pekerjaan</span>
        </div>

        <div className="divide-y divide-slate-100">
          {isFetching ? (
            <div className="p-10 text-center text-slate-500 flex flex-col items-center">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-xs font-medium">Memuat data lowongan...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-800">Tidak ada lowongan pekerjaan</p>
              <p className="text-xs text-slate-400 mt-1">Gunakan tombol posting pekerjaan di atas untuk membuat lowongan pertama Anda.</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job.id} className="p-6 hover:bg-slate-50/70 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900">{job.title}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        job.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {job.status === 'active' ? 'Aktif' : 'Tutup'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-3">{job.category} • Diposting pada {job.postedDate}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-600 mt-3">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        {job.budget}
                      </div>
                      <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Deadline: {job.deadline}</div>
                      <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}</div>
                      <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> {job.duration}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start">
                    <button 
                      onClick={() => openEditModal(job)} 
                      className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors border border-slate-200"
                      title="Edit Lowongan"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(job.id)} 
                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors border border-slate-200"
                      title="Hapus Lowongan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <Users className="w-4 h-4 text-blue-600" /> {job.applicants} Pelamar Masuk
                  </div>
                  <Link 
                    href={`/dashboard/client/jobs/${job.id}/applicants`} 
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100"
                  >
                    Lihat Pelamar &rarr;
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Post/Edit Modal */}
      {showPostJobModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 p-5 flex justify-between items-center z-10">
              <h2 className="text-lg font-bold text-slate-900">{editingId ? 'Edit Pekerjaan' : 'Posting Pekerjaan Baru'}</h2>
              <button onClick={closeModal} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Judul Pekerjaan</label>
                <input name="title" value={formData.title} onChange={handleInputChange} className="w-full border border-slate-300 p-2.5 text-sm rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" required placeholder="Contoh: Senior Frontend Developer" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Kategori</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full border border-slate-300 p-2.5 text-sm rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" required>
                  <option value="">Pilih Kategori</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Graphic Design">Graphic Design</option>
                  <option value="Content Writing">Content Writing</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Deskripsi</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} className="w-full border border-slate-300 p-2.5 text-sm rounded-lg focus:ring-2 focus:ring-blue-600 outline-none resize-none" required placeholder="Jelaskan detail tugas, ekspektasi, dan kualifikasi..." />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Anggaran (Rp)</label>
                  <input type="number" name="budget" value={formData.budget} onChange={handleInputChange} className="w-full border border-slate-300 p-2.5 text-sm rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" required placeholder="Contoh: 5000000" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Deadline</label>
                  <input type="date" name="deadline" value={formData.deadline} onChange={handleInputChange} className="w-full border border-slate-300 p-2.5 text-sm rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Lokasi</label>
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full border border-slate-300 p-2.5 text-sm rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" placeholder="Remote / Jakarta" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Durasi Proyek</label>
                  <input type="text" name="duration" value={formData.duration} onChange={handleInputChange} className="w-full border border-slate-300 p-2.5 text-sm rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" placeholder="Contoh: 1-3 Bulan" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Skills (Pisahkan dengan koma)</label>
                <input type="text" name="skills" value={formData.skills} onChange={handleInputChange} className="w-full border border-slate-300 p-2.5 text-sm rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" required placeholder="React, Next.js, TypeScript" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Level Pengalaman</label>
                <select name="experienceLevel" value={formData.experienceLevel} onChange={handleInputChange} className="w-full border border-slate-300 p-2.5 text-sm rounded-lg focus:ring-2 focus:ring-blue-600 outline-none">
                  <option value="entry">Pemula (Entry Level)</option>
                  <option value="intermediate">Menengah (Intermediate)</option>
                  <option value="expert">Ahli (Expert Level)</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-bold transition">Batal</button>
                <button type="submit" disabled={isLoading} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-bold transition shadow-sm disabled:opacity-50">
                  {isLoading ? 'Menyimpan...' : (editingId ? 'Simpan Perubahan' : 'Posting Pekerjaan')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}