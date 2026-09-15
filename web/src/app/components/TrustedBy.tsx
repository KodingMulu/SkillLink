'use client';

import { useState, useEffect } from "react";
import { Code2, Palette, Megaphone, PenTool, Video, Database, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { getApiUrl } from "@/lib/api";

export default function TalentCategories() {
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchCategoryStats = async () => {
      try {
        const res = await axios.get(getApiUrl('/public/stats'));
        if (res.data?.data?.categories) {
          setCategoryCounts(res.data.data.categories);
        }
      } catch (err) {
        console.error("Failed to load category stats", err);
      }
    };
    fetchCategoryStats();
  }, []);

  const categories = [
    {
      key: "SOFTWARE",
      title: "Pengembangan Software & Web",
      icon: Code2,
      skills: ["React / Next.js", "Node.js & Express", "Laravel & PHP", "Mobile App Development"],
      color: "text-blue-600 bg-blue-50 border-blue-100"
    },
    {
      key: "DESIGN",
      title: "Desain Grafis & UI/UX",
      icon: Palette,
      skills: ["Figma UI/UX", "Brand Identity", "Illustrator", "3D Modeling"],
      color: "text-purple-600 bg-purple-50 border-purple-100"
    },
    {
      key: "MARKETING",
      title: "Digital Marketing & SEO",
      icon: Megaphone,
      skills: ["Meta & Google Ads", "SEO Content", "Social Media Management", "Analytics"],
      color: "text-emerald-600 bg-emerald-50 border-emerald-100"
    },
    {
      key: "WRITING",
      title: "Penulisan & Konten",
      icon: PenTool,
      skills: ["Copywriting", "Artikel SEO", "Penerjemahan", "Jurnalistik"],
      color: "text-amber-600 bg-amber-50 border-amber-100"
    },
    {
      key: "VIDEO",
      title: "Video Editing & Animasi",
      icon: Video,
      skills: ["Premiere Pro", "After Effects", "Reels & TikTok Editing", "Motion Graphics"],
      color: "text-rose-600 bg-rose-50 border-rose-100"
    },
    {
      key: "DATA",
      title: "Data Science & AI",
      icon: Database,
      skills: ["Python Data Analysis", "Machine Learning", "Excel & SQL", "Power BI"],
      color: "text-indigo-600 bg-indigo-50 border-indigo-100"
    }
  ];

  return (
    <section id="kategori" className="py-20 bg-white border-b border-slate-200/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Kategori Talenta Terbaik
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Jelajahi Berbagai Keahlian Profesional
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Temukan spesialis untuk proyek Anda atau temukan peluang karir yang sesuai dengan passion Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div 
                key={idx}
                className="bg-slate-50/70 border border-slate-200 rounded-2xl p-6 hover:bg-white hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl border ${cat.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200">
                      {categoryCounts[cat.key] ?? 0} Proyek
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-3 group-hover:text-blue-600 transition-colors">
                    {cat.title}
                  </h3>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {cat.skills.map((skill, sIdx) => (
                      <span 
                        key={sIdx}
                        className="text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 px-2.5 py-0.5 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 pt-3 border-t border-slate-200/60"
                >
                  <span>Lihat Talenta & Pekerjaan</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}