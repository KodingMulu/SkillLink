'use client';

import { useState, useEffect, use } from 'react';
import DashboardLayout from '@/app/dashboard/DashboardLayout';
import {
  ArrowLeft, MapPin, Star, ShieldCheck,
  FileText, CheckCircle2, Award, Briefcase, Globe, Loader2, Mail
} from "lucide-react";
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Portfolio {
  id: string;
  title: string;
  tags: string[];
  image: string | null;
}

interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  rating: number | null;
}

interface FreelancerStats {
  rating: number;
  reviews: number;
  successRate: number;
}

interface FreelancerData {
  id: string;
  username: string;
  email: string;
  title: string | null;
  bio: string | null;
  location: string | null;
  skills: string[];
  portfolios: Portfolio[];
  experiences: Experience[];
  stats: FreelancerStats;
}

export default function ApplicantDetail({ params }: { params: Promise<{ freelancerId: string }> }) {
  const resolvedParams = use(params);
  const freelancerId = resolvedParams.freelancerId;
  const router = useRouter();

  const [freelancer, setFreelancer] = useState<FreelancerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFreelancer = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await axios.get(`${apiUrl}/user/freelancer/detail/${freelancerId}`, {
          withCredentials: true
        });
        if (response.data.code === 200) {
          setFreelancer(response.data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFreelancer();
  }, [freelancerId]);

  if (isLoading) {
    return (
      <DashboardLayout role="client">
        <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-500">Mengambil data freelancer...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!freelancer) {
    return (
      <DashboardLayout role="client">
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
          <p className="text-slate-500 font-bold">Freelancer tidak ditemukan.</p>
          <button onClick={() => router.back()} className="text-blue-600 mt-2 hover:underline">Kembali</button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="client">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-6 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Kembali</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-sm">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-600 border-4 border-white shadow-lg uppercase">
                {freelancer.username.charAt(0)}
              </div>
              <div className="absolute bottom-2 right-2 bg-emerald-500 p-1.5 rounded-full border-4 border-white">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-slate-900">{freelancer.username}</h1>
            <p className="text-blue-600 font-medium mb-4">{freelancer.title || 'Freelancer'}</p>

            <div className="flex items-center justify-center gap-2 text-slate-500 text-sm mb-6">
              <MapPin className="w-4 h-4" />
              {freelancer.location || 'Indonesia'}
            </div>

            <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-100 mb-6">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Rating</p>
                <div className="flex items-center justify-center gap-1 text-slate-900 font-bold text-sm">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  {freelancer.stats.rating} ({freelancer.stats.reviews})
                </div>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Job Success</p>
                <p className="text-sm font-bold text-emerald-600">{freelancer.stats.successRate}%</p>
              </div>
            </div>

            <div className="space-y-3">
              <a href={`mailto:${freelancer.email}`} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                Hubungi via Email
              </a>
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" /> Keahlian
            </h3>
            <div className="flex flex-wrap gap-2">
              {freelancer.skills.length > 0 ? freelancer.skills.map((skill, index) => (
                <span key={index} className="bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-100">
                  {skill}
                </span>
              )) : <span className="text-slate-400 text-sm italic">Belum ada skill ditambahkan</span>}
            </div>
          </section>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Tentang</h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {freelancer.bio || "Freelancer ini belum menambahkan biodata/deskripsi diri."}
            </p>
          </section>

          <section className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" /> Portofolio Terbaru
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              {freelancer.portfolios.length > 0 ? freelancer.portfolios.map((item) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="aspect-video bg-slate-100 rounded-2xl mb-3 overflow-hidden border border-slate-200 relative flex items-center justify-center">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <FileText className="w-8 h-8 text-slate-300 group-hover:scale-110 transition-transform" />
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{item.title}</h4>
                  <p className="text-xs text-slate-500">{item.tags[0] || 'Project'}</p>
                </div>
              )) : (
                <div className="col-span-2 text-center py-8">
                  <p className="text-slate-500 text-sm">Belum ada portofolio yang diunggah.</p>
                </div>
              )}
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" /> Riwayat Pekerjaan (Platform)
            </h2>
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
              {freelancer.experiences.length > 0 ? freelancer.experiences.map((exp, idx) => (
                <div key={idx} className="relative pl-12">
                  <div className="absolute left-0 mt-1 w-10 h-10 rounded-full bg-blue-50 border-4 border-white flex items-center justify-center text-blue-600 z-10 shadow-sm">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{exp.role}</h4>
                    <p className="text-sm text-blue-600 font-medium mb-1">Klien: {exp.company}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-slate-400">{exp.period}</p>
                      {exp.rating && (
                        <span className="text-xs flex items-center text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-amber-500 mr-1" /> {exp.rating}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="pl-12">
                  <p className="text-slate-500 text-sm italic">Belum ada riwayat pekerjaan yang diselesaikan di platform ini.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}