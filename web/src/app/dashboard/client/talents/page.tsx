'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from "../../DashboardLayout";
import { Search, Star, MapPin, Briefcase, DollarSign, Filter, ChevronDown, MessageSquare, Heart, Loader2 } from 'lucide-react';
import axios from 'axios';

interface Talent {
  id: string; 
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

export default function TalentsPage() {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  const fetchTalents = async () => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (priceRange !== 'all') params.append('price', priceRange);
      if (ratingFilter !== 'all') params.append('rating', ratingFilter);

      const response = await axios.get(`${apiUrl}/user/client/talents?${params.toString()}`, {
        withCredentials: true
      });
      
      if (response.data.code === 200) {
        setTalents(response.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTalents();
    }, 500); 

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, priceRange, ratingFilter]);


  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-emerald-100 text-emerald-700';
      case 'busy': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getAvailabilityText = (status: string) => {
    switch (status) {
      case 'available': return 'Available';
      case 'busy': return 'Busy';
      default: return 'Unavailable';
    }
  };

  return (
    <DashboardLayout role="client">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Temukan Talenta Terbaik</h1>
        <p className="text-slate-500">Jelajahi profesional berbakat siap membantu proyek Anda</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari talenta, skill, atau kategori..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition whitespace-nowrap"
          >
            <Filter className="w-4 h-4" />
            Filter
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat.toLowerCase().replace(' ', '-'))}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                selectedCategory === cat.toLowerCase().replace(' ', '-')
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-200">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Price Range</label>
                  <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                    <option value="all">All Prices</option>
                    <option value="0-100k">Rp 0 - 100k</option>
                    <option value="200k+">Rp 200k+</option>
                  </select>
                </div>
             </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-slate-200 text-sm text-slate-600">
          {isLoading ? 'Memuat data...' : (
             <>Menampilkan <span className="font-semibold text-slate-900">{talents.length}</span> talenta</>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
          <p className="text-slate-500">Mencari talenta terbaik...</p>
        </div>
      ) : talents.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <p className="text-slate-500 font-medium">Tidak ada talenta yang ditemukan.</p>
          <button onClick={() => {setSearchQuery(''); setSelectedCategory('all');}} className="mt-2 text-blue-600 hover:underline">
            Reset Pencarian
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {talents.map((talent) => (
            <div
              key={talent.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg uppercase">
                      {talent.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg truncate w-32">{talent.name}</h3>
                      <p className="text-slate-600 text-sm truncate w-32">{talent.title}</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                    <Heart className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-slate-900">{talent.rating}</span>
                    <span className="text-slate-500 text-sm">({talent.reviews})</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getAvailabilityColor(talent.availability)}`}>
                    {getAvailabilityText(talent.availability)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-slate-600 mb-4">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{talent.location}</span>
                </div>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2 h-10">{talent.description}</p>

                <div className="flex flex-wrap gap-2 mb-4 h-16 content-start">
                  {talent.skills.slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {talent.skills.length > 3 && (
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">
                      +{talent.skills.length - 3}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-slate-100">
                  <div>
                    <div className="flex items-center gap-1 text-slate-500 text-xs mb-1">
                      <Briefcase className="w-3.5 h-3.5" />
                      Projects
                    </div>
                    <div className="font-bold text-slate-900">{talent.completedProjects}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-slate-500 text-xs mb-1">
                      <DollarSign className="w-3.5 h-3.5" />
                      Hourly Rate
                    </div>
                    <div className="font-bold text-slate-900">{talent.hourlyRate}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-lg shadow-blue-600/20">
                    Hire Now
                  </button>
                  <button className="p-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition">
                    <MessageSquare className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}