import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, 
  ActivityIndicator, RefreshControl, Image 
} from 'react-native';
import { 
  Search, Star, MapPin, Briefcase, DollarSign, Filter, ChevronDown, 
  MessageSquare, Heart, Loader2 
} from 'lucide-react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export default function ClientTalentsPage() {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      const token = await AsyncStorage.getItem('token');
      
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);

      const response = await axios.get(`${apiUrl}/user/client/?${params.toString()}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.code === 200) {
        setTalents(response.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTalents();
    }, 500); 

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTalents();
  }, []);

  const getAvailabilityStyle = (status: string) => {
    switch (status) {
      case 'available': return { bg: '#D1FAE5', text: '#047857', label: 'Available' };
      case 'busy': return { bg: '#FEF3C7', text: '#B45309', label: 'Busy' };
      default: return { bg: '#F1F5F9', text: '#334155', label: 'Unavailable' };
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Temukan Talenta</Text>
          <Text style={styles.subtitle}>Jelajahi profesional berbakat</Text>
        </View>

        <View style={styles.filterSection}>
          <View style={styles.searchRow}>
            <View style={styles.searchInputContainer}>
              <Search size={20} color="#94A3B8" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Cari talenta, skill..."
                placeholderTextColor="#94A3B8"
              />
            </View>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setShowFilters(!showFilters)}
            >
              <Filter size={20} color="#334155" />
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {categories.map((cat, idx) => {
              const value = cat.toLowerCase().replace(' ', '-');
              const isSelected = selectedCategory === value;
              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setSelectedCategory(value)}
                  style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
                >
                  <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.resultCount}>
            <Text style={styles.resultText}>
              Menampilkan <Text style={styles.resultNumber}>{talents.length}</Text> talenta
            </Text>
          </View>
        </View>

        {isLoading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.loadingText}>Mencari talenta terbaik...</Text>
          </View>
        ) : talents.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Tidak ada talenta ditemukan</Text>
            <TouchableOpacity onPress={() => {setSearchQuery(''); setSelectedCategory('all');}}>
              <Text style={styles.resetText}>Reset Pencarian</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.talentList}>
            {talents.map((talent) => {
              const availStyle = getAvailabilityStyle(talent.availability);
              return (
                <View key={talent.id} style={styles.talentCard}>
                  <View style={styles.cardHeader}>
                    <View style={styles.userInfo}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{talent.avatar}</Text>
                      </View>
                      <View style={styles.nameSection}>
                        <Text style={styles.talentName} numberOfLines={1}>{talent.name}</Text>
                        <Text style={styles.talentTitle} numberOfLines={1}>{talent.title}</Text>
                      </View>
                    </View>
                    <TouchableOpacity style={styles.heartBtn}>
                      <Heart size={20} color="#94A3B8" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.ratingRow}>
                    <View style={styles.ratingBadge}>
                      <Star size={14} color="#FACC15" fill="#FACC15" />
                      <Text style={styles.ratingText}>{talent.rating}</Text>
                      <Text style={styles.reviewText}>({talent.reviews})</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: availStyle.bg }]}>
                      <Text style={[styles.statusText, { color: availStyle.text }]}>
                        {availStyle.label}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.locationRow}>
                    <MapPin size={14} color="#64748B" />
                    <Text style={styles.locationText}>{talent.location}</Text>
                  </View>

                  <Text style={styles.description} numberOfLines={2}>
                    {talent.description}
                  </Text>

                  <View style={styles.skillsContainer}>
                    {talent.skills.slice(0, 3).map((skill, idx) => (
                      <View key={idx} style={styles.skillBadge}>
                        <Text style={styles.skillText}>{skill}</Text>
                      </View>
                    ))}
                    {talent.skills.length > 3 && (
                      <View style={styles.skillBadgeMore}>
                        <Text style={styles.skillTextMore}>+{talent.skills.length - 3}</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <View style={styles.statLabelRow}>
                        <Briefcase size={12} color="#64748B" />
                        <Text style={styles.statLabel}>Projects</Text>
                      </View>
                      <Text style={styles.statValue}>{talent.completedProjects}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <View style={styles.statLabelRow}>
                        <DollarSign size={12} color="#64748B" />
                        <Text style={styles.statLabel}>Rate</Text>
                      </View>
                      <Text style={styles.statValue}>{talent.hourlyRate}</Text>
                    </View>
                  </View>

                  <View style={styles.actionButtons}>
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
  scrollContent: {
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
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  filterSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
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
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 14,
    color: '#0F172A',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  categoriesScroll: {
    flexGrow: 0,
    marginBottom: 16,
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
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  categoryTextActive: {
    color: 'white',
  },
  resultCount: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  resultText: {
    fontSize: 12,
    color: '#64748B',
  },
  resultNumber: {
    fontWeight: 'bold',
    color: '#0F172A',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#64748B',
    fontSize: 14,
  },
  emptyState: {
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
  },
  resetText: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 14,
  },
  talentList: {
    gap: 16,
  },
  talentCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  nameSection: {
    flex: 1,
  },
  talentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  talentTitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  heartBtn: {
    padding: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  reviewText: {
    fontSize: 12,
    color: '#64748B',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 12,
    color: '#64748B',
  },
  description: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 16,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  skillBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  skillText: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '600',
  },
  skillBadgeMore: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  skillTextMore: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
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
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  hireBtn: {
    flex: 1,
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hireBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  messageBtn: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
  },
});