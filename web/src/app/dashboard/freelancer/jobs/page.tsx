'use client';

import { useState } from 'react';
import DashboardLayout from "../../DashboardLayout";
import { 
  Search, MapPin, DollarSign, Briefcase, Clock, Filter, 
  ChevronRight, Star, Bookmark, Zap, TrendingUp, X, Users, CheckCircle2 
} from 'lucide-react';

export default function FindJobsPage() {
  const [activeTab, setActiveTab] = useState('Semua');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const categories = ['Semua', 'Web Development', 'UI/UX Design', 'Mobile App', 'Writing'];

  const [jobs] = useState([
    {
      id: 1,
      title: "Senior React Developer - Perbaikan Bug E-Commerce",
      client: "Tech Solutions Inc.",
      location: "Remote",
      budget: "Rp 5.000.000 - Rp 8.000.000",
      type: "Proyek",
      postedAt: "2 jam yang lalu",
      difficulty: "Intermediate",
      isTrending: true,
      applicants: 12,
      category: "Web Development",
      skills: ["React", "Next.js", "TypeScript"],
      description: "Kami mencari pengembang React yang berpengalaman untuk membantu tim kami menyelesaikan beberapa bug kritis di platform e-commerce kami."
    },
    {
      id: 2,
      title: "Desain UI/UX Aplikasi Mobile Kesehatan",
      client: "HealthGo Startup",
      location: "Jakarta (Hybrid)",
      budget: "Rp 150.000 / Jam",
      type: "Kontrak Per Jam",
      postedAt: "5 jam yang lalu",
      difficulty: "Expert",
      isTrending: false,
      applicants: 8,
      category: "UI/UX Design",
      skills: ["Figma", "UI/UX", "Mobile Design"],
      description: "Dibutuhkan desainer UI/UX untuk merancang 15-20 layar aplikasi kesehatan. Harus memiliki portofolio aplikasi mobile yang kuat."
    }
  ]);

  const handleApplyClick = (job: any) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  };

  const submitApplication = () => {
    setIsSuccess(true);
    setTimeout(() => {
      setIsApplyModalOpen(false);
      setIsSuccess(false);
      setSelectedJob(null);
    }, 2000);
  };

  const filteredJobs = activeTab === 'Semua' 
    ? jobs 
    : jobs.filter(job => job.category === activeTab);

  return (
    <DashboardLayout role="freelancer">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900">Cari Pekerjaan</h1>
        <p className="text-slate-500">Temukan proyek impian dan mulai bekerja hari ini</p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input type="text" placeholder="Cari pekerjaan..." className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveTab(cat)} className={`px-5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === cat ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 border border-slate-200'}`}>{cat}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white border border-slate-200 rounded-[32px] p-6 hover:border-blue-500 transition-all group relative">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full w-fit">
                    {job.type}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">{job.title}</h2>
                  <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                    <span>{job.client}</span>
                    <span className="flex items-center gap-1"><Users size={14}/> {job.applicants} Pelamar</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-600 text-sm mb-6 line-clamp-2 leading-relaxed">{job.description}</p>

              <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Budget</p>
                  <p className="text-slate-900 font-bold">{job.budget}</p>
                </div>
                <button 
                  onClick={() => handleApplyClick(job)}
                  className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all font-bold text-sm shadow-lg shadow-slate-900/10"
                >
                  Lamar Sekarang
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[32px] p-8 text-white shadow-xl">
            <h3 className="font-bold text-xl mb-2">Statistik Anda</h3>
            <div className="space-y-4 mt-6">
              <div className="flex justify-between items-center">
                <span className="text-blue-100 text-sm">Lamaran Terkirim</span>
                <span className="font-bold text-lg">14</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-100 text-sm">Menunggu Respon</span>
                <span className="font-bold text-lg">5</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* MODAL KONFIRMASI LAMARAN */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            {!isSuccess ? (
              <>
                <div className="p-8 pb-0 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-900">Konfirmasi Lamaran</h3>
                  <button onClick={() => setIsApplyModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20}/></button>
                </div>
                <div className="p-8">
                  <div className="bg-slate-50 p-4 rounded-2xl mb-6 border border-slate-100">
                    <p className="text-xs font-black text-slate-400 uppercase mb-1">Pekerjaan</p>
                    <p className="font-bold text-slate-900">{selectedJob?.title}</p>
                  </div>
                  <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                    Dengan melamar, profil dan portofolio Anda akan dikirimkan ke <span className="font-bold text-slate-900">{selectedJob?.client}</span> untuk ditinjau.
                  </p>
                  <div className="flex gap-3">
                    <button onClick={() => setIsApplyModalOpen(false)} className="flex-1 py-4 font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-all">Batal</button>
                    <button onClick={submitApplication} className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">Kirim Lamaran</button>
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