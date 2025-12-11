'use client';

import React, { useState } from 'react';
import { Search, Star, MapPin, Briefcase, DollarSign, Filter, X, ChevronDown } from 'lucide-react';

interface Talent {
  id: number;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  reviews: number;
  location: string;
  hourlyRate: string;
  skills: string[];
  completedProjects: number;
  description: string;
  availability: 'available' | 'busy' | 'unavailable';
}

export default function TalentaPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');

  const categories = [
    'All Categories',
    'Web Development',
    'Mobile Development',
    'UI/UX Design',
    'Content Writing',
    'Digital Marketing',
    'Graphic Design',
    'Video Editing'
  ];

  const talents: Talent[] = [
    {
      id: 1,
      name: 'Budi Santoso',
      title: 'UI/UX Designer',
      avatar: 'B',
      rating: 4.9,
      reviews: 127,
      location: 'Jakarta, Indonesia',
      hourlyRate: 'Rp 150.000',
      skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
      completedProjects: 89,
      description: 'Experienced UI/UX designer with 5+ years creating beautiful and functional interfaces.',
      availability: 'available'
    },
    {
      id: 2,
      name: 'Siti Aminah',
      title: 'Content Writer',
      avatar: 'S',
      rating: 5.0,
      reviews: 95,
      location: 'Bandung, Indonesia',
      hourlyRate: 'Rp 100.000',
      skills: ['SEO Writing', 'Copywriting', 'Blog Posts', 'Social Media'],
      completedProjects: 156,
      description: 'Professional content writer specializing in SEO-optimized articles and engaging copy.',
      availability: 'available'
    },
    {
      id: 3,
      name: 'Ahmad Rizki',
      title: 'Full Stack Developer',
      avatar: 'A',
      rating: 4.8,
      reviews: 203,
      location: 'Surabaya, Indonesia',
      hourlyRate: 'Rp 200.000',
      skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
      completedProjects: 142,
      description: 'Senior developer with expertise in building scalable web applications.',
      availability: 'busy'
    },
    {
      id: 4,
      name: 'Dewi Lestari',
      title: 'Digital Marketing Specialist',
      avatar: 'D',
      rating: 4.9,
      reviews: 88,
      location: 'Yogyakarta, Indonesia',
      hourlyRate: 'Rp 120.000',
      skills: ['Google Ads', 'Facebook Ads', 'SEO', 'Analytics'],
      completedProjects: 67,
      description: 'Digital marketing expert helping businesses grow their online presence.',
      availability: 'available'
    },
    {
      id: 5,
      name: 'Rudi Hartono',
      title: 'Mobile App Developer',
      avatar: 'R',
      rating: 4.7,
      reviews: 145,
      location: 'Bali, Indonesia',
      hourlyRate: 'Rp 180.000',
      skills: ['React Native', 'Flutter', 'iOS', 'Android'],
      completedProjects: 98,
      description: 'Mobile developer creating native and cross-platform applications.',
      availability: 'available'
    },
    {
      id: 6,
      name: 'Lisa Permata',
      title: 'Graphic Designer',
      avatar: 'L',
      rating: 5.0,
      reviews: 112,
      location: 'Medan, Indonesia',
      hourlyRate: 'Rp 130.000',
      skills: ['Photoshop', 'Illustrator', 'Branding', 'Print Design'],
      completedProjects: 178,
      description: 'Creative graphic designer specializing in branding and visual identity.',
      availability: 'available'
    }
  ];

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'busy':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getAvailabilityText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'busy':
        return 'Busy';
      default:
        return 'Unavailable';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Temukan Talenta Terbaik</h1>
              <p className="text-gray-600 mt-1">Jelajahi {talents.length} profesional berbakat siap membantu proyek Anda</p>
            </div>
            
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari talenta, skill, atau kategori..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat.toLowerCase().replace(' ', '-'))}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  selectedCategory === cat.toLowerCase().replace(' ', '-')
                    ? 'bg-teal-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Menampilkan <span className="font-semibold text-gray-900">{talents.length}</span> talenta
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <Filter className="w-4 h-4" />
              Filter
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="all">All Prices</option>
                    <option value="0-100k">Rp 0 - 100k</option>
                    <option value="100k-200k">Rp 100k - 200k</option>
                    <option value="200k+">Rp 200k+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4+">4+ Stars</option>
                    <option value="3+">3+ Stars</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setPriceRange('all');
                      setRatingFilter('all');
                    }}
                    className="w-full px-4 py-2 text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50 transition"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Talent Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {talents.map((talent) => (
            <div
              key={talent.id}
              className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Card Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {talent.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{talent.name}</h3>
                      <p className="text-gray-600 text-sm">{talent.title}</p>
                    </div>
                  </div>
                </div>

                {/* Rating & Location */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900">{talent.rating}</span>
                    <span className="text-gray-500 text-sm">({talent.reviews})</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getAvailabilityColor(talent.availability)}`}>
                    {getAvailabilityText(talent.availability)}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{talent.location}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{talent.description}</p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {talent.skills.slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {talent.skills.length > 3 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                      +{talent.skills.length - 3}
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t">
                  <div>
                    <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
                      <Briefcase className="w-3.5 h-3.5" />
                      Projects
                    </div>
                    <div className="font-bold text-gray-900">{talent.completedProjects}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
                      <DollarSign className="w-3.5 h-3.5" />
                      Hourly Rate
                    </div>
                    <div className="font-bold text-gray-900">{talent.hourlyRate}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg hover:from-teal-600 hover:to-blue-600 transition font-medium">
                    Hire Now
                  </button>
                  <button className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="px-6 py-3 border-2 border-teal-500 text-teal-600 rounded-lg hover:bg-teal-50 transition font-medium">
            Load More Talents
          </button>
        </div>
      </div>
    </div>
  );
}