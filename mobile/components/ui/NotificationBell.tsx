import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Badge } from 'react-native-paper';

export default function NotificationBell() {
  const handlePress = () => {
    // Tambahkan logika di sini saat lonceng diklik (misal: buka modal atau navigasi)
    alert("Notifikasi diklik!"); 
  };

  return (
    <View style={styles.container}>
      {/* IconButton membuat lonceng ini dapat diklik secara otomatis */}
      <IconButton
        icon="bell" 
        iconColor="#1a2533" // Warna biru gelap sesuai gambar dashboard Anda
        size={24}
        onPress={handlePress}
        style={styles.iconButton}
      />
      
      {/* Badge untuk titik merah di pojok kanan atas */}
      <Badge
        visible={true}
        size={10} 
        style={styles.badge}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginRight: 10,
  },
  iconButton: {
    margin: 0,
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#ff4d4d', // Warna merah sesuai gambar
    borderWidth: 1.5,
    borderColor: '#ffffff', // Garis tepi putih agar rapi
  },
});