'use client';

import { useState } from "react";
import { Search, MessageSquare, CheckCircle, FilePlus, UserCheck, Wallet, Award } from "lucide-react";

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState<'client' | 'freelancer'>('client');

  const clientSteps = [
    {
      step: "01",
      icon: FilePlus,
      title: "Posting Proyek / Pekerjaan",
      desc: "Jelaskan kebutuhan proyek, anggaran, dan tenggat waktu secara gratis.",
      color: "bg-blue-50 text-blue-600 border-blue-100"
    },
    {
      step: "02",
      icon: MessageSquare,
      title: "Pilih Talenta & Sepakati Milestone",
      desc: "Review lamaran, portfolio, dan wawancarai kandidat yang sesuai.",
      color: "bg-purple-50 text-purple-600 border-purple-100"
    },
    {
      step: "03",
      icon: CheckCircle,
      title: "Setujui Hasil & Bayar Aman",
      desc: "Dana Escrow hanya diteruskan setelah Anda menyetujui hasil pekerjaan.",
      color: "bg-emerald-50 text-emerald-600 border-emerald-100"
    }
  ];

  const freelancerSteps = [
    {
      step: "01",
      icon: UserCheck,
      title: "Lengkapi Profil & Skill",
      desc: "Tampilkan keahlian, riwayat pendidikan, dan portofolio terbaik Anda.",
      color: "bg-emerald-50 text-emerald-600 border-emerald-100"
    },
    {
      step: "02",
      icon: Search,
      title: "Cari & Ajukan Penawaran",
      desc: "Pilih proyek dari Klien terpercaya yang sesuai dengan keahlian Anda.",
      color: "bg-blue-50 text-blue-600 border-blue-100"
    },
    {
      step: "03",
      icon: Wallet,
      title: "Kerjakan & Dapatkan Pembayaran",
      desc: "Selesaikan milestone, dapatkan honor terjamin & ulasan positif.",
      color: "bg-amber-50 text-amber-600 border-amber-100"
    }
  ];

  const currentSteps = activeTab === 'client' ? clientSteps : freelancerSteps;

  return (
    <section id="cara-kerja" className="py-20 bg-white border-b border-slate-200/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Panduan Mudah
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Bagaimana Cara Kerja SkillLink?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Proses yang transparan, cepat, dan terverifikasi untuk Klien maupun Freelancer.
          </p>

          {/* Toggle Tab */}
          <div className="pt-2 flex justify-center">
            <div className="inline-flex p-1 bg-slate-100 border border-slate-200 rounded-xl">
              <button
                onClick={() => setActiveTab('client')}
                className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'client'
                    ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Untuk Klien / Perusahaan
              </button>
              <button
                onClick={() => setActiveTab('freelancer')}
                className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'freelancer'
                    ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Untuk Freelancer / Talenta
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {currentSteps.map((stepItem, idx) => {
            const Icon = stepItem.icon;
            return (
              <div 
                key={idx} 
                className="bg-slate-50/70 border border-slate-200 rounded-2xl p-6 relative flex flex-col justify-between hover:bg-white hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl border ${stepItem.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-black text-slate-300">
                      {stepItem.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{stepItem.title}</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{stepItem.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}