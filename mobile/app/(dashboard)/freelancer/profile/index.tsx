import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Share,
  ActivityIndicator,
} from 'react-native';
import { Text, Card, Badge } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// --- Types ---
type TabType = 'overview' | 'portfolio' | 'reviews';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);

  // Mock Data (Sesuaikan dengan fetch API nantinya)
  const profile = {
    name: 'Alex Johnson',
    title: 'Senior Fullstack Developer',
    avatar: 'AJ',
    rating: 4.9,
    reviewCount: 124,
    projectsDone: 86,
    location: 'Bandung, ID',
    bio: 'Professional developer with 5+ years experience in React, Node.js, and Mobile Development. Passionate about building clean and scalable applications.',
    skills: ['React Native', 'TypeScript', 'Node.js', 'PostgreSQL', 'UI/UX Design'],
    joinDate: 'Januari 2022',
    portfolios: [
      { id: '1', title: 'E-Commerce App', desc: 'Full-featured online store', tags: ['React', 'Firebase'] },
      { id: '2', title: 'Fintech Dashboard', desc: 'Banking management system', tags: ['Next.js', 'Chart.js'] },
    ]
  };

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  const handleShare = async () => {
    try {
      await Share.share({ message: `Cek profil freelancer ${profile.name} di platform kami!` });
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* HERO SECTION */}
        <View style={styles.heroContainer}>
          <LinearGradient
            colors={['#1e3a8a', '#0f172a']}
            style={styles.heroGradient}
          />
          <View style={styles.profileHeaderCard}>
            <View style={styles.avatarContainer}>
              <LinearGradient colors={['#2563eb', '#4f46e5']} style={styles.avatar}>
                <Text style={styles.avatarText}>{profile.avatar}</Text>
              </LinearGradient>
              <View style={styles.onlineBadge}>
                <View style={styles.dot} />
                <Text style={styles.onlineText}>OPEN TO WORK</Text>
              </View>
            </View>

            <Text style={styles.userName}>{profile.name}</Text>
            <Text style={styles.userTitle}>{profile.title}</Text>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="star" size={16} color="#f59e0b" />
                <Text style={styles.statText}>{profile.rating} ({profile.reviewCount})</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="briefcase" size={16} color="#2563eb" />
                <Text style={styles.statText}>{profile.projectsDone} Projects</Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.btnPrimary}>
                <MaterialCommunityIcons name="download" size={18} color="#fff" />
                <Text style={styles.btnPrimaryText}>Download CV</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnOutline} onPress={handleShare}>
                <MaterialCommunityIcons name="share-variant" size={18} color="#64748b" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* TAB NAVIGATION */}
        <View style={styles.tabWrapper}>
          {(['overview', 'portfolio', 'reviews'] as TabType[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
            >
              <Text style={[styles.tabBtnText, activeTab === tab && styles.tabBtnTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* TAB CONTENT */}
        <View style={styles.contentContainer}>
          {activeTab === 'overview' && (
            <View style={styles.tabPane}>
              <Card style={styles.infoCard}>
                <View style={styles.cardHeader}>
                  <MaterialCommunityIcons name="account-outline" size={24} color="#2563eb" />
                  <Text style={styles.cardTitle}>Tentang Saya</Text>
                </View>
                <Text style={styles.bioText}>{profile.bio}</Text>
              </Card>

              <Card style={styles.infoCard}>
                <View style={styles.cardHeader}>
                  <MaterialCommunityIcons name="layers-outline" size={24} color="#4f46e5" />
                  <Text style={styles.cardTitle}>Keahlian</Text>
                </View>
                <View style={styles.skillWrapper}>
                  {profile.skills.map((s, i) => (
                    <View key={i} style={styles.skillBadge}>
                      <Text style={styles.skillText}>{s}</Text>
                    </View>
                  ))}
                </View>
              </Card>
            </View>
          )}

          {activeTab === 'portfolio' && (
            <View style={styles.tabPane}>
              {profile.portfolios.map((p) => (
                <Card key={p.id} style={styles.portfolioCard}>
                  <View style={styles.portfolioImagePlaceholder}>
                    <MaterialCommunityIcons name="image-outline" size={40} color="#cbd5e1" />
                  </View>
                  <Card.Content style={styles.portfolioContent}>
                    <Text style={styles.portfolioTitle}>{p.title}</Text>
                    <Text style={styles.portfolioDesc}>{p.desc}</Text>
                    <View style={styles.tagRow}>
                      {p.tags.map((t, idx) => (
                        <Text key={idx} style={styles.tagText}>#{t}</Text>
                      ))}
                    </View>
                  </Card.Content>
                </Card>
              ))}
            </View>
          )}

          {activeTab === 'reviews' && (
            <View style={[styles.tabPane, styles.emptyContainer]}>
              <MaterialCommunityIcons name="star-outline" size={64} color="#cbd5e1" />
              <Text style={styles.emptyText}>Belum ada ulasan klien</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  heroContainer: { height: 400, alignItems: 'center' },
  heroGradient: { height: 200, width: '100%', borderBottomLeftRadius: 50, borderBottomRightRadius: 50 },
  profileHeaderCard: {
    width: width - 48,
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 24,
    marginTop: -100,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatar: { width: 100, height: 100, borderRadius: 30, justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#fff' },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: '900' },
  onlineBadge: {
    position: 'absolute', bottom: -10, alignSelf: 'center',
    backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 12, flexDirection: 'row', alignItems: 'center', elevation: 2,
    borderWidth: 1, borderColor: '#10b981'
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10b981', marginRight: 6 },
  onlineText: { fontSize: 10, fontWeight: '900', color: '#10b981' },
  userName: { fontSize: 24, fontWeight: '900', color: '#0f172a' },
  userTitle: { fontSize: 16, color: '#2563eb', fontWeight: '600', marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: 15, marginBottom: 20 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#f1f5f9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statText: { fontSize: 12, fontWeight: 'bold', color: '#64748b' },
  actionButtons: { flexDirection: 'row', gap: 10, width: '100%' },
  btnPrimary: { flex: 1, backgroundColor: '#0f172a', height: 50, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  btnPrimaryText: { color: '#fff', fontWeight: 'bold' },
  btnOutline: { width: 50, height: 50, borderRadius: 15, borderWidth: 1, borderColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center' },
  
  tabWrapper: { flexDirection: 'row', paddingHorizontal: 24, marginTop: 20, gap: 10 },
  tabBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12 },
  tabBtnActive: { backgroundColor: '#2563eb' },
  tabBtnText: { fontWeight: 'bold', color: '#64748b' },
  tabBtnTextActive: { color: '#fff' },

  contentContainer: { padding: 24 },
  tabPane: { gap: 16 },
  infoCard: { padding: 20, borderRadius: 24, backgroundColor: '#fff', elevation: 0, borderWidth: 1, borderColor: '#f1f5f9' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: '900', color: '#0f172a' },
  bioText: { lineHeight: 22, color: '#475569', fontSize: 15 },
  skillWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillBadge: { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#f8fafc', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  skillText: { fontSize: 13, fontWeight: 'bold', color: '#334155' },

  portfolioCard: { borderRadius: 24, overflow: 'hidden', elevation: 0, borderWidth: 1, borderColor: '#f1f5f9' },
  portfolioImagePlaceholder: { height: 150, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  portfolioContent: { padding: 16 },
  portfolioTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  portfolioDesc: { fontSize: 13, color: '#64748b', marginVertical: 4 },
  tagRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  tagText: { color: '#2563eb', fontSize: 12, fontWeight: 'bold' },

  emptyContainer: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { color: '#94a3b8', marginTop: 10, fontWeight: 'bold' }
});