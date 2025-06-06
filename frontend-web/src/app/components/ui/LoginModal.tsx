'use client';
import { useTranslations } from 'next-intl';
import { AppleIcons, GoogleIcons, FacebookIcons } from '../../../../public/icons';

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const t = useTranslations('loginModal');
  if (!isOpen) return null;

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

        <form className="space-y-3">
          <div>
            <input
              type="text"
              className="w-full px-3 py-2 border text-black rounded focus:outline-none"
              placeholder={t('phoneOrEmail')}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 text-black py-2 rounded hover:bg-yellow-500 transition"
          >
            {t('next')}
          </button>

          <button
            type="submit"
            className="w-full bg-white text-black py-2 rounded border border-black hover:bg-gray-50 transition"
          >
            {t('password')}
          </button>
        </form>
        <div className="flex justify-center mt-8">
          <p className="text-sm text-black font-semibold">{t('account')} <span className="text-yellow-500 underline">{t('sign')}</span></p>
        </div>
      </div>
    </div>
  );
}
