import { useState } from 'react';
import { X, UserPlus, Mail, Lock, User, AlertCircle, Check } from 'lucide-react';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type UserRole = 'freelancer' | 'client' | 'admin';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  phone: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
}

interface RoleOption {
  value: UserRole;
  label: string;
  icon: string;
  description: string;
}

export default function AddUserModal({ isOpen, onClose, onSuccess }: AddUserModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'freelancer',
    phone: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const roleOptions: RoleOption[] = [
    { 
      value: 'freelancer', 
      label: 'Freelancer', 
      icon: '👨‍💻', 
      description: 'Pekerja lepas yang menerima proyek' 
    },
    { 
      value: 'client', 
      label: 'Client', 
      icon: '🏢', 
      description: 'Pemberi kerja yang memposting proyek' 
    },
    { 
      value: 'admin', 
      label: 'Admin', 
      icon: '⚙️', 
      description: 'Administrator platform' 
    }
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama wajib diisi';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Nama minimal 3 karakter';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password wajib diisi';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }

    if (formData.phone && !/^[0-9+\-\s()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Format nomor telepon tidak valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('User data submitted:', formData);

      setIsSubmitting(false);
      setSubmitSuccess(true);

      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'freelancer',
          phone: ''
        });
        setErrors({});
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Submit error:', error);
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'freelancer',
        phone: ''
      });
      setErrors({});
      setSubmitSuccess(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          handleClose();
        }
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white z-10 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Tambah User Baru</h2>
              <p className="text-sm text-slate-500">Lengkapi form untuk menambahkan user</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitSuccess ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                User Berhasil Ditambahkan!
              </h3>
              <p className="text-sm text-slate-500">
                User baru telah ditambahkan ke sistem
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                      errors.name 
                        ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                        : 'border-slate-300 focus:ring-blue-500 bg-white'
                    }`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.name && (
                  <div className="flex items-center gap-1 mt-1 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs">{errors.name}</span>
                  </div>
                )}
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="nama@email.com"
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                      errors.email 
                        ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                        : 'border-slate-300 focus:ring-blue-500 bg-white'
                    }`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center gap-1 mt-1 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs">{errors.email}</span>
                  </div>
                )}
              </div>

              {/* Phone Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Nomor Telepon (Opsional)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                    📱
                  </span>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+62 812-3456-7890"
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                      errors.phone 
                        ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                        : 'border-slate-300 focus:ring-blue-500 bg-white'
                    }`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.phone && (
                  <div className="flex items-center gap-1 mt-1 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs">{errors.phone}</span>
                  </div>
                )}
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  Role <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {roleOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleInputChange('role', option.value)}
                      disabled={isSubmitting}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        formData.role === option.value
                          ? 'border-blue-500 bg-blue-50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{option.icon}</span>
                        {formData.role === option.value && (
                          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <h4 className="font-semibold text-slate-900 text-sm mb-1">
                        {option.label}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {option.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Password Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Min. 6 karakter"
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                        errors.password 
                          ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                          : 'border-slate-300 focus:ring-blue-500 bg-white'
                      }`}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.password && (
                    <div className="flex items-center gap-1 mt-1 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-xs">{errors.password}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Konfirmasi Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Ulangi password"
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                        errors.confirmPassword 
                          ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                          : 'border-slate-300 focus:ring-blue-500 bg-white'
                      }`}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <div className="flex items-center gap-1 mt-1 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-xs">{errors.confirmPassword}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <div className="text-blue-600 mt-0.5 text-lg">ℹ️</div>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">
                      Informasi Tambahan
                    </h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Email akan digunakan untuk login ke sistem</li>
                      <li>• User akan menerima email verifikasi otomatis</li>
                      <li>• Password harus minimal 6 karakter</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!submitSuccess && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50 sticky bottom-0 rounded-b-2xl">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Tambah User
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}