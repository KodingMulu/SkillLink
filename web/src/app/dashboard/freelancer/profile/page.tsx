'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../DashboardLayout';
import Link from 'next/link';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import {
  User, Mail, MapPin, Briefcase,
  Star, Clock, Edit2, Github, Linkedin,
  Globe, Plus, ExternalLink,
  Layers, Share2, CheckCircle2,
  Sparkles, Phone, ShieldCheck, Award
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

export default function FreelancerProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const apiUrl = getApiUrl();
        const response = await axios.get(`${apiUrl}/user/freelancer/profile`, { withCredentials: true });
        if (response.data.code === 200) {
          setProfile(response.data.data);
        }
      } catch (error) {
        console.error("Gagal mengambil profil freelancer:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading || !profile) {
    return (
      <DashboardLayout role="freelancer">
        <div className="flex h-[70vh] items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-16 w-16 bg-blue-100 rounded-full border-4 border-blue-200"></div>
            <div className="h-4 w-48 bg-slate-200 rounded-full"></div>
            <p className="text-xs font-semibold text-slate-400">Memuat Profil Freelancer...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Ringkasan & Bio', icon: Layers },
    { id: 'portfolio', label: `Portofolio (${profile.portfolios.length})`, icon: Briefcase },
    { id: 'reviews', label: `Ulasan (${profile.reviewCount})`, icon: Star }
  ];

  return (
    <DashboardLayout role="freelancer">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner Cover Header */}
        <div className="relative h-56 md:h-64 w-full bg-slate-900 rounded-3xl shadow-lg"></div>

        {/* Profile Card Overlay */}
        <div className="-mt-28 relative z-10 px-4 sm:px-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 md:p-8">
            <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start justify-between">
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left w-full lg:w-auto">
                {/* Avatar Badge */}
                <div className="relative shrink-0">
                  <div className="w-32 h-32 md:w-36 md:h-36 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center text-white text-4xl font-black shadow-xl border-4 border-white uppercase tracking-wider">
                    {profile.avatar || profile.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl shadow-lg border-2 border-white" title="Profil Terverifikasi">
                    <ShieldCheck size={18} />
                  </div>
                </div>

                {/* Main Identity */}
                <div className="space-y-2 pt-2">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{profile.name}</h1>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-100">
                      Freelancer Pro
                    </span>
                  </div>
                  <p className="text-base md:text-lg font-semibold text-blue-600">{profile.title || 'Spesialis SkillLink'}</p>
                  
                  {/* Badges Bar */}
                  <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-xs font-bold pt-2">
                    <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 px-3.5 py-1.5 rounded-xl border border-amber-200/60">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      <span>{profile.rating.toFixed(1)} <span className="text-amber-600/70 font-normal">({profile.reviewCount} Ulasan)</span></span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3.5 py-1.5 rounded-xl border border-emerald-200/60">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>{profile.completedProjects} Proyek Selesai</span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-slate-50 text-slate-700 px-3.5 py-1.5 rounded-xl border border-slate-200">
                      <MapPin className="w-4 h-4 text-rose-500" />
                      <span>{profile.location || 'Indonesia'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full lg:w-auto shrink-0 pt-4 lg:pt-2 border-t lg:border-t-0 border-slate-100">
                <Link
                  href="/dashboard/freelancer/settings"
                  className="flex-1 lg:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 active:scale-95 text-xs"
                >
                  <Edit2 size={16} />
                  <span>Edit Profil</span>
                </Link>
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center p-3.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-100 transition shadow-sm active:scale-95 text-xs font-bold cursor-pointer"
                  title="Bagikan Tautan Profil"
                >
                  {copied ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Share2 size={18} />}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Left */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Tab Nav Selector */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-2 shadow-sm space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <tab.icon size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Informasi Kontak</h3>
              
              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0"><Mail size={16} /></div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</p>
                    <p className="font-bold text-slate-900 truncate" title={profile.email}>{profile.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl shrink-0"><Phone size={16} /></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Telepon</p>
                    <p className="font-bold text-slate-900">{profile.phone || '-'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl shrink-0"><Clock size={16} /></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Waktu Respon</p>
                    <p className="font-bold text-slate-900">{profile.responseTime}</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold mb-3 uppercase tracking-wider">Media Sosial & Portofolio</p>
                <div className="flex gap-2">
                  {[
                    { icon: Github, link: profile.github },
                    { icon: Linkedin, link: profile.linkedin },
                    { icon: Globe, link: profile.website }
                  ].map((item, i) => (
                    <a 
                      key={i} 
                      href={item.link === '#' ? undefined : `https://${item.link}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all"
                    >
                      <item.icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Main Panel Content */}
          <div className="lg:col-span-3">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* About Me Card */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl"><User size={20} /></div>
                    <h3 className="text-lg font-black text-slate-900">Tentang Saya</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-wrap text-sm">
                    {profile.bio || "Belum ada bio singkat. Tambahkan bio di menu Pengaturan untuk memikat calon klien."}
                  </p>
                </div>

                {/* Keahlian & Skills Card */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl"><Layers size={20} /></div>
                    <h3 className="text-lg font-black text-slate-900">Keahlian & Spesialisasi</h3>
                  </div>
                  {profile.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2.5">
                      {profile.skills.map((skill, index) => (
                        <span key={index} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs text-slate-700 hover:border-blue-300 transition-colors">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-slate-400 text-xs font-semibold">Belum ada keahlian ditambahkan.</p>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* Portfolio Tab */}
            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-900">Galeri Portofolio Proyek</h3>
                  <Link 
                    href="/dashboard/freelancer/portfolio"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition"
                  >
                    <Plus size={16} /> Kelola Portofolio
                  </Link>
                </div>

                {profile.portfolios.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                      <Briefcase size={32} />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">Portofolio Masih Kosong</h4>
                    <p className="text-slate-500 text-xs max-w-sm mx-auto">
                      Tambahkan hasil karya terbaik Anda untuk dipamerkan kepada klien.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {profile.portfolios.map((item) => (
                      <div key={item.id} className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col">
                        <div className="relative h-48 bg-slate-100 overflow-hidden">
                          {item.image ? (
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                              <Layers size={40} />
                            </div>
                          )}
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            <h4 className="text-base font-bold text-slate-900">{item.title}</h4>
                            <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">{item.description}</p>
                          </div>
                          {item.link && (
                            <a href={item.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline">
                              <ExternalLink size={14} /> Lihat Tautan Proyek
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <h3 className="text-lg font-black text-slate-900">Ulasan & Rating dari Klien</h3>

                {profile.reviews.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center space-y-4">
                    <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
                      <Star size={32} />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">Belum Ada Ulasan</h4>
                    <p className="text-slate-500 text-xs max-w-sm mx-auto">
                      Selesaikan proyek pertama Anda untuk mendapatkan ulasan dan testimonial resmi dari klien.
                    </p>
                  </div>
                ) : (
                  profile.reviews.map((r) => (
                    <div key={r.id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                            {r.clientName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">{r.clientName}</h4>
                            <p className="text-[11px] text-slate-400 font-medium">{formatDate(r.date)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
                          <Star className="fill-amber-500 text-amber-500 w-3.5 h-3.5" />
                          <span className="text-xs font-black text-amber-800">{r.rating}.0</span>
                        </div>
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed font-medium italic pl-13">
                        &quot;{r.comment || 'Tidak ada komentar.'}&quot;
                      </p>
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