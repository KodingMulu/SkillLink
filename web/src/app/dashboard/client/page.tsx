'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from "../DashboardLayout";
import { getApiUrl } from '@/lib/api';
import { 
  Users, FileText, DollarSign, Briefcase, ChevronRight, X, Plus, Clock, ArrowUpRight
} from "lucide-react";

interface DashboardData {
    stats: {
        totalSpent: number;
        openJobs: number;
        newApplicants: number;
        completedContracts: number;
    };
    recentApplicants: {
        id: string;
        name: string;
        role: string;
        appliedFor: string;
        date: string;
        match: number;
    }[];
    activeContracts: {
        id: string;
        freelancerName: string;
        projectTitle: string;
        progress: number;
        deadline: string;
        budget: number;
    }[];
}

export default function ClientDashboard() {
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    budget: '',
    deadline: '',
    location: 'Remote',
    duration: '1-3 bulan',
    experienceLevel: 'intermediate',
    skills: ''
  });

  const fetchDashboard = async () => {
    try {
        const apiUrl = getApiUrl();
        const res = await axios.get(`${apiUrl}/user/client/dashboard`, {
            withCredentials: true 
        });
        setDashboardData(res.data.data);
    } catch (error) {
        console.error("Dashboard Fetch Error:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        const apiUrl = getApiUrl();
        const payload = {
            ...formData,
            budget: Number(formData.budget),
            deadline: formData.deadline ? new Date(formData.deadline).toISOString() : new Date().toISOString(),
        };
        await axios.post(`${apiUrl}/user/client/jobs`, payload, { withCredentials: true });
        alert('Pekerjaan berhasil diposting!');
        setShowPostJobModal(false);
        setFormData({
            title: '',
            category: '',
            description: '',
            budget: '',
            deadline: '',
            location: 'Remote',
            duration: '1-3 bulan',
            experienceLevel: 'intermediate',
            skills: ''
        });
        fetchDashboard();
    } catch (error) {
        console.error("Posting Error:", error);
        if (axios.isAxiosError(error)) {
            alert(error.response?.data?.message || 'Gagal memposting pekerjaan');
        } else {
            alert('Gagal memposting pekerjaan');
        }
    } finally {
        setIsSubmitting(false);
    }
  };

  const formatRupiah = (val: number) => 
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);

  if (loading) {
    return (
      <DashboardLayout role="client">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-500 text-sm font-medium">Memuat Dashboard Klien...</p>
        </div>
      </DashboardLayout>
    );
  }

  const stats = [
    { 
        label: "Total Pengeluaran", 
        value: formatRupiah(dashboardData?.stats.totalSpent || 0), 
        icon: DollarSign, 
        color: "text-emerald-600", 
        bg: "bg-emerald-50 border-emerald-100" 
    },
    { label: "Lowongan Aktif", value: dashboardData?.stats.openJobs || 0, icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
    { label: "Pelamar Baru", value: dashboardData?.stats.newApplicants || 0, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-100" },
    { label: "Kontrak Selesai", value: dashboardData?.stats.completedContracts || 0, icon: FileText, color: "text-slate-700", bg: "bg-slate-100 border-slate-200" },
  ];

  return (
    <DashboardLayout role="client">
      {/* Top Welcome Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 md:p-8 text-white mb-8 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full text-xs text-blue-400 font-semibold border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span> Client Workspace
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-50">Dashboard Klien</h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Kelola lowongan pekerjaan, tinjau pelamar, dan pantau progres proyek aktif Anda.
            </p>
          </div>
          <button 
            onClick={() => setShowPostJobModal(true)}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 text-sm shadow-md"
          >
            <Plus className="w-4 h-4" />
            Posting Pekerjaan Baru
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl border ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                 <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                 <h3 className="text-xl font-bold text-slate-900 mt-0.5">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Pelamar Terbaru */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="font-bold text-slate-900 text-base">Pelamar Terbaru</h2>
                <p className="text-xs text-slate-500">Proposal pekerjaan yang baru saja masuk</p>
              </div>
              <a href="/dashboard/client/jobs" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                Lihat Lowongan <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="divide-y divide-slate-100">
              {dashboardData?.recentApplicants.length === 0 ? (
                  <div className="p-10 text-center text-slate-500">
                    <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-medium">Belum ada pelamar baru</p>
                    <p className="text-xs text-slate-400 mt-1">Proposal pelamar akan muncul di sini setelah Anda memposting proyek</p>
                  </div>
              ) : (
                  dashboardData?.recentApplicants.map((applicant) => (
                    <div key={applicant.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm uppercase">
                            {applicant.name.charAt(0)}
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm">{applicant.name}</h4>
                            <p className="text-xs text-slate-500">{applicant.role} • <span className="text-blue-600 font-medium">{applicant.appliedFor}</span></p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                          {applicant.date}
                        </span>
                        <a href={`/dashboard/client/jobs`} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Kontrak Berjalan */}
        <div className="space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-slate-900 text-base">Kontrak Berjalan</h2>
              <span className="text-xs text-slate-500 font-medium">Active Projects</span>
            </div>
            <div className="space-y-3">
               {dashboardData?.activeContracts.length === 0 ? (
                   <div className="p-6 text-center text-slate-500 border border-dashed border-slate-200 rounded-xl">
                      <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs font-medium">Tidak ada kontrak aktif saat ini</p>
                   </div>
               ) : (
                   dashboardData?.activeContracts.map((contract) => (
                       <div key={contract.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                                      {contract.freelancerName?.charAt(0) || 'F'}
                                  </div>
                                  <span className="text-xs font-bold text-slate-900">{contract.freelancerName}</span>
                              </div>
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Berjalan</span>
                          </div>
                          <p className="text-xs text-slate-600 mb-2 font-medium truncate">{contract.projectTitle}</p>
                          
                          <div className="flex justify-between text-[11px] mb-1 font-semibold">
                            <span className="text-slate-500">Progres</span>
                            <span className="text-blue-600">{contract.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-1.5 mb-3">
                              <div className="bg-blue-600 h-1.5 rounded-full transition-all" style={{ width: `${contract.progress}%` }}></div>
                          </div>
                          
                          <div className="flex justify-between items-center text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                              <span>Deadline: {contract.deadline}</span>
                              <span className="font-bold text-slate-900">{formatRupiah(contract.budget)}</span>
                          </div>
                       </div>
                   ))
               )}
            </div>
          </section>
        </div>
      </div>

      {/* Modal Posting Pekerjaan Baru */}
      {showPostJobModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 shadow-xl">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Posting Pekerjaan Baru</h2>
                <p className="text-xs text-slate-500">Lengkapi informasi pekerjaan untuk mempublikasikannya.</p>
              </div>
              <button onClick={() => setShowPostJobModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Judul Pekerjaan</label>
                <input name="title" value={formData.title} onChange={handleInputChange} required className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none" placeholder="Contoh: Senior React Frontend Developer" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Kategori</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} required className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none">
                    <option value="">Pilih Kategori</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile Development">Mobile Development</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Content Writing">Content Writing</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Anggaran (Rp)</label>
                  <input name="budget" type="number" value={formData.budget} onChange={handleInputChange} required className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none" placeholder="Contoh: 5000000" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tenggat Waktu</label>
                    <input name="deadline" type="date" value={formData.deadline} onChange={handleInputChange} className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Level Pengalaman</label>
                    <select name="experienceLevel" value={formData.experienceLevel} onChange={handleInputChange} className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none">
                        <option value="entry">Entry Level</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="expert">Expert</option>
                    </select>
                  </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Keahlian (Pisahkan dengan koma)</label>
                <input name="skills" value={formData.skills} onChange={handleInputChange} className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none" placeholder="React, TypeScript, TailwindCSS" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Deskripsi Pekerjaan</label>
                <textarea name="description" rows={4} value={formData.description} onChange={handleInputChange} required className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none" placeholder="Jelaskan detail tugas, ruang lingkup, dan kualifikasi..."></textarea>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowPostJobModal(false)} className="flex-1 py-2.5 px-4 rounded-lg font-bold text-slate-700 border border-slate-300 hover:bg-slate-50 text-sm transition-colors">Batal</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 px-4 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 text-sm transition-colors shadow-sm disabled:opacity-50">
                  {isSubmitting ? 'Memproses...' : 'Posting Sekarang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}