import { Search, MessageSquare, CheckCircle } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Cari & Pilih",
      desc: "Jelajahi ribuan talenta atau posting proyek Anda secara gratis.",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: MessageSquare,
      title: "Diskusi & Deal",
      desc: "Diskusikan detail pekerjaan, negosiasi harga, dan mulai kontrak.",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: CheckCircle,
      title: "Selesai & Bayar",
      desc: "Terima hasil kerja, berikan review, dan pembayaran diteruskan.",
      color: "bg-emerald-100 text-emerald-600"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900">Cara Kerja SkillLink</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-100 -z-0" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                <div className={`w-24 h-24 rounded-full ${step.color} flex items-center justify-center mb-6 border-4 border-white shadow-xl`}>
                  <Icon className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 px-4">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}