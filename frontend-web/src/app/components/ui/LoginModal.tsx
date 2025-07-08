'use client';

import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { z } from 'zod';

import {
  AppleIcons,
  FacebookIcons,
  GoogleIcons,
} from '../../../../public/icons';

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function LoginModal({
  isOpen,
  onClose,
}: LoginModalProps): React.JSX.Element | null {
  const t = useTranslations('loginModal');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) {
    return null;
  }

  const loginSchema = z.object({
    email: z
      .string()
      .min(1, { message: t('error') })
      .email({ message: t('error') }),
    password: z.string().min(6, { message: t('passwordTooShort') }),
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      const firstError =
        Object.values(validation.error.formErrors.fieldErrors)[0]?.[0] ??
        t('loginError');
      setError(firstError);

      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message ?? 'Erreur inconnue');
      }

      onClose();
      window.location.reload();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('loginError'));
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4 text-black">{t('login')}</h2>

        <div className="space-y-3 mb-6">
          <button className="w-full flex items-center justify-center gap-2 border py-2 rounded hover:bg-gray-100 transition">
            <GoogleIcons />
            <span className="text-black font-medium">{t('google')}</span>
          </button>
          <button className="w-full flex items-center justify-center gap-2 border py-2 rounded hover:bg-gray-100 transition">
            <AppleIcons />
            <span className="text-black font-medium">{t('apple')}</span>
          </button>
          <button className="w-full flex items-center justify-center gap-2 border py-2 rounded hover:bg-gray-100 transition">
            <FacebookIcons />
            <span className="text-black font-medium">{t('facebook')}</span>
          </button>
        </div>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-gray-500 text-lg">{t('or')}</span>
          <div className="flex-grow border-t border-gray-300" />
        </div>

        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="email"
            className="w-full px-3 py-2 border text-black rounded focus:outline-none"
            placeholder={t('phoneOrEmail')}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full px-3 py-2 border text-black rounded focus:outline-none"
            placeholder={t('password')}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="w-full text-center text-sm text-blue-600 hover:underline"
            onClick={() => alert('Mot de passe oublié ?')}
          >
            {t('forgotPassword')}
          </button>

          {error != null && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-black py-2 rounded hover:bg-yellow-500 transition"
          >
            {loading ? t('loading') : t('login')}
          </button>
        </form>

        <div className="flex justify-center mt-8">
          <p className="text-sm text-black font-semibold">
            {t('account')}{' '}
            <span className="text-yellow-500 underline cursor-pointer">
              {t('sign')}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
