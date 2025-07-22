'use client';
import { JSX, useRef, useState } from 'react';

import AccountWidget from '@/app/components/ui/AccountWidget';
import SportModal from '@/app/components/ui/AddAdressModal';
import Sidebar from '@/app/components/ui/Sidebar';
import { SportPlace } from '@/types/api';

import GeolocationButton from './GeolocationButton';
import { useLeafletMap } from './useLeafletMap';

import 'leaflet/dist/leaflet.css';

const MapContainer = (): JSX.Element => {
  const mapRef = useRef<HTMLDivElement>(null);

  // ✅ Typage correct du contenu du panneau latéral
  const [sidebarContent, setSidebarContent] = useState<
    (SportPlace & { isNew?: boolean }) | null
  >(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // 🔹 Gestion des clics sur les marqueurs
  const map = useLeafletMap(
    mapRef,
    content => {
      setSidebarContent(content);
      setIsSidebarOpen(true);
    },
    () => {
      setSidebarContent(null);
      setIsSidebarOpen(false);
    }
  );

  return (
    <div>
      {/* Boutons en haut à droite */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <SportModal />
        <AccountWidget />
      </div>

      {/* Carte */}
      <div ref={mapRef} className="fixed inset-0 z-0 h-screen w-screen" />

      {/* Bouton géolocalisation */}
      <GeolocationButton map={map} />

      {/* Sidebar (ouverte seulement si nécessaire) */}
      {isSidebarOpen && sidebarContent && (
        <Sidebar
          content={sidebarContent}
          closeSidebar={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MapContainer;
