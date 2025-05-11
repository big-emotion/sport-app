'use client';

import { notFound, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { JSX, useEffect, useState } from 'react';

import { Button } from '@/app/components/ui/Button';

export default function ConfirmationPage(): JSX.Element | null {
  const t = useTranslations('confirmation');
  const searchParams = useSearchParams();
  const router = useRouter();
  const [valid, setValid] = useState<boolean | null>(null);

  useEffect(() => {
    const access = searchParams.get('access');
    if (access !== 'granted') {
      notFound();
    } else {
      setValid(true);
    }
  }, [searchParams]);

  if (valid === null) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-black gap-6 px-4 text-center">
      <h1 className="text-3xl font-bold">{t('title')}</h1>
      <Button variant="primary" size="md" onClick={() => router.push('/')}>
        {t('button')}
      </Button>
    </div>
  );
}
