'use client';

import dynamic from 'next/dynamic';
import React, { ReactElement } from 'react';

const Map = dynamic(() => import('../../components/sections/Map'), {
  ssr: false,
});

export default function MapInteractivePage(): ReactElement {
  return (
    <div>
      <Map />
    </div>
  );
}
