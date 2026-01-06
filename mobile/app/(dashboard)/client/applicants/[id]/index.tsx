import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextStyle,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import { Text, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// Define interface for Styles to ensure TS compliance
interface Styles {
  container: ViewStyle;
  navHeader: ViewStyle;
  backButton: ViewStyle;
  backText: TextStyle;
  scrollContent: ViewStyle;
  profileCard: ViewStyle;
  avatarWrapper: ViewStyle;
  avatarCircle: ViewStyle;
  avatarInitial: TextStyle;
  verifiedBadge: ViewStyle;
  name: TextStyle;
  role: TextStyle;
  locationRow: ViewStyle;
  locationText: TextStyle;
  statsRow: ViewStyle;
  statItem: ViewStyle;
  statLabel: TextStyle;
  statValue: TextStyle;
  rowCenter: ViewStyle;
  actionWrapper: ViewStyle;
  btnPrimary: ViewStyle;
  btnPrimaryText: TextStyle;
  btnSecondary: ViewStyle;
  btnSecondaryText: TextStyle;
  section: ViewStyle;
  sectionTitle: TextStyle;
  bioText: TextStyle;
  skillsContainer: ViewStyle;
  skillChip: ViewStyle;
  skillText: TextStyle;
  timelineItem: ViewStyle;
  timelineLine: ViewStyle;
  timelineDot: ViewStyle;
  line: ViewStyle;
  timelineContent: ViewStyle;
  expRole: TextStyle;
  expCompany: TextStyle;
  expPeriod: TextStyle;
  portfolioGrid: ViewStyle;
  portfolioCard: ViewStyle;
  portfolioImagePlaceholder: ViewStyle;
  portTitle: TextStyle;
  portCat: TextStyle;
}

const APPLICANT = {
  name: "Sapta Wahyu Tirta",
  role: "Senior UI/UX Designer",
  location: "Yogyakarta, Indonesia",
  rating: 4.9,
  reviews: 124,
  successRate: 98,
  bio: "Saya adalah desainer produk dengan pengalaman lebih dari 5 tahun fokus pada aplikasi mobile dan dashboard enterprise. Ahli dalam Figma, Adobe XD, dan riset pengguna.",
  skills: ["UI Design", "UX Research", "Figma", "Prototyping", "Design System"],
  experience: [
    { company: "Tech Solutions", role: "Product Designer", period: "2021 - Present" },
    { company: "Creative Agency", role: "UI Designer", period: "2019 - 2021" }
  ],
  portfolio: [
    { title: "E-commerce Mobile App", category: "Mobile Design" },
    { title: "SaaS Dashboard for HR", category: "Web Application" }
  ]
};

export default function ApplicantDetailPage() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#64748b" />
          <Text style={styles.backText}>Kembali</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitial}>{APPLICANT.name.charAt(0)}</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <MaterialCommunityIcons name="shield-check" size={16} color="#fff" />
            </View>
          </View>

          <Text style={styles.name}>{APPLICANT.name}</Text>
          <Text style={styles.role}>{APPLICANT.role}</Text>
          
          <View style={styles.locationRow}>
            <MaterialCommunityIcons name="map-marker" size={16} color="#94a3b8" />
            <Text style={styles.locationText}>{APPLICANT.location}</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>RATING</Text>
              <View style={styles.rowCenter}>
                <MaterialCommunityIcons name="star" size={16} color="#f59e0b" />
                <Text style={styles.statValue}>{APPLICANT.rating} ({APPLICANT.reviews})</Text>
              </View>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>JOB SUCCESS</Text>
              <Text style={[styles.statValue, { color: '#10b981' }]}>{APPLICANT.successRate}%</Text>
            </View>
          </View>

          <View style={styles.actionWrapper}>
            <TouchableOpacity style={styles.btnPrimary}>
              <Text style={styles.btnPrimaryText}>Rekrut Sekarang</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSecondary}>
              <MaterialCommunityIcons name="message-text-outline" size={20} color="#475569" />
              <Text style={styles.btnSecondaryText}>Kirim Pesan</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tentang</Text>
          <Text style={styles.bioText}>{APPLICANT.bio}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Keahlian</Text>
          <View style={styles.skillsContainer}>
            {APPLICANT.skills.map((skill, idx) => (
              <View key={idx} style={styles.skillChip}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pengalaman Kerja</Text>
          {APPLICANT.experience.map((item, idx) => (
            <View key={idx} style={styles.timelineItem}>
              <View style={styles.timelineLine}>
                <View style={styles.timelineDot} />
                {idx !== APPLICANT.experience.length - 1 && <View style={styles.line} />}
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.expRole}>{item.role}</Text>
                <Text style={styles.expCompany}>{item.company}</Text>
                <Text style={styles.expPeriod}>{item.period}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Portofolio Terbaru</Text>
          <View style={styles.portfolioGrid}>
            {APPLICANT.portfolio.map((item, idx) => (
              <TouchableOpacity key={idx} style={styles.portfolioCard}>
                <View style={styles.portfolioImagePlaceholder}>
                  <MaterialCommunityIcons name="file-image-outline" size={32} color="#cbd5e1" />
                </View>
                <Text style={styles.portTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.portCat}>{item.category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create<Styles>({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  navHeader: { paddingHorizontal: 16, paddingVertical: 12 },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  backText: { color: '#64748b', fontWeight: '600', fontSize: 14, marginLeft: 4 },
  
  scrollContent: { padding: 20, paddingBottom: 40 },
  
  profileCard: { padding: 24, borderRadius: 32, backgroundColor: '#fff', elevation: 2, alignItems: 'center', borderWidth: 1, borderColor: '#f1f5f9' },
  avatarWrapper: { position: 'relative', marginBottom: 16 },
  avatarCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#fff' },
  avatarInitial: { fontSize: 36, fontWeight: 'bold', color: '#2563eb' },
  verifiedBadge: { position: 'absolute', bottom: 5, right: 5, backgroundColor: '#10b981', padding: 4, borderRadius: 12, borderWidth: 3, borderColor: '#fff' },
  
  name: { fontSize: 22, fontWeight: 'bold', color: '#0f172a' },
  role: { fontSize: 16, color: '#2563eb', fontWeight: '600', marginTop: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  locationText: { color: '#64748b', fontSize: 14, marginLeft: 4 },
  
  statsRow: { flexDirection: 'row', width: '100%', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#f1f5f9', marginVertical: 20, paddingVertical: 15 },
  statItem: { flex: 1, alignItems: 'center' },
  statLabel: { fontSize: 10, color: '#94a3b8', fontWeight: 'bold', marginBottom: 4 },
  statValue: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },

  actionWrapper: { width: '100%' },
  btnPrimary: { backgroundColor: '#2563eb', paddingVertical: 14, borderRadius: 16, alignItems: 'center', marginBottom: 12 },
  btnPrimaryText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  btnSecondary: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  btnSecondaryText: { color: '#475569', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },

  section: { marginTop: 32 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginBottom: 12 },
  bioText: { fontSize: 15, color: '#475569', lineHeight: 22 },

  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  skillChip: { backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0', marginRight: 8, marginBottom: 8 },
  skillText: { fontSize: 13, color: '#64748b', fontWeight: '500' },

  timelineItem: { flexDirection: 'row' },
  timelineLine: { alignItems: 'center', width: 20, marginRight: 16 },
  timelineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#2563eb', borderWidth: 3, borderColor: '#dbeafe' },
  line: { width: 2, flex: 1, backgroundColor: '#f1f5f9' },
  timelineContent: { flex: 1, paddingBottom: 24 },
  expRole: { fontSize: 15, fontWeight: 'bold', color: '#0f172a' },
  expCompany: { fontSize: 14, color: '#2563eb', fontWeight: '600', marginTop: 2 },
  expPeriod: { fontSize: 12, color: '#94a3b8', marginTop: 4 },

  portfolioGrid: { flexDirection: 'row' },
  portfolioCard: { flex: 1, backgroundColor: '#fff', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#f1f5f9', marginRight: 12 },
  portfolioImagePlaceholder: { backgroundColor: '#f8fafc', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 10, aspectRatio: 1.5 },
  portTitle: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
  portCat: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
});