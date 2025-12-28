'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from "../../DashboardLayout";
import { Briefcase, MapPin, Calendar, DollarSign, Clock, Edit, Trash2, Eye, Users, X } from "lucide-react";
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
  _count?: {
    proposals: number;
  };
}

export default function JobsPage() {
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    budget: '',
    deadline: '',
    location: '',
    skills: '',
    duration: '',
    experienceLevel: 'intermediate'
  });

  const fetchJobs = async () => {
    setIsFetching(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await axios.get(`${apiUrl}/user/client/jobs`, { withCredentials: true });
      if (response.data.code === 200) {
        const mappedJobs: Job[] = response.data.data.map((item: ApiJob) => {
          const isValidDate = (dateString: string | null) => {
            return dateString && !isNaN(new Date(dateString).getTime());
          };

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
              ? new Date(item.createdAt).toLocaleDateString('id-ID')
              : '-',
            budget: `Rp ${item.budget.toLocaleString('id-ID')}`,
            budgetRaw: item.budget,
            deadline: isValidDate(item.deadline)
              ? new Date(item.deadline!).toLocaleDateString('id-ID')
              : '-',
            deadlineRaw: isValidDate(item.deadline)
              ? new Date(item.deadline!).toISOString().split('T')[0]
              : '',
          };
        });

        setJobs(mappedJobs);
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      if (editingId) {
        await axios.put(`${apiUrl}/user/client/jobs/${editingId}`, formData, { withCredentials: true });
        alert('Pekerjaan berhasil diperbarui!');
      } else {
        await axios.post(`${apiUrl}/user/client/jobs`, formData, { withCredentials: true });
        alert('Pekerjaan berhasil diposting!');
      }

      closeModal();
      fetchJobs();

    } catch (error) {
      console.error("Error submit job:", error);
      let msg = "Terjadi kesalahan.";
      // Fix: Type checking error axios
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (job: Job) => {
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
    setShowModal(true);
  };

  const handleDeleteClick = async (jobId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pekerjaan ini? Data pelamar juga akan terhapus.")) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      await axios.delete(`${apiUrl}/user/client/jobs/${jobId}`, { withCredentials: true });

      alert("Pekerjaan berhasil dihapus.");
      fetchJobs();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Gagal menghapus pekerjaan.");
    }
  };

  const handleViewClick = (job: Job) => {
    setSelectedJob(job);
    setShowViewModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      title: '', category: '', description: '', budget: '', deadline: '',
      location: '', skills: '', duration: '', experienceLevel: 'intermediate'
    });
  };

  // --- Helpers UI ---
  const getStatusBadge = (status: string) => status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700';
  const getStatusText = (status: string) => status === 'active' ? 'Aktif' : 'Ditutup';

  return (
    <DashboardLayout role="client">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Posting Proyek</h1>
          <p className="text-slate-500">Kelola semua lowongan pekerjaan Anda</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-lg shadow-blue-600/20 transition-all"
        >
          + Posting Pekerjaan Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 mb-1">Total Lowongan</p>
          <p className="text-3xl font-bold text-slate-900">{jobs.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 mb-1">Lowongan Aktif</p>
          <p className="text-3xl font-bold text-emerald-600">{jobs.filter(j => j.status === 'active').length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 mb-1">Total Pelamar</p>
          <p className="text-3xl font-bold text-blue-600">{jobs.reduce((sum, j) => sum + j.applicants, 0)}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 mb-1">Lowongan Ditutup</p>
          <p className="text-3xl font-bold text-slate-600">{jobs.filter(j => j.status === 'closed').length}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="font-bold text-slate-900">Daftar Lowongan Pekerjaan</h2>
        </div>

        <div className="divide-y divide-slate-100">
          {isFetching ? (
            <div className="p-8 text-center text-slate-500">Memuat data pekerjaan...</div>
          ) : jobs.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Belum ada pekerjaan yang diposting.</div>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(job.status)}`}>
                        {getStatusText(job.status)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mb-3">{job.category} • Diposting {job.postedDate}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <DollarSign className="w-4 h-4 text-slate-400" />
                        <span>{job.budget}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>{job.deadline}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>{job.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleViewClick(job)}
                      className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors" title="Lihat Detail"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditClick(job)}
                      className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors" title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(job.id)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors" title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-700">{job.applicants} Pelamar</span>
                  </div>
                  <Link
                    href={`/dashboard/client/jobs/${job.id}/applicants`}
                    className="text-sm text-blue-600 hover:underline font-medium"
                  >
                    Lihat Pelamar
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {editingId ? 'Edit Pekerjaan' : 'Posting Pekerjaan Baru'}
                </h2>
                <p className="text-sm text-slate-500 mt-1">Isi detail di bawah ini</p>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-lg transition">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Judul Pekerjaan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Contoh: Frontend Developer untuk Aplikasi E-Commerce"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
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
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Deskripsi Pekerjaan <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Jelaskan detail pekerjaan, tanggung jawab, dan deliverables..."
                  rows={5}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Budget (Rp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    placeholder="5000000"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Deadline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Lokasi
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Remote / Jakarta"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Durasi Proyek
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="2 Bulan"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Skills yang Dibutuhkan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="React, Next.js, TypeScript"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-2">Pisahkan dengan koma</p>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-lg shadow-blue-600/20 flex items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? 'Menyimpan...' : (editingId ? 'Simpan Perubahan' : 'Posting Pekerjaan')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViewModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setShowViewModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full text-slate-400"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedJob.title}</h2>
            <div className="flex gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase">{selectedJob.category}</span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full uppercase">{selectedJob.status === 'active' ? 'Aktif' : 'Tutup'}</span>
            </div>

            <div className="space-y-4 text-sm text-slate-600">
              <div className="grid grid-cols-2 gap-4">
                <p><strong>Budget:</strong> {selectedJob.budget}</p>
                <p><strong>Deadline:</strong> {selectedJob.deadline}</p>
                <p><strong>Lokasi:</strong> {selectedJob.location}</p>
                <p><strong>Durasi:</strong> {selectedJob.duration}</p>
              </div>

              <div>
                <strong>Skills:</strong>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedJob.skills.map((s, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-100 rounded text-xs border border-slate-200">{s}</span>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <strong>Deskripsi:</strong>
                <p className="mt-2 whitespace-pre-line leading-relaxed text-slate-700">{selectedJob.description}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t flex justify-end">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}