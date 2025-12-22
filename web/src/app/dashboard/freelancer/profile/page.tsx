'use client';

import { useState } from 'react';
import DashboardLayout from "../../DashboardLayout";
import { 
  User, Mail, Phone, MapPin, Calendar, Briefcase, 
  Star, Clock, Edit2, Save, X, Github, Linkedin, 
  Globe, Plus, Upload, TrendingUp, ExternalLink,
  Award, BookOpen, Layers
} from 'lucide-react';

// --- Types ---
interface Skill { id: string; name: string; level: number; }
interface Experience { id: string; title: string; company: string; period: string; description: string; }
interface Portfolio { id: string; title: string; image: string; description: string; link: string; tags: string[]; }

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'reviews'>('overview');

  const [profile, setProfile] = useState({
    name: 'Saipul Bahri',
    title: 'Senior Frontend Developer',
    email: 'saipul.bahri@email.com',
    phone: '+62 812-3456-7890',
    location: 'Jakarta, Indonesia',
    joinDate: 'Januari 2024',
    bio: 'Seorang Frontend Developer dengan pengalaman 3+ tahun dalam membangun aplikasi web modern menggunakan React, Next.js, dan TypeScript. Passionate dalam menciptakan user experience yang menarik, responsif, dan performant.',
    completedProjects: 24,
    rating: 4.9,
    responseTime: '2 jam',
    website: 'saipulbahri.dev',
    github: 'github.com/saipulbahri',
    linkedin: 'linkedin.com/in/saipulbahri',
    avatar: 'SB'
  });

  const [skills] = useState<Skill[]>([
    { id: '1', name: 'React / Next.js', level: 95 },
    { id: '2', name: 'TypeScript', level: 88 },
    { id: '3', name: 'Tailwind CSS', level: 98 },
    { id: '4', name: 'Node.js & Express', level: 75 },
    { id: '5', name: 'UI/UX Design (Figma)', level: 82 },
  ]);

  const [portfolios] = useState<Portfolio[]>([
    { id: '1', title: 'Enterprise E-Commerce', image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80', description: 'Platform belanja online skala besar dengan sistem manajemen inventaris.', link: '#', tags: ['Next.js', 'Stripe', 'Redux'] },
    { id: '2', title: 'Crypto Dashboard', image: 'https://images.unsplash.com/photo-1551288049-bbbda5366392?w=800&q=80', description: 'Dashboard pemantauan harga kripto real-time dengan integrasi WebSocket.', link: '#', tags: ['React', 'D3.js', 'API'] },
  ]);

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
            
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl border-4 border-white">
                  {profile.avatar}
                </div>
                {isEditing && (
                  <button className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg border-2 border-white">
                    <Upload className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Identity */}
              <div className="pt-2">
                {isEditing ? (
                  <div className="space-y-3 mb-4">
                    <input 
                      className="text-3xl font-black border-b-2 border-blue-500 bg-transparent outline-none w-full"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                    />
                    <input 
                      className="text-lg text-slate-500 border-b border-slate-200 bg-transparent outline-none w-full"
                      value={profile.title}
                      onChange={(e) => setProfile({...profile, title: e.target.value})}
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">{profile.name}</h1>
                    <p className="text-lg font-medium text-blue-600 mb-4">{profile.title}</p>
                  </>
                )}

                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-semibold">
                  <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-xl">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span>{profile.rating} <span className="text-amber-400 font-normal">(45 Ulasan)</span></span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 text-slate-600 px-4 py-2 rounded-xl border border-slate-100">
                    <Briefcase className="w-4 h-4 text-blue-500" />
                    <span>{profile.completedProjects} Proyek Selesai</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 w-full md:w-auto">
              {isEditing ? (
                <>
                  <button onClick={() => setIsEditing(false)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition">
                    <X size={18} /> Batal
                  </button>
                  <button onClick={() => setIsEditing(false)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition">
                    <Save size={18} /> Simpan
                  </button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition">
                  <Edit2 size={18} /> Edit Profil
                </button>
              )}
            </div>
          </div>

          {/* Quick Info Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600"><Mail size={20} /></div>
              <div><p className="text-[10px] uppercase font-black text-slate-400">Email</p><p className="text-sm font-bold text-slate-700">{profile.email}</p></div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600"><MapPin size={20} /></div>
              <div><p className="text-[10px] uppercase font-black text-slate-400">Lokasi</p><p className="text-sm font-bold text-slate-700">{profile.location}</p></div>
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
              onClick={() => setActiveTab(tab.id as any)}
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
                {isEditing ? (
                  <textarea 
                    rows={4}
                    className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition"
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  />
                ) : (
                  <p className="text-slate-600 leading-relaxed font-medium">{profile.bio}</p>
                )}
              </section>

              {/* Skills Visualized */}
              <section className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                  <TrendingUp className="text-blue-600" /> Keahlian Utama
                </h3>
                <div className="space-y-6">
                  {skills.map((skill) => (
                    <div key={skill.id} className="group">
                      <div className="flex justify-between mb-2 px-1">
                        <span className="font-bold text-slate-700">{skill.name}</span>
                        <span className="text-blue-600 font-black">{skill.level}%</span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-1000"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
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
                <p className="text-blue-100 text-sm font-medium relative z-10 mb-6">Konsistensi kerja yang luar biasa selama 6 bulan terakhir.</p>
                <button className="w-full py-3 bg-white text-blue-600 font-black rounded-xl text-sm hover:bg-blue-50 transition relative z-10">
                  Lihat Pencapaian
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {/* Add New Project Card */}
             <button className="h-full min-h-[300px] border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-slate-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/30 transition-all group">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-100 transition">
                  <Plus size={32} />
                </div>
                <span className="font-bold">Tambah Proyek Baru</span>
             </button>

             {portfolios.map((item) => (
               <div key={item.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                  <div className="relative h-48 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <a href={item.link} className="flex items-center gap-2 text-white font-bold text-sm bg-blue-600/90 px-4 py-2 rounded-xl backdrop-blur-sm">
                        <ExternalLink size={14} /> Lihat Detail
                      </a>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider rounded-lg">{tag}</span>
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
                  {[...Array(5)].map((_, i) => <Star key={i} className="fill-current w-8 h-8" />)}
                </div>
             </div>

             {/* Dummy Reviews */}
             {[1, 2, 3].map((r) => (
               <div key={r} className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm hover:border-blue-200 transition">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100"></div>
                      <div>
                        <h4 className="font-bold text-slate-900">Client {r}</h4>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">2 Weeks Ago</p>
                      </div>
                    </div>
                    <div className="flex text-amber-500"><Star className="fill-current w-4 h-4" /> <span className="ml-1 text-sm font-black">5.0</span></div>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed italic">"Sangat puas dengan hasil kerjanya. Kode bersih, komunikasi lancar, dan selesai lebih cepat dari deadline. Sangat direkomendasikan!"</p>
               </div>
             ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}