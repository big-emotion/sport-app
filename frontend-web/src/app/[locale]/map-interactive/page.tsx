import { notFound } from 'next/navigation';

import MapContainer from '@/app/components/map/MapContainer';

export default async function CarteInteractivePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (locale === 'fr') {
    return notFound();
  }

  return <MapContainer locale={locale} />;
}
