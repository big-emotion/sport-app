'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import React, { JSX, useCallback, useEffect, useState } from 'react';

import { SECTION_IDS } from '@/app/components/ui/Section-id';

export default function Navbar(): JSX.Element {
  const t = useTranslations('navbar');
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const sections = [
    { id: SECTION_IDS.HEADER, label: t('header') },
    { id: SECTION_IDS.FEATURE, label: t('features') },
    { id: SECTION_IDS.TESTIMONIAL, label: t('testimonials') },
    { id: SECTION_IDS.GALERIE, label: t('gallery') },
    { id: SECTION_IDS.ADVANTAGES, label: t('advantage') },
    { id: SECTION_IDS.NEWSLETTER, label: t('newsletter') },
    { id: SECTION_IDS.FAQ, label: t('faq') },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setMenuOpen(false);
    }
  };

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + 150;
    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) {
        const offsetTop = element.offsetTop;
        const offsetHeight = element.offsetHeight;
        if (
          scrollPosition >= offsetTop &&
          scrollPosition < offsetTop + offsetHeight
        ) {
          setActiveSection(section.id);
          break;
        }
      }
    }
  }, [sections]);

  useEffect(() => {
    let timeout: number | null = null;

    const onScroll = () => {
      if (timeout !== null) {
        clearTimeout(timeout);
      }
      timeout = window.setTimeout(() => {
        handleScroll();
      }, 100);
    };

    window.addEventListener('scroll', onScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (timeout !== null) {
        clearTimeout(timeout);
      }
    };
  }, [handleScroll]);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white shadow-md rounded-full">
      <nav className="flex justify-center items-center gap-4 py-2 px-6">
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle menu"
          type="button"
        >
          <svg
            className="w-6 h-6 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        <div className="hidden md:flex justify-center items-center gap-4">
          {sections.map(section => (
            <motion.a
              key={section.id}
              href={`#${section.id}`}
              onClick={e => {
                e.preventDefault();
                scrollToSection(section.id);
              }}
              className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-all duration-300 ${
                activeSection === section.id
                  ? 'text-black bg-yellow-400 shadow-md'
                  : 'text-black hover:bg-yellow-400'
              }`}
              initial={{ opacity: 0 }}
              animate={{
                opacity: activeSection === section.id ? 1 : 0.8,
                scale: activeSection === section.id ? 1.1 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              {section.label}
            </motion.a>
          ))}
        </div>

        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-lg flex flex-col items-center w-56 py-2 z-50"
          >
            {sections.map(section => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={e => {
                  e.preventDefault();
                  scrollToSection(section.id);
                }}
                className={`block w-full px-4 py-2 text-center text-black font-semibold rounded-lg transition-colors duration-300 ${
                  activeSection === section.id
                    ? 'bg-yellow-400 shadow-md'
                    : 'hover:bg-yellow-400'
                }`}
              >
                {section.label}
              </a>
            ))}
          </motion.div>
        )}
      </nav>
    </div>
  );
}
