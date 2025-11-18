'use client';

import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      console.log('Reset password request for:', email);
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  const handleBackToLogin = () => {
    // Navigate to login page
    console.log('Navigate to login');
  };

  const handleResendEmail = () => {
    setIsLoading(true);
    setTimeout(() => {
      console.log('Resend email to:', email);
      alert('Email telah dikirim ulang!');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {!isSuccess ? (
            <>
              <div className="text-center space-y-2">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Ingin Merubah Password?</h1>
                <p className="text-gray-500">
                  Jangan khawatir, kami akan mengirimkan instruksi reset password ke email Anda
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-600 focus:border-transparent transition"
                      placeholder="nama@email.com"
                      required
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading || !email}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Mengirim...
                    </span>
                  ) : (
                    'Kirim Link Reset Password'
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-800 py-2 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <Link href={'/auth/register'}>Daftar sekarang</Link>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center space-y-4">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Email Terkirim!</h1>
                <p className="text-gray-600">
                  Kami telah mengirimkan link reset password ke
                </p>
                <p className="text-blue-600 font-semibold text-lg">{email}</p>
                <p className="text-gray-500 text-sm">
                  Silakan cek inbox email Anda dan klik link yang diberikan untuk mengatur password baru
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">💡 Tips:</span> Jika email tidak muncul dalam beberapa menit, cek folder spam atau junk email Anda
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleResendEmail}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Mengirim...
                    </span>
                  ) : (
                    'Kirim Ulang Email'
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-800 py-2 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="font-medium">Kembali ke Login</span>
                </button>
              </div>
            </>
          )}

          <div className="pt-4 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Butuh bantuan?{' '}
              <button className="text-blue-600 hover:text-blue-700 font-semibold">
                Hubungi Support
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          © 2024 Your Company. All rights reserved.
        </p>
      </div>
    </div>
  );
}