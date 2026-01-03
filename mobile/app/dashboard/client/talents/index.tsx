import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Text, Card, Avatar, Chip, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Mock Data / Interface
interface Talent {
  id: string;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  location: string;
  hourlyRate: string;
  skills: string[];
  availability: 'available' | 'busy' | 'unavailable';
}

export default function TalentsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [talents, setTalents] = useState<Talent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Web', 'Mobile', 'UI/UX', 'Writing', 'Marketing'];

  // Fungsi Fetch (Simulasi)
  useEffect(() => {
    setLoading(true);
    // Logika API axios anda di sini
    setTimeout(() => {
      setTalents([
        {
          id: '1',
          name: 'Nazril Afandi',
          title: 'Senior UI Designer',
          rating: 4.9,
          reviews: 120,
          location: 'Lampung, ID',
          hourlyRate: 'Rp 150k',
          skills: ['Figma', 'React', 'Tailwind'],
          availability: 'available'
        },
        {
          id: '2',
          name: 'Sarah Jane',
          title: 'Fullstack Dev',
          rating: 4.8,
          reviews: 85,
          location: 'Jakarta, ID',
          hourlyRate: 'Rp 250k',
          skills: ['Node.js', 'Next.js', 'AWS'],
          availability: 'busy'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [searchQuery, selectedCategory]);

  const renderTalentCard = ({ item }: { item: Talent }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Avatar.Text size={50} label={item.name.substring(0, 2).toUpperCase()} style={styles.avatar} />
          <View style={styles.headerInfo}>
            <Text style={styles.talentName}>{item.name}</Text>
            <Text style={styles.talentTitle}>{item.title}</Text>
          </View>
          <IconButton icon="heart-outline" size={20} onPress={() => {}} />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="star" size={16} color="#eab308" />
            <Text style={styles.statText}>{item.rating} ({item.reviews})</Text>
          </View>
          <View style={[styles.badge, item.availability === 'available' ? styles.badgeSuccess : styles.badgeWarning]}>
            <Text style={styles.badgeText}>{item.availability.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.locationRow}>
          <MaterialCommunityIcons name="map-marker-outline" size={14} color="#64748b" />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>

        <View style={styles.skillsContainer}>
          {item.skills.map((skill, index) => (
            <View key={index} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footerRow}>
          <View>
            <Text style={styles.rateLabel}>Hourly Rate</Text>
            <Text style={styles.rateValue}>{item.hourlyRate}</Text>
          </View>
          <TouchableOpacity style={styles.hireBtn}>
            <Text style={styles.hireBtnText}>Hire Now</Text>
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cari Talenta</Text>
        <View style={styles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={22} color="#94a3b8" />
          <TextInput
            placeholder="Cari skill atau nama..."
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterBtn}>
            <MaterialCommunityIcons name="tune" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.categoryScroll}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((cat) => (
            <Chip
              key={cat}
              selected={selectedCategory === cat}
              onPress={() => setSelectedCategory(cat)}
              style={[styles.chip, selectedCategory === cat && styles.chipSelected]}
              textStyle={{ color: selectedCategory === cat ? '#fff' : '#64748b' }}
            >
              {cat}
            </Chip>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={{ marginTop: 10, color: '#64748b' }}>Mencari profesional...</Text>
        </View>
      ) : (
        <FlatList
          data={talents}
          renderItem={renderTalentCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="account-search-outline" size={80} color="#cbd5e1" />
              <Text style={styles.emptyText}>Talenta tidak ditemukan</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0f172a', marginBottom: 15 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 12, paddingLeft: 12 },
  searchInput: { flex: 1, paddingVertical: 12, paddingHorizontal: 10, fontSize: 15 },
  filterBtn: { backgroundColor: '#2563eb', padding: 12, borderRadius: 12 },
  
  categoryScroll: { paddingVertical: 15, backgroundColor: '#fff' },
  chip: { marginRight: 8, backgroundColor: '#f1f5f9', borderRadius: 20 },
  chipSelected: { backgroundColor: '#2563eb' },

  listContent: { padding: 15 },
  card: { marginBottom: 15, borderRadius: 16, backgroundColor: '#fff', elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { backgroundColor: '#3b82f6' },
  headerInfo: { flex: 1, marginLeft: 12 },
  talentName: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  talentTitle: { fontSize: 13, color: '#64748b' },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  statItem: { flexDirection: 'row', alignItems: 'center' },
  statText: { marginLeft: 4, fontWeight: '600', color: '#1e293b' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeSuccess: { backgroundColor: '#f0fdf4' },
  badgeWarning: { backgroundColor: '#fffbeb' },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#16a34a' },

  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  locationText: { marginLeft: 4, fontSize: 12, color: '#64748b' },

  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 },
  skillTag: { backgroundColor: '#eff6ff', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, marginRight: 6, marginBottom: 6 },
  skillText: { fontSize: 11, color: '#2563eb', fontWeight: '500' },

  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 15 },
  rateLabel: { fontSize: 11, color: '#64748b' },
  rateValue: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  hireBtn: { backgroundColor: '#2563eb', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  hireBtnText: { color: '#fff', fontWeight: 'bold' },

  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 10, color: '#64748b', fontSize: 16 }
});