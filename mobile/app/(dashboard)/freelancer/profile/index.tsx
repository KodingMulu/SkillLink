import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, 
  ActivityIndicator, RefreshControl, Share, Linking, Alert 
} from 'react-native';
import { 
  User, Mail, MapPin, Briefcase, Star, Clock, Edit2, Github, Linkedin, 
  Globe, Download, Share2, Layers, ExternalLink, Plus 
} from 'lucide-react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

type TabType = 'overview' | 'portfolio' | 'reviews';

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
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

  const fetchProfile = async () => {
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      const token = await AsyncStorage.getItem('token');
      
      const response = await axios.get(`${apiUrl}/user/freelancer/profile`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });

      if (response.data.code === 200) {
        setProfile(response.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProfile();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
  };

  const handleDownloadCV = () => {
    Alert.alert("Info", "Fitur Download CV akan segera tersedia!");
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Lihat profil ${profile.name} di SkillLink!`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const openLink = (url: string) => {
    if (url && url !== '#') {
      const finalUrl = url.startsWith('http') ? url : `https://${url}`;
      Linking.openURL(finalUrl).catch(err => console.error(err));
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <View style={styles.tabContent}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Kontak & Info</Text>
              <View style={styles.contactItem}>
                <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
                  <Mail size={16} color="#2563EB" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>EMAIL</Text>
                  <Text style={styles.value} numberOfLines={1}>{profile.email}</Text>
                </View>
              </View>
              <View style={styles.contactItem}>
                <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
                  <Clock size={16} color="#059669" />
                </View>
                <View>
                  <Text style={styles.label}>RESPON</Text>
                  <Text style={styles.value}>{profile.responseTime}</Text>
                </View>
              </View>

              <View style={styles.divider} />
              
              <Text style={[styles.label, { marginBottom: 10 }]}>SOCIALS</Text>
              <View style={styles.socialRow}>
                <TouchableOpacity onPress={() => openLink(profile.github)} style={styles.socialBtn}>
                  <Github size={18} color="#64748B" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openLink(profile.linkedin)} style={styles.socialBtn}>
                  <Linkedin size={18} color="#64748B" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openLink(profile.website)} style={styles.socialBtn}>
                  <Globe size={18} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
                  <User size={18} color="#2563EB" />
                </View>
                <Text style={styles.cardTitle}>Tentang Saya</Text>
              </View>
              <Text style={styles.bioText}>
                {profile.bio || "Halo! Saya belum menulis bio."}
              </Text>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: '#EEF2FF' }]}>
                  <Layers size={18} color="#4F46E5" />
                </View>
                <Text style={styles.cardTitle}>Keahlian & Tools</Text>
              </View>
              <View style={styles.skillsContainer}>
                {profile.skills.length > 0 ? (
                  profile.skills.map((skill, index) => (
                    <View key={index} style={styles.skillBadge}>
                      <Text style={styles.skillText}>{skill}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.emptyText}>Belum ada keahlian ditambahkan.</Text>
                )}
              </View>
            </View>
          </View>
        );

      case 'portfolio':
        return (
          <View style={styles.tabContent}>
            <TouchableOpacity style={styles.addProjectBtn}>
              <Plus size={24} color="#94A3B8" />
              <Text style={styles.addProjectText}>Tambah Proyek Baru</Text>
            </TouchableOpacity>

            {profile.portfolios.map((item) => (
              <View key={item.id} style={styles.portfolioCard}>
                <View style={styles.portfolioImageContainer}>
                  {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.portfolioImage} />
                  ) : (
                    <View style={styles.portfolioPlaceholder}>
                      <Layers size={32} color="#CBD5E1" />
                    </View>
                  )}
                  {item.link && (
                    <TouchableOpacity onPress={() => openLink(item.link!)} style={styles.externalLinkBtn}>
                      <ExternalLink size={16} color="#0F172A" />
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.portfolioContent}>
                  <View style={styles.tagsRow}>
                    {item.tags.slice(0, 3).map((tag, idx) => (
                      <View key={idx} style={styles.tagBadge}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                  <Text style={styles.portfolioTitle}>{item.title}</Text>
                  <Text style={styles.portfolioDesc} numberOfLines={3}>{item.description}</Text>
                </View>
              </View>
            ))}
          </View>
        );

      case 'reviews':
        return (
          <View style={styles.tabContent}>
            <View style={[styles.card, styles.ratingSummary]}>
              <View>
                <Text style={styles.label}>TOTAL RATING</Text>
                <Text style={styles.ratingBig}>{profile.rating}</Text>
                <View style={styles.starRow}>
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      color="#F59E0B" 
                      fill={i < Math.round(profile.rating) ? "#F59E0B" : "transparent"} 
                    />
                  ))}
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.reviewCountBig}>{profile.reviewCount}</Text>
                <Text style={styles.label}>ULASAN</Text>
              </View>
            </View>

            {profile.reviews.length === 0 ? (
              <View style={styles.emptyReview}>
                <Star size={32} color="#CBD5E1" />
                <Text style={styles.emptyText}>Belum ada ulasan.</Text>
              </View>
            ) : (
              profile.reviews.map((r) => (
                <View key={r.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewAvatar}>
                      <Text style={styles.reviewInitials}>{r.clientName.charAt(0)}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.reviewerName}>{r.clientName}</Text>
                      <Text style={styles.reviewDate}>{formatDate(r.date)}</Text>
                    </View>
                    <View style={styles.reviewRatingBadge}>
                      <Star size={10} color="#B45309" fill="#B45309" />
                      <Text style={styles.reviewRatingText}>{r.rating}.0</Text>
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{r.comment || 'Tidak ada komentar.'}</Text>
                </View>
              ))
            )}
          </View>
        );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />}
    >
      <View style={styles.banner}>
        <View style={styles.bannerOverlay} />
      </View>

      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{profile.avatar}</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>OPEN TO WORK</Text>
          </View>
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.jobTitle}>{profile.title}</Text>
          
          <View style={styles.statsRow}>
            <View style={[styles.statBadge, { backgroundColor: '#FFFBEB', borderColor: '#FEF3C7' }]}>
              <Star size={12} color="#D97706" fill="#D97706" />
              <Text style={[styles.statText, { color: '#B45309' }]}>
                {profile.rating} ({profile.reviewCount})
              </Text>
            </View>
            <View style={[styles.statBadge, { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }]}>
              <Briefcase size={12} color="#3B82F6" />
              <Text style={[styles.statText, { color: '#475569' }]}>
                {profile.completedProjects} Projects
              </Text>
            </View>
          </View>

          <View style={styles.locationRow}>
            <MapPin size={12} color="#10B981" />
            <Text style={styles.locationText}>{profile.location || 'Remote'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleDownloadCV}>
          <Download size={16} color="white" />
          <Text style={styles.primaryBtnText}>Download CV</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.secondaryBtn} 
          onPress={() => router.push('/(dashboard)/freelancer/settings')}
        >
          <Edit2 size={16} color="#334155" />
          <Text style={styles.secondaryBtnText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
          <Share2 size={18} color="#334155" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        {([
          { id: 'overview', label: 'Overview', icon: Layers },
          { id: 'portfolio', label: 'Portofolio', icon: Briefcase },
          { id: 'reviews', label: 'Ulasan', icon: Star }
        ] as const).map((tab) => (
          <TouchableOpacity 
            key={tab.id}
            style={[styles.tabBtn, activeTab === tab.id && styles.activeTabBtn]}
            onPress={() => setActiveTab(tab.id)}
          >
            <tab.icon 
              size={16} 
              color={activeTab === tab.id ? '#FFFFFF' : '#64748B'} 
            />
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {renderTabContent()}
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    height: 140,
    backgroundColor: '#1E293B',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#2563EB',
    opacity: 0.2,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  profileHeader: {
    marginTop: 80,
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    alignItems: 'center',
  },
  avatarContainer: {
    marginTop: -50,
    marginBottom: 12,
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  statusBadge: {
    position: 'absolute',
    bottom: -6,
    alignSelf: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'white',
  },
  statusText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
  headerInfo: {
    alignItems: 'center',
    width: '100%',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  locationText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 20,
  },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0F172A',
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 12,
    borderRadius: 12,
  },
  secondaryBtnText: {
    color: '#334155',
    fontWeight: 'bold',
    fontSize: 14,
  },
  iconBtn: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: 'white',
    padding: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
  },
  activeTabBtn: {
    backgroundColor: '#2563EB',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTabText: {
    color: 'white',
  },
  tabContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  iconBox: {
    padding: 6,
    borderRadius: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  label: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 10,
  },
  socialBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bioText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  skillText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  emptyText: {
    color: '#94A3B8',
    fontStyle: 'italic',
    fontSize: 12,
  },
  addProjectBtn: {
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
  },
  addProjectText: {
    fontWeight: 'bold',
    color: '#94A3B8',
  },
  portfolioCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  portfolioImageContainer: {
    height: 160,
    backgroundColor: '#F1F5F9',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  portfolioImage: {
    width: '100%',
    height: '100%',
  },
  portfolioPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  externalLinkBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  portfolioContent: {
    padding: 16,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  tagBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  portfolioTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  portfolioDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
  ratingSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingBig: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F172A',
  },
  starRow: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewCountBig: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  emptyReview: {
    alignItems: 'center',
    padding: 40,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 16,
    gap: 10,
  },
  reviewCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewInitials: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#64748B',
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  reviewDate: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  reviewRatingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  reviewRatingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#B45309',
  },
  reviewComment: {
    fontSize: 13,
    color: '#475569',
    fontStyle: 'italic',
    lineHeight: 20,
  },
});