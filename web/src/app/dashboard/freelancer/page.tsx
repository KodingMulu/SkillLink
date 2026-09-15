'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from "../DashboardLayout";
import {
  Wallet, Clock, CheckCircle2, Star, TrendingUp, TrendingDown,
  ArrowRight, Briefcase, Search, ArrowUpRight, ArrowDownLeft,
  Sparkles, ChevronRight
} from "lucide-react";
import axios from 'axios';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { getApiUrl } from '@/lib/api';

interface DashboardStats {
  revenue: { value: number; growth: number; label: string };
  activeProjects: { value: number; growth: number; label: string };
  completedProjects: { value: number; growth: number; label: string };
  rating: { value: number; growth: number; label: string };
}

interface Project {
  id?: string;
  title: string;
  client: string;
  deadline: string;
  progress: number;
  status: string;
}

interface RecommendedJob {
  id: string;
  title: string;
  description: string;
  budget: string;
  tags: string[];
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  description?: string;
  createdAt: string;
}

export default function FreelancerDashboard() {
  const { user } = useAuth();
  const [statsData, setStatsData] = useState<DashboardStats | null>(null);
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<RecommendedJob[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(number);
  };

  const getStatusStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('revisi') || s.includes('late') || s.includes('terlewat')) {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    if (s.includes('review')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (s.includes('progress') || s.includes('jalan')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const apiUrl = getApiUrl();
        const response = await axios.get(`${apiUrl}/user/freelancer/dashboard`, {
          withCredentials: true
        });

        if (response.data.code === 200 && response.data.data) {
          const { stats, activeProjects, recommendedJobs, walletBalance, recentTransactions } = response.data.data;
          if (stats) setStatsData(stats);
          if (activeProjects) setActiveProjects(activeProjects);
          if (recommendedJobs) setRecommendedJobs(recommendedJobs);
          if (walletBalance !== undefined) setWalletBalance(walletBalance);
          if (recentTransactions) setRecentTransactions(recentTransactions);
        }

      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Gagal mengambil data dashboard:", error.response?.data || error.message);
        } else {
          console.error("Terjadi kesalahan sistem:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statsConfig = [
    {
      label: "Total Pendapatan",
      value: statsData ? formatRupiah(statsData.revenue.value) : "Rp 0",
      growth: statsData?.revenue.growth || 0,
      icon: Wallet,
      borderColor: "border-emerald-100",
      iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100"
    },
    {
      label: "Proyek Aktif",
      value: statsData?.activeProjects.value.toString() || "0",
      growth: statsData?.activeProjects.growth || 0,
      icon: Clock,
      borderColor: "border-blue-100",
      iconBg: "bg-blue-50 text-blue-600 border-blue-100"
    },
    {
      label: "Selesai",
      value: statsData?.completedProjects.value.toString() || "0",
      growth: statsData?.completedProjects.growth || 0,
      icon: CheckCircle2,
      borderColor: "border-purple-100",
      iconBg: "bg-purple-50 text-purple-600 border-purple-100"
    },
    {
      label: "Rating",
      value: statsData ? `${statsData.rating.value}/5.0` : "0.0/5.0",
      growth: statsData?.rating.growth || 0,
      icon: Star,
      borderColor: "border-amber-100",
      iconBg: "bg-amber-50 text-amber-500 border-amber-100"
    },
  ];

  return (
    <DashboardLayout role="freelancer">
      {/* Welcome Hero Banner */}
      <section className="relative mb-8 rounded-3xl bg-slate-900 p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Selamat Datang, {user?.username || 'Freelancer'}! 👋
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Pantau progres proyek berjalan, kirim penawaran terbaru, dan tingkatkan pendapatanmu hari ini.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/freelancer/jobs"
              className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-500 transition shadow-md"
            >
              <Search className="w-4 h-4" />
              <span>Cari Kerja</span>
            </Link>
            <Link
              href="/dashboard/freelancer/wallet"
              className="flex items-center gap-2 px-5 py-3 bg-slate-800 border border-slate-700 text-white rounded-xl font-bold text-xs hover:bg-slate-700 transition"
            >
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span>Tarik Saldo</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {loading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse p-6"></div>
          ))
        ) : (
          statsConfig.map((stat, index) => (
            <div
              key={index}
              className={`bg-white p-6 rounded-3xl border ${stat.borderColor} shadow-sm hover:shadow-md transition-all`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl border ${stat.iconBg}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${stat.growth >= 0 ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' : 'text-red-700 bg-red-50 border border-red-100'}`}>
                  {stat.growth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(stat.growth)}%
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          ))
        )}
      </section>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Active Projects */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <span>Proyek Sedang Berjalan</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Daftar pekerjaan aktif yang membutuhkan progresmu</p>
              </div>
              <Link
                href="/dashboard/freelancer/contracts"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1"
              >
                <span>Lihat Semua Kontrak</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {loading ? (
                [1, 2].map(i => (
                  <div key={i} className="p-6 space-y-3 animate-pulse">
                    <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                    <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                  </div>
                ))
              ) : activeProjects.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-sm">
                    <Briefcase className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">Belum Ada Proyek Aktif</h3>
                  <p className="text-slate-500 text-xs max-w-sm mx-auto mb-5">
                    Mulai jelajahi pekerjaan yang cocok dan kirimkan tawaran terbaikmu.
                  </p>
                  <Link
                    href="/dashboard/freelancer/jobs"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs shadow-md hover:bg-blue-700 transition"
                  >
                    <span>Cari Lowongan Pekerjaan</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              ) : (
                activeProjects.map((project, idx) => (
                  <div key={project.id || idx} className="p-6 hover:bg-slate-50/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">
                          {project.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                          <span className="font-semibold text-slate-700">{project.client}</span>
                          <span>•</span>
                          <span>Deadline: <strong className={`${String(project.deadline).includes('Terlewat') ? 'text-red-600' : 'text-slate-700'}`}>{project.deadline}</strong></span>
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border w-fit ${getStatusStyle(project.status)}`}>
                        {project.status}
                      </span>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1.5 font-bold">
                        <span className="text-slate-500">Progres pengerjaan</span>
                        <span className="text-blue-600">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Right Column - Recommended Jobs & Wallet Widget */}
        <div className="space-y-6">
          {/* Quick Wallet Card */}
          <section className="bg-slate-900 rounded-3xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saldo Aktif Dompet</span>
              <Link
                href="/dashboard/freelancer/wallet"
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-white transition"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <h3 className="text-3xl font-black text-white mb-4">
              {formatRupiah(walletBalance)}
            </h3>
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Transaksi Terakhir:</span>
              {recentTransactions.length > 0 ? (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                  +{formatRupiah(recentTransactions[0].amount)}
                </span>
              ) : (
                <span className="text-xs text-slate-400 font-medium">Belum ada transaksi</span>
              )}
            </div>
          </section>

          {/* Recommended Jobs Card */}
          <section className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-900 text-sm tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Rekomendasi Pekerjaan</span>
              </h2>
            </div>

            <div className="space-y-3">
              {loading ? (
                [1, 2, 3].map(i => (
                  <div key={i} className="p-4 border border-slate-100 rounded-2xl space-y-2 animate-pulse">
                    <div className="flex justify-between">
                      <div className="h-4 bg-slate-100 w-1/2 rounded"></div>
                      <div className="h-4 bg-slate-100 w-1/4 rounded"></div>
                    </div>
                    <div className="h-3 bg-slate-100 w-full rounded"></div>
                  </div>
                ))
              ) : recommendedJobs.length === 0 ? (
                <div className="text-center text-slate-400 text-xs py-6">
                  Belum ada rekomendasi lowongan baru.
                </div>
              ) : (
                recommendedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 border border-slate-100 rounded-2xl hover:border-blue-300 hover:bg-slate-50 transition-all"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-slate-900 text-xs line-clamp-1">
                        {job.title}
                      </h4>
                      <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 whitespace-nowrap">
                        {job.budget}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>
                    <div className="mt-2.5 flex gap-1.5 flex-wrap">
                      {job.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            <Link
              href="/dashboard/freelancer/jobs"
              className="w-full mt-4 py-2.5 text-xs font-bold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <span>Jelajahi Semua Pekerjaan</span>
              <ArrowRight size={14} />
            </Link>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}