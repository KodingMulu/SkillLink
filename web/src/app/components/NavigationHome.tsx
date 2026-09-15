'use client';

import { Briefcase, Menu, X, LayoutDashboard, User as UserIcon, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import { getApiUrl } from "@/lib/api";

interface User {
     id: string;
     email: string;
     role: string;
     username?: string;
}

export default function NavigationHome() {
     const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
     const [isScrolled, setIsScrolled] = useState(false);
     const [user, setUser] = useState<User | null>(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          const handleScroll = () => {
               setIsScrolled(window.scrollY > 20);
          };

          const checkAuth = async () => {
               try {
                    const url = getApiUrl('/user/me');
                    const response = await axios.get(url, { withCredentials: true });

                    if (response.status === 200 && response.data.user) {
                         setUser(response.data.user);
                    }
               } catch (error) {
                    setUser(null);
               } finally {
                    setLoading(false);
               }
          };

          window.addEventListener('scroll', handleScroll);
          checkAuth();

          return () => window.removeEventListener('scroll', handleScroll);
     }, []);

     const dashboardLink = user?.role === 'ADMIN' ? '/dashboard/admin' : user?.role === 'CLIENT' ? '/dashboard/client' : '/dashboard/freelancer';

     const scrollToSection = (id: string) => {
          setMobileMenuOpen(false);
          const element = document.getElementById(id);
          if (element) {
               element.scrollIntoView({ behavior: 'smooth' });
          }
     };

     return (
          <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
               isScrolled 
                    ? "bg-white/95 backdrop-blur-md border-b border-slate-200 py-3.5 shadow-sm" 
                    : "bg-white/80 backdrop-blur-sm border-b border-slate-200/60 py-4"
          }`}>
               <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between">
                         
                         {/* Brand Logo */}
                         <Link href="/" className="flex items-center gap-2.5 group">
                              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:bg-blue-700 transition-colors">
                                   S
                              </div>
                              <span className="text-xl font-extrabold text-slate-900 tracking-tight">SkillLink</span>
                         </Link>

                         {/* Desktop Nav Links */}
                         <nav className="hidden md:flex items-center gap-8">
                              <button 
                                   onClick={() => scrollToSection('kategori')}
                                   className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                              >
                                   Kategori Talenta
                              </button>
                              <button 
                                   onClick={() => scrollToSection('fitur')}
                                   className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                              >
                                   Keunggulan
                              </button>
                              <button 
                                   onClick={() => scrollToSection('cara-kerja')}
                                   className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                              >
                                   Cara Kerja
                              </button>
                         </nav>

                         {/* Auth CTA */}
                         <div className="hidden md:flex items-center gap-3">
                              {loading ? (
                                   <div className="h-9 w-28 bg-slate-100 rounded-xl animate-pulse" />
                              ) : user ? (
                                   <Link
                                        href={dashboardLink}
                                        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
                                   >
                                        <LayoutDashboard className="w-4 h-4 text-blue-400" />
                                        <span>Dashboard ({user.username || 'User'})</span>
                                   </Link>
                              ) : (
                                   <>
                                        <Link
                                             href="/auth/login"
                                             className="text-xs font-bold text-slate-700 hover:text-blue-600 px-4 py-2 transition-colors"
                                        >
                                             Masuk
                                        </Link>
                                        <Link
                                             href="/auth/register"
                                             className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-sm flex items-center gap-1.5"
                                        >
                                             <span>Daftar Gratis</span>
                                             <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                   </>
                              )}
                         </div>

                         {/* Mobile Hamburger */}
                         <button
                              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                              aria-label="Toggle Menu"
                         >
                              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                         </button>
                    </div>
               </div>

               {/* Mobile Menu Dropdown */}
               {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2">
                         <button
                              onClick={() => scrollToSection('kategori')}
                              className="block w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
                         >
                              Kategori Talenta
                         </button>
                         <button
                              onClick={() => scrollToSection('fitur')}
                              className="block w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
                         >
                              Keunggulan Escrow
                         </button>
                         <button
                              onClick={() => scrollToSection('cara-kerja')}
                              className="block w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
                         >
                              Cara Kerja
                         </button>
                         
                         <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                              {user ? (
                                   <Link
                                        href={dashboardLink}
                                        className="flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-xl text-xs font-bold"
                                   >
                                        <LayoutDashboard className="w-4 h-4 text-blue-400" />
                                        <span>Ke Dashboard</span>
                                   </Link>
                              ) : (
                                   <>
                                        <Link
                                             href="/auth/login"
                                             className="block w-full text-center py-2 text-xs font-bold text-slate-700 bg-slate-50 rounded-xl"
                                        >
                                             Masuk
                                        </Link>
                                        <Link
                                             href="/auth/register"
                                             className="block w-full text-center py-2.5 text-xs font-bold text-white bg-blue-600 rounded-xl"
                                        >
                                             Daftar Gratis
                                        </Link>
                                   </>
                              )}
                         </div>
                    </div>
               )}
          </header>
     );
}