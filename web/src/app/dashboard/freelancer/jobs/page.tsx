'use client';

import { useState } from 'react';
import DashboardLayout from "../../DashboardLayout";
import { Search, MapPin, DollarSign, Briefcase, Clock, Filter, ChevronRight, Star } from 'lucide-react';

export default function FindJobsPage() {
  return (
    <DashboardLayout role="freelancer">
      {/* HEADER & SEARCH SECTION */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 font-black">Cari Pekerjaan</h1>
        <p className="text-slate-500 mb-6">Temukan proyek yang sesuai dengan keahlian Anda</p>
        
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Cari desain UI, pengembang React, dsb..." 
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50 transition font-bold shadow-sm">
            <Filter size={18} />
            <span>Filter</span>
          </button>
          <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition font-bold shadow-lg shadow-blue-600/20">
            Cari
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* List proyek akan muncul di sini pada Tahap 2 */}
          <div className="p-12 border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center text-slate-400">
            <Briefcase size={48} className="mb-4 opacity-20" />
            <p className="font-medium">Memuat daftar pekerjaan terbaru...</p>
          </div>
        </div>
        
        <div className="hidden lg:block space-y-6">
           {/* Sidebar info akan muncul di sini */}
           <div className="bg-blue-600 rounded-[32px] p-6 text-white shadow-xl shadow-blue-600/20">
             <h3 className="font-bold text-lg mb-2">Tips Pro!</h3>
             <p className="text-blue-100 text-sm leading-relaxed">Lengkapi profil Anda hingga 100% untuk meningkatkan peluang diterima oleh klien sebesar 40%.</p>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}