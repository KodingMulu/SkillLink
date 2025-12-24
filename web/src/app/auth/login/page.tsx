'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await axios.post(`${apiUrl}/auth/login`, {
        email: formData.email,
        password: formData.password
      }, {
        withCredentials: true
      });

      if (response.data.code === 200) {
        const userRole = response.data.user.role;
        switch (userRole) {
          case 'ADMIN':
            router.push('/dashboard/admin');
            break;
          case 'CLIENT':
            router.push('/dashboard/client');
            break;
          case 'FREELANCER':
            router.push('/dashboard/freelancer');
            break;
          default:
            router.push('/'); 
            break;
        }
      } else {
        alert(`Login Gagal`);
      }

    } catch (error) {
      console.error('Login error:', error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || 'Email atau password salah');
      } else {
        alert('Terjadi kesalahan pada server');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-slate-50 flex items-center justify-center p-4 lg:p-8 overflow-hidden">
      <div aria-hidden="true" className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] pointer-events-none" />
      <div aria-hidden="true" className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-400/20 rounded-full blur-[100px] pointer-events-none" />
      <section className="relative z-10 w-full max-w-[400px] bg-white/80 backdrop-blur-xl rounded-xl shadow-sm border border-slate-200 p-8">
        <header className="mb-8 text-center">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-blue-600/20">
            <LogIn className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Selamat Datang</h1>
          <p className="text-slate-500 text-sm mt-2">Masuk ke akun Anda untuk melanjutkan</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email
            </label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-sm"
                placeholder="nama@email.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-sm"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-slate-100 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-slate-400" />
                ) : (
                  <Eye className="h-4 w-4 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-600 cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer select-none">
                Ingat saya
              </label>
            </div>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              Lupa password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm shadow-blue-600/20 active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <span>Masuk</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-600">
            Belum punya akun?{' '}
            <Link href={'/auth/register'} className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-all">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}