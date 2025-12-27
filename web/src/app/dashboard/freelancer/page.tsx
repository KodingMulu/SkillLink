'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from "../DashboardLayout";
import { Wallet, Clock, CheckCircle2, Star, TrendingUp, TrendingDown } from "lucide-react";
import axios from 'axios';
import Link from 'next/link';

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

export default function FreelancerDashboard() {
  const [statsData, setStatsData] = useState<DashboardStats | null>(null);
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<RecommendedJob[]>([]);
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
    if (s.includes('revisi')) return 'bg-orange-100 text-orange-600';
    if (s.includes('review')) return 'bg-blue-100 text-blue-600';
    if (s.includes('progress')) return 'bg-emerald-100 text-emerald-600';
    return 'bg-slate-100 text-slate-600';
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await axios.get(`${apiUrl}/user/freelancer/dashboard`, {
          withCredentials: true 
        });

        if (response.data.code === 200 && response.data.data) {
          const { stats, activeProjects, recommendedJobs } = response.data.data;
          if (stats) setStatsData(stats);
          if (activeProjects) setActiveProjects(activeProjects);
          if (recommendedJobs) setRecommendedJobs(recommendedJobs);
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
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      label: "Proyek Aktif",
      value: statsData?.activeProjects.value.toString() || "0",
      growth: statsData?.activeProjects.growth || 0,
      icon: Clock,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      label: "Selesai",
      value: statsData?.completedProjects.value.toString() || "0",
      growth: statsData?.completedProjects.growth || 0,
      icon: CheckCircle2,
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      label: "Rating",
      value: statsData ? `${statsData.rating.value}/5.0` : "0.0/5.0",
      growth: statsData?.rating.growth || 0,
      icon: Star,
      color: "text-amber-500",
      bg: "bg-amber-50"
    },
  ];

  return (
    <DashboardLayout role="freelancer">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Halo, Freelancer! 👋</h1>
        <p className="text-slate-500">Berikut adalah aktivitas terbaru proyekmu.</p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse"></div>
          ))
        ) : (
          statsConfig.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
                  stat.growth >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'
                }`}>
                  {stat.growth >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {Math.abs(stat.growth)}%
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          ))
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-bold text-slate-900">Proyek Sedang Berjalan</h2>
              <button className="text-sm text-blue-600 hover:underline">Lihat Semua</button>
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
                 <div className="p-8 text-center text-slate-500">
                    Tidak ada proyek yang sedang aktif saat ini.
                 </div>
              ) : (
                activeProjects.map((project, idx) => (
                  <div key={project.id || idx} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-slate-900">{project.title}</h4>
                        <p className="text-sm text-slate-500">
                          {project.client} • Deadline: <span className={`${String(project.deadline).includes('Terlewat') ? 'text-red-600' : 'text-red-500'} font-medium`}>{project.deadline}</span>
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">Progress</span>
                        <span className="font-medium text-slate-700">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-bold text-slate-900 mb-4">Rekomendasi Pekerjaan</h2>
            <div className="space-y-4">
              {loading ? (
                [1, 2, 3].map(i => (
                  <div key={i} className="p-4 border border-slate-100 rounded-xl space-y-2 animate-pulse">
                    <div className="flex justify-between">
                      <div className="h-4 bg-slate-100 w-1/2 rounded"></div>
                      <div className="h-4 bg-slate-100 w-1/4 rounded"></div>
                    </div>
                    <div className="h-3 bg-slate-100 w-full rounded"></div>
                  </div>
                ))
              ) : recommendedJobs.length === 0 ? (
                <div className="text-center text-slate-500 text-sm py-4">
                  Belum ada rekomendasi baru.
                </div>
              ) : (
                recommendedJobs.map((job) => (
                  <div key={job.id} className="p-4 border border-slate-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {job.title}
                      </h4>
                      <span className="text-xs font-bold text-slate-900 whitespace-nowrap ml-2">
                        {job.budget}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {job.description}
                    </p>
                    <div className="mt-3 flex gap-2 flex-wrap">
                      {job.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
            <button className="w-full mt-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <Link href={'/dashboard/freelancer/jobs'}>Cari Lebih Banyak</Link>
            </button>
          </section>
        </div>

      </div>
    </DashboardLayout>
  );
}