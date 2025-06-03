'use client';
import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLeafletMap } from './useLeafletMap';
import Sidebar from '@/app/components/ui/Sidebar';
import GeolocationButton from './GeolocationButton';
import 'leaflet/dist/leaflet.css';

type MapContainerProps = {
  locale: string;
};

const MapContainer = ({ locale }: MapContainerProps) => {
  const t = useTranslations('map');

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
