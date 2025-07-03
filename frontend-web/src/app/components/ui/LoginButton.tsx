'use client';

import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import LoginModal from './LoginModal';

export default function LoginButton(): React.ReactElement {
  const t = useTranslations('loginButton');
  const [isOpen, setIsOpen] = useState(false);

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
