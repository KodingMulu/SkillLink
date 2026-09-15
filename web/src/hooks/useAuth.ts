'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import { getApiUrl } from '@/lib/api';

interface User {
  id: string;
  email: string;
  role: string;
  username?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const apiUrl = getApiUrl();

        const res = await axios.get(`${apiUrl}/user/me`, {
          withCredentials: true,
        });

        setUser(res.data.user);
      } catch (error) {
        router.replace('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [router]);

  return { user, loading };
}