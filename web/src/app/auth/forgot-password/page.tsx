'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mail, ArrowLeft, KeyRound, CheckCircle2, ArrowRight, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await axios.post(`${apiUrl}/auth/forgot-password`, { email });

      if (response.data.code === 200) {
        setStep(2);
      } else {
        alert(`Gagal: ${response.data.message}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || 'Email tidak ditemukan');
      } else {
        alert('Terjadi kesalahan server');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const codeValue = otp.join('');
    if (codeValue.length < 4) {
      alert('Masukkan 4 digit kode');
      return;
    }

    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await axios.post(`${apiUrl}/auth/verify-reset-code`, {
        email,
        code: codeValue
      });

      if (response.data.code === 200) {
        setStep(3);
      } else {
        alert(response.data.message);
      }

    } catch (error) {
      alert('Kode salah atau kadaluwarsa');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert('Password tidak cocok');
      return;
    }

    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await axios.post(`${apiUrl}/auth/change-password`, {
        email,
        password: passwords.new
      });

      if (response.data.code === 200) {
        alert('Password berhasil diubah! Silakan login.');
        router.push('/auth/login');
      } else {
        alert(response.data.message);
      }

    } catch (error) {
      alert('Gagal mengubah password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  return (
    <main className="relative min-h-screen bg-slate-50 flex items-center justify-center p-4 lg:p-8 overflow-hidden">
      <div aria-hidden="true" className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] pointer-events-none" />
      <div aria-hidden="true" className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-400/20 rounded-full blur-[100px] pointer-events-none" />
      <section className="relative z-10 w-full max-w-[400px] bg-white/80 backdrop-blur-xl rounded-xl shadow-sm border border-slate-200 p-8 transition-all duration-300">
        <header className="mb-8 text-center">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-blue-600/20">
            {step === 1 && <KeyRound className="w-6 h-6 text-white" />}
            {step === 2 && <Mail className="w-6 h-6 text-white" />}
            {step === 3 && <CheckCircle2 className="w-6 h-6 text-white" />}
          </div>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {step === 1 && 'Lupa Password?'}
            {step === 2 && 'Cek Email Anda'}
            {step === 3 && 'Password Baru'}
          </h1>

          <p className="text-slate-500 text-sm mt-2 px-2">
            {step === 1 && 'Masukkan email Anda untuk menerima kode reset.'}
            {step === 2 && `Kami telah mengirim kode 4 digit ke ${email}`}
            {step === 3 && 'Buat password baru yang aman untuk akun Anda.'}
          </p>
        </header>

        {step === 1 && (
          <form onSubmit={handleSendEmail} className="space-y-6">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-sm"
                  placeholder="nama@email.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm shadow-blue-600/20 active:scale-[0.98]"
            >
              {isLoading ? 'Mengirim...' : 'Kirim Kode'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div className="flex justify-between gap-2 px-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el }}
                  type="text"
                  maxLength={1}
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-14 h-14 sm:w-16 sm:h-16 text-center text-2xl font-bold bg-white border border-slate-300 rounded-xl text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:-translate-y-1 transition-all duration-200"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm shadow-blue-600/20 active:scale-[0.98]"
            >
              {isLoading ? 'Memverifikasi...' : 'Lanjut'}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-sm text-slate-500 hover:text-slate-800 transition-colors"
            >
              Salah email? Kembali
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Password Baru</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-sm"
                  placeholder="Minimal 8 karakter"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Konfirmasi Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-sm"
                  placeholder="Ulangi password"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="showPass"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-600 cursor-pointer"
              />
              <label htmlFor="showPass" className="text-sm text-slate-600 cursor-pointer">Tampilkan password</label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm shadow-blue-600/20 active:scale-[0.98]"
            >
              {isLoading ? 'Menyimpan...' : 'Reset Password'}
            </button>
          </form>
        )}

        {/* Footer Link */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center text-sm text-slate-600 font-medium hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Kembali ke Login
          </Link>
        </div>
      </section>
    </main>
  );
}