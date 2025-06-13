'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { postToApi } from '@/lib/apiClient';  // <- ici
import { setCookie } from 'cookies-next';

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const t = useTranslations('loginModal');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🧪 handleSubmit déclenché');
    setError(null);
    setLoading(true);

    try {
      const data = await postToApi<{
        token: string;
        user: { id: string; firstName: string; lastName: string; email: string };
      }>('/api/auth/login', 'POST', { email, password });

      console.log('✅ Authentification réussie :', data.user);

      setCookie('token', data.token, {
        maxAge: 60 * 60 * 24,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });

      onClose();
      window.location.reload();
    } catch (err: any) {
      console.error('❌ Échec de l’authentification :', err);
      setError(err.message || 'Erreur lors de la connexion');
    } finally {
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

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            className="w-full px-3 py-2 border text-black rounded focus:outline-none"
            placeholder={t('phoneOrEmail')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full px-3 py-2 border text-black rounded focus:outline-none"
            placeholder={t('password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-black py-2 rounded hover:bg-yellow-500 transition"
          >
            {loading ? t('loading') : t('login')}
          </button>
        </form>
      </div>
    </div>
  );
}
