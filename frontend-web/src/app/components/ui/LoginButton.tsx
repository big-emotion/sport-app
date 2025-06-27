'use client';

import { useTranslations } from 'next-intl';
import React, { useEffect, useRef, useState } from 'react';

import { ClocheIcon, GridIcon, HeartIcon, LogoutIcon, UserIcon } from '@/app/components/ui/icons';

import LoginModal from './LoginModal';

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export default function LoginButton(): React.ReactElement {
  const t = useTranslations('loginButton');
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-yellow-400 rounded hover:bg-yellow-500 text-black font-semibold"
        >
          {t('login')}
        </button>
        <LoginModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen(prev => !prev)}
        className="w-10 h-10 bg-yellow-400 rounded hover:bg-yellow-500 flex items-center justify-center"
      >
        <span className="sr-only">{t('profil')}</span>
        <GridIcon />
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
          <ul className="py-1 text-sm text-black">
            <li>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex gap-2">
                <UserIcon />
                {t('profil')}
              </button>
            </li>
            <li>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex gap-2">
                <HeartIcon />
                {t('favorites')}
              </button>
            </li>
            <li>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex gap-2">
                <ClocheIcon />
                {t('notifications')}
              </button>
            </li>
            <li>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex gap-2">
                <LogoutIcon />
                {t('logout')}
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
