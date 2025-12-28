'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from "../../DashboardLayout";
import axios from 'axios';
import {
  User, Bell, CreditCard, Eye, EyeOff, Save, Shield,
  Check, X, ExternalLink, Wallet, MapPin, Phone
} from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    title: '',
    bio: '',
    phone: '',
    location: '',
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [walletData, setWalletData] = useState({
    balance: 0,
    bankName: '-',
    accountNumber: '-',
    accountHolder: '-'
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    emailJobAlerts: true,
    emailMessages: true,
    pushNewProject: false,
    pushPayment: true
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await axios.get(`${apiUrl}/user/freelancer/settings`, { withCredentials: true });

        if (response.data.code === 200) {
          const data = response.data.data;

          setProfileData({
            name: data.name || '',
            email: data.email || '',
            title: data.title || '',
            bio: data.bio || '',
            phone: data.phone || '',
            location: data.location || ''
          });
          setSkills(data.skills || []);

          if (data.wallet) {
            setWalletData(data.wallet);
          }
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Gagal load settings:", error.response?.data?.message || error.message);
        } else {
          console.error("Error:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      await axios.put(`${apiUrl}/user/freelancer/settings`, {
        name: profileData.name,
        title: profileData.title,
        bio: profileData.bio,
        phone: profileData.phone,
        location: profileData.location,
        skills: skills
      }, { withCredentials: true });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      alert("Gagal menyimpan perubahan profil.");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Konfirmasi password tidak cocok!');
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await axios.patch(`${apiUrl}/user/freelancer/settings`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, { withCredentials: true });

      if (response.data.code === 200) {
        alert('Password berhasil diubah!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Gagal mengubah password");
      } else {
        alert("Terjadi kesalahan sistem");
      }
    }
  };

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(number);
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'security', label: 'Keamanan', icon: Shield },
    { id: 'notifications', label: 'Notifikasi', icon: Bell },
    { id: 'payment', label: 'Pembayaran', icon: CreditCard },
  ];

  return (
    <DashboardLayout role="freelancer">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pengaturan</h1>
          <p className="text-slate-500">Kelola akun dan preferensi Anda</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition font-bold text-sm shadow-sm">
          <ExternalLink size={16} />
          <Link href={'/dashboard/freelancer/profile'}>
            <span>Lihat Profil Publik</span>
          </Link>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium ${activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
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
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {profileData.name.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{profileData.name}</h3>
                    <p className="text-sm text-slate-500">{profileData.email}</p>
                    {profileData.location && (
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <MapPin size={12} /> {profileData.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Lengkap</label>
                    <input type="text" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Profesi / Title</label>
                    <input type="text" placeholder="Contoh: Frontend Developer" value={profileData.title} onChange={(e) => setProfileData({ ...profileData, title: e.target.value })} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 outline-none transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Nomor Telepon</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input type="text" placeholder="+62..." value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 outline-none transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Lokasi</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input type="text" placeholder="Jakarta, Indonesia" value={profileData.location} onChange={(e) => setProfileData({ ...profileData, location: e.target.value })} className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 outline-none transition-all" />
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-3 text-[10px] uppercase tracking-widest">Keahlian (Skills)</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {skills.length === 0 && <p className="text-xs text-slate-400">Belum ada skill ditambahkan.</p>}
                    {skills.map((skill) => (
                      <span key={skill} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
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
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Bio Singkat</label>
                  <textarea rows={4} placeholder="Ceritakan sedikit tentang pengalaman Anda..." value={profileData.bio} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 outline-none resize-none transition-all" />
                </div>

                <div className="flex justify-end pt-4">
                  <button type="submit" className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold shadow-lg shadow-blue-600/20 active:scale-95">
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 2. SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Shield className="text-blue-600" size={24} /> Keamanan Akun
              </h2>
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
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Konfirmasi Password Baru</label>
                  <input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 outline-none" required />
                </div>
                <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-bold shadow-lg shadow-blue-600/10">Ubah Password</button>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Bell className="text-blue-600" size={24} /> Preferensi Notifikasi
              </h2>
              <div className="space-y-6">
                {[
                  { id: 'emailJobAlerts', label: 'Email Lowongan Pekerjaan', desc: 'Terima rekomendasi pekerjaan baru via email.' },
                  { id: 'emailMessages', label: 'Email Pesan Masuk', desc: 'Notifikasi saat ada klien mengirim pesan.' },
                  { id: 'pushNewProject', label: 'Push Notif Proyek Baru', desc: 'Notifikasi di browser saat ada proyek cocok.' },
                  { id: 'pushPayment', label: 'Notifikasi Pembayaran', desc: 'Info saat dana masuk atau ditarik.' },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.label}</h4>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications[item.id as keyof typeof notifications]}
                        onChange={() => setNotifications({ ...notifications, [item.id]: !notifications[item.id as keyof typeof notifications] })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
                <div className="relative z-10">
                  <p className="text-blue-100 text-sm mb-1 font-medium">Total Saldo Aktif</p>
                  <h2 className="text-4xl font-bold mb-6">{formatRupiah(walletData.balance)}</h2>

                  <div className="flex gap-3">
                    <button className="px-6 py-2.5 bg-white text-blue-700 rounded-xl font-bold text-sm hover:bg-blue-50 transition shadow-lg">
                      Tarik Dana (Withdraw)
                    </button>
                    <button className="px-6 py-2.5 bg-blue-500/30 border border-white/20 text-white rounded-xl font-bold text-sm hover:bg-blue-500/40 transition">
                      Riwayat
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Wallet className="text-slate-500" size={20} /> Akun Penerima
                </h3>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      {walletData.bankName?.charAt(0) || 'B'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{walletData.bankName}</p>
                      <p className="text-sm text-slate-500">{walletData.accountNumber}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{walletData.accountHolder}</p>
                    </div>
                  </div>
                  <button className="text-sm font-bold text-blue-600 hover:underline">Ubah</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}