import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  TextInput,
  Platform,
  Image
} from 'react-native';
import { 
  Briefcase, 
  DollarSign, 
  Users, 
  FileText, 
  Wallet, 
  Clock, 
  CheckCircle2, 
  Star, 
  Bell, 
  Search,
  Menu,
  MoreVertical,
  ChevronRight,
  LogOut
} from 'lucide-react-native';

// --- CONFIG ---
const CURRENT_ROLE: 'client' | 'freelancer' = 'freelancer'; // Ganti role di sini

export default function DashboardScreen() {
  const role = CURRENT_ROLE;
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Simulasi state sidebar

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* === 1. FIXED TOP HEADER === */}
      <SafeAreaView style={{ backgroundColor: 'white' }}>
        <View style={styles.topHeader}>
          {/* Left: Menu & Logo */}
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => console.log("Open Drawer")}>
              <Menu size={24} color="#64748B" />
            </TouchableOpacity>
            
            <View style={styles.brandContainer}>
              <View style={styles.logoBox}>
                <Briefcase size={16} color="white" strokeWidth={3} />
              </View>
              <Text style={styles.brandText}>SkillLink</Text>
            </View>
          </View>

          {/* Right: Notification & Avatar */}
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <Bell size={22} color="#64748B" />
              <View style={styles.badge} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.avatarBtn}>
              <Text style={styles.avatarText}>{role === 'freelancer' ? 'ME' : 'CL'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* === 2. SCROLLABLE CONTENT === */}
      <View style={styles.contentContainer}>
        {/* Background Blobs (Visual Candy) */}
        <View style={[styles.blob, styles.blobBlue]} />
        <View style={[styles.blob, styles.blobGreen]} />

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Greeting & Search Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.greeting}>Halo, {role === 'freelancer' ? 'Nazril' : 'Pak Klien'}! 👋</Text>
            <Text style={styles.subGreeting}>
              {role === 'freelancer' ? 'Berikut aktivitas terbaru proyekmu.' : 'Kelola proyek dan temukan talenta terbaik.'}
            </Text>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Search size={20} color="#94A3B8" style={styles.searchIcon} />
              <TextInput 
                placeholder="Cari proyek atau pesan..." 
                placeholderTextColor="#94A3B8"
                style={styles.searchInput}
              />
            </View>
          </View>

          {/* Render Content Berdasarkan Role */}
          {role === 'client' ? <ClientContent /> : <FreelancerContent />}

          <Text style={styles.copyright}>© 2024 SkillLink. All rights reserved.</Text>
        </ScrollView>
      </View>
    </View>
  );
}

// ==========================================
// SUB-COMPONENTS
// ==========================================

