'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import React, { JSX, useCallback, useEffect, useState } from 'react';

import { SECTION_IDS } from '@/app/components/ui/Section-id';

export default function Navbar(): JSX.Element {
  const t = useTranslations('navbar');
  const [activeSection, setActiveSection] = useState<string | null>(null);

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
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <nav className="bg-white rounded-full shadow-lg flex justify-center items-center gap-4 px-6 py-2">
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
      </nav>
    </div>
  );
}
