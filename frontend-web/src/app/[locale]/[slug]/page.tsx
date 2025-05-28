import { notFound } from 'next/navigation';
import MapInteractive from '@/app/components/map/MapContainer';

type Props = {
  params: {
    locale: string;
    slug: string;
  };
};

export default function LocalizedPage({ params }: Props) {
  const { locale, slug } = params;

  const isMap =
    (locale === 'fr' && slug === 'carte-interactive') ||
    (locale === 'en' && slug === 'map-interactive');

  if (isMap) {
    return <MapInteractive />;
  }

  return notFound();
}
