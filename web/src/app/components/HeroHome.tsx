'use client';

import { Award, Briefcase, DollarSign, Users } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const AnimatedNumber = ({ value }: { value: string }) => {
     const numericValue = parseInt(value.replace(/\D/g, ''));
     const suffix = value.replace(/[0-9]/g, '');

     const [count, setCount] = useState(0);

     useEffect(() => {
          let startTimestamp: number | null = null;
          const duration = 2000;

          const step = (timestamp: number) => {
               if (!startTimestamp) startTimestamp = timestamp;
               const progress = Math.min((timestamp - startTimestamp) / duration, 1);
               const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
               setCount(Math.floor(easeProgress * numericValue));

               if (progress < 1) {
                    window.requestAnimationFrame(step);
               }
          };

          window.requestAnimationFrame(step);
     }, [numericValue]);

     return (
          <span>
               {count}
               {suffix}
          </span>
     );
};

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
          <section className="pt-24 pb-12 px-4 relative overflow-hidden bg-slate-50">
               <div
                    className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-sky-400/20 blur-[120px] pointer-events-none mix-blend-multiply"
                    aria-hidden="true"
               />
               <div
                    className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-400/15 blur-[120px] pointer-events-none mix-blend-multiply"
                    aria-hidden="true"
               />

               <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-10 mt-10 min-h-32 tracking-tight">
                         Temukan{' '}
                         <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-600 bg-clip-text text-transparent">
                              {typedText}
                              <span className="animate-pulse text-sky-600">|</span>
                         </span>
                         <br />
                         untuk Proyekmu
                    </h1>

                    <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                         Kolaborasi dengan industri, kerjakan tugas nyata, dan bangun portofolio profesional yang terverifikasi.
                    </p>

                    <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mt-12 max-w-5xl mx-auto">
                         {stats.map((stat, index) => {
                              const Icon = stat.icon;
                              const iconColors = ["text-sky-600", "text-emerald-600", "text-teal-600", "text-blue-600"];

                              return (
                                   <li
                                        key={stat.label}
                                        className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                                   >
                                        <div className={`w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center bg-slate-100 ${iconColors[index]}`}>
                                             <Icon className="w-6 h-6" />
                                        </div>

                                        {/* Menggunakan Komponen AnimatedNumber di sini */}
                                        <p className="text-3xl font-bold text-slate-900 mb-1 tracking-tight tabular-nums">
                                             <AnimatedNumber value={stat.value} />
                                        </p>

                                        <p className="text-sm font-medium text-slate-500">
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