'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from "../../DashboardLayout";
import Link from 'next/link'; // Import Link untuk navigasi
import axios from 'axios';
import { 
  User, Mail, MapPin, Briefcase, 
  Star, Clock, Edit2, Github, Linkedin, 
  Globe, Plus, ExternalLink,
  Award, Layers,
  TrendingUp
} from 'lucide-react';

// --- Types ---
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

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'reviews'>('overview');
  const [loading, setLoading] = useState(true);

  // Default Initial State
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

  // Fetch Data
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

  // Helper formatting date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
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

  return (
    <DashboardLayout role="freelancer">
      {/* Banner Section */}
      <div className="relative h-48 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-t-[2.5rem] overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      </div>

      {/* Main Profile Card */}
      <div className="relative -mt-24 px-8 pb-8">
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
            
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left w-full">
              {/* Avatar */}
              <div className="relative group flex-shrink-0">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl border-4 border-white">
                  {profile.avatar}
                </div>
              </div>

              {/* Identity */}
              <div className="pt-2 w-full">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">{profile.name}</h1>
                <p className="text-lg font-medium text-blue-600 mb-4">{profile.title}</p>

                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-semibold">
                  <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-xl">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span>{profile.rating} <span className="text-amber-400 font-normal">({profile.reviewCount} Ulasan)</span></span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 text-slate-600 px-4 py-2 rounded-xl border border-slate-100">
                    <Briefcase className="w-4 h-4 text-blue-500" />
                    <span>{profile.completedProjects} Proyek Selesai</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions: Direct to Settings */}
            <div className="flex gap-2 w-full md:w-auto flex-shrink-0 justify-center md:justify-end">
              <Link 
                href="/dashboard/freelancer/settings" 
                className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition"
              >
                <Edit2 size={18} /> Edit Profil
              </Link>
            </div>
          </div>

          {/* Quick Info Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600"><Mail size={20} /></div>
              <div className="overflow-hidden"><p className="text-[10px] uppercase font-black text-slate-400">Email</p><p className="text-sm font-bold text-slate-700 truncate">{profile.email}</p></div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600"><MapPin size={20} /></div>
              <div><p className="text-[10px] uppercase font-black text-slate-400">Lokasi</p><p className="text-sm font-bold text-slate-700">{profile.location || '-'}</p></div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600"><Clock size={20} /></div>
              <div><p className="text-[10px] uppercase font-black text-slate-400">Respon</p><p className="text-sm font-bold text-slate-700">{profile.responseTime}</p></div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-8 mb-8">
        <div className="flex gap-2 bg-white p-1.5 rounded-[1.5rem] border border-slate-200 shadow-sm w-fit">
          {[
            { id: 'overview', label: 'Ringkasan', icon: Layers },
            { id: 'portfolio', label: 'Portofolio', icon: Briefcase },
            { id: 'reviews', label: 'Ulasan', icon: Star }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'portfolio' | 'reviews')}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                activeTab === tab.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-8 pb-12">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Bio */}
              <section className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <User className="text-blue-600" /> Tentang Saya
                </h3>
                <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">{profile.bio}</p>
              </section>

              {/* Skills */}
              <section className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                  <TrendingUp className="text-blue-600" /> Keahlian
                </h3>
                {profile.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {profile.skills.map((skill, index) => (
                      <span key={index} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic">Belum ada keahlian ditambahkan. Pergi ke halaman Pengaturan untuk menambah keahlian.</p>
                )}
              </section>
            </div>

            {/* Sidebar Overview */}
            <div className="space-y-8">
              <section className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                <h3 className="text-lg font-black text-slate-900 mb-6">Media Sosial</h3>
                <div className="space-y-4">
                  {[
                    { icon: Globe, label: profile.website, color: 'text-blue-500' },
                    { icon: Github, label: profile.github, color: 'text-slate-800' },
                    { icon: Linkedin, label: profile.linkedin, color: 'text-blue-700' },
                  ].map((social, i) => (
                    <a key={i} href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-slate-50 transition group">
                      <social.icon size={20} className={social.color} />
                      <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600 truncate">{social.label}</span>
                    </a>
                  ))}
                </div>
              </section>

              <div className="bg-blue-600 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-200 overflow-hidden relative group">
                <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform">
                  <Award size={160} />
                </div>
                <h3 className="text-xl font-black mb-2 relative z-10">Freelancer Berprestasi</h3>
                <p className="text-blue-100 text-sm font-medium relative z-10 mb-6">Bergabung sejak {profile.joinDate ? formatDate(profile.joinDate) : '-'}</p>
              </div>
            </div>
          </div>
        )}

        {/* --- Portfolio --- */}
        {activeTab === 'portfolio' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             <button className="h-full min-h-[300px] border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-slate-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/30 transition-all group">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-100 transition">
                  <Plus size={32} />
                </div>
                <span className="font-bold">Tambah Proyek Baru</span>
             </button>

             {profile.portfolios.length === 0 && (
               <div className="col-span-full text-center text-slate-400 py-10 hidden">
                 Belum ada portofolio.
               </div>
             )}

             {profile.portfolios.map((item) => (
               <div key={item.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                  <div className="relative h-48 bg-slate-100 overflow-hidden flex items-center justify-center">
                    {item.image ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                        <Layers size={48} className="text-slate-300" />
                    )}
                    
                    {item.link && (
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <a href={item.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white font-bold text-sm bg-blue-600/90 px-4 py-2 rounded-xl backdrop-blur-sm">
                          <ExternalLink size={14} /> Lihat Detail
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.tags.map((tag, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider rounded-lg">{tag}</span>
                      ))}
                    </div>
                    <h4 className="text-lg font-black text-slate-900 mb-2">{item.title}</h4>
                    <p className="text-sm text-slate-500 font-medium line-clamp-2">{item.description}</p>
                  </div>
               </div>
             ))}
          </div>
        )}

        {/* --- Ulasan (Reviews) --- */}
        {activeTab === 'reviews' && (
          <div className="max-w-4xl mx-auto space-y-6">
             <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-1">Rata-rata Rating</p>
                  <h3 className="text-4xl font-black text-slate-900">{profile.rating} <span className="text-slate-300 font-normal">/ 5.0</span></h3>
                </div>
                <div className="flex gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => <Star key={i} className={`w-8 h-8 ${i < Math.round(profile.rating) ? 'fill-current' : 'text-slate-200'}`} />)}
                </div>
             </div>

             {profile.reviews.length === 0 ? (
               <div className="text-center py-10 text-slate-500 italic">Belum ada ulasan dari klien.</div>
             ) : (
               profile.reviews.map((r) => (
                 <div key={r.id} className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm hover:border-blue-200 transition">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                          {r.clientName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{r.clientName}</h4>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{formatDate(r.date)}</p>
                        </div>
                      </div>
                      <div className="flex text-amber-500"><Star className="fill-current w-4 h-4" /> <span className="ml-1 text-sm font-black">{r.rating}.0</span></div>
                    </div>
                    <p className="text-slate-600 font-medium leading-relaxed italic">&quot;{r.comment || 'Tidak ada komentar.'}&quot;</p>
                 </div>
               ))
             )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}