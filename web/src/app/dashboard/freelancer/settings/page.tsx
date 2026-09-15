'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from "../../DashboardLayout";
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import {
  User, Bell, CreditCard, Eye, EyeOff, Save, Shield,
  Check, X, ExternalLink, Wallet, MapPin, Phone,
  Sparkles, Loader2, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const apiUrl = getApiUrl();
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

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const apiUrl = getApiUrl();
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
      console.error(error);
      alert("Gagal menyimpan perubahan profil.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Konfirmasi password baru tidak cocok!');
      return;
    }

    setIsSaving(true);
    try {
      const apiUrl = getApiUrl();
      const response = await axios.put(`${apiUrl}/user/freelancer/settings`, {
        name: profileData.name,
        title: profileData.title,
        bio: profileData.bio,
        phone: profileData.phone,
        location: profileData.location,
        skills: skills,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, { withCredentials: true });

      if (response.data.code === 200) {
        alert('Password Anda berhasil diperbarui!');
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
    } finally {
      setIsSaving(false);
    }
  };

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(number || 0);
  };

  const tabs = [
    { id: 'profile', label: 'Profil Saya', icon: User },
    { id: 'security', label: 'Keamanan Akun', icon: Shield },
    { id: 'notifications', label: 'Preferensi Notifikasi', icon: Bell },
    { id: 'payment', label: 'Metode Pembayaran', icon: CreditCard },
  ];

  return (
    <DashboardLayout role="freelancer">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner Header */}
        <div className="relative rounded-3xl bg-slate-900 p-8 text-white shadow-lg">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-blue-200">
                <Sparkles size={14} className="text-amber-400" /> Account & Preferences Manager
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                Pengaturan Akun & Keamanan
              </h1>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                Kelola informasi pribadi, ubah kata sandi, atur preferensi notifikasi, dan sambungkan rekening penarikan dana.
              </p>
            </div>

            <Link
              href="/dashboard/freelancer/profile"
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 border border-white/20 text-white rounded-2xl hover:bg-white/20 transition font-bold text-xs shrink-0 cursor-pointer"
            >
              <ExternalLink size={16} />
              <span>Lihat Profil Publik</span>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-slate-500 font-medium text-sm">Memuat pengaturan Anda...</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Tab Sidebar */}
            <div className="w-full lg:w-72 shrink-0 space-y-2">
              <div className="bg-white p-2.5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all font-bold text-xs cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <tab.icon size={18} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Panel */}
            <div className="flex-1">
              
              {saveSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 flex items-center space-x-3 animate-in fade-in zoom-in duration-300">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="text-emerald-900 text-xs font-bold">Perubahan informasi profil berhasil disimpan!</span>
                </div>
              )}

              {/* 1. PROFILE TAB */}
              {activeTab === 'profile' && (
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 md:p-8 space-y-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Informasi Profil Pribadi</h2>
                    <p className="text-xs text-slate-500 mt-1">Informasi ini akan ditampilkan pada profil publik Anda</p>
                  </div>

                  {/* Profile Identity Card */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-md uppercase shrink-0">
                      {profileData.name.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-bold text-slate-900 text-base">{profileData.name}</h3>
                      <p className="text-xs text-slate-500 truncate">{profileData.email}</p>
                      {profileData.location && (
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 font-medium">
                          <MapPin size={12} className="text-rose-500" /> {profileData.location}
                        </p>
                      )}
                    </div>
                  </div>

                  <form onSubmit={handleProfileUpdate} className="space-y-5">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Nama Lengkap</label>
                        <input 
                          type="text" 
                          value={profileData.name} 
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} 
                          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium text-slate-900 outline-none transition-all" 
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Profesi / Title</label>
                        <input 
                          type="text" 
                          placeholder="Contoh: Senior Full Stack Developer" 
                          value={profileData.title} 
                          onChange={(e) => setProfileData({ ...profileData, title: e.target.value })} 
                          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium text-slate-900 outline-none transition-all" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Nomor Telepon</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input 
                            type="text" 
                            placeholder="+62812345678" 
                            value={profileData.phone} 
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} 
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium text-slate-900 outline-none transition-all" 
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Lokasi / Kota</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input 
                            type="text" 
                            placeholder="Jakarta, Indonesia" 
                            value={profileData.location} 
                            onChange={(e) => setProfileData({ ...profileData, location: e.target.value })} 
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium text-slate-900 outline-none transition-all" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Manager Skills */}
                    <div className="space-y-3 pt-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Keahlian & Skills</label>
                      <div className="flex flex-wrap gap-2">
                        {skills.length === 0 && <p className="text-xs text-slate-400">Belum ada skill ditambahkan.</p>}
                        {skills.map((skill) => (
                          <span key={skill} className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold border border-blue-100">
                            {skill}
                            <X size={14} className="cursor-pointer hover:text-red-500 transition-colors" onClick={() => removeSkill(skill)} />
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Tambah keahlian baru (Tekan Enter)..." 
                          value={newSkill} 
                          onChange={(e) => setNewSkill(e.target.value)} 
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} 
                          className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-xs font-medium outline-none" 
                        />
                        <button 
                          type="button" 
                          onClick={addSkill} 
                          className="px-5 py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
                        >
                          Tambah
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Bio Singkat</label>
                      <textarea 
                        rows={4} 
                        placeholder="Ceritakan pengalaman profesional Anda, keahlian utama, serta keunggulan Anda dalam menangani proyek..." 
                        value={profileData.bio} 
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} 
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium text-slate-900 outline-none resize-none transition-all" 
                      />
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-100">
                      <button 
                        type="submit" 
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition font-bold text-xs shadow-lg shadow-blue-600/20 active:scale-95 cursor-pointer"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="animate-spin" size={16} />
                            <span>Menyimpan...</span>
                          </>
                        ) : (
                          <>
                            <Save size={16} />
                            <span>Simpan Perubahan</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* 2. SECURITY TAB */}
              {activeTab === 'security' && (
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 md:p-8 space-y-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      <Shield className="text-blue-600" size={24} /> Keamanan & Kata Sandi
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Perbarui password akun Anda secara berkala untuk menjaga keamanan</p>
                  </div>

                  <form onSubmit={handlePasswordChange} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Password Saat Ini</label>
                      <div className="relative">
                        <input 
                          type={showCurrentPassword ? 'text' : 'password'} 
                          value={passwordData.currentPassword} 
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} 
                          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium outline-none" 
                          required 
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)} 
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Password Baru</label>
                      <div className="relative">
                        <input 
                          type={showNewPassword ? 'text' : 'password'} 
                          value={passwordData.newPassword} 
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} 
                          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium outline-none" 
                          required 
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowNewPassword(!showNewPassword)} 
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Konfirmasi Password Baru</label>
                      <input 
                        type="password" 
                        value={passwordData.confirmPassword} 
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} 
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium outline-none" 
                        required 
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSaving}
                      className="w-full py-3.5 bg-blue-600 text-white font-bold text-xs rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/10 flex justify-center items-center gap-2 cursor-pointer"
                    >
                      {isSaving ? <Loader2 className="animate-spin" size={16} /> : 'Ubah Password'}
                    </button>
                  </form>
                </div>
              )}

              {/* 3. NOTIFICATIONS TAB */}
              {activeTab === 'notifications' && (
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 md:p-8 space-y-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      <Bell className="text-blue-600" size={24} /> Preferensi Notifikasi
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Atur kanal notifikasi yang ingin Anda terima</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { id: 'emailJobAlerts', label: 'Email Lowongan Pekerjaan Baru', desc: 'Dapatkan email saat ada proyek baru yang sesuai dengan keahlian Anda.' },
                      { id: 'emailMessages', label: 'Email Pesan & Lampiran Masuk', desc: 'Terima email pemberitahuan saat ada klien mengirimkan pesan langsung.' },
                      { id: 'pushNewProject', label: 'Notifikasi Browser Proyek Direkomendasikan', desc: 'Notifikasi langsung di layar browser saat ada tawaran mendesak.' },
                      { id: 'pushPayment', label: 'Notifikasi Saldo & Pencairan Dana', desc: 'Notifikasi lengkap setiap ada transaksi dana masuk atau keluar.' },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-slate-900 text-xs">{item.label}</h4>
                          <p className="text-[11px] text-slate-500 font-medium">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
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

              {/* 4. PAYMENT TAB */}
              {activeTab === 'payment' && (
                <div className="space-y-6">
                  
                  {/* Digital Balance Card */}
                  <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
                    <div className="relative z-10 space-y-4">
                      <p className="text-blue-200 text-xs font-bold uppercase tracking-wider">Saldo Dompet Digital SkillLink</p>
                      <h2 className="text-3xl md:text-4xl font-black">{formatRupiah(walletData.balance)}</h2>

                      <div className="flex flex-wrap gap-3 pt-2">
                        <Link 
                          href="/dashboard/freelancer/wallet"
                          className="px-5 py-3 bg-blue-600 text-white rounded-2xl font-bold text-xs hover:bg-blue-500 transition shadow-lg flex items-center gap-2"
                        >
                          <span>Kelola Saldo & Penarikan</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Bank Account Details */}
                  <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 md:p-8 space-y-4">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Wallet className="text-blue-600" size={18} /> Rekening Bank Penarikan Utama
                    </h3>

                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-black text-lg">
                          {walletData.bankName?.charAt(0) || 'B'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{walletData.bankName}</p>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">{walletData.accountNumber}</p>
                          <p className="text-[11px] text-slate-400 font-medium mt-0.5">a.n. {walletData.accountHolder}</p>
                        </div>
                      </div>

                      <Link 
                        href="/dashboard/freelancer/wallet"
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        Ubah Rekening
                      </Link>
                    </div>
                  </div>

                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
}