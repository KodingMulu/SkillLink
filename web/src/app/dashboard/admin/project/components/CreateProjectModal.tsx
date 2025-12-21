'use client';

import { useState } from 'react';
import { X, Briefcase, Calendar, DollarSign, FileText, Tag, Clock, Check, AlertCircle } from 'lucide-react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormData {
  title: string;
  client: string;
  freelancer: string;
  budget: string;
  deadline: string;
  category: string;
  description: string;
  priority: string;
}

interface FormErrors {
  title?: string;
  client?: string;
  budget?: string;
  deadline?: string;
  category?: string;
  description?: string;
}

export default function CreateProjectModal({ isOpen, onClose, onSuccess }: CreateProjectModalProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    client: '',
    freelancer: '',
    budget: '',
    deadline: '',
    category: '',
    description: '',
    priority: 'medium'
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Judul proyek wajib diisi';
    }

    if (!formData.client.trim()) {
      newErrors.client = 'Nama klien wajib diisi';
    }

    if (!formData.budget.trim()) {
      newErrors.budget = 'Anggaran wajib diisi';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Deadline wajib diisi';
    }

    if (!formData.category) {
      newErrors.category = 'Kategori wajib dipilih';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Deskripsi wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Data Proyek:', formData);

      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Reset form dan tutup modal setelah 1.5 detik
      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({
          title: '',
          client: '',
          freelancer: '',
          budget: '',
          deadline: '',
          category: '',
          description: '',
          priority: 'medium'
        });
        setErrors({});
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Submit error:', error);
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Hapus error saat user mulai mengetik
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        title: '',
        client: '',
        freelancer: '',
        budget: '',
        deadline: '',
        category: '',
        description: '',
        priority: 'medium'
      });
      setErrors({});
      setSubmitSuccess(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Buat Proyek Baru</h2>
              <p className="text-sm text-slate-500">Isi detail proyek yang akan dibuat</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {submitSuccess ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Proyek Berhasil Dibuat!
              </h3>
              <p className="text-sm text-slate-500">
                Proyek baru telah ditambahkan ke sistem
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Judul Proyek */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Judul Proyek <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Contoh: Redesain Aplikasi Mobile"
                    disabled={isSubmitting}
                    className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.title 
                        ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                        : 'border-slate-300 focus:ring-blue-500'
                    }`}
                  />
                </div>
                {errors.title && (
                  <div className="flex items-center gap-1 mt-1 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs">{errors.title}</span>
                  </div>
                )}
              </div>

              {/* Client & Freelancer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Klien <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="client"
                    value={formData.client}
                    onChange={handleChange}
                    placeholder="Nama klien atau perusahaan"
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.client 
                        ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                        : 'border-slate-300 focus:ring-blue-500'
                    }`}
                  />
                  {errors.client && (
                    <div className="flex items-center gap-1 mt-1 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-xs">{errors.client}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Freelancer
                  </label>
                  <input
                    type="text"
                    name="freelancer"
                    value={formData.freelancer}
                    onChange={handleChange}
                    placeholder="Nama freelancer"
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Budget & Deadline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Anggaran <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="Rp 15.000.000"
                      disabled={isSubmitting}
                      className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.budget 
                          ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                          : 'border-slate-300 focus:ring-blue-500'
                      }`}
                    />
                  </div>
                  {errors.budget && (
                    <div className="flex items-center gap-1 mt-1 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-xs">{errors.budget}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Deadline <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.deadline 
                          ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                          : 'border-slate-300 focus:ring-blue-500'
                      }`}
                    />
                  </div>
                  {errors.deadline && (
                    <div className="flex items-center gap-1 mt-1 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-xs">{errors.deadline}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Category & Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 appearance-none bg-white transition-all ${
                        errors.category 
                          ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                          : 'border-slate-300 focus:ring-blue-500'
                      }`}
                    >
                      <option value="">Pilih kategori</option>
                      <option value="web">Web Development</option>
                      <option value="mobile">Mobile Development</option>
                      <option value="design">UI/UX Design</option>
                      <option value="marketing">Digital Marketing</option>
                      <option value="content">Content Writing</option>
                      <option value="other">Lainnya</option>
                    </select>
                  </div>
                  {errors.category && (
                    <div className="flex items-center gap-1 mt-1 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-xs">{errors.category}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Prioritas
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Deskripsi Proyek <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Jelaskan detail proyek, requirement, dan ekspektasi hasil..."
                    disabled={isSubmitting}
                    rows={4}
                    className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 resize-none transition-all ${
                      errors.description 
                        ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                        : 'border-slate-300 focus:ring-blue-500'
                    }`}
                  />
                </div>
                {errors.description && (
                  <div className="flex items-center gap-1 mt-1 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs">{errors.description}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        {!submitSuccess && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Briefcase className="w-4 h-4" />
                  Buat Proyek
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}