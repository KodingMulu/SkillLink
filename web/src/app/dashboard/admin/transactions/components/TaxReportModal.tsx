'use client';

import { useState, useEffect } from 'react';
import { X, FileText, Calendar, Download, Check, AlertCircle } from 'lucide-react';

interface TaxReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function TaxReportModal({ isOpen, onClose, onSuccess }: TaxReportModalProps) {
  const [formData, setFormData] = useState({
    periodType: 'monthly',
    month: '',
    quarter: 'Q1',
    year: new Date().getFullYear().toString(),
    startDate: '',
    endDate: '',
    reportFormat: 'pdf',
    includeDetails: true
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generateSuccess, setGenerateSuccess] = useState(false);

  // Mencegah scroll pada body saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Validasi sederhana
  const isFormValid = () => {
    if (formData.periodType === 'monthly') return formData.month !== '';
    if (formData.periodType === 'custom') return formData.startDate !== '' && formData.endDate !== '';
    return true;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsGenerating(false);
      setGenerateSuccess(true);

      setTimeout(() => {
        setGenerateSuccess(false);
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);
    } catch (error) {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isGenerating && onClose()} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Laporan Pajak</h2>
              <p className="text-sm text-slate-500">Periode pelaporan arus kas</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto">
          {generateSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
                <Check className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Laporan Siap!</h3>
              <p className="text-slate-500">File Anda sedang diproses untuk diunduh.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Alert Info */}
              <div className="flex gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  Pastikan data transaksi bulan berjalan sudah diverifikasi sebelum melakukan generate laporan untuk keperluan pajak resmi.
                </p>
              </div>

              {/* Period Type Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['monthly', 'quarterly', 'yearly', 'custom'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFormData(prev => ({ ...prev, periodType: type as any }))}
                    className={`p-3 rounded-xl border-2 transition-all text-sm font-semibold capitalize ${
                      formData.periodType === type ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 hover:border-slate-200 text-slate-500'
                    }`}
                  >
                    {type === 'monthly' ? 'Bulanan' : type === 'quarterly' ? 'Kuartal' : type === 'yearly' ? 'Tahunan' : 'Custom'}
                  </button>
                ))}
              </div>

              {/* Conditional Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.periodType === 'monthly' && (
                  <select 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.month}
                    onChange={(e) => setFormData({...formData, month: e.target.value})}
                  >
                    <option value="">Pilih Bulan</option>
                    <option value="01">Januari</option>
                    {/* ... tambahkan bulan lainnya */}
                  </select>
                )}
                
                {formData.periodType !== 'custom' && (
                  <select 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                  >
                    {[2023, 2024, 2025].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                )}

                {formData.periodType === 'custom' && (
                   <>
                    <input type="date" className="w-full px-4 py-2.5 rounded-xl border border-slate-200" />
                    <input type="date" className="w-full px-4 py-2.5 rounded-xl border border-slate-200" />
                   </>
                )}
              </div>

              {/* Format Selection */}
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-3">Format Output</label>
                <div className="flex gap-4">
                  {['pdf', 'excel'].map(format => (
                    <label key={format} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="format" 
                        checked={formData.reportFormat === format}
                        onChange={() => setFormData({...formData, reportFormat: format as any})}
                        className="w-4 h-4 text-blue-600" 
                      />
                      <span className="text-sm font-medium uppercase text-slate-600 group-hover:text-blue-600">{format}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!generateSuccess && (
          <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
            <button onClick={onClose} className="px-5 py-2 text-sm font-bold text-slate-600 hover:text-slate-800">Batal</button>
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !isFormValid()}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 disabled:shadow-none transition-all flex items-center gap-2"
            >
              {isGenerating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download className="w-4 h-4" />}
              Generate Laporan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}