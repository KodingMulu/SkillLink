'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from "../../DashboardLayout";
import Link from 'next/link';
import axios from 'axios';
import {
  User, Mail, MapPin, Briefcase,
  Star, Clock, Edit2, Github, Linkedin,
  Globe, Plus, ExternalLink,
  Award, Layers, Download, Share2, CheckCircle2
} from 'lucide-react';

interface Portfolio {
  id: string;
  title: string;
  description: string;
  image: string | null;
  link: string | null;
  tags: string[];
}

interface Review {
  id: string;
  clientName: string;
  rating: number;
  comment: string | null;
  date: string;
}

interface ProfileData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  bio: string;
  skills: string[];
  completedProjects: number;
  rating: number;
  reviewCount: number;
  responseTime: string;
  website: string;
  github: string;
  linkedin: string;
  avatar: string;
  portfolios: Portfolio[];
  reviews: Review[];
}

type TabType = 'overview' | 'portfolio' | 'reviews';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    joinDate: '',
    bio: '',
    skills: [],
    completedProjects: 0,
    rating: 0,
    reviewCount: 0,
    responseTime: '-',
    website: '#',
    github: '#',
    linkedin: '#',
    avatar: '',
    portfolios: [],
    reviews: []
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await axios.get(`${apiUrl}/user/freelancer/profile`, { withCredentials: true });

        if (response.data.code === 200) {
          setProfile(response.data.data);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error fetching profile:", error.response?.data?.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
  };

  const handleDownloadCV = () => {
    alert("Fitur Download CV akan segera tersedia! (File belum diupload user)");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <DashboardLayout role="freelancer">
        <div className="flex h-96 items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-slate-200 rounded-full mb-4"></div>
            <div className="h-4 w-32 bg-slate-200 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'portfolio', label: 'Portofolio', icon: Briefcase },
    { id: 'reviews', label: 'Ulasan', icon: Star }
  ];

  return (
    <DashboardLayout role="freelancer">
      <div className="relative h-64 w-full bg-slate-900 rounded-b-[3rem] overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-900 opacity-90"></div>
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-12">
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-6 md:p-8 mb-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-shrink-0 relative mx-auto lg:mx-0">
              <div className="w-36 h-36 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl border-4 border-white">
                {profile.avatar}
              </div>
              <div className="absolute -bottom-3 -right-3 bg-white p-1.5 rounded-full shadow-md">
                <div className="bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-emerald-400">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  OPEN TO WORK
                </div>
              </div>
            </div>

            <div className="flex-1 text-center lg:text-left space-y-3">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{profile.name}</h1>
                <p className="text-lg md:text-xl font-medium text-blue-600">{profile.title}</p>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm font-semibold pt-2">
                <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-xl border border-amber-100/50">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>{profile.rating} <span className="text-amber-500/70 font-normal">({profile.reviewCount} Reviews)</span></span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 text-slate-600 px-4 py-2 rounded-xl border border-slate-100">
                  <Briefcase className="w-4 h-4 text-blue-500" />
                  <span>{profile.completedProjects} Projects Done</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 text-slate-600 px-4 py-2 rounded-xl border border-slate-100">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <span>{profile.location || 'Remote'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto mt-4 lg:mt-0">
              <button
                onClick={handleDownloadCV}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-900/20 active:scale-95"
              >
                <Download size={18} />
                <span>Download CV</span>
              </button>

              <div className="flex gap-3">
                <Link
                  href="/dashboard/freelancer/settings"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition shadow-sm active:scale-95"
                >
                  <Edit2 size={18} />
                  <span>Edit</span>
                </Link>
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition shadow-sm active:scale-95"
                  title="Share Profile"
                >
                  {copied ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Share2 size={18} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all mb-1 last:mb-0 ${activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Kontak</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0"><Mail size={16} /></div>
                    <div className="overflow-hidden">
                      <p className="text-xs text-slate-400 font-bold mb-0.5">EMAIL</p>
                      <p className="text-sm font-semibold text-slate-700 truncate" title={profile.email}>{profile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0"><Clock size={16} /></div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold mb-0.5">RESPON</p>
                      <p className="text-sm font-semibold text-slate-700">{profile.responseTime}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100">
                  <p className="text-xs text-slate-400 font-bold mb-3 uppercase tracking-widest">SOCIALS</p>
                  <div className="flex gap-2">
                    {[
                      { icon: Github, link: profile.github },
                      { icon: Linkedin, link: profile.linkedin },
                      { icon: Globe, link: profile.website }
                    ].map((item, i) => (
                      <a key={i} href={item.link === '#' ? undefined : `https://${item.link}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition">
                        <item.icon size={18} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <section className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-50 rounded-xl text-blue-600"><User size={24} /></div>
                    <h3 className="text-xl font-black text-slate-900">Tentang Saya</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-wrap text-base">
                    {profile.bio || "Halo! Saya belum menulis bio. Anda bisa melihat skill dan portofolio saya di bawah."}
                  </p>
                </section>

                <section className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600"><Layers size={24} /></div>
                    <h3 className="text-xl font-black text-slate-900">Keahlian & Tools</h3>
                  </div>
                  {profile.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {profile.skills.map((skill, index) => (
                        <span key={index} className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 shadow-sm hover:border-blue-300 hover:text-blue-600 hover:shadow-md transition cursor-default select-none">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                      <p className="text-slate-400 italic">Belum ada keahlian ditambahkan.</p>
                      <Link href="/dashboard/freelancer/settings" className="text-blue-600 font-bold text-sm hover:underline mt-2 inline-block">Tambah Keahlian</Link>
                    </div>
                  )}
                </section>

                <section className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                    <Award size={200} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                      <Award className="text-yellow-300" size={28} />
                      <h3 className="text-xl font-black">Top Rated Talent</h3>
                    </div>
                    <p className="text-blue-100 max-w-lg mb-6 leading-relaxed">
                      Freelancer ini telah menunjukkan konsistensi kerja yang luar biasa dan mendapatkan ulasan positif dari klien.
                    </p>
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-bold border border-white/30">
                      <span>Member sejak {formatDate(profile.joinDate)}</span>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <button className="min-h-[320px] border-3 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center gap-4 text-slate-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/30 transition-all group bg-slate-50/50">
                  <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center group-hover:scale-110 transition duration-300">
                    <Plus size={32} />
                  </div>
                  <span className="font-bold">Tambah Proyek Baru</span>
                </button>

                {profile.portfolios.map((item) => (
                  <div key={item.id} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
                          <Layers size={48} />
                        </div>
                      )}

                      {item.link && (
                        <div className="absolute top-4 right-4">
                          <a href={item.link} target="_blank" rel="noreferrer" className="flex items-center justify-center w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full text-slate-900 hover:bg-blue-600 hover:text-white transition shadow-lg">
                            <ExternalLink size={18} />
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {item.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-slate-50 border border-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider rounded-lg">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2 leading-tight">{item.title}</h4>
                      <p className="text-sm text-slate-500 font-medium line-clamp-3 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm flex items-center justify-between bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                  <div>
                    <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-1">Total Rating</p>
                    <h3 className="text-5xl font-black text-slate-900 tracking-tight">{profile.rating}</h3>
                    <div className="flex gap-1 text-amber-500 mt-2">
                      {[...Array(5)].map((_, i) => <Star key={i} className={`w-5 h-5 ${i < Math.round(profile.rating) ? 'fill-current' : 'text-slate-200'}`} />)}
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-3xl font-black text-slate-900">{profile.reviewCount}</p>
                    <p className="text-slate-500 font-medium text-sm">Ulasan Klien</p>
                  </div>
                </div>

                {profile.reviews.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-[2rem] border border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                      <Star size={32} />
                    </div>
                    <p className="text-slate-500 font-medium">Belum ada ulasan dari klien.</p>
                  </div>
                ) : (
                  profile.reviews.map((r) => (
                    <div key={r.id} className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm hover:border-blue-200 transition group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-slate-500 group-hover:from-blue-100 group-hover:to-indigo-100 group-hover:text-blue-600 transition">
                            {r.clientName.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">{r.clientName}</h4>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{formatDate(r.date)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                          <Star className="fill-amber-500 text-amber-500 w-3.5 h-3.5" />
                          <span className="text-sm font-black text-amber-700">{r.rating}.0</span>
                        </div>
                      </div>
                      <div className="pl-16">
                        <p className="text-slate-600 font-medium leading-relaxed italic relative">
                          <span className="absolute -left-4 -top-2 text-4xl text-slate-200 font-serif">&quot;</span>
                          {r.comment || 'Tidak ada komentar.'}
                          <span className="absolute -bottom-4 text-4xl text-slate-200 font-serif">&quot;</span>
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}