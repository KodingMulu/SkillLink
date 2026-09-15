'use client';

import { useState } from 'react';
import DashboardLayout from "../../DashboardLayout";
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Briefcase, 
  Globe, 
  Lock,
  Mail,
  Phone,
  MapPin,
  Building2,
  Camera,
  Save,
  Eye,
  EyeOff
} from "lucide-react";

export default function ClientSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: 'Nazril Afandi',
    email: 'nazril@example.com',
    phone: '+62 812-3456-7890',
    companyName: 'PT Digital Innovation',
    companyAddress: 'Bandar Lampung, Indonesia',
    website: 'https://company.com',
    avatar: ''
  });

  const [notifications, setNotifications] = useState({
    emailNewMatch: true,
    emailProjectUpdate: true,
    emailPayment: false,
    pushNewMatch: true,
    pushMessages: true,
    pushDeadlines: true
  });

  const tabs = [
    { id: 'profile', label: 'Profil Perusahaan', icon: User },
    { id: 'notifications', label: 'Notifikasi', icon: Bell },
    { id: 'security', label: 'Keamanan Akun', icon: Shield },
    { id: 'payment', label: 'Pembayaran', icon: CreditCard },
    { id: 'preferences', label: 'Preferensi Proyek', icon: Briefcase },
  ];

  const handleSave = () => {
    alert('Pengaturan akun berhasil disimpan!');
  };

  return (
    <DashboardLayout role="client">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Pengaturan Klien</h1>
        <p className="text-slate-500 text-sm">Kelola informasi perusahaan, keamanan, dan notifikasi akun Anda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-2 sticky top-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-xs font-bold ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="p-6 sm:p-8">
                <h2 className="text-lg font-bold text-slate-900 mb-6">Informasi Profil Perusahaan</h2>
                
                {/* Avatar Upload */}
                <div className="flex items-center space-x-6 mb-8 pb-6 border-b border-slate-200">
                  <div className="relative">
                    <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-2xl font-bold uppercase border-2 border-slate-100">
                      {profileData.fullName.charAt(0)}
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm">
                      <Camera size={14} className="text-slate-600" />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{profileData.fullName}</h3>
                    <p className="text-slate-500 text-xs">{profileData.email}</p>
                    <button className="text-blue-600 text-xs font-bold mt-1.5 hover:underline">
                      Ubah Foto Logotype
                    </button>
                  </div>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        <User size={14} className="inline mr-1 text-slate-400" />
                        Nama Lengkap / PIC
                      </label>
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                        className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        <Mail size={14} className="inline mr-1 text-slate-400" />
                        Alamat Email Kontak
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        <Phone size={14} className="inline mr-1 text-slate-400" />
                        Nomor Telepon / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        <Globe size={14} className="inline mr-1 text-slate-400" />
                        Website Perusahaan
                      </label>
                      <input
                        type="url"
                        value={profileData.website}
                        onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                        className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      <Building2 size={14} className="inline mr-1 text-slate-400" />
                      Nama Perusahaan / Organisasi
                    </label>
                    <input
                      type="text"
                      value={profileData.companyName}
                      onChange={(e) => setProfileData({...profileData, companyName: e.target.value})}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      <MapPin size={14} className="inline mr-1 text-slate-400" />
                      Alamat Lengkap Perusahaan
                    </label>
                    <textarea
                      value={profileData.companyAddress}
                      onChange={(e) => setProfileData({...profileData, companyAddress: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-colors shadow-sm"
                  >
                    <Save size={16} />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="p-6 sm:p-8">
                <h2 className="text-lg font-bold text-slate-900 mb-6">Pengaturan Notifikasi</h2>
                
                <div className="space-y-6">
                  {/* Email Notifications */}
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center">
                      <Mail size={16} className="mr-2 text-blue-600" />
                      Notifikasi Email
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors border border-slate-200/60">
                        <div>
                          <div className="font-bold text-xs text-slate-900">Freelancer Baru Cocok</div>
                          <div className="text-[11px] text-slate-500">Dapatkan email saat ada kandidat yang sesuai dengan proyek Anda</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications.emailNewMatch}
                          onChange={(e) => setNotifications({...notifications, emailNewMatch: e.target.checked})}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-600"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors border border-slate-200/60">
                        <div>
                          <div className="font-bold text-xs text-slate-900">Update Proyek & Milestone</div>
                          <div className="text-[11px] text-slate-500">Notifikasi saat ada pengiriman hasil kerja atau update progres</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications.emailProjectUpdate}
                          onChange={(e) => setNotifications({...notifications, emailProjectUpdate: e.target.checked})}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-600"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors border border-slate-200/60">
                        <div>
                          <div className="font-bold text-xs text-slate-900">Pembayaran & Invoice Escrow</div>
                          <div className="text-[11px] text-slate-500">Notifikasi transaksi deposit dan konfirmasi Midtrans</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications.emailPayment}
                          onChange={(e) => setNotifications({...notifications, emailPayment: e.target.checked})}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-600"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Push Notifications */}
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center">
                      <Bell size={16} className="mr-2 text-blue-600" />
                      Notifikasi Dalam Aplikasi
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors border border-slate-200/60">
                        <div>
                          <div className="font-bold text-xs text-slate-900">Pesan Baru Freelancer</div>
                          <div className="text-[11px] text-slate-500">Notifikasi saat ada pesan masuk dari freelancer</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications.pushMessages}
                          onChange={(e) => setNotifications({...notifications, pushMessages: e.target.checked})}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-600"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-colors shadow-sm"
                  >
                    <Save size={16} />
                    <span>Simpan Pengaturan</span>
                  </button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="p-6 sm:p-8">
                <h2 className="text-lg font-bold text-slate-900 mb-6">Keamanan Akun</h2>
                
                <div className="space-y-6">
                  {/* Change Password */}
                  <div className="p-6 bg-slate-50 rounded-xl border border-slate-200/60">
                    <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center">
                      <Lock size={16} className="mr-2 text-blue-600" />
                      Ubah Password
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Password Lama
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder="Masukkan password lama"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Password Baru
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                          placeholder="Masukkan password baru"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Konfirmasi Password Baru
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                          placeholder="Konfirmasi password baru"
                        />
                      </div>

                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-colors shadow-sm">
                        Perbarui Password
                      </button>
                    </div>
                  </div>

                  {/* Active Sessions */}
                  <div className="p-6 bg-slate-50 rounded-xl border border-slate-200/60">
                    <h3 className="font-bold text-slate-900 text-sm mb-4">Sesi Log Masuk Aktif</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                            <Globe size={16} className="text-emerald-600" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs">Perangkat Ini (Web Browser)</div>
                            <div className="text-[10px] text-slate-500">Bandar Lampung, ID • Aktif Sekarang</div>
                          </div>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-bold px-2 py-0.5 bg-emerald-50 rounded-md">Aktif</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Tab */}
            {activeTab === 'payment' && (
              <div className="p-6 sm:p-8">
                <h2 className="text-lg font-bold text-slate-900 mb-6">Metode Pembayaran Midtrans</h2>
                
                <div className="space-y-6">
                  <div className="p-8 border-2 border-dashed border-slate-300 rounded-xl text-center hover:border-blue-400 hover:bg-slate-50 transition-colors cursor-pointer">
                    <CreditCard size={40} className="mx-auto text-slate-400 mb-2" />
                    <h3 className="font-bold text-slate-900 text-sm mb-1">Integrasi Pembayaran Otomatis</h3>
                    <p className="text-xs text-slate-500">Pembayaran proyek mendukung Transfer Bank, QRIS, GoPay, dan Kartu Kredit via Midtrans Gateway</p>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-xl border border-slate-200/60">
                    <h3 className="font-bold text-slate-900 text-sm mb-3">Informasi Rekening Bank Klien</h3>
                    <p className="text-xs text-slate-500">Rekening ini digunakan untuk memverifikasi refund atau penarikan dana escrow jika proyek dibatalkan.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="p-6 sm:p-8">
                <h2 className="text-lg font-bold text-slate-900 mb-6">Preferensi Proyek</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Kategori Proyek Favorit
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['UI/UX Design', 'Web Development', 'Mobile App', 'Content Writing', 'SEO', 'Video Editing'].map((cat) => (
                        <button
                          key={cat}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors font-bold text-xs"
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Rentang Anggaran Proyek Umum
                    </label>
                    <select className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600">
                      <option>Rp 1jt - 5jt</option>
                      <option>Rp 5jt - 10jt</option>
                      <option>Rp 10jt - 25jt</option>
                      <option>Lebih dari Rp 25jt</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Bahasa Antarmuka
                    </label>
                    <select className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600">
                      <option>Bahasa Indonesia</option>
                      <option>English</option>
                    </select>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-colors shadow-sm"
                    >
                      <Save size={16} />
                      <span>Simpan Preferensi</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}