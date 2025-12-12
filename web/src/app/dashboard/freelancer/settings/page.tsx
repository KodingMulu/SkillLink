'use client';

import { useState } from 'react';
import DashboardLayout from "../../DashboardLayout";
import { 
  User, Mail, Phone, MapPin, Lock, Bell, CreditCard, 
  Globe, Eye, EyeOff, Save, Shield, Smartphone, LogOut,
  ChevronRight, Check, X, AlertCircle, Camera, Briefcase,
  DollarSign, Clock, Star
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // State untuk form
  const [profileData, setProfileData] = useState({
    name: 'Saipul Bahri',
    title: 'Frontend Developer',
    email: 'saipul.bahri@email.com',
    phone: '+62 812-3456-7890',
    location: 'Jakarta, Indonesia',
    bio: 'Frontend Developer dengan pengalaman 3+ tahun dalam membangun aplikasi web modern menggunakan React, Next.js, dan TypeScript.',
    hourlyRate: '150000',
    website: 'https://saipulbahri.dev',
    github: 'github.com/saipulbahri',
    linkedin: 'linkedin.com/in/saipulbahri',
    language: 'id',
    timezone: 'Asia/Jakarta'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    jobAlerts: true,
    messageAlerts: true,
    projectUpdates: true,
    paymentAlerts: true,
    weeklyReport: false,
    marketingEmails: false
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    showOnlineStatus: true,
    showHourlyRate: true
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Password baru tidak cocok!');
      return;
    }
    alert('Password berhasil diubah!');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'security', label: 'Keamanan', icon: Shield },
    { id: 'notifications', label: 'Notifikasi', icon: Bell },
    { id: 'privacy', label: 'Privasi', icon: Eye },
    { id: 'payment', label: 'Pembayaran', icon: CreditCard },
  ];

  return (
    <DashboardLayout role="freelancer">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Pengaturan</h1>
        <p className="text-slate-500">Kelola akun dan preferensi Anda</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
          
          {/* Logout Button */}
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-white text-red-600 hover:bg-red-50 border border-slate-200 transition mt-4 font-medium">
            <LogOut className="w-5 h-5" />
            <span>Keluar</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {/* Success Message */}
          {saveSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">Perubahan berhasil disimpan!</span>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Informasi Profil</h2>
              
              {/* Avatar Section */}
              <div className="mb-6 pb-6 border-b border-slate-200">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Foto Profil
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    SB
                  </div>
                  <div className="flex space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                      <Camera className="w-4 h-4" />
                      <span>Upload Foto</span>
                    </button>
                    <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition">
                      Hapus
                    </button>
                  </div>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Profesi/Keahlian
                  </label>
                  <input
                    type="text"
                    value={profileData.title}
                    onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Lokasi
                  </label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-slate-50"
                  />
                </div>

                {/* Hourly Rate */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                    <DollarSign className="w-4 h-4 mr-2 text-emerald-600" />
                    Tarif per Jam (Rp)
                  </label>
                  <input
                    type="number"
                    value={profileData.hourlyRate}
                    onChange={(e) => setProfileData({ ...profileData, hourlyRate: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                  />
                </div>

                {/* Social Links */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                      <Globe className="w-4 h-4 mr-2 text-blue-600" />
                      Website/Portfolio
                    </label>
                    <input
                      type="url"
                      value={profileData.website}
                      onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        GitHub
                      </label>
                      <input
                        type="text"
                        value={profileData.github}
                        onChange={(e) => setProfileData({ ...profileData, github: e.target.value })}
                        placeholder="github.com/username"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        LinkedIn
                      </label>
                      <input
                        type="text"
                        value={profileData.linkedin}
                        onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                        placeholder="linkedin.com/in/username"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Language & Timezone */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Bahasa
                    </label>
                    <select
                      value={profileData.language}
                      onChange={(e) => setProfileData({ ...profileData, language: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                    >
                      <option value="id">Bahasa Indonesia</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Zona Waktu
                    </label>
                    <select
                      value={profileData.timezone}
                      onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                    >
                      <option value="Asia/Jakarta">WIB (Jakarta)</option>
                      <option value="Asia/Makassar">WITA (Makassar)</option>
                      <option value="Asia/Jayapura">WIT (Jayapura)</option>
                    </select>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-lg shadow-blue-600/20"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Change Password */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Ubah Password</h2>
                <form onSubmit={handlePasswordChange} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Password Saat Ini
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Password Baru
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Minimal 8 karakter, kombinasi huruf dan angka</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Konfirmasi Password Baru
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Ubah Password
                  </button>
                </form>
              </div>

              {/* Two-Factor Authentication */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Autentikasi Dua Faktor</h2>
                <p className="text-slate-600 mb-4">
                  Tambahkan lapisan keamanan ekstra dengan mengaktifkan autentikasi dua faktor
                </p>
                <button className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">
                  <Smartphone className="w-5 h-5" />
                  <span>Aktifkan 2FA</span>
                </button>
              </div>

              {/* Active Sessions */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Sesi Aktif</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Chrome on Windows</p>
                        <p className="text-sm text-slate-500">Jakarta, Indonesia • Aktif sekarang</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                      Saat ini
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Safari on iPhone</p>
                        <p className="text-sm text-slate-500">Jakarta, Indonesia • 2 hari yang lalu</p>
                      </div>
                    </div>
                    <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                      Keluar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Preferensi Notifikasi</h2>
              <div className="space-y-6">
                {Object.entries({
                  emailNotifications: { label: 'Notifikasi Email', desc: 'Terima notifikasi melalui email' },
                  pushNotifications: { label: 'Notifikasi Push', desc: 'Terima notifikasi push di browser' },
                  jobAlerts: { label: 'Notifikasi Pekerjaan', desc: 'Pekerjaan baru yang sesuai dengan skill Anda' },
                  messageAlerts: { label: 'Notifikasi Pesan', desc: 'Pesan baru dari klien' },
                  projectUpdates: { label: 'Update Proyek', desc: 'Status dan progress proyek Anda' },
                  paymentAlerts: { label: 'Notifikasi Pembayaran', desc: 'Pembayaran diterima atau tertunda' },
                  weeklyReport: { label: 'Laporan Mingguan', desc: 'Ringkasan aktivitas mingguan Anda' },
                  marketingEmails: { label: 'Email Marketing', desc: 'Tips, promo, dan berita terbaru' }
                }).map(([key, { label, desc }]) => (
                  <div key={key} className="flex items-center justify-between pb-4 border-b border-slate-200 last:border-0 last:pb-0">
                    <div>
                      <h3 className="font-semibold text-slate-900">{label}</h3>
                      <p className="text-sm text-slate-600">{desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings[key as keyof typeof notificationSettings]}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, [key]: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-6 mt-6 border-t border-slate-200">
                <button
                  onClick={handleProfileUpdate}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-lg shadow-blue-600/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Preferensi</span>
                </button>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Pengaturan Privasi</h2>
              <div className="space-y-6">
                {/* Profile Visibility */}
                <div className="pb-4 border-b border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-3">Visibilitas Profil</h3>
                  <div className="space-y-3">
                    {[
                      { value: 'public', label: 'Publik', desc: 'Semua orang dapat melihat profil Anda' },
                      { value: 'private', label: 'Privat', desc: 'Hanya klien yang tertarik dapat melihat' }
                    ].map(({ value, label, desc }) => (
                      <label key={value} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50">
                        <input
                          type="radio"
                          name="profileVisibility"
                          value={value}
                          checked={privacySettings.profileVisibility === value}
                          onChange={(e) => setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value })}
                          className="w-4 h-4 text-blue-600 mt-1"
                        />
                        <div>
                          <span className="font-medium text-slate-900">{label}</span>
                          <p className="text-sm text-slate-600">{desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Other Privacy Settings */}
                {Object.entries({
                  showEmail: 'Tampilkan Email',
                  showPhone: 'Tampilkan Nomor Telepon',
                  showHourlyRate: 'Tampilkan Tarif per Jam',
                  allowMessages: 'Izinkan Pesan dari Klien',
                  showOnlineStatus: 'Tampilkan Status Online'
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-slate-700 font-medium">{label}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings[key as keyof typeof privacySettings] as boolean}
                        onChange={(e) => setPrivacySettings({ ...privacySettings, [key]: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-6 mt-6 border-t border-slate-200">
                <button
                  onClick={handleProfileUpdate}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-lg shadow-blue-600/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Pengaturan</span>
                </button>
              </div>
            </div>
          )}

          {/* Payment Tab */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              {/* Bank Account */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Rekening Bank</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-4 border-2 border-blue-500 rounded-xl bg-blue-50">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Bank BCA</p>
                        <p className="text-sm text-slate-600">•••• •••• •••• 4242</p>
                        <p className="text-xs text-slate-500">Saipul Bahri</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                      Primary
                    </span>
                  </div>
                </div>
                <button className="w-full py-3 border-2 border-dashed border-slate-300 text-slate-600 rounded-lg hover:border-blue-500 hover:text-blue-500 transition font-medium">
                  + Tambah Rekening Bank
                </button>
              </div>

              {/* Earnings Summary */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Ringkasan Pendapatan</h2>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                    <p className="text-sm text-emerald-600 font-medium mb-1">Total Pendapatan</p>
                    <p className="text-2xl font-bold text-emerald-900">Rp 45jt</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <p className="text-sm text-blue-600 font-medium mb-1">Bulan Ini</p>
                    <p className="text-2xl font-bold text-blue-900">Rp 8,5jt</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <p className="text-sm text-amber-600 font-medium mb-1">Tertunda</p>
                    <p className="text-2xl font-bold text-amber-900">Rp 2jt</p>
                  </div>
                </div>
              </div>

              {/* Transaction History */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Riwayat Pembayaran</h2>
                  <button className="text-blue-600 hover:underline text-sm font-medium">
                    Lihat Semua
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    { client: 'TechFlow Startup', project: 'Frontend Developer Project', date: '10 Des 2024', amount: '+ Rp 5.000.000', status: 'Berhasil' },
                    { client: 'Digital Agency', project: 'Dashboard Analytics', date: '5 Des 2024', amount: '+ Rp 3.500.000', status: 'Berhasil' },
                    { client: 'Startup XYZ', project: 'Website Redesign', date: '1 Des 2024', amount: '+ Rp 2.800.000', status: 'Pending' }
                  ].map((trans, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <p className="font-semibold text-slate-900">{trans.client}</p>
                        <p className="text-sm text-slate-600">{trans.project}</p>
                        <p className="text-xs text-slate-500 mt-1">{trans.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-600">{trans.amount}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          trans.status === 'Berhasil' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {trans.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Withdraw Balance */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Tarik Saldo</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-900 font-medium">Saldo Tersedia</p>
                      <p className="text-2xl font-bold text-blue-900 mt-1">Rp 8.250.000</p>
                      <p className="text-xs text-blue-700 mt-2">Minimum penarikan: Rp 100.000</p>
                    </div>
                  </div>
                </div>
                <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                  Tarik Saldo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}