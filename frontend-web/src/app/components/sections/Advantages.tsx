'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { JSX } from 'react';

import { AccessItem } from '@/app/components/ui/AccessItem';
import { Section } from '@/app/components/ui/Section';

export default function Advantages(): JSX.Element {
  const t = useTranslations('advantage');

  const items = [
    {
      title: t('access_title'),
      subtitle: t('access_subtitle'),
      delay: 0.2,
      direction: -1,
    },
    {
      title: t('commu_title'),
      subtitle: t('commu_subtitle'),
      delay: 0.4,
      direction: 1,
    },
    {
      title: t('discovery_title'),
      subtitle: t('discovery_subtitle'),
      delay: 0.6,
      direction: -1,
    },
    {
      title: t('multisport_title'),
      subtitle: t('multisport_subtitle'),
      delay: 0.8,
      direction: 1,
    },
  ];

  return (
    <Section>
      <motion.h2
        className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center mb-12 text-black"
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        {t('title')}
      </motion.h2>

      <div className="flex flex-col sm:flex-row items-center justify-center">
        {[0, 1].map(col => (
          <div
            key={col}
            className="flex flex-col justify-center items-center gap-3 sm:gap-8"
          >
            {items
              .filter((_, idx) => idx % 2 === col)
              .map(({ title, subtitle, delay, direction }, idx) => (
                <motion.div
                  key={idx}
                  className="flex"
                  initial={{ opacity: 0, x: 50 * direction }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <AccessItem title={title} subtitle={subtitle} />
                </motion.div>
              ))}
          </div>
        ))}
      </div>
    </Section>
  );
}
