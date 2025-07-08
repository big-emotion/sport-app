'use client';

import { useEffect, useState } from 'react';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

type UseWithAuthReturn = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

export function useWithAuth(): UseWithAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          throw new Error('Not authenticated');
        }
        const data = await res.json();
        if (isMounted) {
          setUser(data);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
  };
}
