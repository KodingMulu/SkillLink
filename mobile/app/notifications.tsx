import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Avatar, Divider, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const NOTIF_DATA = [
  {
    id: '1',
    type: 'project',
    title: 'Penawaran Diterima!',
    description: 'TechStart Inc menerima penawaran Anda pada proyek Redesain UI/UX.',
    time: '2 jam yang lalu',
    icon: 'briefcase-check',
    color: '#10b981',
    isUnread: true,
  },
  {
    id: '2',
    type: 'payment',
    title: 'Pembayaran Berhasil',
    description: 'Termin pertama untuk proyek FinTech Asia telah dikirim ke saldo Anda.',
    time: '5 jam yang lalu',
    icon: 'cash-check',
    color: '#3b82f6',
    isUnread: true,
  },
  {
    id: '3',
    type: 'system',
    title: 'Lengkapi Profil',
    description: 'Profil yang lengkap meningkatkan peluang Anda mendapatkan proyek hingga 40%.',
    time: 'Kemarin',
    icon: 'account-edit',
    color: '#f59e0b',
    isUnread: false,
  },
];

export default function NotificationsPage() {
  const router = useRouter();

  const renderItem = ({ item }: { item: typeof NOTIF_DATA[0] }) => (
    <TouchableOpacity style={[styles.notifItem, item.isUnread && styles.unreadBg]}>
      <Surface style={[styles.iconContainer, { backgroundColor: item.color + '20' }]} elevation={0}>
        <MaterialCommunityIcons name={item.icon as any} size={24} color={item.color} />
      </Surface>
      
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{item.title}</Text>
          {item.isUnread && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifikasi</Text>
        <TouchableOpacity>
          <Text style={styles.markRead}>Tandai dibaca</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={NOTIF_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <Divider style={styles.divider} />}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  markRead: { color: '#3b82f6', fontSize: 12, fontWeight: '600' },
  list: { paddingBottom: 20 },
  notifItem: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  unreadBg: { backgroundColor: '#f8fafc' },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: { flex: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  title: { fontSize: 15, fontWeight: 'bold', color: '#1e293b' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444' },
  description: { fontSize: 14, color: '#64748b', lineHeight: 20, marginBottom: 6 },
  time: { fontSize: 12, color: '#94a3b8' },
  divider: { backgroundColor: '#f1f5f9' },
});