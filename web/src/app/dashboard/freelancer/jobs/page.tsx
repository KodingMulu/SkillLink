'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from "../../DashboardLayout";
import {
  Search, Users, CheckCircle2, X, Loader2
} from 'lucide-react';
import axios from 'axios';

interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  tags: string[];
  companyName: string;
  applicantCount: number;
  createdAt: string;
  matchScore: number;
  isRecommended: boolean;
}

interface JobStats {
  applied: number;
  pending: number;
}

interface ApiResponse {
  message: string;
  code: number;
  data: {
    jobs: Job[];
    stats: JobStats;
  };
}

export default function FindJobsPage() {
  const [activeTab, setActiveTab] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<JobStats>({ applied: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState('');

  const categories = ['Semua', 'Web Development', 'UI/UX Design', 'Mobile App', 'Writing'];

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Baru saja';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} hari yang lalu`;
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchJobs();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, activeTab]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await axios.get<ApiResponse>(`${apiUrl}/user/freelancer/jobs`, {
        params: {
          q: searchQuery,
          category: activeTab
        },
        withCredentials: true
      });

      if (response.data.code === 200) {
        setJobs(response.data.data.jobs);
        setStats(response.data.data.stats);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = (job: Job) => {
    setSelectedJob(job);
    setBidAmount(job.budget.toString());
    setCoverLetter('');
    setIsApplyModalOpen(true);
    setIsSuccess(false);
  };

  const submitApplication = async () => {
    if (!selectedJob || !coverLetter || !bidAmount) return alert("Mohon lengkapi data lamaran");

    setIsSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      await axios.post(`${apiUrl}/user/freelancer/proposals`, {
        jobId: selectedJob.id,
        coverLetter,
        bidAmount
      }, {
        withCredentials: true
      });

      setIsSuccess(true);

      setTimeout(() => {
        setIsApplyModalOpen(false);
        setIsSuccess(false);
        setSelectedJob(null);
        fetchJobs();
      }, 2000);

    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Gagal mengirim lamaran");
      } else {
        alert("Terjadi kesalahan sistem");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout role="freelancer">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900">Cari Pekerjaan</h1>
        <p className="text-slate-500">Temukan proyek impian dan mulai bekerja hari ini</p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pekerjaan berdasarkan judul atau skill..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === cat
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-[32px] p-6 space-y-4 animate-pulse">
                <div className="flex justify-between">
                  <div className="h-6 bg-slate-100 rounded w-1/3"></div>
                  <div className="h-6 bg-slate-100 rounded w-1/6"></div>
                </div>
                <div className="h-4 bg-slate-100 rounded w-full"></div>
                <div className="h-4 bg-slate-100 rounded w-2/3"></div>
              </div>
            ))
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-[32px] border border-slate-200">
              <p className="text-slate-500 font-medium">Tidak ada pekerjaan ditemukan.</p>
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="bg-white border border-slate-200 rounded-[32px] p-6 hover:border-blue-500 transition-all group relative">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {job.tags.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full w-fit">
                          {tag}
                        </span>
                      ))}
                      {job.isRecommended && (
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full w-fit">
                          Recommended
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 mb-1">{job.title}</h2>
                    <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                      <span>{job.companyName}</span>
                      <span>•</span>
                      <span>{getRelativeTime(job.createdAt)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Users size={14} /> {job.applicantCount} Pelamar</span>
                    </div>
                  </div>
                </div>

                <p className="text-slate-600 text-sm mb-6 line-clamp-2 leading-relaxed">{job.description}</p>

                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Budget</p>
                    <p className="text-slate-900 font-bold">{formatRupiah(job.budget)}</p>
                  </div>
                  <button
                    onClick={() => handleApplyClick(job)}
                    className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all font-bold text-sm shadow-lg shadow-slate-900/10"
                  >
                    Lamar Sekarang
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <aside className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[32px] p-8 text-white shadow-xl sticky top-6">
            <h3 className="font-bold text-xl mb-2">Statistik Anda</h3>
            <p className="text-blue-100 text-xs mb-6">Pantau aktivitas lamaran pekerjaan Anda secara real-time.</p>
            <div className="space-y-4 mt-6">
              <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl border border-white/10">
                <span className="text-blue-50 text-sm">Lamaran Terkirim</span>
                <span className="font-bold text-xl">{stats.applied}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl border border-white/10">
                <span className="text-blue-50 text-sm">Menunggu Respon</span>
                <span className="font-bold text-xl">{stats.pending}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {isApplyModalOpen && selectedJob && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            {!isSuccess ? (
              <>
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Ajukan Lamaran</h3>
                    <p className="text-xs text-slate-500">{selectedJob.title}</p>
                  </div>
                  <button onClick={() => setIsApplyModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20} /></button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Penawaran Harga (Rp)</label>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                      placeholder="Masukkan harga penawaran"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Budget Klien: {formatRupiah(selectedJob.budget)}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Cover Letter</label>
                    <textarea
                      rows={5}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium resize-none"
                      placeholder="Jelaskan mengapa Anda cocok untuk pekerjaan ini..."
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setIsApplyModalOpen(false)}
                      disabled={isSubmitting}
                      className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all disabled:opacity-50"
                    >
                      Batal
                    </button>
                    <button
                      onClick={submitApplication}
                      disabled={isSubmitting}
                      className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-70 flex justify-center items-center gap-2"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Kirim Lamaran"}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-12 text-center animate-in fade-in">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Berhasil!</h3>
                <p className="text-slate-500">Lamaran Anda telah terkirim ke klien.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}