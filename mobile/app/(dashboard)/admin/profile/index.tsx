import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView, ActivityIndicator,
    RefreshControl, Dimensions
} from 'react-native';
import axios from 'axios';
import { Shield, Mail, Calendar } from 'lucide-react-native';

interface AdminProfileData {
    name: string;
    email: string;
    role: string;
    joinDate: string;
    avatar: string;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function AdminProfileScreen() {
    const [profile, setProfile] = useState<AdminProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`${API_URL}/user/admin/profile`, {
                withCredentials: true
            });
            if (res.data.code === 200) {
                setProfile(res.data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchProfile();
    }, []);

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1E293B" />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1E293B']} />
            }
        >
            <View style={styles.banner} />

            <View style={styles.contentContainer}>
                <View style={styles.card}>
                    <View style={styles.avatarWrapper}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{profile?.avatar || 'A'}</Text>
                        </View>
                    </View>

                    <View style={styles.headerInfo}>
                        <Text style={styles.name}>{profile?.name}</Text>
                        <View style={styles.roleContainer}>
                            <Shield size={16} color="#DC2626" />
                            <Text style={styles.roleText}>{profile?.role}</Text>
                        </View>
                    </View>

                    <View style={styles.infoGrid}>
                        <View style={styles.infoItem}>
                            <View style={styles.iconBox}>
                                <Mail size={20} color="#64748B" />
                            </View>
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>EMAIL SYSTEM</Text>
                                <Text style={styles.infoValue}>{profile?.email}</Text>
                            </View>
                        </View>

                        <View style={styles.infoItem}>
                            <View style={styles.iconBox}>
                                <Calendar size={20} color="#64748B" />
                            </View>
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>REGISTERED ON</Text>
                                <Text style={styles.infoValue}>
                                    {profile?.joinDate ? new Date(profile.joinDate).toLocaleDateString('id-ID') : '-'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
    },
    banner: {
        height: 160,
        backgroundColor: '#1E293B',
    },
    contentContainer: {
        paddingHorizontal: 20,
        marginTop: -60,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    avatarWrapper: {
        alignItems: 'center',
        marginTop: -60,
        marginBottom: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        backgroundColor: '#0F172A',
        borderRadius: 24,
        borderWidth: 4,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: '900',
        color: 'white',
        textTransform: 'uppercase',
    },
    headerInfo: {
        marginBottom: 32,
    },
    name: {
        fontSize: 28,
        fontWeight: '900',
        color: '#0F172A',
        marginBottom: 8,
    },
    roleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    roleText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#64748B',
        textTransform: 'uppercase',
    },
    infoGrid: {
        gap: 16,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        gap: 16,
    },
    iconBox: {
        width: 44,
        height: 44,
        backgroundColor: 'white',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    infoTextContainer: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: '#94A3B8',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
    },
});