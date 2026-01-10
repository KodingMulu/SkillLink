import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    ImageBackground, ActivityIndicator, RefreshControl, Image
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import {
    Mail, MapPin, Building, Briefcase, DollarSign,
    Edit2, Calendar
} from 'lucide-react-native';

interface Job {
    id: string;
    title: string;
    status: string;
    budget: number;
    date: string;
}

interface ClientProfileData {
    name: string;
    email: string;
    phone: string;
    location: string;
    joinDate: string;
    bio: string;
    stats: {
        totalJobsPosted: number;
        totalHired: number;
        totalSpent: number;
    };
    avatar: string;
    recentJobs: Job[];
}

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ClientProfileScreen() {
    const [profile, setProfile] = useState<ClientProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`${API_URL}/user/client/profile`, {
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

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading && !refreshing) {
        return (
            <View style={s.loadingContainer}>
                <ActivityIndicator size="large" color="#1E293B" />
            </View>
        );
    }

    return (
        <ScrollView
            style={s.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1E293B']} />}
        >
            <View style={s.banner} />

            <View style={s.contentContainer}>
                <View style={s.profileCard}>
                    <View style={s.avatarWrapper}>
                        <View style={s.avatar}>
                            <Text style={s.avatarText}>{profile?.avatar}</Text>
                        </View>
                    </View>

                    <View style={s.profileHeader}>
                        <Text style={s.name}>{profile?.name}</Text>
                        <View style={s.statsRow}>
                            <View style={[s.badge, s.greenBadge]}>
                                <Briefcase size={14} color="#047857" />
                                <Text style={s.greenText}>{profile?.stats.totalJobsPosted} Jobs Posted</Text>
                            </View>
                            <View style={[s.badge, s.blueBadge]}>
                                <DollarSign size={14} color="#1D4ED8" />
                                <Text style={s.blueText}>{formatRupiah(profile?.stats.totalSpent || 0)} Spent</Text>
                            </View>
                        </View>
                        <View style={[s.badge, s.grayBadge, { alignSelf: 'center', marginTop: 8 }]}>
                            <MapPin size={14} color="#475569" />
                            <Text style={s.grayText}>{profile?.location}</Text>
                        </View>

                        <TouchableOpacity
                            style={s.editBtn}
                            onPress={() => router.push('/(dashboard)/client/settings')}
                        >
                            <Edit2 size={16} color="#475569" />
                            <Text style={s.editBtnText}>Edit Profil</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={s.infoCard}>
                    <Text style={s.sectionTitle}>DETAIL KONTAK</Text>
                    <View style={s.contactRow}>
                        <Mail size={18} color="#94A3B8" />
                        <Text style={s.contactText}>{profile?.email}</Text>
                    </View>
                    <View style={s.contactRow}>
                        <Building size={18} color="#94A3B8" />
                        <Text style={s.contactText}>
                            Bergabung {profile?.joinDate ? formatDate(profile.joinDate) : '-'}
                        </Text>
                    </View>
                </View>

                <View style={s.infoCard}>
                    <Text style={s.sectionTitle}>TENTANG PERUSAHAAN</Text>
                    <Text style={s.bioText}>
                        {profile?.bio || "Deskripsi perusahaan belum ditambahkan."}
                    </Text>
                </View>

                <View style={s.infoCard}>
                    <Text style={s.sectionTitle}>PEKERJAAN TERBARU</Text>
                    {(!profile?.recentJobs || profile.recentJobs.length === 0) ? (
                        <Text style={s.emptyText}>Belum ada pekerjaan yang diposting.</Text>
                    ) : (
                        profile.recentJobs.map((job) => (
                            <View key={job.id} style={s.jobItem}>
                                <View>
                                    <Text style={s.jobTitle}>{job.title}</Text>
                                    <View style={s.jobMeta}>
                                        <View style={s.dateBadge}>
                                            <Calendar size={12} color="#64748B" />
                                            <Text style={s.dateText}>{formatDate(job.date)}</Text>
                                        </View>
                                        <View style={s.statusBadge}>
                                            <Text style={s.statusText}>{job.status}</Text>
                                        </View>
                                    </View>
                                </View>
                                <Text style={s.budget}>{formatRupiah(job.budget)}</Text>
                            </View>
                        ))
                    )}
                </View>
            </View>
        </ScrollView>
    );
}

const s = StyleSheet.create({
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
        height: 180,
        backgroundColor: '#0F172A',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    contentContainer: {
        paddingHorizontal: 20,
        marginTop: -80,
        paddingBottom: 40,
        gap: 20,
    },
    profileCard: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        alignItems: 'center',
    },
    avatarWrapper: {
        marginTop: -70,
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 30,
        backgroundColor: '#10B981',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    avatarText: {
        fontSize: 36,
        fontWeight: '900',
        color: 'white',
        textTransform: 'uppercase',
    },
    profileHeader: {
        alignItems: 'center',
        width: '100%',
    },
    name: {
        fontSize: 24,
        fontWeight: '900',
        color: '#0F172A',
        marginBottom: 12,
        textAlign: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 6,
    },
    greenBadge: {
        backgroundColor: '#ECFDF5',
        borderWidth: 1,
        borderColor: '#D1FAE5',
    },
    blueBadge: {
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    grayBadge: {
        backgroundColor: '#F8FAFC',
    },
    greenText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#047857',
    },
    blueText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1D4ED8',
    },
    grayText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#475569',
    },
    editBtn: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
        gap: 8,
    },
    editBtnText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#334155',
    },
    infoCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '900',
        color: '#0F172A',
        marginBottom: 16,
        letterSpacing: 1,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    contactText: {
        fontSize: 14,
        color: '#334155',
        fontWeight: '500',
    },
    bioText: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 22,
    },
    emptyText: {
        fontSize: 14,
        color: '#94A3B8',
        fontStyle: 'italic',
        textAlign: 'center',
        paddingVertical: 20,
    },
    jobItem: {
        backgroundColor: '#F8FAFC',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    jobTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: 8,
    },
    jobMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    dateBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    dateText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#64748B',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        backgroundColor: 'white',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#475569',
        textTransform: 'uppercase',
    },
    budget: {
        fontSize: 16,
        fontWeight: '900',
        color: '#059669',
        textAlign: 'right',
    },
});