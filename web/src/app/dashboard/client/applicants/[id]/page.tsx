'use client';

import { use } from 'react'; // Impor use untuk menangani params di Client Component
import DashboardLayout from "../../../DashboardLayout";
import { 
  ArrowLeft, MapPin, Star, ShieldCheck, 
  FileText, CheckCircle2, MessageSquare, 
  Award, Briefcase, Globe
} from "lucide-react";
import Link from "next/link";

// Tambahkan tipe params jika menggunakan TypeScript, atau biarkan jika JS
export default function ApplicantDetail({ params }: { params: Promise<{ id: string }> }) {
  // Unwraps params menggunakan React.use() sesuai standar Next.js terbaru
  const resolvedParams = use(params);
  const applicantId = resolvedParams.id;

  // Data dummy tetap sama
  const applicant = {
    name: "Sapta Wahyu Tirta",
    role: "Senior UI/UX Designer",
    location: "Yogyakarta, Indonesia",
    rating: 4.9,
    reviews: 124,
    hourlyRate: "Rp 150.000",
    successRate: 98,
    bio: "Saya adalah desainer produk dengan pengalaman lebih dari 5 tahun fokus pada aplikasi mobile dan dashboard enterprise. Ahli dalam Figma, Adobe XD, dan riset pengguna.",
    skills: ["UI Design", "UX Research", "Figma", "Prototyping", "Design System", "React basics"],
    experience: [
      { company: "Tech Solutions", role: "Product Designer", period: "2021 - Present" },
      { company: "Creative Agency", role: "UI Designer", period: "2019 - 2021" }
    ],
    portfolio: [
      { title: "E-commerce Mobile App", category: "Mobile Design" },
      { title: "SaaS Dashboard for HR", category: "Web Application" }
    ]
  };

  return (
    <DashboardLayout role="client">
      {/* Tombol Kembali - Diperbaiki link-nya ke dashboard client */}
      <Link href="/dashboard/client" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-6 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Kembali ke Dashboard</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* KOLOM KIRI */}
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-sm">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-600 border-4 border-white shadow-lg">
                {applicant.name.charAt(0)}
              </div>
              <div className="absolute bottom-2 right-2 bg-emerald-500 p-1.5 rounded-full border-4 border-white">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-slate-900">{applicant.name}</h1>
            <p className="text-blue-600 font-medium mb-4">{applicant.role}</p>
            
            <div className="flex items-center justify-center gap-2 text-slate-500 text-sm mb-6">
              <MapPin className="w-4 h-4" />
              {applicant.location}
            </div>

            <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-100 mb-6">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Rating</p>
                <div className="flex items-center justify-center gap-1 text-slate-900 font-bold text-sm">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  {applicant.rating} ({applicant.reviews})
                </div>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Job Success</p>
                <p className="text-sm font-bold text-emerald-600">{applicant.successRate}%</p>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20">
                Rekrut Sekarang
              </button>
              <button className="w-full bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Kirim Pesan
              </button>
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" /> Keahlian
            </h3>
            <div className="flex flex-wrap gap-2">
              {applicant.skills.map((skill) => (
                <span key={skill} className="bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-100">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* KOLOM KANAN */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Tentang (ID: {applicantId})</h2>
            <p className="text-slate-600 leading-relaxed">{applicant.bio}</p>
          </section>

          <section className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" /> Portofolio Terbaru
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              {applicant.portfolio.map((item, idx) => (
                <div key={idx} className="group cursor-pointer">
                  <div className="aspect-video bg-slate-100 rounded-2xl mb-3 overflow-hidden border border-slate-200 relative flex items-center justify-center">
                    <FileText className="w-8 h-8 text-slate-300 group-hover:scale-110 transition-transform" />
                  </div>
                  <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.title}</h4>
                  <p className="text-xs text-slate-500">{item.category}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
               <Globe className="w-5 h-5 text-blue-600" /> Pengalaman Kerja
            </h2>
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
              {applicant.experience.map((exp, idx) => (
                <div key={idx} className="relative pl-12">
                  <div className="absolute left-0 mt-1 w-10 h-10 rounded-full bg-blue-50 border-4 border-white flex items-center justify-center text-blue-600 z-10 shadow-sm">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{exp.role}</h4>
                    <p className="text-sm text-blue-600 font-medium mb-1">{exp.company}</p>
                    <p className="text-xs text-slate-400">{exp.period}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}