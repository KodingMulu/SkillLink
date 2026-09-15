'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from "../../DashboardLayout";
import { getApiUrl } from '@/lib/api';
import { 
  Briefcase, Calendar, CheckCircle2, Clock, 
  FileText, MessageSquare, ChevronRight, Search, ShieldCheck
} from "lucide-react";
import axios from 'axios';
import Link from 'next/link';

interface Contract {
  id: string;
  freelancerName: string;
  projectTitle: string;
  progress: number;
  deadline: string;
  budget: number;
  status?: string;
}

export default function ClientContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchContracts = async () => {
    setIsLoading(true);
    try {
      const apiUrl = getApiUrl();
      const res = await axios.get(`${apiUrl}/user/client/dashboard`, { withCredentials: true });
      if (res.data.code === 200 && res.data.data?.activeContracts) {
        setContracts(res.data.data.activeContracts);
      }
    } catch (error) {
      console.error("Error fetching client contracts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);

  const filteredContracts = contracts.filter(c => {
    const matchesQuery = c.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.freelancerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesQuery;
  });

  return (
    <DashboardLayout role="client">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Manajemen Kontrak Proyek</h1>
            <p className="text-slate-500 text-sm">Pantau status progres, escrow, dan hasil kerja freelancer Anda</p>
          </div>
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-xl border border-emerald-200 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Escrow System Active
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul proyek atau freelancer..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              statusFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua Kontrak
          </button>
          <button
            onClick={() => setStatusFilter('in_progress')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              statusFilter === 'in_progress' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Berjalan
          </button>
        </div>
      </div>

      {/* Contracts List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-bold text-slate-900 text-base">Daftar Kontrak ({filteredContracts.length})</h2>
          <span className="text-xs text-slate-500 font-medium">Updated Realtime</span>
        </div>

        <div className="divide-y divide-slate-100">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-xs font-medium">Memuat data kontrak...</p>
            </div>
          ) : filteredContracts.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-800">Belum Ada Kontrak Aktif</p>
              <p className="text-xs text-slate-400 mt-1">Kontrak akan otomatis terbentuk setelah Anda menerima proposal freelancer.</p>
            </div>
          ) : (
            filteredContracts.map((contract) => (
              <div key={contract.id} className="p-6 hover:bg-slate-50/70 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold uppercase">
                        {contract.freelancerName?.charAt(0) || 'F'}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{contract.projectTitle}</h3>
                        <p className="text-xs text-slate-500">Freelancer: <span className="font-semibold text-slate-800">{contract.freelancerName}</span></p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="flex justify-between text-xs mb-1 font-semibold">
                        <span className="text-slate-500">Progres Pekerjaan</span>
                        <span className="text-blue-600 font-bold">{contract.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 max-w-md">
                        <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${contract.progress}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-3 min-w-[200px]">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Kontrak Berjalan
                    </span>

                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Anggaran Escrow</span>
                      <span className="text-base font-bold text-slate-900">{formatRupiah(contract.budget)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/client/contracts/${contract.id}`}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                      >
                        Detail Kontrak <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
