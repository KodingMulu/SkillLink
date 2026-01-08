'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from "../DashboardLayout";
import { 
  Users, FileText, DollarSign, Briefcase, ChevronRight, X
} from "lucide-react";

interface DashboardData {
    stats: {
        totalSpent: number;
        openJobs: number;
        newApplicants: number;
        completedContracts: number;
    };
    recentApplicants: {
        name: string;
        role: string;
        appliedFor: string;
        date: string;
        match: number;
    }[];
    activeContracts: {
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
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    budget: '',
    deadline: '',
    experienceLevel: 'intermediate'
  });

  useEffect(() => {
    const fetchDashboard = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/user/client/dashboard`, {
                withCredentials: true 
            });
            setDashboardData(res.data.data);
        } catch (error) {
            console.error("Dashboard Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchDashboard();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await axios.post('/api/client/jobs/create', formData, { withCredentials: true });
        alert('Pekerjaan berhasil diposting!');
        setShowPostJobModal(false);
        window.location.reload(); 
    } catch (error) {
        console.error(error);
        alert('Gagal memposting pekerjaan');
    }
  };

  if (loading) return <div className="p-8 text-center">Memuat Dashboard...</div>;

  const stats = [
    { 
        label: "Total Pengeluaran", 
        value: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(dashboardData?.stats.totalSpent || 0), 
        icon: DollarSign, 
        color: "text-emerald-600", 
        bg: "bg-emerald-50" 
    },
    { label: "Lowongan Aktif", value: dashboardData?.stats.openJobs || 0, icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Pelamar Baru", value: dashboardData?.stats.newApplicants || 0, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Kontrak Selesai", value: dashboardData?.stats.completedContracts || 0, icon: FileText, color: "text-slate-600", bg: "bg-slate-100" },
  ];

  return (
    <DashboardLayout role="client">
      <div className="flex justify-between items-end mb-8">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard Klien</h1>
            <p className="text-slate-500">Kelola proyek dan temukan talenta terbaik.</p>
        </div>
        <button 
            onClick={() => setShowPostJobModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 flex items-center gap-2"
        >
            <Briefcase className="w-5 h-5" />
            Posting Pekerjaan
        </button>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                 <p className="text-sm text-slate-500">{stat.label}</p>
                 <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-bold text-slate-900">Pelamar Terbaru</h2>
              <button className="text-sm text-blue-600 hover:underline">Lihat Semua</button>
            </div>
            <div className="divide-y divide-slate-100">
                <div className="bg-slate-50 px-6 py-3 grid grid-cols-12 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <div className="col-span-5">Talenta</div>
                    <div className="col-span-4">Melamar Untuk</div>
                    <div className="col-span-2">Match</div>
                    <div className="col-span-1"></div>
                </div>

              {dashboardData?.recentApplicants.length === 0 ? (
                  <div className="p-6 text-center text-slate-500">Belum ada pelamar baru.</div>
              ) : (
                  dashboardData?.recentApplicants.map((applicant, idx) => (
                    <div key={idx} className="px-6 py-4 grid grid-cols-12 items-center hover:bg-slate-50 transition-colors">
                      <div className="col-span-5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold uppercase">
                            {applicant.name.charAt(0)}
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-900 text-sm">{applicant.name}</h4>
                            <p className="text-xs text-slate-500">{applicant.role} • {applicant.date}</p>
                        </div>
                      </div>
                      <div className="col-span-4 text-sm text-slate-600 font-medium truncate pr-2">{applicant.appliedFor}</div>
                      <div className="col-span-2">
                         <span className={`px-2 py-1 rounded-md text-xs font-bold ${applicant.match > 90 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                            {applicant.match}% Match
                         </span>
                      </div>
                      <div className="col-span-1 text-right">
                        <button className="text-slate-400 hover:text-slate-600"><ChevronRight className="w-5 h-5" /></button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-bold text-slate-900 mb-4">Kontrak Berjalan</h2>
            <div className="space-y-4">
               {dashboardData?.activeContracts.length === 0 ? (
                   <p className="text-sm text-slate-500">Tidak ada kontrak aktif.</p>
               ) : (
                   dashboardData?.activeContracts.map((contract, idx) => (
                       <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 uppercase">
                                      {contract.freelancerName?.charAt(0) || 'F'}
                                  </div>
                                  <span className="text-sm font-semibold text-slate-900">{contract.freelancerName}</span>
                              </div>
                              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">Active</span>
                          </div>
                          <p className="text-xs text-slate-500 mb-3 truncate">Project: {contract.projectTitle}</p>
                          <div className="flex justify-between text-[10px] mb-1">
                            <span className="text-slate-500">Progress</span>
                            <span className="font-bold text-blue-600">{contract.progress}%</span>
                          </div>
                          <div className="w-full bg-white rounded-full h-1.5 mb-1">
                              <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${contract.progress}%` }}></div>
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-400 mt-2">
                              <span>Deadline: {contract.deadline}</span>
                              <span className="font-bold text-slate-700">
                                  {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(contract.budget)}
                              </span>
                          </div>
                       </div>
                   ))
               )}
            </div>
          </section>
        </div>
      </div>

      {showPostJobModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Posting Pekerjaan Baru</h2>
                <p className="text-sm text-slate-500">Isi detail pekerjaan untuk mulai mencari talenta.</p>
              </div>
              <button onClick={() => setShowPostJobModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Judul Pekerjaan</label>
                <input name="title" onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none" placeholder="Contoh: UI/UX Designer untuk Aplikasi E-commerce" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Kategori</label>
                  <select name="category" onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none">
                    <option value="">Pilih Kategori</option>
                    <option value="Design & Creative">Design & Creative</option>
                    <option value="Development & IT">Development & IT</option>
                    <option value="Writing">Writing</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Anggaran (Rp)</label>
                  <input name="budget" type="number" onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="Contoh: 5000000" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Deadline</label>
                    <input name="deadline" type="date" onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Level Pengalaman</label>
                    <select name="experienceLevel" onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none">
                        <option value="entry">Entry Level</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="expert">Expert</option>
                    </select>
                  </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Deskripsi Pekerjaan</label>
                <textarea name="description" rows={4} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="Jelaskan detail tugas dan kualifikasi..."></textarea>
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowPostJobModal(false)} className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">Batal</button>
                <button type="submit" className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">Posting Sekarang</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}