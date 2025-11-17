'use client'

import { useState } from 'react';
import { Search, Menu, X, Briefcase, Clock, MapPin, Star, TrendingUp, Code, Palette, PenTool, Camera, Music, Video, Filter, ChevronDown, Heart, DollarSign, Users, Award } from 'lucide-react';

export default function FreelancePlatform() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('projects');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { icon: <Code className="w-5 h-5" />, name: "Programming", count: "2.5k+" },
    { icon: <Palette className="w-5 h-5" />, name: "Design", count: "1.8k+" },
    { icon: <PenTool className="w-5 h-5" />, name: "Writing", count: "950+" },
    { icon: <Camera className="w-5 h-5" />, name: "Photography", count: "680+" },
    { icon: <Music className="w-5 h-5" />, name: "Audio", count: "420+" },
    { icon: <Video className="w-5 h-5" />, name: "Video", count: "780+" },
  ];

  const projects = [
    {
      id: 1,
      title: "Website E-Commerce Modern",
      category: "Web Development",
      budget: "Rp 5.000.000 - Rp 10.000.000",
      duration: "2-3 bulan",
      description: "Membutuhkan developer untuk membuat website e-commerce dengan fitur payment gateway, dashboard admin, dan integrasi ekspedisi.",
      skills: ["React", "Node.js", "MongoDB", "Payment Gateway"],
      proposals: 12,
      postedTime: "2 jam yang lalu",
      client: {
        name: "PT Digital Indonesia",
        rating: 4.8,
        reviews: 45,
        verified: true
      }
    },
    {
      id: 2,
      title: "Logo & Brand Identity Design",
      category: "Graphic Design",
      budget: "Rp 2.000.000 - Rp 4.000.000",
      duration: "2-4 minggu",
      description: "Startup teknologi mencari designer untuk membuat logo, brand guidelines, dan asset visual lainnya.",
      skills: ["Adobe Illustrator", "Branding", "Logo Design"],
      proposals: 28,
      postedTime: "5 jam yang lalu",
      client: {
        name: "TechStart Ventures",
        rating: 4.9,
        reviews: 32,
        verified: true
      }
    },
    {
      id: 3,
      title: "Mobile App Development - iOS & Android",
      category: "Mobile Development",
      budget: "Rp 15.000.000 - Rp 25.000.000",
      duration: "3-4 bulan",
      description: "Pengembangan aplikasi mobile untuk platform ride-sharing dengan fitur real-time tracking, payment, dan rating system.",
      skills: ["React Native", "Firebase", "Google Maps API", "Socket.io"],
      proposals: 8,
      postedTime: "1 hari yang lalu",
      client: {
        name: "Mobility Solutions",
        rating: 5.0,
        reviews: 67,
        verified: true
      }
    },
    {
      id: 4,
      title: "Content Writer untuk Blog Teknologi",
      category: "Content Writing",
      budget: "Rp 500.000 - Rp 1.000.000",
      duration: "Ongoing",
      description: "Mencari content writer berpengalaman untuk menulis artikel teknologi, tutorial, dan review produk. 8-10 artikel per bulan.",
      skills: ["SEO Writing", "Tech Writing", "Research"],
      proposals: 35,
      postedTime: "3 hari yang lalu",
      client: {
        name: "Tech Media Group",
        rating: 4.7,
        reviews: 89,
        verified: true
      }
    }
  ];

  const topFreelancers = [
    {
      name: "Andi Wijaya",
      title: "Full Stack Developer",
      rating: 5.0,
      reviews: 127,
      hourlyRate: "Rp 150.000/jam",
      skills: ["React", "Node.js", "Python"],
      avatar: "AW",
      completed: 98,
      successRate: "99%"
    },
    {
      name: "Sarah Putri",
      title: "UI/UX Designer",
      rating: 4.9,
      reviews: 94,
      hourlyRate: "Rp 120.000/jam",
      skills: ["Figma", "Adobe XD", "Prototyping"],
      avatar: "SP",
      completed: 76,
      successRate: "98%"
    },
    {
      name: "Rudi Hermawan",
      title: "Mobile Developer",
      rating: 5.0,
      reviews: 82,
      hourlyRate: "Rp 140.000/jam",
      skills: ["Flutter", "React Native", "Swift"],
      avatar: "RH",
      completed: 65,
      successRate: "100%"
    }
  ];

  const stats = [
    { icon: <Briefcase className="w-6 h-6" />, value: "10,000+", label: "Proyek Selesai" },
    { icon: <Users className="w-6 h-6" />, value: "5,000+", label: "Freelancer Aktif" },
    { icon: <Award className="w-6 h-6" />, value: "98%", label: "Success Rate" },
    { icon: <DollarSign className="w-6 h-6" />, value: "Rp 50M+", label: "Total Pembayaran" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-800">FreelanceHub</span>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <button className="text-gray-700 hover:text-green-600 transition font-medium">Cari Pekerjaan</button>
              <button className="text-gray-700 hover:text-green-600 transition font-medium">Cari Freelancer</button>
              <button className="text-gray-700 hover:text-green-600 transition font-medium">Cara Kerja</button>
              <button className="text-gray-700 hover:text-green-600 transition font-medium">Blog</button>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button className="text-gray-700 hover:text-green-600 transition font-medium">
                Masuk
              </button>
              <button className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-blue-700 transition font-medium">
                Daftar
              </button>
              <button className="border-2 border-green-500 text-green-600 px-6 py-2 rounded-lg hover:bg-green-50 transition font-medium">
                Post Project
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              <button className="block w-full text-left py-2 text-gray-700">Cari Pekerjaan</button>
              <button className="block w-full text-left py-2 text-gray-700">Cari Freelancer</button>
              <button className="block w-full text-left py-2 text-gray-700">Cara Kerja</button>
              <button className="block w-full text-left py-2 text-gray-700">Blog</button>
              <button className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-2 rounded-lg mt-2">
                Masuk
              </button>
              <button className="w-full border-2 border-green-500 text-green-600 py-2 rounded-lg">
                Daftar
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Temukan <span className="bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">Freelancer Terbaik</span>
            <br />untuk Proyekmu
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Platform terpercaya yang menghubungkan klien dengan freelancer profesional di Indonesia
          </p>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-3 flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pekerjaan atau freelancer..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <Filter className="w-5 h-5" />
              Filter
            </button>
            <button className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 transition">
              Cari
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-5xl mx-auto">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-green-500 mb-2 flex justify-center">{stat.icon}</div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Kategori Populer</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, idx) => (
              <button
                key={idx}
                className="p-6 bg-gray-50 rounded-xl hover:bg-gradient-to-br hover:from-green-500 hover:to-blue-600 hover:text-white transition group"
              >
                <div className="text-green-500 group-hover:text-white mb-3 flex justify-center">
                  {category.icon}
                </div>
                <div className="font-semibold mb-1">{category.name}</div>
                <div className="text-sm text-gray-600 group-hover:text-white/80">{category.count}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-8 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-4 mb-8 border-b">
            <button
              onClick={() => setActiveTab('projects')}
              className={`pb-4 px-6 font-semibold transition ${
                activeTab === 'projects'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Proyek Terbaru
            </button>
            <button
              onClick={() => setActiveTab('freelancers')}
              className={`pb-4 px-6 font-semibold transition ${
                activeTab === 'freelancers'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Top Freelancer
            </button>
          </div>

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {projects.map((project) => (
                <div key={project.id} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 hover:text-green-600 cursor-pointer">
                          {project.title}
                        </h3>
                        {project.client.verified && (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {project.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {project.postedTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {project.proposals} proposals
                        </span>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-red-500 transition">
                      <Heart className="w-6 h-6" />
                    </button>
                  </div>

                  <p className="text-gray-600 mb-4">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.skills.map((skill, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-6">
                      <div>
                        <div className="text-sm text-gray-600">Budget</div>
                        <div className="font-bold text-gray-900">{project.budget}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Duration</div>
                        <div className="font-bold text-gray-900">{project.duration}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Client</div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{project.client.name}</span>
                          <div className="flex items-center gap-1 text-yellow-400">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm text-gray-700">{project.client.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 transition">
                      Kirim Proposal
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Freelancers Tab */}
          {activeTab === 'freelancers' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topFreelancers.map((freelancer, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {freelancer.avatar}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{freelancer.name}</h3>
                        <p className="text-gray-600 text-sm">{freelancer.title}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-semibold text-gray-900">{freelancer.rating}</span>
                          <span className="text-sm text-gray-600">({freelancer.reviews})</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {freelancer.skills.map((skill, i) => (
                      <span key={i} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-600">Completed</div>
                      <div className="font-bold text-gray-900">{freelancer.completed} jobs</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Success Rate</div>
                      <div className="font-bold text-green-600">{freelancer.successRate}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="font-bold text-gray-900">{freelancer.hourlyRate}</div>
                    <button className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 transition">
                      Hire Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-500 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Mulai Karirmu sebagai Freelancer!
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Bergabunglah dengan ribuan freelancer sukses dan dapatkan proyek impianmu
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition duration-200 shadow-lg">
              Daftar sebagai Freelancer
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition">
              Post Proyek Gratis
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold">FreelanceHub</span>
              </div>
              <p className="text-gray-400">Platform freelance terpercaya di Indonesia</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Untuk Freelancer</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white transition">Cari Pekerjaan</button></li>
                <li><button className="hover:text-white transition">Cara Kerja</button></li>
                <li><button className="hover:text-white transition">Success Stories</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Untuk Client</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white transition">Post Proyek</button></li>
                <li><button className="hover:text-white transition">Cari Freelancer</button></li>
                <li><button className="hover:text-white transition">Harga</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Bantuan</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white transition">FAQ</button></li>
                <li><button className="hover:text-white transition">Kontak</button></li>
                <li><button className="hover:text-white transition">Kebijakan</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 FreelanceHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}