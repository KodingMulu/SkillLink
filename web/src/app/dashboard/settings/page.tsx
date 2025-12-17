'use client';

import { useState } from 'react';
import { 
  User, Lock, Bell, Shield, 
  CreditCard, Globe, Save, Mail,
  Smartphone, Building2, Briefcase,
  Eye, EyeOff, Trash2
} from 'lucide-react';
import DashboardLayout from '../DashboardLayout';

interface SettingsPageProps {
  role: 'admin' | 'freelancer' | 'client';
}

export default function SettingsPage({ role = 'admin' }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);

  // Definisi Tab berdasarkan Role
  const tabs = [
    { id: 'profile', label: 'Profil Umum', icon: User },
    { id: 'security', label: 'Keamanan', icon: Lock },
    { id: 'notifications', label: 'Notifikasi', icon: Bell },
    // Tab Khusus Role
    ...(role === 'client' ? [{ id: 'billing', label: 'Pembayaran & Penagihan', icon: CreditCard }] : []),
    ...(role === 'freelancer' ? [{ id: 'payout', label: 'Rekening Penarikan', icon: Briefcase }] : []),
    ...(role === 'admin' ? [{ id: 'system', label: 'Konfigurasi Sistem', icon: Shield }] : []),
  ];

  return (
    <DashboardLayout role={role}>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pengaturan Akun</h1>
          <p className="text-slate-500 text-sm">Kelola informasi profil, keamanan, dan preferensi aplikasi Anda.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigasi Settings */}
          <aside className="w-full md:w-64 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                  : 'text-slate-600 hover:bg-white border border-transparent hover:border-slate-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </aside>

          {/* Area Konten Settings */}
          <div className="flex-1 space-y-6">
            
            {/* TAB: PROFILE */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900">Informasi Pribadi</h3>
                  <p className="text-xs text-slate-500">Perbarui foto dan detail profil Anda.</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                      <User className="w-8 h-8" />
                    </div>
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50 transition">
                      Ganti Foto
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Nama Lengkap</label>
                      <input type="text" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" placeholder="Contoh: Budi Santoso" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Email</label>
                      <input type="email" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" placeholder="budi@example.com" />
                    </div>
                    {role === 'client' && (
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-xs font-bold text-slate-700">Nama Perusahaan</label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input type="text" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" placeholder="PT Maju Mundur" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                  <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition">
                    <Save className="w-4 h-4" /> Simpan Perubahan
                  </button>
                </div>
              </div>
            )}

            {/* TAB: SECURITY */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900">Kata Sandi</h3>
                  <p className="text-xs text-slate-500">Pastikan akun Anda menggunakan kata sandi yang kuat.</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Kata Sandi Saat Ini</label>
                    <input type="password" title="password" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Kata Sandi Baru</label>
                      <input type="password" title="password" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Konfirmasi Kata Sandi</label>
                      <input type="password" title="password" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" />
                    </div>
                  </div>
                </div>
                <div className="mx-6 p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3 mb-6">
                  <Shield className="w-5 h-5 text-amber-600 shrink-0" />
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Kami merekomendasikan penggunaan kombinasi huruf besar, kecil, angka, dan simbol untuk keamanan maksimal.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                   <button className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold">Update Password</button>
                </div>
              </div>
            )}

            {/* TAB KHUSUS ADMIN: SYSTEM CONFIG */}
            {activeTab === 'system' && role === 'admin' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h3 className="font-bold text-slate-900 mb-4">Maintenance Mode</h3>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-sm font-bold text-slate-700">Aktifkan Mode Pemeliharaan</p>
                      <p className="text-xs text-slate-500">Hanya admin yang bisa mengakses platform saat aktif.</p>
                    </div>
                    <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm"></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h3 className="font-bold text-slate-900 mb-4 text-red-600">Danger Zone</h3>
                  <button className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-xl text-xs font-bold hover:bg-red-50 transition">
                    <Trash2 className="w-4 h-4" /> Hapus Cache Sistem
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}