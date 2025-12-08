'use client';

import Link from "next/link";
import { Briefcase, Instagram, Linkedin, Twitter, Send } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { label: "Cari Freelancer", href: "/browse/freelancers" },
      { label: "Cari Pekerjaan", href: "/browse/jobs" },
      { label: "Verifikasi Kampus", href: "/verify-campus" },
      { label: "Harga & Layanan", href: "/pricing" },
    ],
    perusahaan: [
      { label: "Tentang Kami", href: "/about" },
      { label: "Karir", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Kontak", href: "/contact" },
    ],
    legal: [
      { label: "Kebijakan Privasi", href: "/privacy" },
      { label: "Syarat & Ketentuan", href: "/terms" },
      { label: "Pedoman Komunitas", href: "/guidelines" },
    ]
  };

  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-slate-50 to-transparent pointer-events-none -z-0" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8 mb-16">
          <div className="lg:col-span-2 space-y-6 pr-0 lg:pr-8">
            <Link href="/" className="flex items-center group w-fit">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-slate-900 tracking-tight">SkillLink</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              Platform kolaborasi #1 yang menghubungkan mahasiswa berbakat dengan proyek industri nyata. Bangun portofolio, dapatkan penghasilan, dan rintis karirmu.
            </p>

            <div className="pt-2">
              <p className="text-sm font-semibold text-slate-900 mb-2">Berlangganan Newsletter</p>
              <form className="flex gap-2 max-w-xs">
                <input
                  type="email"
                  placeholder="Email Anda..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
                <button
                  type="button"
                  className="bg-slate-900 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                  aria-label="Subscribe"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1">
            <h3 className="font-bold text-slate-900 mb-6">Platform</h3>
            <ul className="space-y-4">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h3 className="font-bold text-slate-900 mb-6">Perusahaan</h3>
            <ul className="space-y-4">
              {footerLinks.perusahaan.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h3 className="font-bold text-slate-900 mb-6">Legal</h3>
            <ul className="space-y-4">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h3 className="font-bold text-slate-900 mb-6">Ikuti Kami</h3>
            <div className="flex flex-col space-y-4">
              <a href="#" className="flex items-center space-x-3 text-slate-500 hover:text-blue-600 transition-colors group">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </div>
                <span className="text-sm">LinkedIn</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-slate-500 hover:text-pink-600 transition-colors group">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-pink-50 transition-colors">
                  <Instagram className="w-4 h-4" />
                </div>
                <span className="text-sm">Instagram</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-slate-500 hover:text-sky-500 transition-colors group">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-sky-50 transition-colors">
                  <Twitter className="w-4 h-4" />
                </div>
                <span className="text-sm">Twitter</span>
              </a>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 text-center md:text-left">
            © {currentYear} SkillLink Indonesia. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-sm text-slate-400 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              System Operational
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}