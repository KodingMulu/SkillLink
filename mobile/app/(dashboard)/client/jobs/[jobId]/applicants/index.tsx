import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    ActivityIndicator, Alert, RefreshControl, Image
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import {
    ArrowLeft, User, MapPin, CheckCircle, XCircle,
    FileText, MessageSquare, DollarSign
} from 'lucide-react-native';

interface Applicant {
    id: string;
    coverLetter: string;
    bidAmount: number;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    freelancer: {
        id: string;
        username: string;
        email: string;
        title: string | null;
        location: string | null;
        skills: string[];
        bio: string | null;
    };
}

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function JobApplicantsScreen() {
    const { jobId } = useLocalSearchParams();
    const router = useRouter();

    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchApplicants = async () => {
        try {
            const res = await axios.get(`${API_URL}/user/client/jobs/${jobId}/applicants`, {
                withCredentials: true
            });
            if (res.data.code === 200) {
                setApplicants(res.data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (jobId) fetchApplicants();
    }, [jobId]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchApplicants();
    }, []);

    const handleUpdateStatus = (proposalId: string, status: 'ACCEPTED' | 'REJECTED') => {
        Alert.alert(
            "Konfirmasi",
            `Apakah Anda yakin ingin ${status === 'ACCEPTED' ? 'menerima' : 'menolak'} pelamar ini?`,
            [
                { text: "Batal", style: "cancel" },
                {
                    text: "Ya",
                    onPress: async () => {
                        setProcessingId(proposalId);
                        try {
                            await axios.patch(`${API_URL}/user/client/proposals/${proposalId}`,
                                { status },
                                { withCredentials: true }
                            );
                            Alert.alert("Sukses", `Pelamar berhasil ${status === 'ACCEPTED' ? 'diterima' : 'ditolak'}`);
                            fetchApplicants();
                        } catch (error) {
                            Alert.alert("Error", "Gagal memperbarui status.");
                        } finally {
                            setProcessingId(null);
                        }
                    }
                }
            ]
        );
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ACCEPTED':
                return (
                    <View style={[s.badge, { backgroundColor: '#D1FAE5' }]}>
                        <CheckCircle size={14} color="#059669" />
                        <Text style={[s.badgeText, { color: '#059669' }]}>Diterima</Text>
                    </View>
                );
            case 'REJECTED':
                return (
                    <View style={[s.badge, { backgroundColor: '#FEE2E2' }]}>
                        <XCircle size={14} color="#DC2626" />
                        <Text style={[s.badgeText, { color: '#DC2626' }]}>Ditolak</Text>
                    </View>
                );
            default:
                return (
                    <View style={[s.badge, { backgroundColor: '#EFF6FF' }]}>
                        <Text style={[s.badgeText, { color: '#2563EB' }]}>Menunggu Review</Text>
                    </View>
                );
        }
    };

    return (
        <View style={s.container}>
            <View style={s.header}>
                <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
                    <ArrowLeft size={20} color="#64748B" />
                    <Text style={s.backText}>Kembali</Text>
                </TouchableOpacity>
                <Text style={s.title}>Daftar Pelamar</Text>
                <Text style={s.subtitle}>Review proposal dan pilih freelancer terbaik.</Text>
            </View>

            <ScrollView
                contentContainerStyle={s.content}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />}
            >
                {isLoading && !refreshing ? (
                    <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 40 }} />
                ) : applicants.length === 0 ? (
                    <View style={s.emptyState}>
                        <User size={48} color="#CBD5E1" />
                        <Text style={s.emptyTitle}>Belum ada pelamar</Text>
                        <Text style={s.emptyText}>Lowongan ini belum menerima proposal.</Text>
                    </View>
                ) : (
                    applicants.map((applicant) => (
                        <View key={applicant.id} style={s.card}>
                            <TouchableOpacity
                                onPress={() => router.push(`/client/applicants/${applicant.freelancer.id}`)}
                                style={s.profileHeader}
                            >
                                <View style={s.avatar}>
                                    <Text style={s.avatarText}>
                                        {applicant.freelancer.username?.[0]?.toUpperCase() || 'U'}
                                    </Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={s.username}>{applicant.freelancer.username}</Text>
                                    <Text style={s.userTitle}>{applicant.freelancer.title || 'Freelancer'}</Text>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <Text style={s.bidLabel}>Penawaran</Text>
                                    <Text style={s.bidAmount}>
                                        Rp {applicant.bidAmount.toLocaleString('id-ID')}
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            <View style={s.divider} />

                            <View style={s.section}>
                                <View style={s.sectionTitleRow}>
                                    <FileText size={16} color="#2563EB" />
                                    <Text style={s.sectionTitle}>Cover Letter</Text>
                                </View>
                                <Text style={s.coverLetter}>{applicant.coverLetter}</Text>
                            </View>

                            <View style={s.section}>
                                {applicant.freelancer.location && (
                                    <View style={s.locationRow}>
                                        <MapPin size={14} color="#94A3B8" />
                                        <Text style={s.locationText}>{applicant.freelancer.location}</Text>
                                    </View>
                                )}
                                <View style={s.skillsRow}>
                                    {applicant.freelancer.skills.map((skill, idx) => (
                                        <View key={idx} style={s.skillBadge}>
                                            <Text style={s.skillText}>{skill}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            <View style={s.cardFooter}>
                                <View style={s.statusContainer}>
                                    {getStatusBadge(applicant.status)}
                                </View>

                                {applicant.status === 'PENDING' && (
                                    <View style={s.actionButtons}>
                                        <TouchableOpacity
                                            style={[s.btn, s.rejectBtn]}
                                            onPress={() => handleUpdateStatus(applicant.id, 'REJECTED')}
                                            disabled={!!processingId}
                                        >
                                            <Text style={s.rejectText}>Tolak</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[s.btn, s.acceptBtn]}
                                            onPress={() => handleUpdateStatus(applicant.id, 'ACCEPTED')}
                                            disabled={!!processingId}
                                        >
                                            <Text style={s.acceptText}>
                                                {processingId === applicant.id ? '...' : 'Terima'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {applicant.status === 'ACCEPTED' && (
                                    <TouchableOpacity style={s.chatBtn}>
                                        <MessageSquare size={16} color="#2563EB" />
                                        <Text style={s.chatText}>Chat Freelancer</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        padding: 20,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    backText: {
        marginLeft: 8,
        color: '#64748B',
        fontSize: 14,
        fontWeight: '500',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#64748B',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    emptyState: {
        alignItems: 'center',
        padding: 40,
        backgroundColor: 'white',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderStyle: 'dashed',
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0F172A',
        marginTop: 16,
        marginBottom: 4,
    },
    emptyText: {
        color: '#64748B',
        fontSize: 14,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 16,
        overflow: 'hidden',
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2563EB',
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    userTitle: {
        fontSize: 12,
        color: '#64748B',
    },
    bidLabel: {
        fontSize: 10,
        color: '#64748B',
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    bidAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
    },
    section: {
        padding: 16,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    coverLetter: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 22,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 12,
    },
    locationText: {
        fontSize: 12,
        color: '#64748B',
    },
    skillsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    skillBadge: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    skillText: {
        fontSize: 10,
        color: '#475569',
    },
    cardFooter: {
        padding: 16,
        backgroundColor: '#F8FAFC',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        gap: 16,
    },
    statusContainer: {
        alignItems: 'flex-start',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 100,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    btn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rejectBtn: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    rejectText: {
        color: '#64748B',
        fontWeight: 'bold',
    },
    acceptBtn: {
        backgroundColor: '#2563EB',
    },
    acceptText: {
        color: 'white',
        fontWeight: 'bold',
    },
    chatBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#BFDBFE',
        paddingVertical: 12,
        borderRadius: 8,
    },
    chatText: {
        color: '#2563EB',
        fontWeight: 'bold',
    },
});