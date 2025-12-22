'use client';

import React, { useState } from 'react';
import DashboardLayout from '../../DashboardLayout';
import { 
  Briefcase, Clock, CheckCircle2, MessageSquare, 
  DollarSign, ChevronRight, Search, Filter, 
  MoreHorizontal, FileText, AlertCircle
} from "lucide-react";

export default function FreelancerContractsPage() {
  const [activeTab, setActiveTab] = useState('active');

  const contracts = [
    {
      id: "CON-7829",
      title: "Modern E-Commerce Redesign",
      client: "Global Retail Co.",
      budget: "Rp 12.500.000",
      deadline: "15 Jan 2026",
      status: "in_progress",
      progress: 65,
      nextMilestone: "Integrasi Payment Gateway"
    },
    {
      id: "CON-7830",
      title: "SaaS Dashboard Analytics",
      client: "DataViz Startup",
      budget: "Rp 8.000.000",
      deadline: "28 Des 2025",
      status: "review",
      progress: 100,
      nextMilestone: "Final Feedback"
    },
    {
      id: "CON-7812",
      title: "Mobile App Bug Fixing",
      client: "Tech Solutions",
      budget: "Rp 3.500.000",
      deadline: "10 Des 2025",
      status: "completed",
      progress: 100,
      nextMilestone: "Proyek Selesai"
    }
  ];

  const getStatusStyles = (status: string) => {
    switch(status) {
      case 'in_progress': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'review': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <DashboardLayout role="freelancer">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manajemen Kontrak</h1>
          <p className="text-slate-500 font-medium">Kelola pekerjaan aktif dan pantau progres pembayaran Anda.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          <button 
            onClick={() => setActiveTab('active')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'active' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Aktif (2)
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'history' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Riwayat
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {contracts.map((contract) => (
          <div key={contract.id} className="group bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300">
            <div className="flex flex-col lg:flex-row lg:items-center gap-8">
              
              {/* Bagian Kiri: Info Proyek */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyles(contract.status)}`}>
                    {contract.status.replace('_', ' ')}
                  </span>
                  <span className="text-slate-400 font-bold text-xs">ID: {contract.id}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {contract.title}
                </h3>
                <div className="flex items-center gap-4 text-slate-500 font-bold text-sm">
                  <span className="flex items-center gap-1.5"><Briefcase size={16} className="text-slate-400" /> {contract.client}</span>
                  <span className="text-slate-200">|</span>
                  <span className="flex items-center gap-1.5"><Clock size={16} className="text-slate-400" /> {contract.deadline}</span>
                </div>
              </div>

              {/* Bagian Tengah: Progres & Milestone */}
              <div className="flex-1 border-y lg:border-y-0 lg:border-x border-slate-100 py-6 lg:py-0 lg:px-8">
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Next Milestone</p>
                    <p className="text-sm font-bold text-slate-700">{contract.nextMilestone}</p>
                  </div>
                  <p className="text-sm font-black text-blue-600">{contract.progress}%</p>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-1000"
                    style={{ width: `${contract.progress}%` }}
                  />
                </div>
              </div>

              {/* Bagian Kanan: Budget & Action */}
              <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 min-w-[180px]">
                <div className="text-left lg:text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Budget</p>
                  <p className="text-xl font-black text-slate-900">{contract.budget}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-3 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition border border-slate-200">
                    <MessageSquare size={18} />
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition">
                    Kelola <ChevronRight size={16} />
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}