'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { JSX } from 'react';

import { Section } from '../ui/Section';

export default function Footer(): JSX.Element {
  const t = useTranslations('footer');

  return (
    <Section>
      <motion.div
        className="flex justify-center gap-12"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-12 text-black"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          {t('title')}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <p className="text-gray-600">{t('legal')}</p>
          <p className="text-gray-600">{t('copyright')}</p>
        </motion.div>
      </motion.div>
    </Section>
  );
}
