'use client';

import { useState } from 'react';
import DashboardLayout from "../DashboardLayout";
import { Users, FileText, DollarSign, Briefcase, ChevronRight, MoreVertical, X, Upload, MapPin, Calendar, DollarSign as Money, Clock, CheckCircle2 } from "lucide-react";

export default function ClientDashboard() {
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    budget: '',
    deadline: '',
    location: '',
    skills: '',
    experienceLevel: 'intermediate'
  });

  const stats = [
    { label: "Total Pengeluaran", value: "Rp 45.000.000", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Lowongan Aktif", value: "4", icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Pelamar Baru", value: "28", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Kontrak Selesai", value: "8", icon: FileText, color: "text-slate-600", bg: "bg-slate-100" },
  ];

  const recentApplicants = [
    { name: "sapta wahyu tirta", role: "UI/UX Designer", appliedFor: "Redesain Aplikasi Mobile", date: "2 Jam lalu", match: 95 },
    { name: "deni himawan", role: "Content Writer", appliedFor: "Artikel Blog SEO", date: "5 Jam lalu", match: 88 },
    { name: "m.fito", role: "Backend Dev", appliedFor: "API Integration", date: "1 Hari lalu", match: 70 },
  ];

  // DATA BARU: Aktivitas Log
  const activities = [
    { id: 1, text: "Pembayaran Escrow disetujui", time: "10m lalu", type: "payment" },
    { id: 2, text: "Nazril mengunggah file revisi", time: "1j lalu", type: "work" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    alert('Pekerjaan berhasil diposting!');
    setShowPostJobModal(false);
  };

  return (
    <DashboardLayout role="client">
      <div className="flex justify-between items-end mb-8">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard Klien</h1>
            <p className="text-slate-500">Kelola proyek dan temukan talenta terbaik.</p>
        </div>
        <button 
          onClick={() => setShowPostJobModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-lg shadow-blue-600/20 transition-all"
        >
            + Posting Pekerjaan Baru
        </button>
      </div>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                 <p className="text-sm text-slate-500">{stat.label}</p>
                 <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Recent Applicants (TIDAK BERUBAH) */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-bold text-slate-900">Pelamar Terbaru</h2>
              <button className="text-sm text-blue-600 hover:underline">Lihat Semua</button>
            </div>
            <div className="divide-y divide-slate-100">
                <div className="bg-slate-50 px-6 py-3 grid grid-cols-12 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <div className="col-span-5">Talenta</div>
                    <div className="col-span-4">Melamar Untuk</div>
                    <div className="col-span-2">Match</div>
                    <div className="col-span-1"></div>
                </div>

              {recentApplicants.map((applicant, idx) => (
                <div key={idx} className="px-6 py-4 grid grid-cols-12 items-center hover:bg-slate-50 transition-colors">
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                        {applicant.name.charAt(0)}
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-900 text-sm">{applicant.name}</h4>
                        <p className="text-xs text-slate-500">{applicant.role} • {applicant.date}</p>
                    </div>
                  </div>
                  <div className="col-span-4 text-sm text-slate-600 font-medium">
                    {applicant.appliedFor}
                  </div>
                  <div className="col-span-2">
                     <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                         applicant.match > 90 ? 'bg-emerald-100 text-emerald-700' : 
                         applicant.match > 80 ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                     }`}>
                        {applicant.match}% Match
                     </span>
                  </div>
                  <div className="col-span-1 text-right">
                    <button className="text-slate-400 hover:text-slate-600">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Col: Active Contracts (TIDAK BERUBAH STRUKTURNYA) */}
        <div className="space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-bold text-slate-900 mb-4">Kontrak Berjalan</h2>
            <div className="space-y-4">
               {/* Contract Item */}
               <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">NZ</div>
                          <span className="text-sm font-semibold text-slate-900">Nazril Afandi</span>
                      </div>
                      <button className="text-slate-400"><MoreVertical className="w-4 h-4"/></button>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">Project: Pembuatan Dashboard V2</p>
                  <div className="w-full bg-white rounded-full h-1.5 mb-1">
                      <div className="bg-emerald-500 h-1.5 rounded-full w-[70%]"></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Deadline: 20 Des</span>
                      <span>Rp 5.000.000</span>
                  </div>
               </div>
               
               {/* Contract Item */}
               <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-600">AD</div>
                          <span className="text-sm font-semibold text-slate-900">Saipul Bahri</span>
                      </div>
                      <button className="text-slate-400"><MoreVertical className="w-4 h-4"/></button>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">Project: Logo Rebranding</p>
                  <div className="w-full bg-white rounded-full h-1.5 mb-1">
                      <div className="bg-emerald-500 h-1.5 rounded-full w-[30%]"></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Deadline: 25 Des</span>
                      <span>Rp 1.500.000</span>
                  </div>
               </div>
            </div>
          </section>

          {/* FITUR BARU: Aktivitas Terbaru (Menambah di area bawah yang kosong) */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-bold text-slate-900 mb-4 text-sm">Aktivitas Terbaru</h2>
            <div className="space-y-4">
              {activities.map((act) => (
                <div key={act.id} className="flex gap-3">
                  <div className="mt-1">
                    {act.type === 'payment' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Clock className="w-4 h-4 text-blue-500" />}
                  </div>
                  <div>
                    <p className="text-xs text-slate-700 font-medium">{act.text}</p>
                    <p className="text-[10px] text-slate-400">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

      </div>

      {/* Modal Posting Pekerjaan Baru (TIDAK BERUBAH) */}
      {showPostJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           {/* ... isi modal Anda tetap sama ... */}
        </div>
      )}
    </DashboardLayout>
  );
}