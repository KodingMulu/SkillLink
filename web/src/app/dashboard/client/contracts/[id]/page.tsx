'use client';

import { use, useState } from 'react';
import DashboardLayout from "../../../DashboardLayout";
import { 
  ArrowLeft, Calendar, ShieldCheck, 
  FileText, Download, CheckCircle2, Clock, 
  AlertCircle, MessageSquare
} from "lucide-react";
import Link from "next/link";

export default function ContractManagement({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const contractId = resolvedParams.id;

  const [milestones, setMilestones] = useState([
    { id: 1, title: "Riset & Wireframe", budget: "Rp 1.500.000", status: "completed", date: "12 Des 2025" },
    { id: 2, title: "Desain UI High-Fidelity", budget: "Rp 2.000.000", status: "in_review", date: "20 Des 2025" },
    { id: 3, title: "Final Handover & Asset", budget: "Rp 1.500.000", status: "pending", date: "28 Des 2025" },
  ]);

  const contractDetail = {
    title: "Redesain Aplikasi Mobile E-Commerce",
    freelancer: "Nazril Afandi",
    totalBudget: "Rp 5.000.000",
    escrowBalance: "Rp 3.500.000",
    startDate: "01 Des 2025",
    deadline: "30 Des 2025",
  };

  const handleApproveMilestone = (id: number) => {
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, status: 'completed' } : m));
    alert("Milestone berhasil disetujui! Dana dikirimkan ke wallet freelancer.");
  };

  return (
    <DashboardLayout role="client">
      {/* Header & Navigasi */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Link href="/dashboard/client/contracts" className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors mb-2 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Daftar Kontrak</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">{contractDetail.title}</h1>
          <p className="text-slate-500 text-sm">Kontrak aktif bersama freelancer <span className="font-bold text-slate-900">{contractDetail.freelancer}</span></p>
        </div>
        <div className="flex gap-2">
          <a href="/dashboard/client/messages" className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 flex items-center gap-2 transition-colors">
            <MessageSquare className="w-4 h-4" /> Hubungi Freelancer
          </a>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm">
            Selesaikan Kontrak
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOLOM KIRI: Milestone & Pekerjaan */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-bold text-slate-900 text-base">Milestone Proyek</h2>
              <span className="text-xs text-slate-500 font-medium">3 Tahapan Pembayaran</span>
            </div>
            <div className="divide-y divide-slate-100">
              {milestones.map((m) => (
                <div key={m.id} className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start gap-3.5">
                    <div className={`mt-0.5 p-2 rounded-full ${
                      m.status === 'completed' ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' : 
                      m.status === 'in_review' ? 'bg-amber-100 text-amber-600 border border-amber-200' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {m.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{m.title}</h4>
                      <p className="text-xs text-slate-500">{m.budget} • Estimasi: {m.date}</p>
                    </div>
                  </div>
                  
                  <div>
                    {m.status === 'in_review' ? (
                      <button 
                        onClick={() => handleApproveMilestone(m.id)}
                        className="bg-emerald-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm"
                      >
                        Setujui & Cairkan
                      </button>
                    ) : (
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                        m.status === 'completed' ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' : 'text-slate-500 bg-slate-100'
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
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="font-bold text-slate-900 mb-4 text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" /> Hasil Kerja (Deliverables)
            </h2>
            <div className="border border-dashed border-slate-200 rounded-xl p-6 text-center bg-slate-50/50">
              <div className="bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600">
                <Download className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-slate-900">v2-final-design-mobile.zip</p>
              <p className="text-xs text-slate-500 mb-3">Dikirim oleh Nazril Afandi • 2 Jam yang lalu</p>
              <button className="text-blue-600 text-xs font-bold hover:underline">Unduh File Hasil Kerja</button>
            </div>
          </section>
        </div>

        {/* KOLOM KANAN: Ringkasan Dana Escrow */}
        <div className="space-y-6">
          <section className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-md">
            <div>
              <div className="flex items-center gap-2 text-slate-400 mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Dana Escrow Terlindungi</span>
              </div>
              <p className="text-xs text-slate-400 mb-1">Sisa Dana Tersimpan di Escrow:</p>
              <h3 className="text-3xl font-bold mb-6 text-white">{contractDetail.escrowBalance}</h3>
              
              <div className="space-y-2.5 pt-4 border-t border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Total Anggaran Kontrak</span>
                  <span className="font-bold text-slate-200">{contractDetail.totalBudget}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Sudah Dicairkan</span>
                  <span className="font-bold text-emerald-400">Rp 1.500.000</span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-xs uppercase tracking-wider">
              <AlertCircle className="w-4 h-4 text-amber-500" /> Informasi Kontrak
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Tanggal Mulai</p>
                  <p className="text-xs font-semibold text-slate-800">{contractDetail.startDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Tenggat Waktu</p>
                  <p className="text-xs font-semibold text-slate-800">{contractDetail.deadline}</p>
                </div>
              </div>
            </div>
          </section>
        </div>

      </div>
    </DashboardLayout>
  );
}