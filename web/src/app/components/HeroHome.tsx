'use client';
import { Award, Briefcase, DollarSign, Filter, Search, Users } from "lucide-react";
import { useState, useEffect } from "react";

export default function HeroHome() {
     const [searchQuery, setSearchQuery] = useState('');
     const [typedText, setTypedText] = useState('');
     const [isDeleting, setIsDeleting] = useState(false);
     const [wordIndex, setWordIndex] = useState(0);
     
     const words = ['Freelancer Terbaik', 'Talenta Profesional', 'Expert Terpercaya'];
     const typingSpeed = 150;
     const deletingSpeed = 100;
     const pauseTime = 2000;

     useEffect(() => {
          const currentWord = words[wordIndex];
          
          const timer = setTimeout(() => {
               if (!isDeleting) {
                    if (typedText.length < currentWord.length) {
                         setTypedText(currentWord.slice(0, typedText.length + 1));
                    } else {
                         setTimeout(() => setIsDeleting(true), pauseTime);
                    }
               } else {
                    if (typedText.length > 0) {
                         setTypedText(currentWord.slice(0, typedText.length - 1));
                    } else {
                         setIsDeleting(false);
                         setWordIndex((prev) => (prev + 1) % words.length);
                    }
               }
          }, isDeleting ? deletingSpeed : typingSpeed);

          return () => clearTimeout(timer);
     }, [typedText, isDeleting, wordIndex]);

     const stats = [
          { icon: <Briefcase className="w-6 h-6" />, value: "10,000+", label: "Proyek Selesai" },
          { icon: <Users className="w-6 h-6" />, value: "5,000+", label: "Freelancer Aktif" },
          { icon: <Award className="w-6 h-6" />, value: "98%", label: "Success Rate" },
          { icon: <DollarSign className="w-6 h-6" />, value: "Rp 50M+", label: "Total Pembayaran" }
     ];

     return (
          <>
               <section className="pt-24 pb-12 px-4 relative">
                    {/* ===== TAMBAHAN BACKGROUND IMAGE - MULAI ===== */}
                    <div 
                         className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                         style={{
                              backgroundImage: "url('/images/bg.webp')", // 👈 GANTI NAMA FILE GAMBAR DI SINI
                         }}
                    >
                         {/* Overlay ringan (opsional) - uncomment jika ingin sedikit gelap */}
                         <div className="absolute inset-0 bg-gradient-to-br from-green-50/80 via-blue-50/80 to-purple-50/80"></div>
                    </div>
                    {/* ===== TAMBAHAN BACKGROUND IMAGE - SELESAI ===== */}

                    <div className="max-w-7xl mx-auto text-center relative z-10">
                         <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-10 mt-10 min-h-32">
                              Temukan <span className="bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
                                   {typedText}
                                   <span className="animate-pulse">|</span>
                              </span>
                              <br />untuk Proyekmu
                         </h1>
                         <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                              Platform terpercaya yang menghubungkan klien dengan freelancer profesional di Indonesia
                         </p>

                         {/* Search Bar */}
                         <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-3 flex flex-col md:flex-row gap-3">
                              <div className="flex-1 relative">
                                   <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700" />
                                   <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Cari pekerjaan atau freelancer..."
                                        className="text-gray-700 w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                   />
                              </div>
                              <button className="flex text-gray-600 items-center justify-center gap-2 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                                   <Filter className="w-5 h-5" />
                                   Filter
                              </button>
                              <button className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 transition">
                                   Cari
                              </button>
                         </div>

                         {/* Stats */}
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-5xl mx-auto">
                              {stats.map((stat, idx) => (
                                   <div key={idx} className="bg-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
                                        <div className="text-green-500 mb-2 flex justify-center">{stat.icon}</div>
                                        <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                        <div className="text-sm text-gray-600">{stat.label}</div>
                                   </div>
                              ))}
                         </div>
                    </div>
               </section>
          </>
     )
}