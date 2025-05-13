'use client';
import React, { useState } from 'react';

interface SidebarProps {
  content: string | null;
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ content, closeSidebar }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

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
          <span className="sm:hidden inline">↑</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-0 w-full h-64 sm:left-0 sm:top-0 sm:w-96 sm:h-full bg-white shadow-lg p-4 z-10 transition-transform duration-300">
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-1/2 sm:top-1/2 sm:right-4 text-xl text-gray-500 hover:text-gray-700"
          >
            <span className="sm:inline hidden">←</span>
            <span className="sm:hidden inline">↓</span>
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
          <h2 className="text-xl text-black font-bold mb-4">Détails du Lieu</h2>
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
