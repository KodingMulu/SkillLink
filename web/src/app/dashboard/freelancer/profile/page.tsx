'use client';

import { useState } from 'react';
import DashboardLayout from "../../DashboardLayout";
import { 
  User, Mail, Phone, MapPin, Calendar, Briefcase, 
  Star, Clock, Edit2, Save, X, Github, Linkedin, 
  Globe, Plus, Upload, TrendingUp
} from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  level: number;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
}

interface Portfolio {
  id: string;
  title: string;
  image: string;
  description: string;
  link: string;
  tags: string[];
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'reviews'>('overview');

  // Data Profil
  const [profile, setProfile] = useState({
    name: 'Saipul Bahri',
    title: 'Frontend Developer',
    email: 'saipul.bahri@email.com',
    phone: '+62 812-3456-7890',
    location: 'Jakarta, Indonesia',
    joinDate: 'Januari 2024',
    bio: 'Seorang Frontend Developer dengan pengalaman 3+ tahun dalam membangun aplikasi web modern menggunakan React, Next.js, dan TypeScript. Passionate dalam menciptakan user experience yang menarik dan responsif.',
    completedProjects: 24,
    rating: 4.8,
    responseTime: '2 jam',
    website: 'saipulbahri.dev',
    github: 'github.com/saipulbahri',
    linkedin: 'linkedin.com/in/saipulbahri',
    avatar: 'SB'
  });

