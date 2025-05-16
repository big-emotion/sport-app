'use client';
import { JSX, useEffect, useRef, useState } from 'react';

import Sidebar from '@/app/components/ui/Sidebar';
import 'leaflet/dist/leaflet.css';

const Map = (): JSX.Element => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [sidebarContent, setSidebarContent] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setSidebarContent(null);
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    const fetchDataAndInitMap = async () => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const backendPort = process.env.NEXT_PUBLIC_BACKEND_PORT;

      const res = await fetch(`http://${backendUrl}:${backendPort}/api/sport_places`);
      const data = await res.json();

      const venues = data.member;
      const L = await import('leaflet');

      if (mapRef.current!.childElementCount > 0) return;

      const customIcon = L.icon({
        iconUrl: '/images/marqueur.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -27],
      });

      const map = L.map(mapRef.current!, {
        zoomControl: false,
      }).setView([48.8584, 2.2945], 12);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      map.on('click', () => closeSidebar());

      venues.forEach((venue: any) => {
        const content = `
  <div class="text-sm text-gray-800 font-semibold">
    <h3 class="text-lg font-bold mb-1">${venue.name}</h3>
    <p>${venue.description}</p>
    <p class="text-gray-600">${venue.address}</p>
  </div>
`;

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
      });

      L.tileLayer(
        'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZmFiaW8tYmlnLWVtb3Rpb24iLCJhIjoiY21hZHEzODF0MDNpZDJxczcwYmk0N3AzbiJ9.ptnGmBUgFPTJAEKU12fnWg',
        {
          tileSize: 512,
          zoomOffset: -1,
          attribution:
            '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © OpenStreetMap contributors',
        }
      ).addTo(map);
    };

    fetchDataAndInitMap();
  }, []);

  return (
    <div>
      <div ref={mapRef} className="fixed inset-0 z-0 h-screen w-screen" />
      {isSidebarOpen && (
        <Sidebar content={sidebarContent} closeSidebar={closeSidebar} />
      )}
    </div>
  );
};

export default Map;
