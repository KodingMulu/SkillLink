'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../DashboardLayout';
import axios from 'axios';
import { User, Shield, Mail, Calendar } from 'lucide-react';

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
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const response = await axios.get(`${apiUrl}/user/admin/profile`, { withCredentials: true });
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
                <div className="flex h-screen items-center justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-slate-300 border-t-slate-800 rounded-full"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="admin">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                    <div className="h-32 bg-slate-800"></div>
                    <div className="px-8 pb-8">
                        <div className="relative -mt-16 mb-6">
                            <div className="w-32 h-32 bg-slate-900 rounded-2xl border-4 border-white flex items-center justify-center text-white text-4xl font-black shadow-lg uppercase">
                                {profile.avatar}
                            </div>
                        </div>

                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-black text-slate-900">{profile.name}</h1>
                                <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
                                    <Shield size={16} className="text-red-600" /> {profile.role}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4">
                                <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-500">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Email System</p>
                                    <p className="font-semibold text-slate-700">{profile.email}</p>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4">
                                <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-500">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Registered On</p>
                                    <p className="font-semibold text-slate-700">{new Date(profile.joinDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}