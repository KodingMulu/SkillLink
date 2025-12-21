'use client';

import React, { useEffect } from 'react';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

interface ModerationPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModerationPolicyModal = ({ isOpen, onClose }: ModerationPolicyModalProps) => {
  // Menangani penutupan dengan tombol ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop dengan Blur (sesuai tema DashboardLayout) */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Kontainer Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header - Aksen Merah sesuai tombol Kebijakan Moderasi */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-red-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Kebijakan Moderasi</h2>
              <p className="text-sm text-slate-500 font-medium">Panduan penanganan laporan platform</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200 shadow-sm group"
          >
            <X className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
          </button>
        </div>

        {/* Konten (Scrollable) */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-160px)] space-y-6">
          
          {/* Section 1: Prioritas */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              Kriteria Prioritas Laporan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl border border-red-100 bg-red-50/30">
                <span className="text-[10px] font-bold text-red-600 uppercase">High Priority</span>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">Kasus penipuan (Scam), transaksi ilegal, atau pelecehan serius.</p>
              </div>
              <div className="p-4 rounded-xl border border-orange-100 bg-orange-50/30">
                <span className="text-[10px] font-bold text-orange-600 uppercase">Medium Priority</span>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">Konten tidak pantas atau pelanggaran ringan ketentuan proyek.</p>
              </div>
            </div>
          </section>

          {/* Section 2: Tahapan Tindakan */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Prosedur Resolusi
            </h3>
            <div className="space-y-3">
              {[
                { title: 'Tinjauan Konten', desc: 'Admin wajib memeriksa bukti yang dilampirkan pelapor dalam waktu < 4 jam.' },
                { title: 'Komunikasi Dua Arah', desc: 'Hubungi pihak terlapor melalui sistem internal jika bukti belum kuat.' },
                { title: 'Eksekusi Keputusan', desc: 'Tindakan dapat berupa peringatan, penangguhan akun, atau penghapusan proyek.' },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Footer Info */}
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
            <Info className="w-5 h-5 text-blue-600 shrink-0" />
            <p className="text-[11px] text-blue-700 leading-relaxed">
              Moderator diharapkan menjaga netralitas. Setiap tindakan yang diambil akan dicatat dalam log sistem untuk audit keamanan dan transparansi.
            </p>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95"
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModerationPolicyModal;