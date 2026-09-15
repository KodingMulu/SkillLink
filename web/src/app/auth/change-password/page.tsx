'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ChangePasswordPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/auth/forgot-password');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="text-slate-500 text-sm">Mengalihkan ke halaman reset password...</div>
    </div>
  );
}