import { Building2 } from "lucide-react";

export default function TrustedBy() {
  const partners = ["TechCorp", "UniVeritas", "StudioOne", "DevHouse", "StartUpIndo"];

  return (
    <section className="py-10 border-y border-slate-200 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-sm font-semibold text-slate-500 mb-6 tracking-wide uppercase">
          Dipercaya oleh Universitas & Industri Terdepan
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {partners.map((partner) => (
            <div key={partner} className="flex items-center space-x-2 group cursor-default">
              <Building2 className="w-6 h-6 text-slate-400 group-hover:text-blue-600 transition-colors" />
              <span className="text-xl font-bold text-slate-400 group-hover:text-slate-800 transition-colors">
                {partner}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}