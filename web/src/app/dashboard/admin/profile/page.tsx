'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../DashboardLayout';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import { Shield, Mail, Calendar, UserCheck } from 'lucide-react';

interface AdminProfileData {
    name: string;
    email: string;
    role: string;
    joinDate: string;
    avatar: string;
}

export default function AdminProfilePage() {
    const [profile, setProfile] = useState<AdminProfileData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(getApiUrl('/user/admin/profile'), { withCredentials: true });
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

    if (loading || !profile) {
        return (
            <DashboardLayout role="admin">
                <div className="flex h-64 items-center justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-slate-200 border-t-blue-600 rounded-full"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="admin">
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Profil Administrator</h1>
                    <p className="text-slate-500 text-sm">Informasi akun pengelola sistem platform.</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="h-32 bg-slate-900 flex items-end justify-end p-4">
                        <span className="text-xs font-semibold px-3 py-1 bg-white/10 text-white border border-white/20 rounded-full backdrop-blur-sm">
                            System Admin Access
                        </span>
                    </div>
                    <div className="px-8 pb-8">
                        <div className="relative -mt-12 mb-6 flex items-end justify-between">
                            <div className="w-24 h-24 bg-blue-600 rounded-2xl border-4 border-white flex items-center justify-center text-white text-3xl font-black shadow-md uppercase">
                                {profile.avatar || profile.name.charAt(0)}
                            </div>
                        </div>

                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">{profile.name}</h2>
                                <p className="text-slate-500 text-sm font-medium flex items-center gap-2 mt-1">
                                    <Shield size={16} className="text-red-600" /> 
                                    <span className="px-2 py-0.5 bg-red-50 text-red-700 rounded text-xs font-bold uppercase">{profile.role}</span>
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 flex items-center gap-4">
                                <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-500 shadow-sm">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email System</p>
                                    <p className="font-semibold text-slate-800 text-sm">{profile.email}</p>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 flex items-center gap-4">
                                <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-500 shadow-sm">
                                    <Calendar size={18} />
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tanggal Terdaftar</p>
                                    <p className="font-semibold text-slate-800 text-sm">{new Date(profile.joinDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}