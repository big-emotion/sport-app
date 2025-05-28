import { notFound } from 'next/navigation';
import MapInteractive from '@/app/components/map/MapContainer';

export default async function LocalizedPage({
                                              params,
                                            }: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = await Promise.resolve(params);

  const isMap =
    (locale === 'fr' && slug === 'carte-interactive') ||
    (locale === 'en' && slug === 'map-interactive');

  if (isMap) {
    return <MapInteractive />;
  }

  return notFound();
}

