'use client';

import { JSX } from 'react';

interface AccessItemProps {
  title: string;
  subtitle: string;
}

export function AccessItem({ title, subtitle }: AccessItemProps): JSX.Element {
  return (
    <div className="w-[325px] p-4">
      <div className="flex">
        <div className="w-12 h-12 aspect-square bg-yellow-400 rounded-full mr-[24px]"></div>
        <div>
          <h3 className="text-lg font-bold text-black ">{title}</h3>
          <p className="text-gray-700">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
