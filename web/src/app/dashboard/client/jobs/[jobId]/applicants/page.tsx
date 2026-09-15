'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/app/dashboard/DashboardLayout';
import { getApiUrl } from '@/lib/api';
import axios from 'axios';
import {
    ArrowLeft, User, FileText,
    CheckCircle, XCircle, MessageSquare
} from "lucide-react";
import Link from 'next/link';

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
            const apiUrl = getApiUrl();
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
            const apiUrl = getApiUrl();
            await axios.patch(`${apiUrl}/user/client/proposals/${proposalId}`,
                { status },
                { withCredentials: true }
            );

            alert(`Pelamar berhasil ${status === 'ACCEPTED' ? 'diterima' : 'ditolak'}`);
            fetchApplicants();
        } catch (error) {
            console.error("Error updating status:", error);
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || "Gagal memperbarui status proposal.");
            } else {
                alert("Gagal memperbarui status proposal.");
            }
        } finally {
            setProcessingId(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ACCEPTED': return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 inline-flex"><CheckCircle size={14} /> Diterima</span>;
            case 'REJECTED': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 inline-flex"><XCircle size={14} /> Ditolak</span>;
            default: return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold inline-flex">Menunggu Review</span>;
        }
    };

    return (
        <DashboardLayout role="client">
            <div className="mb-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors mb-3"
                >
                    <ArrowLeft className="w-4 h-4 mr-1.5" /> Kembali ke Lowongan
                </button>
                <h1 className="text-2xl font-bold text-slate-900">Daftar Pelamar Pekerjaan</h1>
                <p className="text-slate-500 text-sm">Tinjau proposal dan tentukan freelancer yang tepat untuk proyek Anda.</p>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-12 text-slate-500 flex flex-col items-center">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2" />
                        <p className="text-xs font-medium">Memuat data pelamar...</p>
                    </div>
                ) : applicants.length === 0 ? (
                    <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center">
                        <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-slate-900">Belum ada pelamar</h3>
                        <p className="text-slate-500 text-xs mt-1">Lowongan ini belum menerima proposal dari freelancer.</p>
                    </div>
                ) : (
                    applicants.map((applicant) => (
                        <div key={applicant.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-slate-300 transition-colors">
                            <div className="flex flex-col lg:flex-row gap-6">

                                {/* Profile Section */}
                                <div className="lg:w-1/4 space-y-3">
                                    <div className="group block">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-base uppercase">
                                                {applicant.freelancer.username?.[0] || 'U'}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 text-base">
                                                    {applicant.freelancer.username}
                                                </h3>
                                                <p className="text-xs text-slate-500">{applicant.freelancer.title || 'Freelancer'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {applicant.freelancer.skills && applicant.freelancer.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 pt-2">
                                            {applicant.freelancer.skills.slice(0, 4).map((skill, idx) => (
                                                <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[11px] font-semibold">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Proposal Content */}
                                <div className="lg:w-2/4 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                                        <FileText size={15} className="text-blue-600" /> Surat Lamaran (Cover Letter)
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                                        {applicant.coverLetter}
                                    </p>
                                </div>

                                {/* Action Section */}
                                <div className="lg:w-1/4 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 flex flex-col justify-between">
                                    <div>
                                        <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1">Penawaran Anggaran</div>
                                        <div className="text-xl font-bold text-slate-900 flex items-center gap-1">
                                            <span className="text-sm font-semibold text-slate-400">Rp</span>
                                            {applicant.bidAmount.toLocaleString('id-ID')}
                                        </div>
                                        <div className="mt-3">
                                            {getStatusBadge(applicant.status)}
                                        </div>
                                    </div>

                                    {applicant.status === 'PENDING' && (
                                        <div className="grid grid-cols-2 gap-2 mt-4">
                                            <button
                                                onClick={() => handleUpdateStatus(applicant.id, 'REJECTED')}
                                                disabled={!!processingId}
                                                className="py-2 px-3 border border-slate-300 text-slate-700 rounded-lg text-xs font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-50"
                                            >
                                                Tolak
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(applicant.id, 'ACCEPTED')}
                                                disabled={!!processingId}
                                                className="py-2 px-3 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                                            >
                                                {processingId === applicant.id ? '...' : 'Terima'}
                                            </button>
                                        </div>
                                    )}

                                    {applicant.status === 'ACCEPTED' && (
                                        <a 
                                            href={`/dashboard/client/messages`}
                                            className="w-full mt-4 py-2 px-3 border border-blue-200 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-100 flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <MessageSquare size={14} /> Hubungi Freelancer
                                        </a>
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