'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import React, { JSX, useCallback, useEffect, useState } from 'react';

export default function Navbar(): JSX.Element {
  const t = useTranslations('navbar'); // Utilisation de la traduction pour la navbar
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = [
    { id: 'header', label: t('header') },
    { id: 'feature', label: t('features') },
    { id: 'testimonial', label: t('testimonials') },
    { id: 'galerie', label: t('gallery') },
    { id: 'advantages', label: t('advantage') },
    { id: 'newsletter', label: t('newsletter') },
    { id: 'faq', label: t('faq') },
  ];

  const scrollToSection = (id: string) => {
    // eslint-disable-next-line no-undef
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScroll = useCallback(() => {
    // eslint-disable-next-line no-undef
    const scrollPosition = window.scrollY + 150; // Ajusté pour la navbar haute
    for (const section of sections) {
      // eslint-disable-next-line no-undef
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
        // eslint-disable-next-line no-undef
        clearTimeout(timeout);
      }
      // eslint-disable-next-line no-undef
      timeout = window.setTimeout(() => {
        handleScroll();
      }, 100);
    };

    // eslint-disable-next-line no-undef
    window.addEventListener('scroll', onScroll);
    handleScroll(); // Active la section correcte au chargement

    return () => {
      // eslint-disable-next-line no-undef
      window.removeEventListener('scroll', onScroll);
      if (timeout !== null) {
        // eslint-disable-next-line no-undef
        clearTimeout(timeout);
      }
    };
  }, [handleScroll]);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white shadow-md rounded-full">
      <nav className="flex justify-center items-center gap-4 py-2 px-6 bg-white rounded-full shadow-lg">
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
                ? 'text-white bg-blue-600 shadow-md'
                : 'text-black hover:bg-blue-100'
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
      </nav>
    </div>
  );
}
