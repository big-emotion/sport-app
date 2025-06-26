'use client';

import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

import LoginModal from './LoginModal';

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export default function LoginButton(): React.ReactElement {
  const t = useTranslations('loginButton');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch {
        // Silent fail
      }
    }

    fetchUser();
  }, []);

  return (
    <>
      {user ? (
        <button
          onClick={() => alert(`Bienvenue ${user.firstName} !`)}
          className="px-4 py-2 bg-yellow-400 rounded hover:bg-yellow-500 text-black font-semibold"
        >
          {t('profil')}
        </button>
      ) : (
        <>
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-yellow-400 rounded hover:bg-yellow-500 text-black font-semibold"
          >
            {t('login')}
          </button>
          <LoginModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
      )}
    </>
  );
}
