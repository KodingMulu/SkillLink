'use client';

import { Briefcase, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function NavigationHome() {
     const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
     const [isScrolled, setIsScrolled] = useState(false);

     useEffect(() => {
          const handleScroll = () => {
               if (window.scrollY > 20) {
                    setIsScrolled(true);
               } else {
                    setIsScrolled(false);
               }
          };

          window.addEventListener('scroll', handleScroll);
          return () => window.removeEventListener('scroll', handleScroll);
     }, []);

     return (
          <>
               <nav 
                    className={`fixed z-50 transition-all duration-300 ease-in-out border-slate-200/50
                         ${isScrolled 
                              ? "top-0 left-0 right-0 w-full rounded-none border-b bg-white/90 backdrop-blur-md py-3 shadow-sm" 
                              : "top-6 left-0 right-0 mx-auto w-[95%] max-w-7xl rounded-full border bg-white/70 backdrop-blur-md py-3 shadow-lg shadow-slate-200/20"
                         }
                    `}
               >
                    <div className="max-w-7xl mx-auto px-6">
                         <div className="flex items-center justify-between">
                              <Link href="/" className="flex items-center group">
                                   <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                                        <Briefcase className="w-5 h-5 text-white" />
                                   </div>
                                   <span className="ml-3 text-lg font-bold text-slate-800 tracking-tight">SkillLink</span>
                              </Link>

                              {/* Desktop Menu */}
                              <div className="hidden md:flex items-center space-x-8">
                                   {['Cari Pekerjaan', 'Cari Freelancer', 'Cara Kerja', 'Blog'].map((item) => (
                                        <button 
                                             key={item}
                                             className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                                        >
                                             {item}
                                        </button>
                                   ))}
                              </div>

                              <div className="hidden md:flex items-center space-x-3">
                                   <Link 
                                        href={'/auth/login'}
                                        className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 transition-colors"
                                   >
                                        Masuk
                                   </Link>
                                   <Link 
                                        href={'/auth/register'}
                                        className="bg-slate-900 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-slate-800 transition-all shadow-md shadow-slate-900/20 hover:shadow-lg hover:-translate-y-0.5"
                                   >
                                        Daftar
                                   </Link>
                              </div>

                              {/* Mobile Toggle */}
                              <button
                                   onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                   className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                              >
                                   {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                              </button>
                         </div>
                    </div>

                    {mobileMenuOpen && (
                         <div className="absolute top-full left-0 right-0 mt-2 px-4 md:hidden">
                              <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-4 space-y-2 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
                                   {['Cari Pekerjaan', 'Cari Freelancer', 'Cara Kerja', 'Blog'].map((item) => (
                                        <button key={item} className="block w-full text-left px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-colors">
                                             {item}
                                        </button>
                                   ))}
                                   <div className="h-px bg-slate-100 my-2" />
                                   <Link href="/auth/login" className="block w-full text-center px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                                        Masuk
                                   </Link>
                                   <Link href="/auth/register" className="block w-full text-center px-4 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-lg shadow-blue-600/20">
                                        Daftar Sekarang
                                   </Link>
                              </div>
                         </div>
                    )}
               </nav>
          </>
     )
}