'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../DashboardLayout';
import { getApiUrl } from '@/lib/api';
import Link from 'next/link';
import axios from 'axios';
import {
    Mail, MapPin, Building,
    Briefcase, DollarSign, Edit2,
    Calendar
} from 'lucide-react';

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

export default function ClientProfilePage() {
    const [profile, setProfile] = useState<ClientProfileData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const apiUrl = getApiUrl();
                const response = await axios.get(`${apiUrl}/user/client/profile`, { withCredentials: true });
                if (response.data.code === 200) {
                    setProfile(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching client profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    if (loading || !profile) {
        return (
            <DashboardLayout role="client">
                <div className="flex h-[400px] items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs text-slate-500 font-medium">Memuat Profil Klien...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="client">
            {/* Dark Header Cover */}
            <div className="relative h-44 w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900"></div>
                <div className="absolute bottom-4 left-6 text-white z-10">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white uppercase tracking-wider">
                        Client Account
                    </span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-12">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 mb-8 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-6 items-start">
                        <div className="w-24 h-24 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-md mx-auto lg:mx-0 uppercase">
                            {profile.avatar}
                        </div>

                        <div className="flex-1 text-center lg:text-left space-y-2">
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{profile.name}</h1>
                            <div className="flex flex-wrap justify-center lg:justify-start gap-3 text-xs font-semibold pt-1">
                                <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-100">
                                    <Briefcase className="w-3.5 h-3.5" /> <span>{profile.stats.totalJobsPosted} Jobs Posted</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100">
                                    <DollarSign className="w-3.5 h-3.5" /> <span>{formatRupiah(profile.stats.totalSpent)} Total Spent</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg">
                                    <MapPin className="w-3.5 h-3.5" /> <span>{profile.location}</span>
                                </div>
                            </div>
                        </div>

                        <Link href="/dashboard/client/settings" className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition shadow-sm flex items-center gap-1.5 mx-auto lg:mx-0">
                            <Edit2 size={15} /> Edit Profil
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Detail Kontak</h3>
                            <div className="space-y-3 text-xs">
                                <div className="flex items-center gap-3">
                                    <Mail className="text-slate-400" size={16} />
                                    <span className="text-slate-700 font-medium truncate" title={profile.email}>{profile.email}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Building className="text-slate-400" size={16} />
                                    <span className="text-slate-700 font-medium">Bergabung {formatDate(profile.joinDate)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Tentang Perusahaan</h3>
                            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                                {profile.bio || "Deskripsi perusahaan belum ditambahkan."}
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h3 className="text-base font-bold text-slate-900 mb-4">Lowongan Terbaru</h3>
                            {profile.recentJobs.length === 0 ? (
                                <div className="text-center py-8 text-slate-400 text-xs italic">Belum ada pekerjaan yang diposting.</div>
                            ) : (
                                <div className="space-y-3">
                                    {profile.recentJobs.map((job) => (
                                        <div key={job.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition gap-3">
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm">{job.title}</h4>
                                                <div className="flex items-center gap-3 mt-1 text-xs font-semibold text-slate-500">
                                                    <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(job.date)}</span>
                                                    <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] uppercase font-bold text-slate-700">{job.status}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-slate-900 text-sm">{formatRupiah(job.budget)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}