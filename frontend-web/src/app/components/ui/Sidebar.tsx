'use client';
import { useTranslations } from 'next-intl';
import React, { useEffect, useRef, useState } from 'react';

interface SidebarProps {
  content: string | null;
  closeSidebar: () => void;
}

const INITIAL_SIDEBAR_HEIGHT = 256;
const MIN_SIDEBAR_HEIGHT = 150;
const CLOSED_SIDEBAR_HEIGHT = 0;
const MAX_SIDEBAR_HEIGHT_RATIO = 0.9;
const MOBILE_BREAKPOINT = 640;

const Sidebar: React.FC<SidebarProps> = ({ content, closeSidebar }) => {
  const t = useTranslations('sidebar');

  const [isOpen, setIsOpen] = useState(true);
  const [height, setHeight] = useState<number>(INITIAL_SIDEBAR_HEIGHT);
  const startY = useRef<number | null>(null);
  const startHeight = useRef<number>(INITIAL_SIDEBAR_HEIGHT);

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= MOBILE_BREAKPOINT) {
        setHeight(CLOSED_SIDEBAR_HEIGHT);
      } else if (height === CLOSED_SIDEBAR_HEIGHT) {
        setHeight(INITIAL_SIDEBAR_HEIGHT);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [height]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    startHeight.current = height;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY.current !== null) {
      const deltaY = startY.current - e.touches[0].clientY;
      const newHeight = Math.min(
        Math.max(startHeight.current + deltaY, MIN_SIDEBAR_HEIGHT),
        window.innerHeight * MAX_SIDEBAR_HEIGHT_RATIO
      );
      setHeight(newHeight);
    }
  };

  const handleTouchEnd = () => {
    startY.current = null;
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="
            fixed z-20 bg-white rounded-full shadow-md px-3 py-1 text-xl
            sm:top-1/2 sm:left-4 sm:-translate-y-1/2
            bottom-4 left-1/2 sm:translate-x-0 -translate-x-1/2
            text-gray-500 hover:text-gray-700
          "
        >
          <span className="sm:inline hidden">→</span>
        </button>
      )}

      {isOpen && (
        <div
          className={`
            fixed w-full sm:w-96 sm:h-full sm:left-0 sm:top-0
            bottom-0 bg-white shadow-lg p-4 z-10 transition-all duration-200
            sm:transition-none
          `}
          style={
            window.innerWidth < MOBILE_BREAKPOINT && height > CLOSED_SIDEBAR_HEIGHT
              ? { height: `${height}px` }
              : { height: '100%' }
          }
        >
          <div
            className="w-12 h-2 rounded-full bg-gray-400 mx-auto mb-4 sm:hidden touch-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />

          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-1/2 sm:top-1/2 sm:right-4 text-xl text-gray-500 hover:text-gray-700"
          >
            <span className="sm:inline hidden">←</span>
          </button>

          <button
            onClick={() => {
              closeSidebar();
              setIsOpen(false);
            }}
            className="absolute top-4 right-4 text-xl text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>

          <h2 className="text-xl text-black font-bold mb-4">{t('detail')}</h2>
          <div
            className="text-black overflow-y-auto h-full pr-2"
            dangerouslySetInnerHTML={{ __html: content ?? '' }}
          />
        </div>
      )}
    </>
  );
};

export default Sidebar;
