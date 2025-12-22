import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card, Badge, ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ProjectProps {
  title: string;
  client: string;
  deadline: string;
  progress: number;
  status: 'Revisi' | 'Progress' | 'Selesai';
}

export default function ProjectListItem({ title, client, deadline, progress, status }: ProjectProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'Revisi': return '#ef4444';
      case 'Progress': return '#3b82f6';
      case 'Selesai': return '#10b981';
      default: return '#64748b';
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Badge style={{ backgroundColor: getStatusColor() + '20', color: getStatusColor() }}>
            {status}
          </Badge>
        </View>
        <Text style={styles.client}>{client} • {deadline}</Text>
        
        <View style={styles.progressSection}>
          <ProgressBar progress={progress} color={getStatusColor()} style={styles.progressBar} />
          <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.actionBtn}>
            <MaterialCommunityIcons name="message-outline" size={18} color="#64748b" />
            <Text style={styles.actionText}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <MaterialCommunityIcons name="file-document-outline" size={18} color="#64748b" />
            <Text style={styles.actionText}>Detail</Text>
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12, backgroundColor: '#fff', borderRadius: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', flex: 1, marginRight: 8 },
  client: { fontSize: 13, color: '#64748b', marginVertical: 8 },
  progressSection: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 8 },
  progressBar: { flex: 1, height: 6, borderRadius: 3 },
  progressText: { fontSize: 12, fontWeight: 'bold', color: '#64748b' },
  footer: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 12, marginTop: 4, gap: 16 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionText: { fontSize: 13, color: '#64748b' }
});