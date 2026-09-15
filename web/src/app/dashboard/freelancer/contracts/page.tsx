'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../../DashboardLayout';
import {
  Briefcase,
  Clock,
  CheckCircle2,
  MessageSquare,
  DollarSign,
  ChevronRight,
  Search,
  FileText,
  Loader2,
  Sparkles,
  Layers,
  X,
  ShieldCheck,
  TrendingUp
} from "lucide-react";
import { getApiUrl } from '@/lib/api';

interface ProjectContract {
  id: string;
  status: string; // 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  progress: number;
  createdAt: string;
  updatedAt: string;
  job: {
    title: string;
    description: string;
    budget: number;
    tags: string[];
    clientId: string;
  };
}

export default function FreelancerContractsPage() {
  const [contracts, setContracts] = useState<ProjectContract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'all'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContract, setSelectedContract] = useState<ProjectContract | null>(null);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    setIsLoading(true);
    try {
      const apiUrl = getApiUrl();
      const res = await axios.get(`${apiUrl}/user/freelancer/projects`, { withCredentials: true });
      if (res.data && res.data.data) {
        setContracts(res.data.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data kontrak:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return { label: 'Sedang Berjalan', class: 'bg-blue-50 text-blue-600 border-blue-200' };
      case 'COMPLETED':
        return { label: 'Selesai', class: 'bg-emerald-50 text-emerald-600 border-emerald-200' };
      case 'CANCELLED':
        return { label: 'Dibatalkan', class: 'bg-rose-50 text-rose-600 border-rose-200' };
      default:
        return { label: status, class: 'bg-slate-50 text-slate-600 border-slate-200' };
    }
  };

  const activeContractsCount = contracts.filter(c => c.status === 'IN_PROGRESS').length;
  const completedContractsCount = contracts.filter(c => c.status === 'COMPLETED').length;
  const totalValue = contracts.reduce((sum, c) => sum + (c.job?.budget || 0), 0);

  const filteredContracts = contracts.filter(contract => {
    const matchesTab =
      activeTab === 'all' ? true :
        activeTab === 'active' ? contract.status === 'IN_PROGRESS' :
          contract.status === 'COMPLETED';

    const matchesSearch =
      contract.job?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <DashboardLayout role="freelancer">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Banner Section */}
        <div className="relative rounded-3xl bg-slate-900 p-8 text-white shadow-lg">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                Manajemen Kontrak Proyek
              </h1>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                Pantau progres pengerjaan proyek aktif Anda, kirim milestone, dan pastikan pembayaran tersalurkan dengan aman melalui sistem Rekening Bersama (Escrow).
              </p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Clock size={26} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kontrak Aktif</p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">{activeContractsCount} Proyek</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle2 size={26} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kontrak Selesai</p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">{completedContractsCount} Proyek</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <TrendingUp size={26} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Nilai Kontrak</p>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">{formatCurrency(totalValue)}</h3>
            </div>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${activeTab === 'active'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
            >
              Aktif ({activeContractsCount})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${activeTab === 'completed'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
            >
              Selesai ({completedContractsCount})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
            >
              Semua ({contracts.length})
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari kontrak / judul..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Contracts List */}
        {isLoading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-slate-500 font-medium text-sm">Memuat kontrak proyek Anda...</p>
          </div>
        ) : filteredContracts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
              <FileText size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Belum Ada Kontrak</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              Tidak ada kontrak proyek yang sesuai dengan kriteria filter saat ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {filteredContracts.map((contract) => {
              const statusInfo = getStatusBadge(contract.status);
              const progressPct = contract.progress || (contract.status === 'COMPLETED' ? 100 : 50);

              return (
                <div
                  key={contract.id}
                  className="group bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">

                    {/* Info Proyek */}
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${statusInfo.class}`}>
                          {statusInfo.label}
                        </span>
                        <span className="text-slate-400 font-mono text-xs">ID: {contract.id.slice(0, 8)}</span>
                      </div>

                      <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                        {contract.job?.title || 'Proyek Tanpa Judul'}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-slate-500 text-xs font-semibold">
                        <span className="flex items-center gap-1.5">
                          <Briefcase size={15} className="text-slate-400" /> Klien: {contract.job?.clientId ? 'Klien Terverifikasi' : 'Klien SkillLink'}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={15} className="text-slate-400" /> Dibuat: {formatDate(contract.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Milestone & Progres */}
                    <div className="flex-1 border-y lg:border-y-0 lg:border-x border-slate-100 py-4 lg:py-0 lg:px-8 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-500 uppercase tracking-wider">Progres Pekerjaan</span>
                        <span className="font-black text-blue-600">{progressPct}%</span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-700"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {contract.status === 'COMPLETED' ? 'Seluruh milestone telah diselesaikan' : 'Pekerjaan sedang berlangsung'}
                      </p>
                    </div>

                    {/* Budget & Action */}
                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 min-w-[200px]">
                      <div className="text-left lg:text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nilai Kontrak</p>
                        <p className="text-xl font-black text-slate-900">{formatCurrency(contract.job?.budget)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedContract(contract)}
                          className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                        >
                          <span>Rincian Kontrak</span>
                          <ChevronRight size={15} />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Modal Detail Kontrak */}
      {selectedContract && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden border border-white/20">
            <div className="p-6 md:p-8 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="px-3 py-1 rounded-full bg-blue-600/80 text-white text-xs font-bold uppercase tracking-wider">
                  Rincian Kontrak Escrow
                </span>
                <h3 className="text-xl font-black mt-2">{selectedContract.job?.title}</h3>
              </div>
              <button
                onClick={() => setSelectedContract(null)}
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-6">

              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Nominal Kontrak</p>
                  <p className="text-lg font-black text-slate-900 mt-0.5">{formatCurrency(selectedContract.job?.budget)}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Pembayaran</p>
                  <p className="text-sm font-bold text-emerald-600 flex items-center gap-1.5 mt-1">
                    <ShieldCheck size={16} /> Escrow Terkunci (Aman)
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Deskripsi Pekerjaan</h4>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {selectedContract.job?.description || 'Tidak ada deskripsi tambahan.'}
                </p>
              </div>

              {selectedContract.job?.tags && selectedContract.job.tags.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Keahlian Yang Dibutuhkan</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedContract.job.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-400 font-medium">
                  ID Kontrak: <span className="font-mono font-bold text-slate-600">{selectedContract.id}</span>
                </div>
                <button
                  onClick={() => setSelectedContract(null)}
                  className="px-6 py-3 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all shadow-md"
                >
                  Tutup
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}