import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Image, Linking, RefreshControl
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import {
  ArrowLeft, MapPin, Star, ShieldCheck,
  FileText, CheckCircle2, Award, Briefcase, Globe, Mail
} from 'lucide-react-native';

interface Portfolio {
  id: string;
  title: string;
  tags: string[];
  image: string | null;
}

interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  rating: number | null;
}

interface FreelancerStats {
  rating: number;
  reviews: number;
  successRate: number;
}

interface FreelancerData {
  id: string;
  username: string;
  email: string;
  title: string | null;
  bio: string | null;
  location: string | null;
  skills: string[];
  portfolios: Portfolio[];
  experiences: Experience[];
  stats: FreelancerStats;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ApplicantDetailScreen() {
  const { freelancerId } = useLocalSearchParams();
  const router = useRouter();

  const [freelancer, setFreelancer] = useState<FreelancerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFreelancer = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/freelancer/detail/${freelancerId}`, {
        withCredentials: true
      });
      if (res.data.code === 200) {
        setFreelancer(res.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (freelancerId) fetchFreelancer();
  }, [freelancerId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFreelancer();
  };

  const handleEmail = () => {
    if (freelancer?.email) {
      Linking.openURL(`mailto:${freelancer.email}`);
    }
  };

  if (isLoading && !refreshing) {
    return (
      <View style={s.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={s.loadingText}>Mengambil data freelancer...</Text>
      </View>
    );
  }

  if (!freelancer) {
    return (
      <View style={s.errorContainer}>
        <Text style={s.errorText}>Freelancer tidak ditemukan.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={s.backLink}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ArrowLeft size={20} color="#64748B" />
          <Text style={s.backBtnText}>Kembali</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Detail Freelancer</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView
        contentContainerStyle={s.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />}
      >
        {/* Profile Card */}
        <View style={s.card}>
          <View style={s.avatarContainer}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>{freelancer.username.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={s.verifiedBadge}>
              <ShieldCheck size={16} color="white" />
            </View>
          </View>

          <Text style={s.username}>{freelancer.username}</Text>
          <Text style={s.userTitle}>{freelancer.title || 'Freelancer'}</Text>

          <View style={s.locationRow}>
            <MapPin size={14} color="#64748B" />
            <Text style={s.locationText}>{freelancer.location || 'Indonesia'}</Text>
          </View>

          <View style={s.statsRow}>
            <View style={s.statItem}>
              <Text style={s.statLabel}>RATING</Text>
              <View style={s.ratingValueRow}>
                <Star size={16} color="#F59E0B" fill="#F59E0B" />
                <Text style={s.ratingValue}>{freelancer.stats.rating} ({freelancer.stats.reviews})</Text>
              </View>
            </View>
            <View style={[s.statItem, s.borderLeft]}>
              <Text style={s.statLabel}>JOB SUCCESS</Text>
              <Text style={s.successRate}>{freelancer.stats.successRate}%</Text>
            </View>
          </View>

          <TouchableOpacity style={s.emailBtn} onPress={handleEmail}>
            <Mail size={18} color="white" style={{ marginRight: 8 }} />
            <Text style={s.emailBtnText}>Hubungi via Email</Text>
          </TouchableOpacity>
        </View>

        {/* Skills Section */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <Award size={18} color="#2563EB" />
            <Text style={s.cardTitle}>Keahlian</Text>
          </View>
          <View style={s.skillsContainer}>
            {freelancer.skills.length > 0 ? (
              freelancer.skills.map((skill, index) => (
                <View key={index} style={s.skillBadge}>
                  <Text style={s.skillText}>{skill}</Text>
                </View>
              ))
            ) : (
              <Text style={s.emptyText}>Belum ada skill ditambahkan</Text>
            )}
          </View>
        </View>

        {/* Bio Section */}
        <View style={s.card}>
          <Text style={s.cardTitleOnly}>Tentang</Text>
          <Text style={s.bioText}>
            {freelancer.bio || "Freelancer ini belum menambahkan biodata/deskripsi diri."}
          </Text>
        </View>

        {/* Portfolio Section */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <Briefcase size={18} color="#2563EB" />
            <Text style={s.cardTitle}>Portofolio Terbaru</Text>
          </View>
          <View style={s.portfolioGrid}>
            {freelancer.portfolios.length > 0 ? (
              freelancer.portfolios.map((item) => (
                <View key={item.id} style={s.portfolioItem}>
                  <View style={s.portfolioImage}>
                    {item.image ? (
                      <Image source={{ uri: item.image }} style={s.image} resizeMode="cover" />
                    ) : (
                      <FileText size={32} color="#CBD5E1" />
                    )}
                  </View>
                  <Text style={s.portfolioTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={s.portfolioTag}>{item.tags[0] || 'Project'}</Text>
                </View>
              ))
            ) : (
              <Text style={s.emptyText}>Belum ada portofolio yang diunggah.</Text>
            )}
          </View>
        </View>

        {/* Experience Section */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <Globe size={18} color="#2563EB" />
            <Text style={s.cardTitle}>Riwayat Pekerjaan</Text>
          </View>
          <View style={s.timeline}>
            {freelancer.experiences.length > 0 ? (
              freelancer.experiences.map((exp, idx) => (
                <View key={idx} style={s.timelineItem}>
                  <View style={s.timelineIcon}>
                    <CheckCircle2 size={16} color="#2563EB" />
                  </View>
                  <View style={s.timelineContent}>
                    <Text style={s.expRole}>{exp.role}</Text>
                    <Text style={s.expCompany}>Klien: {exp.company}</Text>
                    <View style={s.expMeta}>
                      <Text style={s.expPeriod}>{exp.period}</Text>
                      {exp.rating && (
                        <View style={s.expRating}>
                          <Star size={12} color="#F59E0B" fill="#F59E0B" />
                          <Text style={s.expRatingText}>{exp.rating}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <Text style={s.emptyText}>Belum ada riwayat pekerjaan.</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
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
  },
  loadingText: {
    marginTop: 12,
    color: '#64748B',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 12,
  },
  backLink: {
    color: '#2563EB',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtnText: {
    marginLeft: 4,
    color: '#64748B',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#10B981',
    padding: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 4,
  },
  userTitle: {
    fontSize: 14,
    color: '#2563EB',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  locationText: {
    fontSize: 12,
    color: '#64748B',
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    paddingVertical: 16,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  borderLeft: {
    borderLeftWidth: 1,
    borderLeftColor: '#F1F5F9',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94A3B8',
    marginBottom: 4,
  },
  ratingValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  successRate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#059669',
  },
  emailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  emailBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  cardTitleOnly: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillBadge: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  skillText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  bioText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  portfolioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  portfolioItem: {
    width: '48%',
    marginBottom: 12,
  },
  portfolioImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  portfolioTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 2,
  },
  portfolioTag: {
    fontSize: 10,
    color: '#64748B',
  },
  timeline: {
    paddingLeft: 12,
  },
  timelineItem: {
    borderLeftWidth: 2,
    borderLeftColor: '#F1F5F9',
    paddingLeft: 20,
    paddingBottom: 24,
    position: 'relative',
  },
  timelineIcon: {
    position: 'absolute',
    left: -9,
    top: 0,
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    padding: 2,
    borderWidth: 2,
    borderColor: 'white',
  },
  timelineContent: {
    top: -4,
  },
  expRole: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 2,
  },
  expCompany: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '500',
    marginBottom: 4,
  },
  expMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  expPeriod: {
    fontSize: 10,
    color: '#94A3B8',
  },
  expRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  expRatingText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
});