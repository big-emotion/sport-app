'use client';
import { useEffect, useState } from 'react';

import MarkerIcon from '@/../public/images/marqueur.png';
import { fetchFromApi } from '@/lib/apiClient';
import { SportPlace, SportPlacesResponse } from '@/types/api';

export const useLeafletMap = (
  mapRef: React.RefObject<HTMLDivElement | null>,
  onMarkerClick: (content: string) => void,
  onMapClick: () => void
) => {
  const [map, setMap] = useState<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    const initMap = async () => {
      const { default: L } = await import('leaflet');
      const data = await fetchFromApi<SportPlacesResponse>(
        '/api/sport-places',
        'GET'
      );

      const leafletMap = L.map(mapRef.current!, { zoomControl: false }).setView(
        [48.8584, 2.2945],
        12
      );
      L.control.zoom({ position: 'bottomright' }).addTo(leafletMap);

      setTimeout(() => {
        const zoomEl = mapRef.current?.querySelector('.leaflet-control-zoom');
        if (zoomEl) {
          zoomEl.classList.add('custom-zoom-control');
        }
      }, 0);

      const icon = L.icon({
        iconUrl: MarkerIcon.src,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -27],
      });

      data.sportPlaces.forEach((venue: SportPlace) => {
        const content = `<div class="text-sm text-gray-800 font-semibold">
          <h3 class="text-lg font-bold mb-1">${venue.name}</h3>
          <p>${venue.description}</p>
          <p class="text-gray-600">${venue.address}</p>
        </div>`;

        const marker = L.marker([venue.latitude, venue.longitude], { icon })
          .addTo(leafletMap)
          .bindPopup(content, { closeButton: false });

        marker.on('mouseover', () => marker.openPopup());
        marker.on('mouseout', () => marker.closePopup());
        marker.on('click', () => onMarkerClick(content));
      });

      leafletMap.on('click', () => {
        onMapClick();
      });

      const style = process.env.NEXT_PUBLIC_MAPBOX_STYLE;
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      const attribution = process.env.NEXT_PUBLIC_MAPBOX_ATTRIBUTION;

      L.tileLayer(
        `https://api.mapbox.com/styles/v1/${style}/tiles/{z}/{x}/{y}?access_token=${token}`,
        {
          tileSize: 512,
          zoomOffset: -1,
          attribution,
        }
      ).addTo(leafletMap);

      setMap(leafletMap);
    };

    initMap();
  }, [mapRef]);

  return map;
};
