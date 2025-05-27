'use client';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

const GeolocationButton = ({ map }: { map: L.Map | null }) => {
  const t = useTranslations('map');
  const markerRef = useRef<L.CircleMarker | null>(null);

  const handleClick = async () => {
    if (!navigator.geolocation) return alert(t('geolocation'));

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;
        const { default: L } = await import('leaflet');

        if (markerRef.current) map?.removeLayer(markerRef.current);

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
      className="fixed right-3 bottom-[240px] sm:bottom-[80px] transform -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full hover:bg-gray-100"
      aria-label={t('center')}
    >
      📍
    </button>
  ) : null;
};

export default GeolocationButton;
