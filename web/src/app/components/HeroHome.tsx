'use client';
import { Award, Briefcase, DollarSign, Users } from "lucide-react";
import { useState, useEffect } from "react";

export default function HeroHome() {
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
          { icon: Briefcase, value: "500+", label: "Proyek nyata dari industri" },
          { icon: Users, value: "2000+", label: "Mahasiswa Aktif" },
          { icon: Award, value: "200+", label: "Mentor Industri" },
          { icon: DollarSign, value: "95%", label: "Portofolio terverifikasi" }
     ];

     return (
          <section className="pt-24 pb-12 px-4 relative bg-gradient-to-b from-white via-[#F4F7FF] to-[#E8EEFF]">
               {/* Subtle Glow Effect */}
               <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-blue-100/40 blur-3xl opacity-70 pointer-events-none" />

               <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-10 mt-10 min-h-32">
                         Temukan{' '}
                         <span className="bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
                              {typedText}
                              <span className="animate-pulse">|</span>
                         </span>
                         <br />
                         untuk Proyekmu
                    </h1>
                    
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                         Kolaborasi dengan industri, kerjakan tugas nyata, dan bangun portofolio profesional.
                    </p>

                    {/* Stats */}
                    <ul className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-5xl mx-auto">
                         {stats.map((stat) => {
                              const Icon = stat.icon;
                              return (
                                   <li 
                                        key={stat.label} 
                                        className="bg-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-300"
                                   >
                                        <Icon className="w-6 h-6 text-green-500 mb-2 mx-auto" />
                                        <p className="text-3xl font-bold text-gray-900 mb-1">
                                             {stat.value}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                             {stat.label}
                                        </p>
                                   </li>
                              );
                         })}
                    </ul>
               </div>
          </section>
     );
}