import { ShieldCheck, Zap, Trophy, GraduationCap } from "lucide-react";

export default function Features() {
     return (
          <section id="fitur" className="py-20 px-6 bg-slate-50 relative border-b border-slate-200/60">
               <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-12 space-y-3">
                         <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                              Keunggulan Platform
                         </span>
                         <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                              Lebih dari sekadar Marketplace Freelance
                         </h2>
                         <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
                              SkillLink dirancang khusus untuk menjembatani kebutuhan industri dengan talenta terverifikasi yang siap memberikan hasil terbaik.
                         </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div className="md:col-span-2 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:border-slate-300 transition-all relative overflow-hidden group">
                              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-6 font-bold">
                                   <ShieldCheck className="w-6 h-6" />
                              </div>
                              <h3 className="text-xl font-bold text-slate-900 mb-2">Keamanan Pembayaran Escrow (Rekber)</h3>
                              <p className="text-slate-600 text-sm max-w-md leading-relaxed">
                                   Sistem Escrow kami menahan dana secara aman di rekening bersama hingga milestone proyek selesai dan disetujui. Aman bagi klien, terjamin bagi freelancer.
                              </p>
                         </div>

                         <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-md hover:bg-slate-800 transition-all flex flex-col justify-between">
                              <div>
                                   <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 font-bold">
                                        <Zap className="w-6 h-6" />
                                   </div>
                                   <h3 className="text-xl font-bold mb-2">Rekrutmen Instan</h3>
                                   <p className="text-slate-300 text-sm leading-relaxed">
                                        Temukan talenta dengan keahlian yang sesuai dalam hitungan jam tanpa proses berbelit-belit.
                                   </p>
                              </div>
                         </div>

                         <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
                              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-6 font-bold">
                                   <GraduationCap className="w-6 h-6" />
                              </div>
                              <h3 className="text-xl font-bold text-slate-900 mb-2">Talenta Terverifikasi</h3>
                              <p className="text-slate-600 text-sm leading-relaxed">
                                   Setiap pengguna divalidasi identitas dan keterampilannya. Dapatkan talenta muda berkualitas dengan etos kerja tinggi.
                              </p>
                         </div>

                         <div className="md:col-span-2 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
                              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-6 font-bold">
                                   <Trophy className="w-6 h-6" />
                              </div>
                              <h3 className="text-xl font-bold text-slate-900 mb-2">Portofolio & Reputasi Digital</h3>
                              <p className="text-slate-600 text-sm max-w-md leading-relaxed">
                                   Setiap proyek yang selesai secara otomatis menjadi bagian dari portofolio terverifikasi yang diakui industri untuk membangun karir jangka panjang.
                              </p>
                         </div>
                    </div>
               </div>
          </section>
     );
}