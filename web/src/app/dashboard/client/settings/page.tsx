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
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'notifications', label: 'Notifikasi', icon: Bell },
    { id: 'security', label: 'Keamanan', icon: Shield },
    { id: 'payment', label: 'Pembayaran', icon: CreditCard },
    { id: 'preferences', label: 'Preferensi', icon: Briefcase },
  ];

  const handleSave = () => {
    alert('Pengaturan berhasil disimpan!');
  };

  return (
    <DashboardLayout role="client">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Pengaturan</h1>
        <p className="text-slate-500 mt-2">Kelola profil dan preferensi akun Anda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-2 sticky top-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <tab.icon size={20} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Informasi Profil</h2>
                
                {/* Avatar Upload */}
                <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-slate-200">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                      {profileData.fullName.charAt(0)}
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full border-2 border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
                      <Camera size={16} className="text-slate-600" />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">{profileData.fullName}</h3>
                    <p className="text-slate-500 text-sm">{profileData.email}</p>
                    <button className="text-purple-600 text-sm font-medium mt-2 hover:underline">
                      Ubah Foto Profil
                    </button>
                  </div>
                </div>

                {/* Form */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        <User size={16} className="inline mr-2" />
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        <Mail size={16} className="inline mr-2" />
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        <Phone size={16} className="inline mr-2" />
                        Nomor Telepon
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        <Globe size={16} className="inline mr-2" />
                        Website Perusahaan
                      </label>
                      <input
                        type="url"
                        value={profileData.website}
                        onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <Building2 size={16} className="inline mr-2" />
                      Nama Perusahaan
                    </label>
                    <input
                      type="text"
                      value={profileData.companyName}
                      onChange={(e) => setProfileData({...profileData, companyName: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <MapPin size={16} className="inline mr-2" />
                      Alamat Perusahaan
                    </label>
                    <textarea
                      value={profileData.companyAddress}
                      onChange={(e) => setProfileData({...profileData, companyAddress: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                  >
                    <Save size={20} />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Pengaturan Notifikasi</h2>
                
                <div className="space-y-8">
                  {/* Email Notifications */}
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
                      <Mail size={20} className="mr-2 text-purple-600" />
                      Notifikasi Email
                    </h3>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                        <div>
                          <div className="font-medium text-slate-900">Freelancer Baru Cocok</div>
                          <div className="text-sm text-slate-500">Dapatkan email saat ada freelancer yang cocok dengan proyek Anda</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications.emailNewMatch}
                          onChange={(e) => setNotifications({...notifications, emailNewMatch: e.target.checked})}
                          className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-600"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                        <div>
                          <div className="font-medium text-slate-900">Update Proyek</div>
                          <div className="text-sm text-slate-500">Notifikasi saat ada update pada proyek Anda</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications.emailProjectUpdate}
                          onChange={(e) => setNotifications({...notifications, emailProjectUpdate: e.target.checked})}
                          className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-600"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                        <div>
                          <div className="font-medium text-slate-900">Pembayaran & Invoice</div>
                          <div className="text-sm text-slate-500">Notifikasi terkait pembayaran dan invoice</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications.emailPayment}
                          onChange={(e) => setNotifications({...notifications, emailPayment: e.target.checked})}
                          className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-600"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Push Notifications */}
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
                      <Bell size={20} className="mr-2 text-purple-600" />
                      Notifikasi Push
                    </h3>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                        <div>
                          <div className="font-medium text-slate-900">Freelancer Match</div>
                          <div className="text-sm text-slate-500">Push notification saat ada kandidat baru</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications.pushNewMatch}
                          onChange={(e) => setNotifications({...notifications, pushNewMatch: e.target.checked})}
                          className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-600"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                        <div>
                          <div className="font-medium text-slate-900">Pesan Baru</div>
                          <div className="text-sm text-slate-500">Notifikasi saat ada pesan dari freelancer</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications.pushMessages}
                          onChange={(e) => setNotifications({...notifications, pushMessages: e.target.checked})}
                          className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-600"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                        <div>
                          <div className="font-medium text-slate-900">Pengingat Deadline</div>
                          <div className="text-sm text-slate-500">Reminder sebelum deadline proyek</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications.pushDeadlines}
                          onChange={(e) => setNotifications({...notifications, pushDeadlines: e.target.checked})}
                          className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-600"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                  >
                    <Save size={20} />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Keamanan Akun</h2>
                
                <div className="space-y-6">
                  {/* Change Password */}
                  <div className="p-6 bg-slate-50 rounded-xl">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
                      <Lock size={20} className="mr-2 text-purple-600" />
                      Ubah Password
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Password Lama
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                            placeholder="Masukkan password lama"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Password Baru
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                          placeholder="Masukkan password baru"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Konfirmasi Password Baru
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                          placeholder="Konfirmasi password baru"
                        />
                      </div>

                      <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                        Update Password
                      </button>
                    </div>
                  </div>

                  {/* Two Factor Auth */}
                  <div className="p-6 bg-slate-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">Autentikasi Dua Faktor</h3>
                        <p className="text-sm text-slate-500">Tingkatkan keamanan akun dengan 2FA</p>
                      </div>
                      <button className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-white transition-colors font-medium">
                        Aktifkan
                      </button>
                    </div>
                  </div>

                  {/* Active Sessions */}
                  <div className="p-6 bg-slate-50 rounded-xl">
                    <h3 className="font-semibold text-slate-900 mb-4">Sesi Aktif</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Globe size={20} className="text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">Windows • Chrome</div>
                            <div className="text-sm text-slate-500">Bandar Lampung, ID • Aktif sekarang</div>
                          </div>
                        </div>
                        <span className="text-xs text-green-600 font-medium">Perangkat ini</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Tab */}
            {activeTab === 'payment' && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Metode Pembayaran</h2>
                
                <div className="space-y-6">
                  <div className="p-6 border-2 border-dashed border-slate-300 rounded-xl text-center hover:border-purple-400 hover:bg-purple-50/30 transition-all cursor-pointer">
                    <CreditCard size={48} className="mx-auto text-slate-400 mb-3" />
                    <h3 className="font-semibold text-slate-900 mb-2">Tambah Metode Pembayaran</h3>
                    <p className="text-sm text-slate-500">Tambahkan kartu kredit/debit atau e-wallet</p>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-xl">
                    <h3 className="font-semibold text-slate-900 mb-4">Riwayat Pembayaran</h3>
                    <p className="text-slate-500 text-center py-8">Belum ada riwayat pembayaran</p>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Preferensi Proyek</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Kategori Proyek Favorit
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['UI/UX Design', 'Web Development', 'Mobile App', 'Content Writing', 'SEO', 'Video Editing'].map((cat) => (
                        <button
                          key={cat}
                          className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium"
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Budget Range Umum
                    </label>
                    <select className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600">
                      <option>Rp 1jt - 5jt</option>
                      <option>Rp 5jt - 10jt</option>
                      <option>Rp 10jt - 25jt</option>
                      <option>Lebih dari Rp 25jt</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Bahasa
                    </label>
                    <select className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600">
                      <option>Bahasa Indonesia</option>
                      <option>English</option>
                    </select>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                    >
                      <Save size={20} />
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