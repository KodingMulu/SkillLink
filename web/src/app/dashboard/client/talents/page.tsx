'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from "../../DashboardLayout";
import { getApiUrl } from '@/lib/api';
import { Search, Star, MapPin, Briefcase, Filter, ChevronDown, MessageSquare, Heart, Loader2 } from 'lucide-react';
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
      const apiUrl = getApiUrl();
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
      console.error("Error fetching talents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTalents();
    }, 400); 

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, priceRange, ratingFilter]);

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'busy': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getAvailabilityText = (status: string) => {
    switch (status) {
      case 'available': return 'Tersedia';
      case 'busy': return 'Sibuk';
      default: return 'Tidak Tersedia';
    }
  };

  return (
    <DashboardLayout role="client">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Temukan Talenta Terbaik</h1>
        <p className="text-slate-500 text-sm">Jelajahi profesional berbakat yang siap mengerjakan proyek Anda</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama talenta, keahlian, atau gelar..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition font-medium"
          >
            <Filter className="w-4 h-4" />
            Filter
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat, idx) => {
            const catId = cat === 'All Categories' ? 'all' : cat.toLowerCase().replace(/\s+/g, '-');
            return (
              <button
                key={idx}
                onClick={() => setSelectedCategory(catId)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === catId
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-100">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Rentang Tarif</label>
                  <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none">
                    <option value="all">Semua Tarif</option>
                    <option value="0-100k">Rp 0 - 100rb / jam</option>
                    <option value="200k+">Rp 200rb+ / jam</option>
                  </select>
                </div>
             </div>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
          {isLoading ? 'Memuat data talenta...' : (
             <>Menampilkan <span className="font-bold text-slate-900">{talents.length}</span> talenta profesional</>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
          <p className="text-slate-500 text-xs font-medium">Mencari talenta terbaik...</p>
        </div>
      ) : talents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
          <p className="text-slate-500 text-sm font-medium">Tidak ada talenta yang ditemukan.</p>
          <button onClick={() => {setSearchQuery(''); setSelectedCategory('all');}} className="mt-2 text-xs font-bold text-blue-600 hover:underline">
            Reset Filter Pencarian
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {talents.map((talent) => (
            <div
              key={talent.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:border-slate-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center text-lg font-bold uppercase">
                      {talent.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base truncate w-36">{talent.name}</h3>
                      <p className="text-slate-500 text-xs truncate w-36">{talent.title}</p>
                    </div>
                  </div>
                  <button className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-slate-900 text-xs">{talent.rating}</span>
                    <span className="text-slate-400 text-xs">({talent.reviews})</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getAvailabilityColor(talent.availability)}`}>
                    {getAvailabilityText(talent.availability)}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{talent.location}</span>
                </div>
                <p className="text-slate-600 text-xs mb-4 line-clamp-2 leading-relaxed">{talent.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {talent.skills.slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                  {talent.skills.length > 3 && (
                    <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-md text-[11px] font-semibold">
                      +{talent.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <div className="grid grid-cols-2 gap-2 mb-4 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Proyek Selesai</span>
                    <span className="font-bold text-slate-900">{talent.completedProjects} Proyek</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Estimasi Tarif</span>
                    <span className="font-bold text-blue-600">{talent.hourlyRate}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a 
                    href={`/dashboard/client/messages`}
                    className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-bold text-xs text-center shadow-sm"
                  >
                    Rekrut Talenta
                  </a>
                  <a 
                    href={`/dashboard/client/messages`}
                    className="p-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition flex items-center justify-center"
                    title="Kirim Pesan"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}