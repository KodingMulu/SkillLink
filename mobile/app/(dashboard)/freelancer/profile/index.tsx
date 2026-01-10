import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Linking, ActivityIndicator, Clipboard, RefreshControl, Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import {
  User, Mail, MapPin, Briefcase, Star, Clock, Edit2,
  Github, Linkedin, Globe, Plus, Layers, CheckCircle2, Share2, FileText
} from 'lucide-react-native';

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

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const { width } = Dimensions.get('window');

export default function FreelancerProfileScreen() {
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'reviews'>('overview');
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/freelancer/profile`, {
        withCredentials: true
      });
      if (res.data.code === 200) {
        setProfile(res.data.data);
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

  const handleLink = (url: string) => {
    if (url) Linking.openURL(url.startsWith('http') ? url : `https://${url}`);
  };

  if (loading && !refreshing) {
    return (
      <View style={s.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'portfolio', label: 'Portofolio', icon: Briefcase },
    { id: 'reviews', label: 'Ulasan', icon: Star }
  ];

  return (
    <ScrollView
      style={s.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />}
    >
      <View style={s.banner} />

      <View style={s.contentContainer}>
        <View style={s.profileCard}>
          <View style={s.avatarWrapper}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>{profile?.avatar}</Text>
            </View>
          </View>

          <View style={s.profileHeader}>
            <Text style={s.name}>{profile?.name}</Text>
            <Text style={s.title}>{profile?.title}</Text>

            <View style={s.statsRow}>
              <View style={[s.badge, s.amberBadge]}>
                <Star size={12} color="#D97706" fill="#D97706" />
                <Text style={s.amberText}>{profile?.rating} <Text style={{ fontWeight: '400' }}>({profile?.reviewCount})</Text></Text>
              </View>
              <View style={[s.badge, s.slateBadge]}>
                <Briefcase size={12} color="#2563EB" />
                <Text style={s.slateText}>{profile?.completedProjects} Projects</Text>
              </View>
              <View style={[s.badge, s.slateBadge]}>
                <MapPin size={12} color="#10B981" />
                <Text style={s.slateText}>{profile?.location || 'Remote'}</Text>
              </View>
            </View>

            <View style={s.actionButtons}>
              <TouchableOpacity
                style={s.editBtn}
                onPress={() => router.push('/(dashboard)/freelancer/settings')}
              >
                <Edit2 size={16} color="#334155" />
                <Text style={s.btnText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.shareBtn}>
                <Share2 size={18} color="#334155" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={s.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id as any)}
              style={[s.tabBtn, activeTab === tab.id && s.activeTabBtn]}
            >
              <tab.icon size={16} color={activeTab === tab.id ? 'white' : '#64748B'} />
              <Text style={[s.tabText, activeTab === tab.id && s.activeTabText]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'overview' && (
          <View style={s.sectionContainer}>
            <View style={s.card}>
              <View style={s.cardHeader}>
                <View style={s.iconBox}><User size={20} color="#2563EB" /></View>
                <Text style={s.cardTitle}>Tentang Saya</Text>
              </View>
              <Text style={s.bioText}>
                {profile?.bio || "Halo! Saya belum menulis bio."}
              </Text>
            </View>

            <View style={s.card}>
              <View style={s.cardHeader}>
                <View style={[s.iconBox, { backgroundColor: '#EEF2FF' }]}>
                  <Layers size={20} color="#4F46E5" />
                </View>
                <Text style={s.cardTitle}>Keahlian & Tools</Text>
              </View>
              <View style={s.skillsContainer}>
                {profile?.skills.length ? (
                  profile.skills.map((skill, index) => (
                    <View key={index} style={s.skillBadge}>
                      <Text style={s.skillText}>{skill}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={s.emptyText}>Belum ada keahlian ditambahkan.</Text>
                )}
              </View>
            </View>

            <View style={s.card}>
              <Text style={s.sectionTitle}>KONTAK</Text>
              <View style={s.contactRow}>
                <Mail size={16} color="#2563EB" />
                <View>
                  <Text style={s.contactLabel}>EMAIL</Text>
                  <Text style={s.contactValue}>{profile?.email}</Text>
                </View>
              </View>
              <View style={s.contactRow}>
                <Clock size={16} color="#059669" />
                <View>
                  <Text style={s.contactLabel}>RESPON</Text>
                  <Text style={s.contactValue}>{profile?.responseTime}</Text>
                </View>
              </View>

              <View style={s.socialsRow}>
                {profile?.github && (
                  <TouchableOpacity style={s.socialBtn} onPress={() => handleLink(profile.github)}>
                    <Github size={18} color="#64748B" />
                  </TouchableOpacity>
                )}
                {profile?.linkedin && (
                  <TouchableOpacity style={s.socialBtn} onPress={() => handleLink(profile.linkedin)}>
                    <Linkedin size={18} color="#64748B" />
                  </TouchableOpacity>
                )}
                {profile?.website && (
                  <TouchableOpacity style={s.socialBtn} onPress={() => handleLink(profile.website)}>
                    <Globe size={18} color="#64748B" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        )}

        {activeTab === 'portfolio' && (
          <View style={s.portfolioGrid}>
            <TouchableOpacity
              style={s.addProjectCard}
              onPress={() => router.push('/(dashboard)/freelancer/portfolio')}
            >
              <View style={s.addIconCircle}>
                <Plus size={24} color="#64748B" />
              </View>
              <Text style={s.addProjectText}>Tambah Proyek Baru</Text>
            </TouchableOpacity>

            {profile?.portfolios.map((item) => (
              <View key={item.id} style={s.portfolioCard}>
                <View style={s.portfolioImage}>
                  {item.image ? (
                    <Image source={{ uri: item.image }} style={s.image} resizeMode="cover" />
                  ) : (
                    <Layers size={32} color="#CBD5E1" />
                  )}
                </View>
                <View style={s.portfolioContent}>
                  <Text style={s.portfolioTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={s.portfolioDesc} numberOfLines={2}>{item.description}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'reviews' && (
          <View style={s.sectionContainer}>
            {profile?.reviews.length === 0 ? (
              <View style={s.emptyState}>
                <Star size={32} color="#CBD5E1" />
                <Text style={s.emptyText}>Belum ada ulasan dari klien.</Text>
              </View>
            ) : (
              profile?.reviews.map((r) => (
                <View key={r.id} style={s.reviewCard}>
                  <View style={s.reviewHeader}>
                    <View style={s.reviewerInfo}>
                      <View style={s.reviewerAvatar}>
                        <Text style={s.reviewerInitial}>{r.clientName.charAt(0)}</Text>
                      </View>
                      <View>
                        <Text style={s.reviewerName}>{r.clientName}</Text>
                        <Text style={s.reviewDate}>{formatDate(r.date)}</Text>
                      </View>
                    </View>
                    <View style={s.ratingBadge}>
                      <Star size={12} color="#D97706" fill="#D97706" />
                      <Text style={s.ratingText}>{r.rating}.0</Text>
                    </View>
                  </View>
                  <Text style={s.reviewComment}>{r.comment || 'Tidak ada komentar.'}</Text>
                </View>
              ))
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  banner: {
    height: 160,
    backgroundColor: '#1E293B',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  contentContainer: {
    paddingHorizontal: 20,
    marginTop: -60,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 20,
  },
  avatarWrapper: {
    marginTop: -60,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '900',
    color: 'white',
    textTransform: 'uppercase',
  },
  profileHeader: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
    borderWidth: 1,
  },
  amberBadge: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FEF3C7',
  },
  slateBadge: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  amberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#B45309',
  },
  slateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  shareBtn: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
  },
  btnText: {
    fontWeight: 'bold',
    color: '#334155',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 8,
    borderRadius: 12,
  },
  activeTabBtn: {
    backgroundColor: '#2563EB',
  },
  tabText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748B',
  },
  activeTabText: {
    color: 'white',
  },
  sectionContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
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
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  skillText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#334155',
  },
  emptyText: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 16,
    letterSpacing: 1,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  contactLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94A3B8',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  socialsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
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
  portfolioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  addProjectCard: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  addIconCircle: {
    width: 48,
    height: 48,
    backgroundColor: 'white',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  addProjectText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748B',
    textAlign: 'center',
  },
  portfolioCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 12,
  },
  portfolioImage: {
    height: 100,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  portfolioContent: {
    padding: 12,
  },
  portfolioTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  portfolioDesc: {
    fontSize: 10,
    color: '#64748B',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  reviewCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: 'row',
    gap: 12,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewerInitial: {
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
    fontWeight: 'bold',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    height: 28,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#B45309',
  },
  reviewComment: {
    fontSize: 14,
    color: '#475569',
    fontStyle: 'italic',
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#F1F5F9',
  },
});