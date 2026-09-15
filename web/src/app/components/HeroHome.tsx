'use client';

import { Award, Briefcase, DollarSign, Users, Search, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getApiUrl } from "@/lib/api";

const AnimatedNumber = ({ value }: { value: number | string }) => {
     const strVal = String(value);
     const numericValue = parseInt(strVal.replace(/\D/g, '')) || 0;
     const suffix = strVal.replace(/[0-9]/g, '');

     const [count, setCount] = useState(0);

     useEffect(() => {
          let startTimestamp: number | null = null;
          const duration = 1200;

          const step = (timestamp: number) => {
               if (!startTimestamp) startTimestamp = timestamp;
               const progress = Math.min((timestamp - startTimestamp) / duration, 1);
               const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
               setCount(Math.floor(easeProgress * numericValue));

               if (progress < 1) {
                    window.requestAnimationFrame(step);
               }
          };

          window.requestAnimationFrame(step);
     }, [numericValue]);

     return (
          <span>
               {count}
               {suffix}
          </span>
     );
};

interface DbStats {
     totalJobs: number;
     totalFreelancers: number;
     totalClients: number;
     completedProjects: number;
     rating: number;
}

export default function HeroHome() {
     const router = useRouter();
     const [searchQuery, setSearchQuery] = useState('');
     const [dbStats, setDbStats] = useState<DbStats>({
          totalJobs: 0,
          totalFreelancers: 0,
          totalClients: 0,
          completedProjects: 0,
          rating: 4.9
     });

     useEffect(() => {
          const fetchLiveStats = async () => {
               try {
                    const res = await axios.get(getApiUrl('/public/stats'));
                    if (res.data?.data) {
                         setDbStats(res.data.data);
                    }
               } catch (error) {
                    console.error("Failed to load public stats:", error);
               }
          };
          fetchLiveStats();
     }, []);

     const handleSearch = (e: React.FormEvent) => {
          e.preventDefault();
          if (searchQuery.trim()) {
               router.push(`/auth/register`);
          }
     };

     const stats = [
          { icon: Briefcase, value: `${dbStats.totalJobs}`, label: "Proyek Terdaftar", color: "text-blue-600 bg-blue-50 border-blue-100" },
          { icon: Users, value: `${dbStats.totalFreelancers}`, label: "Talenta Mahasiswa & Profesional", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
          { icon: Award, value: `${dbStats.completedProjects}`, label: "Proyek Selesai", color: "text-purple-600 bg-purple-50 border-purple-100" },
          { icon: DollarSign, value: `${dbStats.rating}★`, label: "Rating Kepuasan Klien", color: "text-amber-600 bg-amber-50 border-amber-100" }
     ];

     return (
          <section className="pt-32 pb-16 px-4 bg-slate-50 relative border-b border-slate-200/60">
               <div className="max-w-6xl mx-auto text-center relative z-10 space-y-8">

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
                         Hubungkan Talenta dengan Proyek Industri
                    </h1>

                    <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                         Platform terpercaya untuk mahasiswa dan profesional membangun portofolio terverifikasi, mengerjakan proyek nyata, dan mengelola transaksi secara aman.
                    </p>

                    <div className="max-w-2xl mx-auto space-y-4 pt-2">
                         <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-md">
                              <div className="flex-1 flex items-center pl-3 gap-2">
                                   <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                   <input
                                        type="text"
                                        placeholder="Cari keahlian (cth. React, Graphic Design, Mobile App)..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full py-2 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                                   />
                              </div>
                              <button
                                   type="submit"
                                   className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition shadow-sm flex items-center justify-center gap-2"
                              >
                                   <span>Cari Proyek</span>
                                   <ArrowRight className="w-4 h-4" />
                              </button>
                         </form>

                         <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500 pt-2">
                              <span className="flex items-center gap-1.5">
                                   <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Bebas Biaya Pendaftaran
                              </span>
                              <span className="flex items-center gap-1.5">
                                   <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Sistem Escrow Terjamin
                              </span>
                              <span className="flex items-center gap-1.5">
                                   <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Portofolio Otomatis
                              </span>
                         </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                         <Link
                              href="/auth/register?role=FREELANCER"
                              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition shadow-sm"
                         >
                              Mulai Sebagai Freelancer
                         </Link>
                         <Link
                              href="/auth/register?role=CLIENT"
                              className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm border border-slate-300 rounded-xl transition shadow-sm"
                         >
                              Rekrut Talenta (Klien)
                         </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                         {stats.map((stat, index) => {
                              const Icon = stat.icon;

                              return (
                                   <div
                                        key={index}
                                        className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-left hover:border-slate-300 transition"
                                   >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${stat.color} mb-3 font-bold`}>
                                             <Icon className="w-5 h-5" />
                                        </div>

                                        <p className="text-2xl font-black text-slate-900 tracking-tight tabular-nums">
                                             <AnimatedNumber value={stat.value} />
                                        </p>

                                        <p className="text-xs font-medium text-slate-500 mt-0.5">
                                             {stat.label}
                                        </p>
                                   </div>
                              );
                         })}
                    </div>

               </div>
          </section>
     );
}