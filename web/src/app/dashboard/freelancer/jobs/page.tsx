'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from "../../DashboardLayout";
import {
  Search, Users, CheckCircle2, X, Loader2, Sparkles,
  DollarSign, Clock, Send, Filter, Briefcase, ChevronRight,
  TrendingUp, ArrowRight
} from 'lucide-react';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';

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

  const categories = ['Semua', 'Web Development', 'UI/UX Design', 'Mobile App', 'Writing', 'DevOps'];

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
    if (diffInMinutes < 60) return `${diffInMinutes} menit lalu`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} jam lalu`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} hari lalu`;
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchJobs();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, activeTab]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const apiUrl = getApiUrl();
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
      console.error("Fetch Jobs Error:", error);
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
    if (!selectedJob) return;
    if (!coverLetter.trim()) return alert("Mohon tuliskan cover letter / surat lamaran Anda.");
    if (!bidAmount || isNaN(Number(bidAmount)) || Number(bidAmount) <= 0) {
      return alert("Masukkan nominal penarikan/tawaran harga yang valid.");
    }

    setIsSubmitting(true);
    try {
      const apiUrl = getApiUrl();

      const response = await axios.post(`${apiUrl}/user/freelancer/proposals`, {
        jobId: selectedJob.id,
        coverLetter: coverLetter.trim(),
        bidAmount: Number(bidAmount)
      }, {
        withCredentials: true
      });

      if (response.status === 201 || response.data.code === 201 || response.data.code === 200) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsApplyModalOpen(false);
          setIsSuccess(false);
          setSelectedJob(null);
          fetchJobs();
        }, 1800);
      } else {
        alert(response.data.message || "Gagal mengirim lamaran");
      }

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
      {/* Header Banner Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Cari Pekerjaan</h1>
            <p className="text-slate-500 text-sm sm:text-base mt-1">Temukan proyek impian yang sesuai dengan keahlianmu dan ajukan penawaran terbaik</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan judul proyek atau kata kunci keahlian..."
            className="w-full pl-12 pr-10 py-4 bg-white border border-slate-200/90 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium text-slate-900 shadow-sm transition-all text-sm sm:text-base"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full text-slate-400 transition"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap active:scale-95 ${activeTab === cat
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 border border-blue-600'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Job List */}
        <div className="lg:col-span-2 space-y-5">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-[2rem] p-6 space-y-4 animate-pulse">
                <div className="flex justify-between">
                  <div className="h-6 bg-slate-100 rounded-lg w-1/3"></div>
                  <div className="h-6 bg-slate-100 rounded-lg w-1/6"></div>
                </div>
                <div className="h-4 bg-slate-100 rounded w-full"></div>
                <div className="h-4 bg-slate-100 rounded w-2/3"></div>
              </div>
            ))
          ) : jobs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
                <Search size={32} />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-1">Tidak ada pekerjaan ditemukan</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto mb-4">
                Coba ubah kata kunci pencarian atau pilih kategori lain.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setActiveTab('Semua'); }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            jobs.map((job) => (
              <div
                key={job.id}
                className="group bg-white border border-slate-200/90 rounded-[2rem] p-6 sm:p-8 hover:border-blue-500/80 hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              >
                <div className="flex justify-between items-start gap-4 mb-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {job.isRecommended && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                          <Sparkles size={12} className="text-emerald-500" />
                          Cocok Untukmu
                        </span>
                      )}
                      {job.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-2">
                      {job.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-semibold">
                      <span className="text-slate-800 font-bold bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                        🏢 {job.companyName}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock size={14} className="text-slate-400" /> {getRelativeTime(job.createdAt)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Users size={14} className="text-slate-400" /> {job.applicantCount} Pelamar
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed font-medium">
                  {job.description}
                </p>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estimasi Budget</p>
                    <p className="text-xl sm:text-2xl font-black text-slate-900">{formatRupiah(job.budget)}</p>
                  </div>
                  <button
                    onClick={() => handleApplyClick(job)}
                    className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl transition-all font-bold text-sm shadow-lg shadow-slate-900/10 hover:shadow-blue-600/25 active:scale-95"
                  >
                    <span>Lamar Sekarang</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Dynamic Statistics Card */}
        <aside className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 rounded-[2rem] p-6 sm:p-8 text-white shadow-xl relative overflow-hidden sticky top-6">
            <div aria-hidden="true" className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-blue-200 mb-3 backdrop-blur-md border border-white/10">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Aktivitas Lamaran</span>
                </div>
                <h3 className="font-black text-2xl text-white">Statistik Anda</h3>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                  Pantau terus status lamaran proyek yang telah kamu kirimkan ke klien.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md flex items-center justify-between">
                  <div>
                    <p className="text-xs text-blue-200 font-medium">Total Lamaran Terkirim</p>
                    <p className="text-2xl font-black text-white mt-0.5">{stats.applied}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-300 font-bold border border-blue-400/20">
                    <Send size={20} />
                  </div>
                </div>

                <div className="p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md flex items-center justify-between">
                  <div>
                    <p className="text-xs text-amber-200 font-medium">Menunggu Respon Klien</p>
                    <p className="text-2xl font-black text-amber-300 mt-0.5">{stats.pending}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300 font-bold border border-amber-400/20">
                    <Clock size={20} />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-400/20 text-xs text-blue-100 leading-relaxed">
                💡 <strong>Tips Sukses:</strong> Lampirkan tawaran harga kompetitif dan jelaskan pengalaman relevan Anda pada <em>Cover Letter</em> untuk meningkatkan peluang diterima.
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Proposal Application Modal */}
      {isApplyModalOpen && selectedJob && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200 my-8">
            {!isSuccess ? (
              <>
                <div className="p-6 sm:p-8 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                      Pengajuan Proposal
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-2 line-clamp-1">{selectedJob.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Klien: {selectedJob.companyName}</p>
                  </div>
                  <button
                    onClick={() => setIsApplyModalOpen(false)}
                    className="p-2 hover:bg-slate-200/60 rounded-full text-slate-400 transition"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 sm:p-8 space-y-5">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Penawaran Harga (IDR)</label>
                      <button
                        type="button"
                        onClick={() => setBidAmount(selectedJob.budget.toString())}
                        className="text-[11px] font-bold text-blue-600 hover:underline"
                      >
                        Gunakan Budget Klien
                      </button>
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">Rp</span>
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none font-bold text-slate-900 transition"
                        placeholder="0"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1.5 flex justify-between font-medium">
                      <span>Estimasi Budget Klien:</span>
                      <strong className="text-slate-700">{formatRupiah(selectedJob.budget)}</strong>
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Cover Letter / Surat Lamaran</label>
                    <textarea
                      rows={5}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none font-medium text-sm text-slate-900 resize-none transition leading-relaxed"
                      placeholder="Jelaskan mengapa Anda pengembang/freelancer paling tepat untuk menyelesaikan proyek ini..."
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Minimal tuliskan ringkasan solusi atau portfolio terkait.</p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setIsApplyModalOpen(false)}
                      disabled={isSubmitting}
                      className="flex-1 py-3.5 font-bold text-slate-500 hover:bg-slate-100 rounded-2xl transition-all disabled:opacity-50 text-sm"
                    >
                      Batal
                    </button>
                    <button
                      onClick={submitApplication}
                      disabled={isSubmitting}
                      className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/25 disabled:opacity-70 flex justify-center items-center gap-2 text-sm active:scale-95"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          <span>Mengirim...</span>
                        </>
                      ) : (
                        <>
                          <span>Kirim Lamaran</span>
                          <Send size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-12 text-center animate-in fade-in">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 size={44} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Lamaran Terkirim!</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">
                  Proposal Anda telah sukses disampaikan ke klien. Pantau responnya melalui dashboard.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}