'use client';

import { X, CheckCircle2, Star, TrendingUp, Briefcase } from "lucide-react";

interface Project {
  title: string;
  client: string;
  deadline: string;
  progress: number;
  status: string;
}

interface ProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userInitial?: string;
  completedProjects?: number;
  rating?: string;
  activeProjects?: Project[];
}

export default function ProfilePopup({
  isOpen,
  onClose,
  userName = "Nazril",
  userInitial = "N",
  completedProjects = 12,
  rating = "4.9/5.0",
  activeProjects = []
}: ProfilePopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mt-16 mr-4 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-purple-600 to-purple-700 rounded-t-3xl p-6 pb-20">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <X size={24} />
          </button>
          
          <div className="flex items-center space-x-4 mt-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {userInitial}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{userName}</h2>
              <p className="text-purple-200">Frontend Developer</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-6 -mt-12 mb-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Selesai Card */}
            <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="text-purple-600" size={24} />
                </div>
                <div className="flex items-center text-emerald-500 text-sm font-semibold">
                  <TrendingUp size={16} className="mr-1" />
                  +12%
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-800">{completedProjects}</div>
              <div className="text-slate-500 text-sm mt-1">Selesai</div>
            </div>

            {/* Rating Card */}
            <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Star className="text-amber-500" size={24} />
                </div>
                <div className="flex items-center text-emerald-500 text-sm font-semibold">
                  <TrendingUp size={16} className="mr-1" />
                  +12%
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-800">{rating}</div>
              <div className="text-slate-500 text-sm mt-1">Rating</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 mb-4">
          <div className="flex space-x-2 bg-slate-100 rounded-xl p-1">
            <button className="flex-1 py-2 px-4 rounded-lg text-sm font-medium text-blue-600 bg-white shadow-sm">
              Lihat Semua
            </button>
            <button className="flex-1 py-2 px-4 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-800">
              Rekomendasi
            </button>
          </div>
        </div>

        {/* Job Cards */}
        <div className="px-6 pb-6 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            {activeProjects.length > 0 ? (
              activeProjects.map((project, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-slate-800 mb-1">
                        {project.title}
                      </h3>
                      <p className="text-slate-600 text-sm mb-3">
                        {project.client} • Deadline: {project.deadline}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center space-x-2">
                      <Briefcase size={16} className="text-slate-400" />
                      <span className="text-sm text-slate-500">{project.progress}% Complete</span>
                    </div>
                    <span className={`px-4 py-1.5 rounded-lg text-sm font-medium 
                      ${project.status === 'Revisi' ? 'bg-orange-100 text-orange-700' : 
                        project.status === 'Review' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {project.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                Belum ada proyek aktif
              </div>
            )}
          </div>
        </div>

        {/* View All Button */}
        <div className="px-6 pb-6">
          <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors">
            Lihat Semua Proyek
          </button>
        </div>
      </div>
    </div>
  );
}