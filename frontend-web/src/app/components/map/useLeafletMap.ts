'use client';

import type * as L from 'leaflet';
import React, { useEffect, useState } from 'react';

import MarkerIcon from '@/../public/images/marqueur.png';
import { fetchFromApi } from '@/lib/apiClient';
import { SportPlace, SportPlacesResponse } from '@/types/api';

interface CustomMarker extends L.Marker {
  data?: SportPlace;
}

type MarkerClickHandler = (_venue: SportPlace) => void;

const reverseGeocodeWithMapbox = async (
  lat: number,
  lng: number
): Promise<string> => {
  const url = `${process.env.NEXT_PUBLIC_MAPBOX_URL}${lng},${lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return data.features?.[0]?.place_name ?? 'Adresse inconnue';
  } catch (error) {
    console.error('Erreur reverse geocoding :', error);

    return 'Adresse inconnue';
  }
};

export const useLeafletMap = (
  mapRef: React.RefObject<HTMLDivElement | null>,
  onMarkerClick: MarkerClickHandler,
  onMapClick: () => void
): L.Map | null => {
  const [map, setMap] = useState<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || map) {
      return;
    }

    const initMap = async () => {
      const { default: L } = await import('leaflet');
      const data = await fetchFromApi<SportPlacesResponse>(
        '/api/sport-places',
        'GET'
      );

      const leafletMap = L.map(mapRef.current!, {
        zoomControl: false,
        doubleClickZoom: false,
      });

      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          leafletMap.setView([latitude, longitude], 13);
        },
        () => {
          leafletMap.setView([48.8584, 2.2945], 12);
        }
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

      // 🔹 Affichage des markers existants
      data.sportPlaces.forEach((venue: SportPlace) => {
        if (
          typeof venue.latitude === 'number' &&
          typeof venue.longitude === 'number' &&
          !isNaN(venue.latitude) &&
          !isNaN(venue.longitude)
        ) {
          const marker: CustomMarker = L.marker(
            [venue.latitude, venue.longitude],
            { icon }
          ).addTo(leafletMap);

          marker.data = venue;

          marker.bindPopup(
            `<strong>${venue.name}</strong><br/><small>${venue.address ?? 'Adresse inconnue'}</small>`,
            {
              closeButton: false,
            }
          );

          marker.on('mouseover', () => marker.openPopup());
          marker.on('mouseout', () => marker.closePopup());

          marker.on('click', () => {
            if (marker.data) {
              onMarkerClick(marker.data);
            }
          });
        } else {
          console.warn(
            `Invalid coordinates for venue ${venue.name}:`,
            venue.latitude,
            venue.longitude
          );
        }
      });

      leafletMap.on('click', () => onMapClick());

      // 🔹 Double-clic pour créer un nouveau marker
      leafletMap.on('dblclick', async (e: L.LeafletMouseEvent) => {
        const lat = parseFloat(e.latlng.lat.toFixed(5));
        const lng = parseFloat(e.latlng.lng.toFixed(5));
        const address = await reverseGeocodeWithMapbox(lat, lng);

        const newPlace: SportPlace = {
          name: 'Nouveau lieu',
          description: '',
          address,
          latitude: lat,
          longitude: lng,
        };

        const newMarker: CustomMarker = L.marker([lat, lng], { icon }).addTo(
          leafletMap
        );
        newMarker.data = newPlace;

        newMarker.bindPopup(
          `<strong>${newPlace.name}</strong><br/><small>${newPlace.address ?? 'Adresse inconnue'}</small>`,
          {
            closeButton: false,
          }
        );

        // Ajout des événements mouseover et mouseout pour afficher la popup au survol
        newMarker.on('mouseover', () => newMarker.openPopup());
        newMarker.on('mouseout', () => newMarker.closePopup());

        newMarker.on('click', () => {
          if (newMarker.data) {
            onMarkerClick(newMarker.data);
          }
        });
      });

      const attribution = process.env.NEXT_PUBLIC_MAPBOX_ATTRIBUTION;

      L.tileLayer(
        `https://api.mapbox.com/styles/v1/${process.env.NEXT_PUBLIC_MAPBOX_STYLE}/tiles/{z}/{x}/{y}?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`,
        {
          tileSize: 512,
          zoomOffset: -1,
          attribution,
        }
      ).addTo(leafletMap);

      setMap(leafletMap);
    };

    initMap();
  }, [mapRef, map, onMapClick, onMarkerClick]);

  return map;
};
