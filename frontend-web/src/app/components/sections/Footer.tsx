'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { JSX } from 'react';
import { Section } from '../ui/Section';
import LanguageSwitcher from '../ui/LanguageSwitcher';

export default function Footer(): JSX.Element {
  const t = useTranslations('footer');

  return (
    <Section className="pt-6 pb-2 sm:pb-4">
      {' '}
      {/* padding haut/bas allégé */}
      <motion.div
        className="flex flex-col items-center gap-4 w-full"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Titre */}
        <motion.h2
          className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-1 text-black"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          {t('title')}
        </motion.h2>

        {/* Ligne de séparation */}
        <div className="w-full border-t border-gray-300" />

        {/* Pied de page */}
        <motion.div
          className="w-full pt-3 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Sélecteur de langue à gauche */}
          <div className="mb-2 sm:mb-0">
            <LanguageSwitcher />
          </div>

          {/* Mentions légales à droite */}
          <div>
            <p className="text-gray-600">
              {t('legal')} © {new Date().getFullYear()}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </Section>
  );
}
