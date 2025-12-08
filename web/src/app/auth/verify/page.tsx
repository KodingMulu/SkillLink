'use client';

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, ArrowRight, RotateCcw } from "lucide-react";
import axios, { AxiosError } from "axios";

function VerifyContent() {
     const router = useRouter();
     const searchParams = useSearchParams();
     const emailFromUrl = searchParams.get('email');
     const [code, setCode] = useState<string[]>(['', '', '', '']);
     const [isLoading, setIsLoading] = useState(false);
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

          if (value && index < 3) {
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
          const pastedData = e.clipboardData.getData('text').slice(0, 4);
          if (!/^\d+$/.test(pastedData)) return;

          const newCode = [...code];
          pastedData.split('').forEach((char, index) => {
               if (index < 4) newCode[index] = char;
          });
          setCode(newCode);

          const lastIndex = Math.min(pastedData.length, 3);
          inputRefs.current[lastIndex]?.focus();
     };

     const handleVerify = async (e: React.FormEvent) => {
          e.preventDefault();

          const verificationCode = code.join('');
          if (verificationCode.length < 4) {
               alert('Silakan lengkapi kode verifikasi');
               return;
          }

          if (!emailFromUrl) {
               alert('Email tidak ditemukan. Silakan daftar ulang atau login.');
               return;
          }

          setIsLoading(true);

          try {
               const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

               const payload = {
                    email: emailFromUrl,
                    code: verificationCode
               };

               const response = await axios.post(`${apiUrl}/auth/verify`, payload); // Asumsi endpoint di backend folder Anda verify/route.ts atau auth/route.ts sesuaikan

               if (response.data.code === 200) {
                    alert('Verifikasi Berhasil! Silakan login.');
                    router.push('/auth/login');
               } else {
                    alert(`Gagal: ${response.data.message}`);
               }

          } catch (error) {
               console.error('Verification error:', error);
               if (axios.isAxiosError(error)) {
                    alert(error.response?.data?.message || 'Kode verifikasi salah atau kedaluwarsa');
               } else {
                    alert('Terjadi kesalahan sistem');
               }
          } finally {
               setIsLoading(false);
          }
     };

     const handleResendCode = () => {
          alert('Fitur kirim ulang kode akan segera hadir.');
     };

     return (
          <main className="relative min-h-screen bg-slate-50 flex items-center justify-center p-4 lg:p-8 overflow-hidden">
               <div aria-hidden="true" className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] pointer-events-none" />
               <div aria-hidden="true" className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-purple-400/20 rounded-full blur-[100px] pointer-events-none" />
               <section className="relative z-10 w-full max-w-[400px] bg-white/80 backdrop-blur-xl rounded-xl shadow-sm border border-slate-200 p-8">
                    <header className="mb-8 text-center">
                         <div className="mx-auto w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-blue-600/20">
                              <ShieldCheck className="w-6 h-6 text-white" />
                         </div>
                         <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Verifikasi Email</h1>
                         <p className="text-slate-500 text-sm mt-2">
                              Masukkan 4 digit kode yang dikirim ke <br />
                              <span className="font-medium text-slate-700">{emailFromUrl || 'email Anda'}</span>
                         </p>
                    </header>

                    <form onSubmit={handleVerify} className="space-y-6">
                         <div className="flex justify-between gap-2 px-2">
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
                                        className="w-14 h-14 sm:w-16 sm:h-16 text-center text-2xl font-bold bg-white border border-slate-300 rounded-xl text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:-translate-y-1 transition-all duration-200"
                                   />
                              ))}
                         </div>

                         <button
                              type="submit"
                              disabled={isLoading}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm shadow-blue-600/20 active:scale-[0.98]"
                         >
                              {isLoading ? (
                                   <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                         <p className="text-sm text-slate-600 mb-3">
                              Tidak menerima kode?
                         </p>
                         <button
                              onClick={handleResendCode}
                              type="button"
                              className="inline-flex items-center text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                         >
                              <RotateCcw className="w-4 h-4 mr-1.5" />
                              Kirim Ulang Kode
                         </button>
                    </div>
               </section>
          </main>
     );
}

export default function VerifyPage() {
     return (
          <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
               <VerifyContent />
          </Suspense>
     );
}