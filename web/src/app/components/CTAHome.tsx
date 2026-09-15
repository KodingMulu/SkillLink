import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTA() {
     return (
          <section className="py-16 px-6 bg-slate-50">
               <div className="max-w-5xl mx-auto bg-slate-900 rounded-3xl p-10 md:p-16 text-center text-white border border-slate-800 shadow-xl relative overflow-hidden space-y-6">
                    
                    <span className="px-3.5 py-1.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-bold inline-flex items-center gap-1.5">
                         <Sparkles className="w-3.5 h-3.5" /> Gabung Sekarang Gratis
                    </span>

                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white max-w-2xl mx-auto">
                         Siap Memulai Proyek Anda Bersama SkillLink?
                    </h2>

                    <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                         Bergabunglah dengan ribuan mahasiswa, profesional, dan perusahaan yang telah berkolaborasi menciptakan inovasi baru secara aman.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                         <Link
                              href="/auth/register"
                              className="inline-flex items-center justify-center px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition shadow-md"
                         >
                              Daftar Sekarang
                              <ArrowRight className="ml-2 w-4 h-4" />
                         </Link>
                         <Link
                              href="/auth/login"
                              className="inline-flex items-center justify-center px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-xl border border-slate-700 transition shadow-sm"
                         >
                              Masuk ke Akun Anda
                         </Link>
                    </div>

               </div>
          </section>
     );
}