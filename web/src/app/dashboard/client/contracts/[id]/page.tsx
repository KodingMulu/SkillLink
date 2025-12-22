'use client';

import { use, useState } from 'react';
import DashboardLayout from "../../../DashboardLayout";
import { 
  ArrowLeft, Calendar, DollarSign, ShieldCheck, 
  FileText, Download, CheckCircle2, Clock, 
  AlertCircle, MessageSquare, MoreHorizontal
} from "lucide-react";
import Link from "next/link";

export default function ContractManagement({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const contractId = resolvedParams.id;

  // State untuk simulasi persetujuan milestone
  const [milestones, setMilestones] = useState([
    { id: 1, title: "Riset & Wireframe", budget: "Rp 1.500.000", status: "completed", date: "12 Des 2025" },
    { id: 2, title: "Desain UI High-Fidelity", budget: "Rp 2.000.000", status: "in_review", date: "20 Des 2025" },
    { id: 3, title: "Final Handover & Asset", budget: "Rp 1.500.000", status: "pending", date: "28 Des 2025" },
  ]);

  const contractDetail = {
    title: "Redesain Aplikasi Mobile E-Commerce",
    freelancer: "Nazril Afandi",
    totalBudget: "Rp 5.000.000",
    escrowBalance: "Rp 3.500.000", // Dana yang belum cair
    startDate: "01 Des 2025",
    deadline: "30 Des 2025",
  };

  return (
    <DashboardLayout role="client">
      {/* Header & Navigasi */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Link href="/dashboard/client" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-2 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Kembali ke Dashboard</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">{contractDetail.title}</h1>
          <p className="text-slate-500 text-sm">Kontrak dengan <span className="font-semibold text-blue-600">{contractDetail.freelancer}</span></p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Chat
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20">
            Selesaikan Kontrak
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOLOM KIRI: Milestone & Pekerjaan */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">Milestone Proyek</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {milestones.map((m) => (
                <div key={m.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 p-2 rounded-full ${
                      m.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 
                      m.status === 'in_review' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {m.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{m.title}</h4>
                      <p className="text-sm text-slate-500">{m.budget} • Estimasi {m.date}</p>
                    </div>
                  </div>
                  
                  <div>
                    {m.status === 'in_review' ? (
                      <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-700 shadow-md transition-all">
                        Setujui & Bayar
                      </button>
                    ) : (
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                        m.status === 'completed' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 bg-slate-100'
                      }`}>
                        {m.status.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Pengiriman File Terbaru */}
          <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" /> Hasil Kerja (Deliverables)
            </h2>
            <div className="border-2 border-dashed border-slate-100 rounded-2xl p-8 text-center">
              <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Download className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm font-bold text-slate-900">v2-final-design-mobile.zip</p>
              <p className="text-xs text-slate-400 mb-4">Dikirim oleh Nazril • 2 Jam yang lalu</p>
              <button className="text-blue-600 text-sm font-bold hover:underline">Unduh File</button>
            </div>
          </section>
        </div>

        {/* KOLOM KANAN: Ringkasan Dana Escrow */}
        <div className="space-y-6">
          <section className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-slate-400 mb-4">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-widest">Dana Escrow Aman</span>
              </div>
              <p className="text-sm text-slate-400">Total Sisa Dana Terlindungi:</p>
              <h3 className="text-3xl font-bold mb-6">{contractDetail.escrowBalance}</h3>
              
              <div className="space-y-3 py-4 border-t border-white/10">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Total Kontrak</span>
                  <span className="font-bold">{contractDetail.totalBudget}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Sudah Dibayarkan</span>
                  <span className="font-bold text-emerald-400">Rp 1.500.000</span>
                </div>
              </div>
            </div>
            {/* Dekorasi Background */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl"></div>
          </section>

          <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 text-amber-500" /> Informasi Kontrak
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Mulai</p>
                  <p className="text-sm font-medium">{contractDetail.startDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Tenggat Waktu</p>
                  <p className="text-sm font-medium">{contractDetail.deadline}</p>
                </div>
              </div>
            </div>
          </section>
        </div>

      </div>
    </DashboardLayout>
  );
}