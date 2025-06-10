import { notFound } from 'next/navigation';
import { JSX } from 'react';

import MapContainer from '@/app/components/map/MapContainer';

export default async function CarteInteractivePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<JSX.Element | null> {
  const { locale } = await params;

  if (locale === 'en') {
    notFound();

    return null;
  }

  return <MapContainer locale={locale} />;
}
