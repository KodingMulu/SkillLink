// File: mobile/app/messages.tsx
import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Avatar, Searchbar, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const CHAT_DATA = [
  {
    id: '1',
    name: 'TechStart Inc',
    lastMessage: 'Halo Nazril, bagaimana progres revisi UI?',
    time: '10:30',
    unread: 2,
    avatar: 'TS',
  },
  {
    id: '2',
    name: 'FinTech Asia',
    lastMessage: 'Pembayaran termin pertama sudah diproses.',
    time: 'Yesterday',
    unread: 0,
    avatar: 'FA',
  },
  {
    id: '3',
    name: 'Budi Santoso',
    lastMessage: 'Terima kasih atas bantuannya!',
    time: 'Sat',
    unread: 0,
    avatar: 'BS',
  },
];

export default function MessagesPage() {
  const router = useRouter();

  const renderChatItem = ({ item }: { item: typeof CHAT_DATA[0] }) => (
    <TouchableOpacity style={styles.chatItem}>
      <Avatar.Text size={50} label={item.avatar} style={styles.avatar} />
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <View style={styles.chatFooter}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pesan</Text>
        <TouchableOpacity>
          <MaterialCommunityIcons name="message-plus-outline" size={24} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Cari percakapan..."
          onChangeText={() => {}}
          value=""
          style={styles.searchBar}
          inputStyle={styles.searchInput}
        />
      </View>

      {/* Chat List */}
      <FlatList
        data={CHAT_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
        ItemSeparatorComponent={() => <Divider style={styles.divider} />}
        contentContainerStyle={styles.listContent}
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  searchContainer: { padding: 16 },
  searchBar: { backgroundColor: '#f8fafc', elevation: 0, borderRadius: 12 },
  searchInput: { fontSize: 14 },
  listContent: { paddingBottom: 20 },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  avatar: { backgroundColor: '#3b82f6' },
  chatInfo: { flex: 1, marginLeft: 16 },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  time: { fontSize: 12, color: '#94a3b8' },
  chatFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lastMessage: { fontSize: 14, color: '#64748b', flex: 1, marginRight: 8 },
  unreadBadge: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  divider: { backgroundColor: '#f1f5f9', marginHorizontal: 16 },
});