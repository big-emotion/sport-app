'use client';

import { useTranslations } from 'next-intl';
import React, { useEffect, useRef, useState } from 'react';

import {
  ClocheIcon,
  GridIcon,
  HeartIcon,
  LogoutIcon,
  UserIcon,
} from '@/app/components/ui/icons';
import { User } from '@/utils/withAuth';

type Props = {
  user: User;
};

export default function UserMenu({ user }: Props): React.ReactElement {
  const t = useTranslations('loginButton');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex gap-2"
                onClick={() => alert(`Salut ${user.firstName} !`)}
              >
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
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex gap-2"
                onClick={async () => {
                  try {
                    const res = await fetch('/api/auth/logout', {
                      method: 'POST',
                    });
                    if (res.ok) {
                      window.location.reload();
                    }
                  } catch (err) {
                    console.error('Erreur lors de la déconnexion', err);
                  }
                }}
              >
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
