// mobile/app/(dashboard)/client/index.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function ClientDashboard() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Dashboard Client</Text>
            <Text style={styles.subtitle}>Selamat datang kembali!</Text>

            {/* Menu Navigasi Sementara (Nanti diganti Tabs) */}
            <View style={styles.menuContainer}>
                <TouchableOpacity style={styles.btn} onPress={() => router.push('/(dashboard)/client/jobs')}>
                    <Text style={styles.btnText}>Kelola Pekerjaan</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn} onPress={() => router.push('/(dashboard)/client/talents')}>
                    <Text style={styles.btnText}>Cari Talent</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
    subtitle: { fontSize: 16, color: 'gray', marginBottom: 30 },
    menuContainer: { width: '100%', gap: 15 },
    btn: { backgroundColor: '#2563EB', padding: 15, borderRadius: 8, alignItems: 'center' },
    btnText: { color: 'white', fontWeight: 'bold' }
});