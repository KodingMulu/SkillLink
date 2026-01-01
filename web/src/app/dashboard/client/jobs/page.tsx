'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from "../../DashboardLayout";
import { MapPin, Calendar, Clock, Edit, Trash2, Users, X } from "lucide-react"; 
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '', category: '', description: '', budget: '', deadline: '',
    location: '', skills: '', duration: '', experienceLevel: 'intermediate'
  });
  const fetchJobs = async () => {
    setIsFetching(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await axios.get(`${apiUrl}/user/client/jobs`, { withCredentials: true });
      
      if (response.data.code === 200 && response.data.data) {
        const mappedJobs: Job[] = response.data.data.map((item: ApiJob) => {
          const isValidDate = (d: string | null) => d && !isNaN(new Date(d).getTime());
          return {
            id: item.id,
            title: item.title,
            category: item.category,
            description: item.description,
            location: item.location || '-',
            duration: item.duration || '-',
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
      console.error("Error fetch:", error);
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
      location: '', skills: '', duration: '', experienceLevel: 'intermediate'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
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
    if(!confirm("Yakin hapus?")) return;
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        await axios.delete(`${apiUrl}/user/client/jobs/${id}`, { withCredentials: true });
        fetchJobs();
    } catch (error) { alert("Gagal menghapus"); }
  };

  const getStatusBadge = (s: string) => s === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700';

  return (
    <DashboardLayout role="client">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Posting Proyek</h1>
          <p className="text-slate-500">Kelola semua lowongan pekerjaan Anda</p>
        </div>
        <button onClick={() => setShowPostJobModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-lg transition-all font-medium">
          + Posting Pekerjaan Baru
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100"><h2 className="font-bold text-slate-900">Daftar Lowongan Pekerjaan</h2></div>
        <div className="divide-y divide-slate-100">
          {isFetching ? <div className="p-8 text-center text-slate-500">Memuat data...</div> : jobs.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Belum ada pekerjaan yang diposting.</div>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(job.status)} uppercase`}>{job.status === 'active' ? 'Aktif' : 'Tutup'}</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-3">{job.category} • Diposting {job.postedDate}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600 mt-4">
                      {/* FIX: Hapus Icon DollarSign karena string budget sudah mengandung "Rp" */}
                      <div className="flex items-center gap-2 font-medium text-slate-900">
                        {job.budget} 
                      </div>
                      <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400" /> {job.deadline}</div>
                      <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400" /> {job.location}</div>
                      <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400" /> {job.duration}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button onClick={() => openEditModal(job)} className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(job.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Users className="w-4 h-4 text-slate-400" /> {job.applicants} Pelamar
                  </div>
                  <Link href={`/dashboard/client/jobs/${job.id}/applicants`} className="text-sm text-blue-600 hover:underline font-medium">Lihat Pelamar</Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showPostJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between z-10">
              <h2 className="text-xl font-bold text-slate-900">{editingId ? 'Edit Pekerjaan' : 'Posting Pekerjaan Baru'}</h2>
              <button onClick={closeModal}><X className="w-6 h-6 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700">Judul Pekerjaan</label>
                <input name="title" value={formData.title} onChange={handleInputChange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required placeholder="Contoh: Frontend Developer" />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700">Kategori</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required>
                  <option value="">Pilih Kategori</option>
                  <option value="web-development">Web Development</option>
                  <option value="mobile-development">Mobile Development</option>
                  <option value="ui-ux-design">UI/UX Design</option>
                  <option value="graphic-design">Graphic Design</option>
                  <option value="content-writing">Content Writing</option>
                  <option value="digital-marketing">Digital Marketing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700">Deskripsi</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" required placeholder="Deskripsikan pekerjaan..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-700">Budget (Angka)</label>
                  <input type="number" name="budget" value={formData.budget} onChange={handleInputChange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required placeholder="Contoh: 5000000" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-700">Deadline</label>
                  <input type="date" name="deadline" value={formData.deadline} onChange={handleInputChange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-700">Lokasi</label>
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Remote / Jakarta" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-700">Durasi</label>
                  <input type="text" name="duration" value={formData.duration} onChange={handleInputChange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Contoh: 3 Bulan" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700">Skills (Pisahkan koma)</label>
                <input type="text" name="skills" value={formData.skills} onChange={handleInputChange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required placeholder="React, Next.js, TypeScript" />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700">Level Pengalaman</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2"><input type="radio" name="experienceLevel" value="beginner" checked={formData.experienceLevel === 'beginner'} onChange={handleInputChange} /> Pemula</label>
                  <label className="flex items-center gap-2"><input type="radio" name="experienceLevel" value="intermediate" checked={formData.experienceLevel === 'intermediate'} onChange={handleInputChange} /> Menengah</label>
                  <label className="flex items-center gap-2"><input type="radio" name="experienceLevel" value="expert" checked={formData.experienceLevel === 'expert'} onChange={handleInputChange} /> Ahli</label>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button type="button" onClick={closeModal} className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium">Batal</button>
                <button type="submit" disabled={isLoading} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg transition font-medium">{isLoading ? 'Menyimpan...' : (editingId ? 'Simpan Perubahan' : 'Posting')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}