  const [skills, setSkills] = useState<Skill[]>([
    { id: '1', name: 'React', level: 90 },
    { id: '2', name: 'Next.js', level: 85 },
    { id: '3', name: 'TypeScript', level: 80 },
    { id: '4', name: 'Tailwind CSS', level: 95 },
    { id: '5', name: 'JavaScript', level: 90 },
    { id: '6', name: 'Node.js', level: 70 }
  ]);

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'Tech Solutions Inc',
      period: '2022 - Sekarang',
      description: 'Memimpin tim frontend dalam pengembangan aplikasi e-commerce dengan Next.js'
    },
    {
      id: '2',
      title: 'Frontend Developer',
      company: 'Digital Agency',
      period: '2020 - 2022',
      description: 'Mengembangkan berbagai website dan aplikasi web untuk klien'
    }
  ]);

  const [portfolios, setPortfolios] = useState<Portfolio[]>([
    {
      id: '1',
      title: 'E-Commerce Platform',
      image: '🛒',
      description: 'Platform e-commerce modern dengan Next.js dan Stripe integration',
      link: 'https://example.com',
      tags: ['Next.js', 'TypeScript', 'Stripe']
    },
    {
      id: '2',
      title: 'Dashboard Analytics',
      image: '📊',
      description: 'Dashboard analytics real-time dengan React dan Chart.js',
      link: 'https://example.com',
      tags: ['React', 'Chart.js', 'API']
    },
    {
      id: '3',
      title: 'Social Media App',
      image: '📱',
      description: 'Aplikasi social media dengan fitur chat real-time',
      link: 'https://example.com',
      tags: ['React', 'Firebase', 'Tailwind']
    }
  ]);

  const reviews = [
    {
      id: '1',
      client: 'TechFlow Startup',
      rating: 5,
      comment: 'Excellent work! Very professional and delivered on time.',
      date: '2 minggu yang lalu',
      project: 'Frontend Developer (Next.js)'
    },
    {
      id: '2',
      client: 'Digital Agency',
      rating: 5,
      comment: 'Great communication and quality work. Will hire again!',
      date: '1 bulan yang lalu',
      project: 'Dashboard Analytics'
    },
    {
      id: '3',
      client: 'Startup XYZ',
      rating: 4,
      comment: 'Good developer, delivered quality work.',
      date: '2 bulan yang lalu',
      project: 'Website Redesign'
    }
  ];

  const handleSaveProfile = () => {
    setIsEditing(false);
    alert('Profil berhasil diperbarui!');
  };

  return (
    <DashboardLayout role="freelancer">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Profil Saya</h1>
        <p className="text-slate-500">Kelola informasi profil dan portfolio Anda</p>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start space-x-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {profile.avatar}
              </div>
              {isEditing && (
                <button className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition shadow-lg">
                  <Upload className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Info Utama */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="text-2xl font-bold border-b-2 border-blue-500 focus:outline-none bg-transparent"
                  />
                  <input
                    type="text"
                    value={profile.title}
                    onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                    className="text-lg text-slate-600 border-b-2 border-blue-500 focus:outline-none bg-transparent"
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">{profile.name}</h1>
                  <p className="text-lg text-slate-600 mb-4">{profile.title}</p>
                </>
              )}

              {/* Stats */}
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center bg-amber-50 px-3 py-1 rounded-lg">
                    <Star className="w-4 h-4 text-amber-500 fill-current mr-1" />
                    <span className="font-bold text-slate-900">{profile.rating}</span>
                    <span className="text-slate-500 ml-1">(45)</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1 rounded-lg">
                  <Briefcase className="w-4 h-4 text-slate-500" />
                  <span className="font-medium text-slate-900">{profile.completedProjects}</span>
                  <span className="text-slate-500">proyek</span>
                </div>
                <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1 rounded-lg">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span className="text-slate-900 font-medium">{profile.responseTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Save className="w-4 h-4" />
                  <span className="font-medium">Simpan</span>
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
                >
                  <X className="w-4 h-4" />
                  <span className="font-medium">Batal</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Edit2 className="w-4 h-4" />
                <span className="font-medium">Edit Profil</span>
              </button>
            )}
          </div>
        </div>

        {/* Kontak Info Grid */}
        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
          <div className="flex items-center space-x-3 text-slate-600 bg-slate-50 p-3 rounded-lg">
            <Mail className="w-5 h-5 text-blue-600" />
            {isEditing ? (
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="flex-1 border-b border-slate-300 focus:outline-none focus:border-blue-500 bg-transparent"
              />
            ) : (
              <span className="font-medium">{profile.email}</span>
            )}
          </div>
          <div className="flex items-center space-x-3 text-slate-600 bg-slate-50 p-3 rounded-lg">
            <Phone className="w-5 h-5 text-emerald-600" />
            {isEditing ? (
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="flex-1 border-b border-slate-300 focus:outline-none focus:border-blue-500 bg-transparent"
              />
            ) : (
              <span className="font-medium">{profile.phone}</span>
            )}
          </div>
          <div className="flex items-center space-x-3 text-slate-600 bg-slate-50 p-3 rounded-lg">
            <MapPin className="w-5 h-5 text-red-600" />
            {isEditing ? (
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="flex-1 border-b border-slate-300 focus:outline-none focus:border-blue-500 bg-transparent"
              />
            ) : (
              <span className="font-medium">{profile.location}</span>
            )}
          </div>
          <div className="flex items-center space-x-3 text-slate-600 bg-slate-50 p-3 rounded-lg">
            <Calendar className="w-5 h-5 text-purple-600" />
            <span className="font-medium">Bergabung {profile.joinDate}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-4 font-semibold transition ${
              activeTab === 'overview'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-6 py-4 font-semibold transition ${
              activeTab === 'portfolio'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Portfolio
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-4 font-semibold transition ${
              activeTab === 'reviews'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Ulasan
          </button>
        </div>

        <div className="p-6">
          {/* Tab Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Tentang Saya */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-3">Tentang Saya</h3>
                {isEditing ? (
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={4}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                ) : (
                  <p className="text-slate-700 leading-relaxed">{profile.bio}</p>
                )}
              </div>

              {/* Skills */}
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">Skills</h3>
                  {isEditing && (
                    <button className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 text-sm font-medium">
                      <Plus className="w-4 h-4" />
                      <span>Tambah</span>
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {skills.map((skill) => (
                    <div key={skill.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">{skill.name}</span>
                        <span className="text-sm text-slate-500 font-medium">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pengalaman */}
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">Pengalaman</h3>
                  {isEditing && (
                    <button className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 text-sm font-medium">
                      <Plus className="w-4 h-4" />
                      <span>Tambah</span>
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="border-l-4 border-blue-600 pl-4 py-2 bg-slate-50 rounded-r-lg">
                      <h4 className="font-bold text-slate-900">{exp.title}</h4>
                      <p className="text-slate-600 font-medium">{exp.company}</p>
                      <p className="text-sm text-slate-500 mb-2 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {exp.period}
                      </p>
                      <p className="text-slate-700 text-sm">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Social Media</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-slate-200">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <a href={`https://${profile.website}`} className="text-blue-600 hover:underline font-medium">
                      {profile.website}
                    </a>
                  </div>
                  <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-slate-200">
                    <Github className="w-5 h-5 text-slate-700" />
                    <a href={`https://${profile.github}`} className="text-blue-600 hover:underline font-medium">
                      {profile.github}
                    </a>
                  </div>
                  <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-slate-200">
                    <Linkedin className="w-5 h-5 text-blue-600" />
                    <a href={`https://${profile.linkedin}`} className="text-blue-600 hover:underline font-medium">
                      {profile.linkedin}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Portfolio */}
          {activeTab === 'portfolio' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Portfolio Saya</h3>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm">
                  <Plus className="w-4 h-4" />
                  <span className="font-medium">Tambah Portfolio</span>
                </button>
              </div>
              <div className="grid grid-cols-3 gap-6">
                {portfolios.map((portfolio) => (
                  <div key={portfolio.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-blue-300 transition group">
                    <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-6xl">
                      {portfolio.image}
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition">{portfolio.title}</h4>
                      <p className="text-sm text-slate-600 mb-3 line-clamp-2">{portfolio.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {portfolio.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <a
                        href={portfolio.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                      >
                        Lihat Project →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-slate-50 rounded-xl p-5 border border-slate-100 hover:border-slate-200 transition">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-slate-900">{review.client}</h4>
                      <p className="text-sm text-slate-600">{review.project}</p>
                    </div>
                    <div className="flex items-center space-x-1 bg-amber-50 px-3 py-1 rounded-lg">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'text-amber-500 fill-current' : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-700 mb-2 italic">"{review.comment}"</p>
                  <p className="text-xs text-slate-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {review.date}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}