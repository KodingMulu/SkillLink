'use client';

import { useState } from 'react';
import DashboardLayout from "../../DashboardLayout";
import { 
  User, Mail, Phone, MapPin, Lock, Bell, CreditCard, 
  Globe, Eye, EyeOff, Save, Shield, Smartphone, LogOut,
  ChevronRight, Check, X, AlertCircle, Camera, Briefcase,
  DollarSign, Clock, Star, Sparkles, Plus, Github, Linkedin
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [availability, setAvailability] = useState('available');

  const [skills, setSkills] = useState(['React', 'Next.js', 'Tailwind CSS', 'TypeScript']);
  const [newSkill, setNewSkill] = useState('');

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

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

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
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pengaturan</h1>
          <p className="text-slate-500">Kelola akun dan preferensi Anda</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm min-w-[240px]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
              <Sparkles size={14} className="text-amber-500" /> Kekuatan Profil
            </span>
            <span className="text-xs font-black text-blue-600">85%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="w-[85%] h-full bg-blue-600 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Statistik Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Proyek Selesai', value: '24', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Rating Rata-rata', value: '4.9', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Klien Puas', value: '98%', icon: Check, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Waktu Respon', value: '< 2 jam', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon size={20} />
            </div>
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-64 space-y-2">
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
          
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-white text-red-600 hover:bg-red-50 border border-slate-200 transition mt-4 font-medium">
            <LogOut className="w-5 h-5" />
            <span>Keluar</span>
          </button>
        </div>

        <div className="flex-1">
          {saveSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center space-x-3 animate-in fade-in zoom-in duration-300">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">Perubahan berhasil disimpan!</span>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Informasi Profil</h2>
              
              <div className="mb-6 pb-6 border-b border-slate-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      SB
                    </div>
                    <div className="flex flex-col space-y-2">
                      <div className="flex space-x-2">
                        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-bold">
                          <Camera className="w-4 h-4" />
                          <span>Upload Foto</span>
                        </button>
                        <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition text-sm font-bold">
                          Hapus
                        </button>
                      </div>

                      <div className="flex flex-col gap-1.5 pt-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Anda</p>
                        <div className="flex gap-2">
                          {[
                            { id: 'available', label: 'Aktif', color: 'bg-emerald-500' },
                            { id: 'busy', label: 'Sibuk', color: 'bg-amber-500' },
                            { id: 'away', label: 'Libur', color: 'bg-rose-500' }
                          ].map((s) => (
                            <button
                              key={s.id}
                              onClick={() => setAvailability(s.id)}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black transition-all border ${
                                availability === s.id 
                                ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${s.color}`}></span>
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Lengkap</label>
                    <input type="text" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Profesi/Keahlian</label>
                    <input type="text" value={profileData.title} onChange={(e) => setProfileData({ ...profileData, title: e.target.value })} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 outline-none" />
                  </div>
                </div>

                <div className="py-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Keahlian Utama (Tags)</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {skills.map((skill) => (
                      <span key={skill} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100 transition-all">
                        {skill}
                        <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => removeSkill(skill)} />
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Tambah skill..." value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 text-sm outline-none" />
                    <button type="button" onClick={addSkill} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition">Tambah</button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Bio</label>
                  <textarea value={profileData.bio} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} rows={4} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 outline-none resize-none" />
                </div>

                {/* TAHAP 3: Connected Accounts UI */}
                <div className="py-4 border-t border-slate-100">
                  <label className="block text-sm font-semibold text-slate-700 mb-4 uppercase tracking-widest text-[10px]">Akun Terhubung</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { platform: 'GitHub', icon: Github, user: 'saipulbahri', color: 'text-slate-900', connected: true },
                      { platform: 'LinkedIn', icon: Linkedin, user: 'Belum terhubung', color: 'text-blue-700', connected: false },
                    ].map((social, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-white shadow-sm ${social.color}`}><social.icon size={18}/></div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{social.platform}</p>
                            <p className="text-[10px] text-slate-500">{social.user}</p>
                          </div>
                        </div>
                        <button type="button" className={`text-[10px] font-black px-3 py-1.5 rounded-lg transition-all border ${social.connected ? 'text-red-500 border-red-100 hover:bg-red-50' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                          {social.connected ? 'Putuskan' : 'Hubungkan'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button type="submit" className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-lg shadow-blue-600/20">
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tab lain tetap sama... */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Ubah Password</h2>
                <form onSubmit={handlePasswordChange} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Password Saat Ini</label>
                    <div className="relative">
                      <input type={showCurrentPassword ? 'text' : 'password'} value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 outline-none" required />
                      <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Password Baru</label>
                    <div className="relative">
                      <input type={showNewPassword ? 'text' : 'password'} value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 outline-none" required />
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">Ubah Password</button>
                </form>
              </div>
            </div>
          )}
          {/* ... sisa kode tab lainnya sama ... */}
        </div>
      </div>
    </DashboardLayout>
  );
}