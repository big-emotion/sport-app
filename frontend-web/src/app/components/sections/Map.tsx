'use client';
import { JSX, useEffect, useRef, useState } from 'react';
import { SportPlace, SportPlacesResponse } from '@/types/api';

import Sidebar from '@/app/components/ui/Sidebar';
import 'leaflet/dist/leaflet.css';
import { fetchFromApi } from '@/lib/apiClient';
import MarkerIcon from '@/../public/images/marqueur.png';
import { useTranslations } from 'next-intl';

const Map = (): JSX.Element => {
  const t = useTranslations('map');
  const mapRef = useRef<HTMLDivElement>(null);
  const [sidebarContent, setSidebarContent] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [leafletMap, setLeafletMap] = useState<L.Map | null>(null);

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setSidebarContent(null);
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    const fetchDataAndInitMap = async () => {
      try {
        const data = await fetchFromApi<SportPlacesResponse>(
          '/api/sport_places',
          'GET'
        );
        const venues = data.member;

        const { default: L } = await import('leaflet');

        if (mapRef.current!.childElementCount > 0) return;

        const customIcon = L.icon({
          iconUrl: MarkerIcon.src,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -27],
        });

        const map = L.map(mapRef.current!, {
          zoomControl: false,
        }).setView([48.8584, 2.2945], 12);

        setLeafletMap(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        map.on('click', () => closeSidebar());

        venues.forEach((venue: SportPlace) => {
          const content = `<div class="text-sm text-gray-800 font-semibold">
              <h3 class="text-lg font-bold mb-1">${venue.name}</h3>
              <p>${venue.description}</p>
              <p class="text-gray-600">${venue.address}</p>
            </div>`;

          const marker = L.marker([venue.latitude, venue.longitude], {
            icon: customIcon,
          })
            .addTo(map)
            .bindPopup(content, {
              closeButton: false,
            });

          marker.on('mouseover', () => marker.openPopup());
          marker.on('mouseout', () => marker.closePopup());
          marker.on('click', () => {
            setSidebarContent(content);
            setIsSidebarOpen(true);
          });

          const style = process.env.NEXT_PUBLIC_MAPBOX_STYLE;
          const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
          const mapboxAttribution = process.env.NEXT_PUBLIC_MAPBOX_ATTRIBUTION;

          L.tileLayer(
            `https://api.mapbox.com/styles/v1/${style}/tiles/{z}/{x}/{y}?access_token=${token}`,
            {
              tileSize: 512,
              zoomOffset: -1,
              attribution: mapboxAttribution,
            }
          ).addTo(map);
        });
      } catch (error) {
        console.error('Erreur lors de l’init de la carte :', error);
      }
    };

    fetchDataAndInitMap();
  }, []);

  return (
    <div>
      <div ref={mapRef} className="fixed inset-0 z-0 h-screen w-screen" />

      {leafletMap && (
        <button
          onClick={() => {
            if (!navigator.geolocation) {
              alert(t('geolocation'));
              return;
            }
            navigator.geolocation.getCurrentPosition(
              position => {
                const { latitude, longitude } = position.coords;
                leafletMap.setView([latitude, longitude], 14);
              },
              () => {
                alert(t('location'));
              }
            );
          }}
          className="fixed right-3 bottom-20 transform -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full hover:bg-gray-100"
          aria-label={t('center')}
        >
          📍
        </button>
      )}

      {isSidebarOpen && (
        <Sidebar content={sidebarContent} closeSidebar={closeSidebar} />
      )}
    </div>
  );
};

export default Map;
