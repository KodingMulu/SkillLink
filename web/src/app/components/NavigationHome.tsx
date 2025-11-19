'use client';
import { Briefcase, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function NavigationHome() {
     const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

     return (
          <>
               <nav className="fixed top-0 w-full shadow-sm z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                         <div className="flex items-center justify-between h-16">
                              <div className="flex items-center">
                                   <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                                        <Briefcase className="w-6 h-6 text-white" />
                                   </div>
                                   <span className="ml-2 text-xl font-bold text-gray-800">SkillLink</span>
                              </div>

                              <div className="hidden md:flex items-center space-x-6">
                                   <button className="text-gray-700 hover:text-green-600 transition font-medium">Cari Pekerjaan</button>
                                   <button className="text-gray-700 hover:text-green-600 transition font-medium">Cari Freelancer</button>
                                   <button className="text-gray-700 hover:text-green-600 transition font-medium">Cara Kerja</button>
                                   <button className="text-gray-700 hover:text-green-600 transition font-medium">Blog</button>
                              </div>

                              <div className="hidden md:flex items-center space-x-4">
                                   <button className="text-gray-700 hover:text-green-600 transition font-medium">
                                        <Link href={'/auth/login'}>
                                             Masuk
                                        </Link>
                                   </button>
                                   <button className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-blue-700 transition font-medium">
                                        <Link href={'/auth/register'}>
                                             Daftar
                                        </Link>
                                   </button>
                              </div>

                              <button
                                   onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                   className="md:hidden p-2"
                              >
                                   {mobileMenuOpen ? <X className="w-6 h-6 text-black" /> : <Menu className="w-6 h-6 text-black" />}
                              </button>
                         </div>
                    </div>

                    {mobileMenuOpen && (
                         <div className="md:hidden border-t">
                              <div className="px-4 py-4 space-y-3">
                                   <button className="block w-full text-left py-2 text-gray-700">Cari Pekerjaan</button>
                                   <button className="block w-full text-left py-2 text-gray-700">Cari Freelancer</button>
                                   <button className="block w-full text-left py-2 text-gray-700">Cara Kerja</button>
                                   <button className="block w-full text-left py-2 text-gray-700">Blog</button>
                                   <button className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-2 rounded-lg mt-2">
                                        Masuk
                                   </button>
                                   <button className="w-full border-2 border-green-500 text-green-600 py-2 rounded-lg">
                                        Daftar
                                   </button>
                              </div>
                         </div>
                    )}
               </nav>
          </>
     )
}