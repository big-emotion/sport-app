'use client';
import type * as L from 'leaflet';
import { useTranslations } from 'next-intl';
import { JSX, useRef } from 'react';

const GeolocationButton = ({
  map,
}: {
  map: L.Map | null;
}): JSX.Element | null => {
  const t = useTranslations('map');
  const markerRef = useRef<L.CircleMarker | null>(null);

  const handleClick = async () => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;
        const { default: L } = await import('leaflet');

        if (markerRef.current) {
          map?.removeLayer(markerRef.current);
        }

        const userMarker = L.circleMarker([latitude, longitude], {
          radius: 5,
          color: '#2563eb',
          fillColor: '#3b82f6',
          fillOpacity: 0.8,
        }).addTo(map!);

        markerRef.current = userMarker;
        map?.setView([latitude, longitude], 18);
      },
      () => alert(t('location'))
    );
  };

  return map ? (
    <button
      onClick={handleClick}
      className="absolute bottom-50 sm:bottom-25 right-3 bg-white shadow-md p-2 rounded-full hover:bg-gray-100 z-49"
      aria-label={t('center')}
    >
      📍
    </button>
  ) : null;
};

export default GeolocationButton;
