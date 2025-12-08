import { ShieldCheck, Zap, Trophy, GraduationCap } from "lucide-react";

export default function Features() {
     return (
          <section className="py-24 px-6 bg-slate-50 relative overflow-hidden">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-200/20 blur-[120px] rounded-full pointer-events-none" />
               <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                         <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                              Lebih dari sekadar Marketplace
                         </h2>
                         <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                              SkillLink dirancang khusus untuk menjembatani kebutuhan industri dengan talenta mahasiswa yang siap berkembang.
                         </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                              <div className="absolute top-0 right-0 p-10 bg-blue-50 rounded-bl-[100px] -mr-10 -mt-10 transition-transform group-hover:scale-110">
                                   <ShieldCheck className="w-12 h-12 text-blue-600" />
                              </div>
                              <h3 className="text-2xl font-bold text-slate-900 mb-3">Keamanan Pembayaran Terjamin</h3>
                              <p className="text-slate-600 max-w-md">
                                   Sistem Escrow kami menahan dana hingga pekerjaan selesai disetujui. Aman untuk klien, terjamin untuk freelancer.
                              </p>
                         </div>

                         <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-lg hover:-translate-y-1 transition-transform">
                              <Zap className="w-10 h-10 text-yellow-400 mb-4" />
                              <h3 className="text-xl font-bold mb-2">Fast Hiring</h3>
                              <p className="text-slate-300 text-sm">
                                   Temukan talenta dalam hitungan jam, bukan hari. Algoritma kami mencocokkan skill dengan instan.
                              </p>
                         </div>

                         <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                              <GraduationCap className="w-10 h-10 text-emerald-600 mb-4" />
                              <h3 className="text-xl font-bold text-slate-900 mb-2">Mahasiswa Terverifikasi</h3>
                              <p className="text-slate-600 text-sm">
                                   Setiap freelancer divalidasi status kampusnya. Dapatkan talenta muda dengan semangat belajar tinggi.
                              </p>
                         </div>

                         <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                              <div className="absolute bottom-0 right-0 p-10 bg-emerald-50 rounded-tl-[100px] -mr-10 -mb-10 transition-transform group-hover:scale-110">
                                   <Trophy className="w-12 h-12 text-emerald-600" />
                              </div>
                              <h3 className="text-2xl font-bold text-slate-900 mb-3">Bangun Reputasi Profesional</h3>
                              <p className="text-slate-600 max-w-md">
                                   Setiap proyek yang selesai menjadi bagian dari portofolio digital yang diakui industri. Langkah awal karir gemilang.
                              </p>
                         </div>
                    </div>
               </div>
          </section>
     );
}