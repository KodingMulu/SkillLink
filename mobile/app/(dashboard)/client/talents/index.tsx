import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator, Image, Dimensions
} from 'react-native';
import {
  Search, Star, MapPin, Briefcase, DollarSign,
  Filter, ChevronDown, MessageSquare, Heart
} from 'lucide-react-native';
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

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function TalentsScreen() {
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
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (priceRange !== 'all') params.append('price', priceRange);
      if (ratingFilter !== 'all') params.append('rating', ratingFilter);

      const response = await axios.get(`${API_URL}/user/client/talents?${params.toString()}`, {
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

  const getAvailabilityStyle = (status: string) => {
    switch (status) {
      case 'available': return { bg: '#D1FAE5', text: '#047857', label: 'Available' };
      case 'busy': return { bg: '#FEF9C3', text: '#A16207', label: 'Busy' };
      default: return { bg: '#F1F5F9', text: '#475569', label: 'Unavailable' };
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Temukan Talenta Terbaik</Text>
          <Text style={styles.subtitle}>Jelajahi profesional berbakat siap membantu proyek Anda</Text>
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchRow}>
            <View style={styles.searchInputContainer}>
              <Search size={20} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Cari talenta, skill, atau kategori..."
                placeholderTextColor="#94A3B8"
              />
            </View>
            <TouchableOpacity
              style={styles.filterBtn}
              onPress={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} color="#334155" />
              <Text style={styles.filterBtnText}>Filter</Text>
              <ChevronDown size={16} color="#334155" style={{ transform: [{ rotate: showFilters ? '180deg' : '0deg' }] }} />
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map((cat, idx) => {
              const value = cat.toLowerCase().replace(' ', '-');
              const isSelected = selectedCategory === value;
              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setSelectedCategory(value)}
                  style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
                >
                  <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>{cat}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {showFilters && (
            <View style={styles.expandedFilters}>
              <Text style={styles.filterLabel}>Price Range</Text>
              <View style={styles.pickerContainer}>
                <TouchableOpacity onPress={() => setPriceRange('all')} style={[styles.filterOption, priceRange === 'all' && styles.filterOptionActive]}><Text style={[styles.filterOptionText, priceRange === 'all' && styles.filterOptionTextActive]}>All Prices</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setPriceRange('0-100k')} style={[styles.filterOption, priceRange === '0-100k' && styles.filterOptionActive]}><Text style={[styles.filterOptionText, priceRange === '0-100k' && styles.filterOptionTextActive]}>0 - 100k</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setPriceRange('200k+')} style={[styles.filterOption, priceRange === '200k+' && styles.filterOptionActive]}><Text style={[styles.filterOptionText, priceRange === '200k+' && styles.filterOptionTextActive]}>200k+</Text></TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.resultCount}>
            {isLoading ? (
              <Text style={styles.resultText}>Memuat data...</Text>
            ) : (
              <Text style={styles.resultText}>Menampilkan <Text style={styles.boldText}>{talents.length}</Text> talenta</Text>
            )}
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.loadingText}>Mencari talenta terbaik...</Text>
          </View>
        ) : talents.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Tidak ada talenta yang ditemukan.</Text>
            <TouchableOpacity onPress={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
              <Text style={styles.resetText}>Reset Pencarian</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.grid}>
            {talents.map((talent) => {
              const availability = getAvailabilityStyle(talent.availability);
              return (
                <View key={talent.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.userInfo}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{talent.avatar}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.userName} numberOfLines={1}>{talent.name}</Text>
                        <Text style={styles.userTitle} numberOfLines={1}>{talent.title}</Text>
                      </View>
                    </View>
                    <TouchableOpacity style={styles.heartBtn}>
                      <Heart size={20} color="#94A3B8" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.ratingRow}>
                    <View style={styles.ratingContainer}>
                      <Star size={16} color="#FACC15" fill="#FACC15" />
                      <Text style={styles.ratingValue}>{talent.rating}</Text>
                      <Text style={styles.ratingCount}>({talent.reviews})</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: availability.bg }]}>
                      <Text style={[styles.statusText, { color: availability.text }]}>{availability.label}</Text>
                    </View>
                  </View>

                  <View style={styles.locationRow}>
                    <MapPin size={16} color="#94A3B8" />
                    <Text style={styles.locationText}>{talent.location}</Text>
                  </View>

                  <Text style={styles.description} numberOfLines={2}>{talent.description}</Text>

                  <View style={styles.skillsContainer}>
                    {talent.skills.slice(0, 3).map((skill, idx) => (
                      <View key={idx} style={styles.skillBadge}>
                        <Text style={styles.skillText}>{skill}</Text>
                      </View>
                    ))}
                    {talent.skills.length > 3 && (
                      <View style={styles.skillMore}>
                        <Text style={styles.skillMoreText}>+{talent.skills.length - 3}</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <View style={styles.statLabelRow}>
                        <Briefcase size={14} color="#64748B" />
                        <Text style={styles.statLabel}>Projects</Text>
                      </View>
                      <Text style={styles.statValue}>{talent.completedProjects}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <View style={styles.statLabelRow}>
                        <DollarSign size={14} color="#64748B" />
                        <Text style={styles.statLabel}>Hourly Rate</Text>
                      </View>
                      <Text style={styles.statValue}>{talent.hourlyRate}</Text>
                    </View>
                  </View>

                  <View style={styles.cardFooter}>
                    <TouchableOpacity style={styles.hireBtn}>
                      <Text style={styles.hireBtnText}>Hire Now</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.messageBtn}>
                      <MessageSquare size={20} color="#334155" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  searchSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    height: 48,
  },
  filterBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
  },
  categoryScroll: {
    marginBottom: 8,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  categoryPillActive: {
    backgroundColor: '#2563EB',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#334155',
  },
  categoryTextActive: {
    color: 'white',
  },
  expandedFilters: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  pickerContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
  },
  filterOptionActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  filterOptionText: {
    fontSize: 12,
    color: '#64748B',
  },
  filterOptionTextActive: {
    color: '#2563EB',
    fontWeight: '600',
  },
  resultCount: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  resultText: {
    fontSize: 13,
    color: '#475569',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#0F172A',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    color: '#64748B',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  emptyText: {
    color: '#64748B',
    marginBottom: 8,
  },
  resetText: {
    color: '#2563EB',
    fontWeight: '600',
  },
  grid: {
    gap: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
    marginRight: 10,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 2,
  },
  userTitle: {
    fontSize: 14,
    color: '#64748B',
  },
  heartBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  ratingCount: {
    fontSize: 13,
    color: '#64748B',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 13,
    color: '#64748B',
  },
  description: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 16,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
    height: 32,
    overflow: 'hidden',
  },
  skillBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  skillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1D4ED8',
  },
  skillMore: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  skillMoreText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 12,
  },
  hireBtn: {
    flex: 1,
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  hireBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  messageBtn: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
});