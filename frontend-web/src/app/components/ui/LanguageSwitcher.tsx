'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const locales = [
    { code: 'en', label: 'ENGLISH' },
    { code: 'fr', label: 'FRANÇAIS' },
  ];

  const handleSwitch = (targetLocale: string) => {
    if (targetLocale === locale) return;

    const segments = pathname.split('/');
    segments[1] = targetLocale;
    const newPath = segments.join('/');
    router.push(newPath);
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
