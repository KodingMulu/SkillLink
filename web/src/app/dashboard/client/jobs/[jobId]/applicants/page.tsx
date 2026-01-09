'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/app/dashboard/DashboardLayout';
import axios from 'axios';
import {
    ArrowLeft, User, MapPin, Briefcase, DollarSign,
    CheckCircle, XCircle, FileText, MessageSquare
} from "lucide-react";

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

export default function JobApplicantsPage() {
    const params = useParams();
    const router = useRouter();
    const jobId = params.jobId as string;

    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchApplicants = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const response = await axios.get(`${apiUrl}/user/client/jobs/${jobId}/applicants`, {
                withCredentials: true
            });
            if (response.data.code === 200) {
                setApplicants(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching applicants:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (jobId) fetchApplicants();
    }, [jobId]);

    const handleUpdateStatus = async (proposalId: string, status: 'ACCEPTED' | 'REJECTED') => {
        if (!confirm(`Apakah Anda yakin ingin ${status === 'ACCEPTED' ? 'menerima' : 'menolak'} pelamar ini?`)) return;

        setProcessingId(proposalId);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            await axios.patch(`${apiUrl}/user/client/proposals/${proposalId}`,
                { status },
                { withCredentials: true }
            );

            alert(`Pelamar berhasil ${status === 'ACCEPTED' ? 'diterima' : 'ditolak'}`);
            fetchApplicants();
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Gagal memperbarui status.");
        } finally {
            setProcessingId(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ACCEPTED': return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={14} /> Diterima</span>;
            case 'REJECTED': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><XCircle size={14} /> Ditolak</span>;
            default: return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">Menunggu Review</span>;
        }
    };

    return (
        <DashboardLayout role="client">
            <div className="mb-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-slate-500 hover:text-slate-900 transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Lowongan
                </button>
                <h1 className="text-2xl font-bold text-slate-900">Daftar Pelamar</h1>
                <p className="text-slate-500">Review proposal dan pilih freelancer terbaik untuk proyek Anda.</p>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-10 text-slate-500">Memuat data pelamar...</div>
                ) : applicants.length === 0 ? (
                    <div className="bg-white p-10 rounded-2xl border border-dashed border-slate-300 text-center">
                        <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-slate-900">Belum ada pelamar</h3>
                        <p className="text-slate-500">Lowongan ini belum menerima proposal.</p>
                    </div>
                ) : (
                    applicants.map((applicant) => (
                        <div key={applicant.id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex flex-col lg:flex-row gap-6">

                                {/* Profile Section */}
                                <div className="lg:w-1/4 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg uppercase">
                                            {applicant.freelancer.username?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900">{applicant.freelancer.username}</h3>
                                            <p className="text-xs text-slate-500">{applicant.freelancer.title || 'Freelancer'}</p>
                                        </div>
                                    </div>

                                    <div className="text-sm text-slate-600 space-y-2">
                                        {applicant.freelancer.location && (
                                            <div className="flex items-center gap-2">
                                                <MapPin size={14} className="text-slate-400" /> {applicant.freelancer.location}
                                            </div>
                                        )}
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {applicant.freelancer.skills.map((skill, idx) => (
                                                <span key={idx} className="text-[10px] bg-slate-100 px-2 py-1 rounded-md text-slate-600">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Proposal Content */}
                                <div className="lg:w-2/4 border-l border-slate-100 lg:pl-6 space-y-3">
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                                        <FileText size={16} className="text-blue-600" /> Cover Letter
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                                        {applicant.coverLetter}
                                    </p>
                                </div>

                                {/* Action Section */}
                                <div className="lg:w-1/4 border-l border-slate-100 lg:pl-6 flex flex-col justify-between">
                                    <div>
                                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Penawaran</div>
                                        <div className="text-2xl font-black text-slate-900 flex items-center gap-1">
                                            <span className="text-lg font-medium text-slate-400">Rp</span>
                                            {applicant.bidAmount.toLocaleString('id-ID')}
                                        </div>
                                        <div className="mt-4">
                                            {getStatusBadge(applicant.status)}
                                        </div>
                                    </div>

                                    {applicant.status === 'PENDING' && (
                                        <div className="grid grid-cols-2 gap-2 mt-6">
                                            <button
                                                onClick={() => handleUpdateStatus(applicant.id, 'REJECTED')}
                                                disabled={!!processingId}
                                                className="py-2 px-3 border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-50"
                                            >
                                                Tolak
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(applicant.id, 'ACCEPTED')}
                                                disabled={!!processingId}
                                                className="py-2 px-3 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50"
                                            >
                                                {processingId === applicant.id ? '...' : 'Terima'}
                                            </button>
                                        </div>
                                    )}

                                    {applicant.status === 'ACCEPTED' && (
                                        <button className="w-full mt-4 py-2 px-3 border border-blue-200 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-50 flex items-center justify-center gap-2">
                                            <MessageSquare size={16} /> Chat Freelancer
                                        </button>
                                    )}
                                </div>

                            </div>
                        </div>
                    ))
                )}
            </div>
        </DashboardLayout>
    );
}