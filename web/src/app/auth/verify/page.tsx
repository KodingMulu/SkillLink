'use client';
import { useState, useRef, KeyboardEvent } from "react";

interface VerifyCodeProps {
     backgroundImage?: string;
     backgroundColor?: string;
}

export default function VerifyCode({ backgroundImage, backgroundColor }: VerifyCodeProps) {
     // Ganti dengan path gambar background Anda
     const defaultBackground = '/images/bg.webp';
     
     const backgroundStyle = backgroundImage 
          ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }
          : backgroundColor 
               ? { backgroundColor: backgroundColor }
               : { backgroundImage: `url(${defaultBackground})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' };
     const [code, setCode] = useState<string[]>(['', '', '', '']);
     const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

     const handleChange = (index: number, value: string) => {
          // Hanya izinkan angka
          if (value && !/^\d$/.test(value)) return;

          const newCode = [...code];
          newCode[index] = value;
          setCode(newCode);

          // Auto focus ke input berikutnya
          if (value && index < 3) {
               inputRefs.current[index + 1]?.focus();
          }
     };

     const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
          // Jika backspace dan input kosong, pindah ke input sebelumnya
          if (e.key === 'Backspace' && !code[index] && index > 0) {
               inputRefs.current[index - 1]?.focus();
          }
     };

     const handlePaste = (e: React.ClipboardEvent) => {
          e.preventDefault();
          const pastedData = e.clipboardData.getData('text').slice(0, 4);
          
          // Hanya izinkan angka
          if (!/^\d+$/.test(pastedData)) return;

          const newCode = [...code];
          pastedData.split('').forEach((char, index) => {
               if (index < 4) {
                    newCode[index] = char;
               }
          });
          setCode(newCode);

          // Focus ke input terakhir yang terisi
          const lastIndex = Math.min(pastedData.length, 3);
          inputRefs.current[lastIndex]?.focus();
     };

     const handleVerify = () => {
          const verificationCode = code.join('');
          if (verificationCode.length === 4) {
               console.log('Kode verifikasi:', verificationCode);
               // Tambahkan logika verifikasi Anda di sini
               alert(`Kode verifikasi: ${verificationCode}`);
          } else {
               alert('Silakan isi semua kode verifikasi');
          }
     };

     const handleResendCode = () => {
          console.log('Kirim ulang kode');
          // Tambahkan logika kirim ulang kode di sini
          alert('Kode verifikasi telah dikirim ulang');
     };

     return (
          <div className="min-h-screen flex items-center justify-center p-4" style={backgroundStyle}>
               <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                    <div className="mb-6">
                         <div className="w-12 h-12 bg-teal-700 rounded-full flex items-center justify-center mx-auto mb-4">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                         </div>
                         <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Verifikasi Kode</h2>
                         <p className="text-center text-gray-600 text-sm">Masukkan 4 digit kode yang telah dikirim</p>
                    </div>

                    <div className="flex justify-center gap-3 mb-6">
                         {code.map((digit, index) => (
                              <input
                                   key={index}
                                   ref={(el) => {
                                        inputRefs.current[index] = el;
                                   }}
                                   type="text"
                                   inputMode="numeric"
                                   maxLength={1}
                                   value={digit}
                                   onChange={(e) => handleChange(index, e.target.value)}
                                   onKeyDown={(e) => handleKeyDown(index, e)}
                                   onPaste={handlePaste}
                                   className="w-16 h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-teal-700 focus:outline-none transition"
                              />
                         ))}
                    </div>

                    <button
                         onClick={handleVerify}
                         className="w-full bg-teal-700 text-white py-3 rounded-lg font-semibold hover:bg-teal-800 transition mb-4"
                    >
                         Verify
                    </button>

                    <div className="text-center">
                         <p className="text-gray-600 text-sm mb-2">Didn't receive the token?</p>
                         <button
                              onClick={handleResendCode}
                              className="text-teal-700 font-semibold hover:underline"
                         >
                              Resend code
                         </button>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                         <p className="text-sm text-gray-700 mb-2">
                              <strong>Memulihkan Akses ke Akun Dashlane Anda - Portal CCA</strong>
                         </p>
                         <p className="text-xs text-gray-600">
                              Gambar mungkin dilindungi hak cipta. <a href="#" className="text-blue-600 hover:underline">Pelajari Lebih Lanjut</a>
                         </p>
                    </div>

                    <div className="flex justify-center gap-4 mt-6">
                         <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                              </svg>
                              <span className="text-sm font-medium">Bagikan</span>
                         </button>
                         <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                              </svg>
                              <span className="text-sm font-medium">Simpan</span>
                         </button>
                    </div>
               </div>
          </div>
     );
}