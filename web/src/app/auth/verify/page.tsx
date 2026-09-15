'use client';

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, ArrowRight, RotateCcw, AlertCircle } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

function VerifyContent() {
     const router = useRouter();
     const searchParams = useSearchParams();
     const emailFromUrl = searchParams.get('email');
     const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
     const [isLoading, setIsLoading] = useState(false);
     const [errorMessage, setErrorMessage] = useState('');
     const [successMessage, setSuccessMessage] = useState('');
     const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

     useEffect(() => {
          if (inputRefs.current[0]) {
               inputRefs.current[0].focus();
          }
     }, []);

     const handleChange = (index: number, value: string) => {
          if (value && !/^\d$/.test(value)) return;
          const newCode = [...code];
          newCode[index] = value;
          setCode(newCode);
          if (errorMessage) setErrorMessage('');

          if (value && index < 5) {
               inputRefs.current[index + 1]?.focus();
          }
     };

     const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Backspace' && !code[index] && index > 0) {
               inputRefs.current[index - 1]?.focus();
          }
     };

     const handlePaste = (e: React.ClipboardEvent) => {
          e.preventDefault();
          const pastedData = e.clipboardData.getData('text').slice(0, 6);
          if (!/^\d+$/.test(pastedData)) return;

          const newCode = [...code];
          pastedData.split('').forEach((char, index) => {
               if (index < 6) newCode[index] = char;
          });
          setCode(newCode);

          const lastIndex = Math.min(pastedData.length, 5);
          inputRefs.current[lastIndex]?.focus();
     };

     const handleVerify = async (e: React.FormEvent) => {
          e.preventDefault();
          setErrorMessage('');
          setSuccessMessage('');

          const verificationCode = code.join('');
          if (verificationCode.length < 6) {
               setErrorMessage('Silakan lengkapi 6 digit kode verifikasi');
               return;
          }

          if (!emailFromUrl) {
               setErrorMessage('Email tidak ditemukan. Silakan daftar ulang atau login.');
               return;
          }

          setIsLoading(true);

          try {
               const apiUrl = getApiUrl();
               const payload = {
                    email: emailFromUrl,
                    code: verificationCode
               };

               const response = await axios.post(`${apiUrl}/auth/verify`, payload);

               if (response.data.code === 200) {
                    router.push('/auth/login');
               } else {
                    setErrorMessage(response.data.message || 'Gagal memverifikasi akun');
               }

          } catch (error) {
               console.error('Verification error:', error);
               if (axios.isAxiosError(error)) {
                    setErrorMessage(error.response?.data?.message || 'Kode verifikasi salah atau kedaluwarsa');
               } else {
                    setErrorMessage('Terjadi kesalahan sistem');
               }
          } finally {
               setIsLoading(false);
          }
     };

     const handleResendCode = async () => {
          if (!emailFromUrl) {
               setErrorMessage('Email tidak ditemukan');
               return;
          }
          setErrorMessage('');
          setSuccessMessage('');

          try {
               const apiUrl = getApiUrl();
               await axios.post(`${apiUrl}/auth/forgot-password`, { email: emailFromUrl });
               setSuccessMessage('Kode verifikasi baru telah dikirim ke email Anda.');
          } catch (error) {
               setErrorMessage('Gagal mengirim ulang kode.');
          }
     };

     return (
          <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 lg:p-8">
               <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
                    <header className="text-center">
                         <Link href="/" className="inline-flex items-center gap-2 mb-6">
                              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md">
                                   S
                              </div>
                              <span className="font-extrabold text-lg tracking-tight text-slate-900">SkillLink</span>
                         </Link>

                         <div className="mx-auto w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mb-4 text-blue-600">
                              <ShieldCheck className="w-6 h-6" />
                         </div>
                         <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Verifikasi Email</h1>
                         <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                              Masukkan 6 digit kode verifikasi yang dikirim ke <br />
                              <span className="font-bold text-slate-800">{emailFromUrl || 'email Anda'}</span>
                         </p>
                    </header>

                    {errorMessage && (
                         <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-700 text-xs font-semibold animate-in fade-in">
                              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                              <span>{errorMessage}</span>
                         </div>
                    )}

                    {successMessage && (
                         <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-xs font-semibold animate-in fade-in">
                              <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                              <span>{successMessage}</span>
                         </div>
                    )}

                    <form onSubmit={handleVerify} className="space-y-6">
                         <div className="flex justify-center gap-2">
                              {code.map((digit, index) => (
                                   <input
                                        key={index}
                                        ref={(el) => { inputRefs.current[index] = el }}
                                        type="text"
                                        maxLength={1}
                                        inputMode="numeric"
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={handlePaste}
                                        className="w-11 h-12 text-center text-lg font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all"
                                   />
                              ))}
                         </div>

                         <button
                              type="submit"
                              disabled={isLoading}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm text-sm"
                         >
                              {isLoading ? (
                                   <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Memvalidasi...</span>
                                   </>
                              ) : (
                                   <>
                                        <span>Verifikasi Akun</span>
                                        <ArrowRight className="w-4 h-4" />
                                   </>
                              )}
                         </button>
                    </form>

                    <div className="pt-6 border-t border-slate-100 text-center space-y-2">
                         <p className="text-xs text-slate-500">
                              Tidak menerima kode verifikasi?
                         </p>
                         <button
                              onClick={handleResendCode}
                              type="button"
                              className="inline-flex items-center text-xs text-blue-600 font-bold hover:text-blue-700 transition-colors"
                         >
                              <RotateCcw className="w-3.5 h-3.5 mr-1" />
                              Kirim Ulang Kode
                         </button>
                    </div>
               </div>
          </main>
     );
}

export default function VerifyPage() {
     return (
          <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 text-sm">Memuat...</div>}>
               <VerifyContent />
          </Suspense>
     );
}