'use client';

import { setCookie } from 'cookies-next';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import { postToApi } from '@/lib/apiClient';

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
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === '') {
      setError('Veuillez saisir un email.');

      return;
    }
    setError(null);
    setShowPassword(true);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await postToApi<{
        token: string;
        user: {
          id: string;
          firstName: string;
          lastName: string;
          email: string;
        };
      }>('/api/auth/login', 'POST', { email, password });

      setCookie('token', data.token, {
        maxAge: 60 * 60 * 24,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
      });

      onClose();
      window.location.reload();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Erreur lors de la connexion'
      );
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

        {/* Boutons sociaux */}
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

        {/* Séparateur */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-gray-500 text-lg">{t('or')}</span>
          <div className="flex-grow border-t border-gray-300" />
        </div>

        {/* Formulaire */}
        <form
          onSubmit={showPassword ? handleLogin : handleNext}
          className="space-y-3"
        >
          <input
            type="email"
            className="w-full px-3 py-2 border text-black rounded focus:outline-none"
            placeholder={t('phoneOrEmail')}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          {!showPassword && (
            <button
              type="button"
              className="w-full px-3 py-2 border text-black rounded focus:outline-none hover:bg-gray-100 transition"
              onClick={() => alert('Mot de passe oublié ?')}
            >
              {t('forgotPassword')}
            </button>
          )}
          {showPassword && (
            <>
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
            </>
          )}

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-black py-2 rounded hover:bg-yellow-500 transition"
          >
            {loading ? t('loading') : showPassword ? t('login') : t('next')}
          </button>
        </form>

        {/* Pied de modal */}
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
