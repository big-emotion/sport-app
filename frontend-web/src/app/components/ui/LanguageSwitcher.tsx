'use client';

import { useLocale, useTranslations } from 'next-intl';
import React from 'react';
import ReactCountryFlag from 'react-country-flag';

import { usePathname, useRouter } from '@/i18n/navigation';

interface LanguageSwitcherProps {
  className?: string;
  showFlags?: boolean;
}

export const LanguageSwitcher = ({
  className,
  showFlags,
}: LanguageSwitcherProps): React.ReactElement => {
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
          <button
            onClick={() => handleSwitch(lang.code)}
            className={
              showFlags
                ? `w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md border-2 transition-all duration-200
                    ${lang.code === locale ? 'border-yellow-400 scale-110' : 'border-transparent'}
                    hover:border-yellow-400 hover:scale-110`
                : `uppercase hover:underline transition-all duration-200 ${
                    lang.code === locale ? 'font-bold' : 'font-normal'
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
          {!showFlags && idx < locales.length - 1 && (
            <span className="text-gray-400 select-none">/</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
