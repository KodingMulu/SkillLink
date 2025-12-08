import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
     return (
          <section className="py-20 px-6">
               <div className="max-w-5xl mx-auto bg-slate-900 rounded-[2.5rem] relative overflow-hidden text-center py-16 px-6 shadow-2xl shadow-slate-900/20">
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                         <div className="absolute top-[-50%] left-[-20%] w-[600px] h-[600px] bg-blue-600/30 blur-[100px] rounded-full" />
                         <div className="absolute bottom-[-50%] right-[-20%] w-[600px] h-[600px] bg-emerald-600/20 blur-[100px] rounded-full" />
                    </div>

                    <div className="relative z-10">
                         <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                              Siap Memulai Proyek Anda?
                         </h2>
                         <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
                              Bergabunglah dengan ribuan mahasiswa dan perusahaan yang telah berkolaborasi menciptakan inovasi baru.
                         </p>

                         <div className="flex flex-col sm:flex-row gap-4 justify-center">
                              <Link
                                   href="/auth/register"
                                   className="inline-flex items-center justify-center px-8 py-4 bg-white text-slate-900 font-bold rounded-full hover:bg-blue-50 transition-all hover:scale-105"
                              >
                                   Daftar Sekarang
                                   <ArrowRight className="ml-2 w-5 h-5" />
                              </Link>
                              <Link
                                   href="/how-it-works"
                                   className="inline-flex items-center justify-center px-8 py-4 border border-slate-700 text-white font-medium rounded-full hover:bg-slate-800 transition-all"
                              >
                                   Pelajari Lebih Lanjut
                              </Link>
                         </div>
                    </div>
               </div>
          </section>
     );
}