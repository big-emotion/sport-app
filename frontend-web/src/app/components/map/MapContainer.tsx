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

  const [sidebarContent, setSidebarContent] = useState<
    (SportPlace & { isNew?: boolean }) | null
  >(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

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
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <SportModal />
        <AccountWidget />
      </div>

      <div ref={mapRef} className="fixed inset-0 z-0 h-screen w-screen" />

      <GeolocationButton map={map} />

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
