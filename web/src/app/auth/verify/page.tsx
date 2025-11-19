'use client';
import { useState, useRef, KeyboardEvent } from "react";

interface VerifyCodeProps {
     backgroundImage?: string;
     backgroundColor?: string;
}

export default function VerifyCode({ backgroundImage, backgroundColor }: VerifyCodeProps) {
     const defaultBackground = '/images/bg.webp';
     
     const backgroundStyle = backgroundImage 
          ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }
          : backgroundColor 
               ? { backgroundColor: backgroundColor }
               : { backgroundImage: `url(${defaultBackground})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' };
     
     const [code, setCode] = useState<string[]>(['', '', '', '']);
     const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

     const handleChange = (index: number, value: string) => {
          if (value && !/^\d$/.test(value)) return;
          const newCode = [...code];
          newCode[index] = value;
          setCode(newCode);
          if (value && index < 3) inputRefs.current[index + 1]?.focus();
     };

     const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
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

     const handleVerify = () => {
          const verificationCode = code.join('');
          if (verificationCode.length === 4) {
               alert(`Kode verifikasi: ${verificationCode}`);
          } else {
               alert('Silakan isi semua kode verifikasi');
          }
     };

     const handleResendCode = () => {
          alert('Kode verifikasi telah dikirim ulang');
     };

     return (
          <div className="min-h-screen flex items-center justify-center p-4" style={backgroundStyle}>
               
               {/* CARD HITAM GLOSSY */}
               <div className="bg-black/40 backdrop-blur-xl shadow-2xl rounded-2xl p-8 max-w-md w-full border border-white/10">
                    
                    <div className="mb-6">
                         <div className="w-14 h-14 bg-black/60 border border-gray-600 shadow-inner shadow-black/70 rounded-full flex items-center justify-center mx-auto mb-4">
                              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                         </div>

                         <h2 className="text-2xl font-bold text-center text-white mb-2">Verifikasi Kode</h2>
                         <p className="text-center text-gray-300 text-sm">Masukkan 4 digit kode yang telah dikirim</p>
                    </div>

                    {/* INPUT HITAM GLOSSY */}
                    <div className="flex justify-center gap-3 mb-6">
                         {code.map((digit, index) => (
                              <input
                                   key={index}
                                   ref={(el) => (inputRefs.current[index] = el)}
                                   type="text"
                                   maxLength={1}
                                   inputMode="numeric"
                                   value={digit}
                                   onChange={(e) => handleChange(index, e.target.value)}
                                   onKeyDown={(e) => handleKeyDown(index, e)}
                                   onPaste={handlePaste}
                                   className="
                                        w-16 h-16 text-center text-2xl font-bold 
                                        rounded-xl 
                                        bg-black/50 
                                        text-white 
                                        border border-gray-600 
                                        shadow-md shadow-black/50 
                                        focus:border-white focus:shadow-xl 
                                        transition-all duration-200
                                   "
                              />
                         ))}
                    </div>

                    {/* BUTTON GLOSSY */}
                    <button
                         onClick={handleVerify}
                         className="w-full bg-black/70 text-white py-3 rounded-lg font-semibold border border-gray-700 shadow-md shadow-black/70 hover:bg-black/90 transition"
                    >
                         Verify
                    </button>

                    <div className="text-center mt-4">
                         <p className="text-gray-300 text-sm mb-2">Tidak menerima kode?</p>
                         <button
                              onClick={handleResendCode}
                              className="text-blue-300 font-semibold hover:underline"
                         >
                              Kirim ulang kode
                         </button>
                    </div>

               </div>
          </div>
     );
}
