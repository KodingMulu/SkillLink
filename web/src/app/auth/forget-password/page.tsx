'use client';

import { useState } from 'react';
import { Mail, ArrowLeft, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ForgetPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendEmail = () => {
    setError('');
    
    if (!email) {
      setError('Email tidak boleh kosong');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Format email tidak valid');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleResetPassword = () => {
    setError('');
    
    if (!newPassword || !confirmPassword) {
      setError('Semua field harus diisi');
      return;
    }
    
    if (newPassword.length < 8) {
      setError('Password minimal 8 karakter');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      alert('Password berhasil diubah!');
    }, 1500);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/bg.webp')",
        }}
      />

      {/* Card Content */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md relative z-10">
        {/* Step 1: Email Input */}
        {step === 1 && (
          <div className="p-8">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition mb-6"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Kembali
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Lupa Password?</h1>
              <p className="text-gray-600">
                Masukkan email Anda dan kami akan mengirimkan link untuk reset password
              </p>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            <button
              onClick={handleSendEmail}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Mengirim...' : 'Konfirmasi'}
            </button>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Ingat password Anda?{' '}
                <Link href="/auth/login" className="text-purple-600 hover:text-purple-800 font-semibold transition">
                  Masuk di sini
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Success Message */}
        {step === 2 && (
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Email Terkirim!</h1>
              <p className="text-gray-600 mb-4">
                Kami telah mengirimkan link reset password ke
              </p>
              <p className="text-purple-600 font-semibold mb-4">{email}</p>
              <p className="text-sm text-gray-500">
                Silakan cek inbox atau folder spam email Anda. Link akan kadaluarsa dalam 1 jam.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Tidak menerima email?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Periksa folder spam atau junk mail</li>
                <li>• Pastikan email yang dimasukkan benar</li>
                <li>• Tunggu beberapa menit, email mungkin terlambat</li>
              </ul>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleSendEmail}
                disabled={loading}
                className="w-full border-2 border-purple-500 text-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Mengirim ulang...' : 'Kirim Ulang Email'}
              </button>
              
              <button
                onClick={() => setStep(3)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition"
              >
                Sudah Punya Kode? Reset Password
              </button>
            </div>

            <div className="mt-6 text-center">
              <Link href="/auth/login" className="flex items-center justify-center w-full text-gray-600 hover:text-gray-900 transition">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke halaman login
              </Link>
            </div>
          </div>
        )}

        {/* Step 3: Reset Password Form */}
        {step === 3 && (
          <div className="p-8">
            <button
              onClick={() => setStep(2)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition mb-6"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Kembali
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Buat Password Baru</h1>
              <p className="text-gray-600">
                Password baru harus berbeda dengan password sebelumnya
              </p>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Password Baru
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  placeholder="Minimal 8 karakter"
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Konfirmasi Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  placeholder="Ulangi password baru"
                />
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Password harus mengandung:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className={`flex items-center ${newPassword.length >= 8 ? 'text-green-600' : ''}`}>
                  <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}>
                    {newPassword.length >= 8 && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  Minimal 8 karakter
                </li>
                <li className={`flex items-center ${/[A-Z]/.test(newPassword) ? 'text-green-600' : ''}`}>
                  <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${/[A-Z]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}>
                    {/[A-Z]/.test(newPassword) && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  Huruf kapital (A-Z)
                </li>
                <li className={`flex items-center ${/[0-9]/.test(newPassword) ? 'text-green-600' : ''}`}>
                  <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${/[0-9]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}>
                    {/[0-9]/.test(newPassword) && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  Angka (0-9)
                </li>
              </ul>
            </div>

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Memproses...' : 'Reset Password'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}