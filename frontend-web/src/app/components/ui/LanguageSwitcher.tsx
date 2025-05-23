'use client';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('languageSwitcher');

  const locales = [
    { code: 'fr', label: t('fr') },
    { code: 'en', label: t('en') },
  ];

  const handleSwitch = (targetLocale: string) => {
    if (targetLocale === locale) return;

    router.push(pathname, { locale: targetLocale });
  };

  return (
    <div className="text-black text-sm space-x-1">
      {locales.map((lang, index) => (
        <span key={lang.code} className="inline">
          <button
            onClick={() => handleSwitch(lang.code)}
            className={`uppercase hover:underline transition-all duration-200 ${
              lang.code === locale ? 'font-bold' : 'font-normal'
            }`}
          >
            {lang.label}
          </button>
          {index < locales.length - 1 && <span className="px-1">/</span>}
        </span>
      ))}
    </div>
  );
}
