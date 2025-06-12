'use client';

import { useLocale, useTranslations } from 'next-intl';
import React from 'react';
import ReactCountryFlag from 'react-country-flag';

import { usePathname, useRouter } from '@/i18n/navigation';

const LanguageButton = ({
  lang,
  showFlags,
  isActive,
  onClick,
}: {
  lang: { code: string; label: string; flag: string; alt: string };
  showFlags: boolean;
  isActive: boolean;
  onClick: () => void;
}): React.ReactElement => (
  <button
    onClick={onClick}
    className={
      showFlags
        ? `w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md border-2 transition-all duration-200
            ${isActive ? 'border-yellow-400 scale-110' : 'border-transparent'}
            hover:border-yellow-400 hover:scale-110`
        : `uppercase hover:underline transition-all duration-200 ${
            isActive ? 'font-bold' : 'font-normal'
          }`
    }
    aria-label={lang.label}
  >
    {showFlags ? (
      <ReactCountryFlag
        countryCode={lang.flag}
        svg
        style={{
          width: '2em',
          height: '2em',
          borderRadius: '50%',
          verticalAlign: 'middle',
        }}
        title={lang.alt}
      />
    ) : (
      lang.label
    )}
  </button>
);

export const LanguageSwitcher = ({
  className,
  showFlags,
}: {
  className?: string;
  showFlags?: boolean;
}): React.ReactElement => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('languageSwitcher');

  const locales = [
    { code: 'fr', label: t('fr'), flag: 'FR', alt: 'Français' },
    { code: 'en', label: t('en'), flag: 'GB', alt: 'English' },
  ];

  const handleSwitch = (targetLocale: string) => {
    if (targetLocale === locale) {
      return;
    }
    router.push(pathname, { locale: targetLocale });
  };

  return (
    <div
      className={`${className ?? ''} text-black text-sm flex items-center gap-x-2`}
    >
      {locales.map((lang, idx) => (
        <React.Fragment key={lang.code}>
          <LanguageButton
            lang={lang}
            showFlags={showFlags ?? false}
            isActive={lang.code === locale}
            onClick={() => handleSwitch(lang.code)}
          />
          {(showFlags ?? false) && idx < locales.length - 1 && (
            <span className="text-gray-400 select-none">/</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
