'use client';

import { useState } from 'react';
import DashboardLayout from "../../DashboardLayout";
import { Plus, Briefcase, Layout, ExternalLink, Trash2, Edit3, Image as ImageIcon } from 'lucide-react';

export default function PortfolioPage() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "E-Commerce Re-design",
      category: "Web Development",
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=500&q=80",
    }
  ]);

  return (
    <DashboardLayout role="freelancer">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Portofolio Saya</h1>
          <p className="text-slate-500">Pamerkan hasil kerja terbaik Anda untuk menarik klien</p>
        </div>

        <button className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-bold shadow-lg shadow-blue-600/20">
          <Plus size={18} />
          <span>Tambah Proyek Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Placeholder untuk List Proyek nanti */}
        <div className="md:col-span-3 py-12 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400">
          <Layout size={48} className="mb-4 opacity-20" />
          <p className="font-medium">Mulai tambahkan proyek pertama Anda</p>
        </div>
      </div>
    </DashboardLayout>
  );
}