function FreelancerContent() {
  const stats = [
    { label: "Pendapatan", value: "Rp 12.5jt", icon: Wallet, color: "#059669", bg: "#ECFDF5" },
    { label: "Proyek Aktif", value: "3", icon: Clock, color: "#2563EB", bg: "#EFF6FF" },
    { label: "Selesai", value: "12", icon: CheckCircle2, color: "#7C3AED", bg: "#F5F3FF" },
    { label: "Rating", value: "4.9", icon: Star, color: "#D97706", bg: "#FFFBEB" },
  ];

  const activeProjects = [
    { title: "Redesain UI/UX E-Wallet", client: "FinTech Asia", deadline: "2 Hari lagi", progress: 75, status: "Revisi", statusColor: "orange" },
    { title: "Backend API LMS", client: "Univ. Teknokrat", deadline: "1 Minggu lagi", progress: 40, status: "On Progress", statusColor: "blue" },
  ];

  return (
    <View style={styles.contentSpace}>
      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={[styles.statHeader]}>
               <View style={[styles.statIconBox, { backgroundColor: stat.bg }]}>
                  <stat.icon size={18} color={stat.color} />
               </View>
               {index === 0 && (
                   <View style={styles.trendBadge}>
                       <Text style={styles.trendText}>+12%</Text>
                   </View>
               )}
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Active Projects */}
      <View>
        <SectionHeader title="Proyek Berjalan" action="Lihat Semua" />
        <View style={styles.cardContainer}>
          {activeProjects.map((project, idx) => (
            <View key={idx} style={[styles.itemCard, idx !== activeProjects.length -1 && styles.borderBottom]}>
              <View style={styles.projectHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{project.title}</Text>
                  <Text style={styles.itemSubtitle}>{project.client} • <Text style={{color: '#EF4444'}}>{project.deadline}</Text></Text>
                </View>
                <Badge text={project.status} color={project.statusColor} />
              </View>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressRow}>
                  <Text style={styles.progressLabel}>Progress</Text>
                  <Text style={styles.progressValue}>{project.progress}%</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${project.progress}%` }]} />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Recommended Jobs */}
      <View>
        <SectionHeader title="Rekomendasi Pekerjaan" action="Cari" />
        <View style={styles.cardContainer}>
            <View style={styles.itemCard}>
                <View style={styles.jobRow}>
                    <Text style={styles.itemTitle}>Frontend Developer React</Text>
                    <Text style={styles.salaryText}>Rp 5jt</Text>
                </View>
                <Text style={[styles.itemSubtitle, {marginTop: 4}]} numberOfLines={2}>
                    Membuat dashboard admin menggunakan Next.js dan Tailwind CSS...
                </Text>
                <View style={styles.tagsRow}>
                    <Tag text="Remote" />
                    <Tag text="Project" />
                </View>
            </View>
        </View>
      </View>
    </View>
  );
}

function ClientContent() {
  const stats = [
    { label: "Pengeluaran", value: "Rp 45jt", icon: DollarSign, color: "#059669", bg: "#ECFDF5" },
    { label: "Lowongan", value: "4", icon: Briefcase, color: "#2563EB", bg: "#EFF6FF" },
    { label: "Pelamar", value: "28", icon: Users, color: "#7C3AED", bg: "#F5F3FF" },
    { label: "Kontrak", value: "8", icon: FileText, color: "#475569", bg: "#F1F5F9" },
  ];

  const applicants = [
    { name: "Budi Santoso", role: "UI Designer", applied: "Mobile App", match: 95 },
    { name: "Siti Aminah", role: "Writer", applied: "SEO Blog", match: 88 },
  ];

  return (
    <View style={styles.contentSpace}>
      {/* Create Job Button */}
      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>+ Posting Pekerjaan Baru</Text>
      </TouchableOpacity>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: stat.bg }]}>
              <stat.icon size={20} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Recent Applicants */}
      <View>
        <SectionHeader title="Pelamar Terbaru" action="Semua" />
        <View style={styles.cardContainer}>
            {applicants.map((item, idx) => (
                <TouchableOpacity key={idx} style={[styles.itemCard, styles.applicantRow, idx !== applicants.length -1 && styles.borderBottom]}>
                    <View style={styles.applicantAvatar}>
                        <Text style={styles.applicantInitial}>{item.name.charAt(0)}</Text>
                    </View>
                    <View style={{flex: 1, marginLeft: 12}}>
                        <Text style={styles.itemTitle}>{item.name}</Text>
                        <Text style={styles.itemSubtitle}>{item.role} • {item.applied}</Text>
                    </View>
                    <Badge 
                        text={`${item.match}%`} 
                        color={item.match > 90 ? 'emerald' : 'blue'} 
                    />
                    <ChevronRight size={20} color="#CBD5E1" />
                </TouchableOpacity>
            ))}
        </View>
      </View>
    </View>
  );
}

// ==========================================
// SHARED UI COMPONENTS
// ==========================================

const SectionHeader = ({ title, action }: { title: string, action?: string }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {action && (
        <TouchableOpacity>
            <Text style={styles.sectionAction}>{action}</Text>
        </TouchableOpacity>
    )}
  </View>
);

const Badge = ({ text, color }: { text: string, color: string }) => {
    let bg = '#EFF6FF';
    let txt = '#2563EB';
    if (color === 'orange') { bg = '#FFF7ED'; txt = '#C2410C'; }
    if (color === 'emerald') { bg = '#ECFDF5'; txt = '#059669'; }
    return (
        <View style={[styles.badgeContainer, { backgroundColor: bg }]}>
            <Text style={[styles.badgeText, { color: txt }]}>{text}</Text>
        </View>
    );
};

const Tag = ({ text }: { text: string }) => (
    <View style={styles.tag}>
        <Text style={styles.tagText}>{text}</Text>
    </View>
);

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
  // --- TOP HEADER STYLES ---
  topHeader: {
    height: 60,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    // Shadow ringan
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 3,
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#2563EB', // Gradient simulation
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    padding: 4,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1,
    borderColor: 'white',
  },
  avatarBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'transparent', 
    borderWidth: 2,
    borderColor: 'transparent', // Bisa diganti border
    overflow: 'hidden',
  },
  avatarText: {
    width: '100%',
    height: '100%',
    backgroundColor: '#8B5CF6', // Purple gradient simulation
    color: 'white',
    textAlign: 'center',
    lineHeight: 32,
    fontWeight: 'bold',
    fontSize: 12,
  },
  
  // --- CONTENT STYLES ---
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 20,
  },
  welcomeSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#0F172A',
    fontSize: 14,
  },
  
  // Blobs (Background)
  blob: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.15,
  },
  blobBlue: {
    backgroundColor: '#60A5FA', 
    top: -50,
    right: -100,
  },
  blobGreen: {
    backgroundColor: '#34D399', 
    top: 250,
    left: -150,
  },
  
  contentSpace: {
    paddingHorizontal: 20,
    gap: 24,
  },
  
  // Stats
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  statIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  trendText: {
    fontSize: 10,
    color: '#059669',
    fontWeight: 'bold',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
  },

  // Cards & Lists
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  itemCard: {
    padding: 16,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  sectionAction: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '500',
  },
  
  // Items
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  
  // Progress
  progressContainer: { gap: 6 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between' },
  progressLabel: { fontSize: 11, color: '#64748B' },
  progressValue: { fontSize: 11, fontWeight: '600', color: '#334155' },
  progressBarBg: { height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#2563EB', borderRadius: 3 },

  // Badges & Tags
  badgeContainer: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginLeft: 8 },
  badgeText: { fontSize: 10, fontWeight: '600' },
  jobRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  salaryText: { fontSize: 12, fontWeight: 'bold', color: '#0F172A' },
  tagsRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  tag: { backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  tagText: { fontSize: 10, color: '#475569' },

  // Client Specific
  primaryButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: { color: 'white', fontWeight: '600', fontSize: 14 },
  applicantRow: { flexDirection: 'row', alignItems: 'center' },
  applicantAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  applicantInitial: { color: '#475569', fontWeight: 'bold' },

  copyright: {
    textAlign: 'center',
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 32,
    marginBottom: 16,
  }
});