'use client';

import dynamic from 'next/dynamic';
import React, { ReactElement } from 'react';
import MapContainer from '@/app/components/map/MapContainer';

const Map = dynamic(() => import('../../components/sections/Map'), {
  ssr: false,
  loading: () => (
    <p className="text-center text-black text-4xl">Chargement de la carte...</p>
  ),
});

export default function MapInteractivePage(): ReactElement {
  return (
    <div>
      <MapContainer />
    </div>
  );
}
