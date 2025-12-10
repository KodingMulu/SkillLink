'use client';

import { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Calendar, Briefcase, 
  Award, Star, DollarSign, Clock, Edit2, Save, X,
  Github, Linkedin, Globe, Plus, Trash2, Upload
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
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'reviews'>('overview');

  // Data Profil
  const [profile, setProfile] = useState({
    name: 'Ahmad Rizki',
    title: 'Frontend Developer',
    email: 'ahmad.rizki@email.com',
    phone: '+62 812-3456-7890',
    location: 'Jakarta, Indonesia',
    joinDate: 'Januari 2024',
    bio: 'Seorang Frontend Developer dengan pengalaman 3+ tahun dalam membangun aplikasi web modern menggunakan React, Next.js, dan TypeScript. Passionate dalam menciptakan user experience yang menarik dan responsif.',
    hourlyRate: 150000,
    completedProjects: 24,
    rating: 4.8,
    responseTime: '2 jam',
    website: 'https://ahmadrizki.dev',
    github: 'github.com/ahmadrizki',
    linkedin: 'linkedin.com/in/ahmadrizki'
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
      description: 'Platform e-commerce modern dengan Next.js dan Stripe',
      link: 'https://example.com'
    },
    {
      id: '2',
      title: 'Dashboard Analytics',
      image: '📊',
      description: 'Dashboard analytics real-time dengan React dan Chart.js',
      link: 'https://example.com'
    },
    {
      id: '3',
      title: 'Social Media App',
      image: '📱',
      description: 'Aplikasi social media dengan fitur chat real-time',
      link: 'https://example.com'
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
    // Implementasi save ke backend di sini
    alert('Profil berhasil diperbarui!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  AR
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition">
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
                      className="text-2xl font-bold border-b-2 border-blue-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={profile.title}
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                      className="text-lg text-gray-600 border-b-2 border-blue-500 focus:outline-none"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
                    <p className="text-lg text-gray-600 mb-4">{profile.title}</p>
                  </>
                )}

                {/* Stats */}
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">{profile.rating}</span>
                    <span className="text-gray-500">(45 ulasan)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                    <span>{profile.completedProjects} proyek selesai</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span>Respon: {profile.responseTime}</span>
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
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan</span>
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    <X className="w-4 h-4" />
                    <span>Batal</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Profil</span>
                </button>
              )}
            </div>
          </div>

          {/* Kontak Info */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-3 text-gray-600">
              <Mail className="w-5 h-5" />
              {isEditing ? (
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="flex-1 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                />
              ) : (
                <span>{profile.email}</span>
              )}
            </div>
            <div className="flex items-center space-x-3 text-gray-600">
              <Phone className="w-5 h-5" />
              {isEditing ? (
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="flex-1 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                />
              ) : (
                <span>{profile.phone}</span>
              )}
            </div>
            <div className="flex items-center space-x-3 text-gray-600">
              <MapPin className="w-5 h-5" />
              {isEditing ? (
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="flex-1 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                />
              ) : (
                <span>{profile.location}</span>
              )}
            </div>
            <div className="flex items-center space-x-3 text-gray-600">
              <Calendar className="w-5 h-5" />
              <span>Bergabung {profile.joinDate}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 font-semibold transition ${
                activeTab === 'overview'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-6 py-4 font-semibold transition ${
                activeTab === 'portfolio'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Portfolio
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-4 font-semibold transition ${
                activeTab === 'reviews'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-600 hover:text-gray-900'
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
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Tentang Saya</h3>
                  {isEditing ? (
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                  )}
                </div>

                {/* Skills */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">Skills</h3>
                    {isEditing && (
                      <button className="text-blue-500 hover:text-blue-600 flex items-center space-x-1">
                        <Plus className="w-4 h-4" />
                        <span>Tambah Skill</span>
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {skills.map((skill) => (
                      <div key={skill.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-700">{skill.name}</span>
                          <span className="text-sm text-gray-500">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pengalaman */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">Pengalaman</h3>
                    {isEditing && (
                      <button className="text-blue-500 hover:text-blue-600 flex items-center space-x-1">
                        <Plus className="w-4 h-4" />
                        <span>Tambah Pengalaman</span>
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                        <p className="text-gray-600">{exp.company}</p>
                        <p className="text-sm text-gray-500 mb-2">{exp.period}</p>
                        <p className="text-gray-700">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Social Media</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <a href={`https://${profile.website}`} className="text-blue-500 hover:underline">
                        {profile.website}
                      </a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Github className="w-5 h-5 text-gray-400" />
                      <a href={`https://${profile.github}`} className="text-blue-500 hover:underline">
                        {profile.github}
                      </a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Linkedin className="w-5 h-5 text-gray-400" />
                      <a href={`https://${profile.linkedin}`} className="text-blue-500 hover:underline">
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
                  <h3 className="text-xl font-bold text-gray-900">Portfolio Saya</h3>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                    <Plus className="w-4 h-4" />
                    <span>Tambah Portfolio</span>
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  {portfolios.map((portfolio) => (
                    <div key={portfolio.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
                      <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-6xl">
                        {portfolio.image}
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{portfolio.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{portfolio.description}</p>
                        <a
                          href={portfolio.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline text-sm"
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
                  <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{review.client}</h4>
                        <p className="text-sm text-gray-500">{review.project}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{review.comment}</p>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}