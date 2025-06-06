'use client';
import { useRef, useState } from 'react';

import LoginButton from '@/app/components/ui/LoginButton';
import Sidebar from '@/app/components/ui/Sidebar';

import GeolocationButton from './GeolocationButton';
import { useLeafletMap } from './useLeafletMap';
import 'leaflet/dist/leaflet.css';

const MapContainer = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [sidebarContent, setSidebarContent] = useState<string | null>(null);
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
      <div className="fixed top-4 right-4 z-50">
        <LoginButton />
      </div>
      <div ref={mapRef} className="fixed inset-0 z-0 h-screen w-screen" />

      <GeolocationButton map={map} />

      {isSidebarOpen && (
        <Sidebar
          content={sidebarContent}
          closeSidebar={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MapContainer;
