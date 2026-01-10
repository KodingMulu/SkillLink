'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../DashboardLayout';
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
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const response = await axios.get(`${apiUrl}/user/client/profile`, { withCredentials: true });
                if (response.data.code === 200) {
                    setProfile(response.data.data);
                }
            } catch (error) {
                console.error(error);
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
                <div className="flex h-screen items-center justify-center">
                    <div className="animate-pulse flex flex-col items-center gap-4">
                        <div className="h-16 w-16 bg-slate-200 rounded-full"></div>
                        <div className="h-4 w-48 bg-slate-200 rounded"></div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="client">
            <div className="relative h-64 w-full bg-slate-900 rounded-b-[3rem] overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-900 opacity-90"></div>
                <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-12">
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-6 md:p-8 mb-8 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        <div className="w-36 h-36 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-[2rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl border-4 border-white mx-auto lg:mx-0 uppercase">
                            {profile.avatar}
                        </div>

                        <div className="flex-1 text-center lg:text-left space-y-3">
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900">{profile.name}</h1>
                            <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm font-semibold pt-2">
                                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-100">
                                    <Briefcase className="w-4 h-4" /> <span>{profile.stats.totalJobsPosted} Jobs Posted</span>
                                </div>
                                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl border border-blue-100">
                                    <DollarSign className="w-4 h-4" /> <span>{formatRupiah(profile.stats.totalSpent)} Spent</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-50 text-slate-600 px-4 py-2 rounded-xl">
                                    <MapPin className="w-4 h-4" /> <span>{profile.location}</span>
                                </div>
                            </div>
                        </div>

                        <Link href="/dashboard/client/settings" className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition shadow-sm flex items-center gap-2">
                            <Edit2 size={18} /> Edit Profil
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Detail Kontak</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Mail className="text-slate-400" size={18} />
                                    <span className="text-slate-700 font-medium truncate" title={profile.email}>{profile.email}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Building className="text-slate-400" size={18} />
                                    <span className="text-slate-700 font-medium">Bergabung {formatDate(profile.joinDate)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Tentang Perusahaan</h3>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                {profile.bio || "Deskripsi perusahaan belum ditambahkan."}
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h3 className="text-lg font-black text-slate-900 mb-6">Pekerjaan Terbaru</h3>
                            {profile.recentJobs.length === 0 ? (
                                <div className="text-center py-8 text-slate-400 italic">Belum ada pekerjaan yang diposting.</div>
                            ) : (
                                <div className="space-y-4">
                                    {profile.recentJobs.map((job) => (
                                        <div key={job.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition gap-4">
                                            <div>
                                                <h4 className="font-bold text-slate-900">{job.title}</h4>
                                                <div className="flex items-center gap-3 mt-1 text-xs font-bold text-slate-500">
                                                    <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(job.date)}</span>
                                                    <span className="px-2 py-0.5 bg-white border rounded uppercase">{job.status}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-emerald-600">{formatRupiah(job.budget)}</p>
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