'use client';

import { motion, Variants } from 'framer-motion';
import { useTranslations } from 'next-intl';
import React, { JSX } from 'react';

import { FeatureCard } from '@/app/components/ui/FeatureCard';
import { Section } from '@/app/components/ui/Section';

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.5,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

interface FeatureEntry {
  titleKey: string;
  subtitleKey: string;
}

export function Feature(): JSX.Element {
  const t = useTranslations('features');

  const featureRows: FeatureEntry[][] = [
    [
      { titleKey: 'localisation', subtitleKey: 'subtitle_localisation' },
      { titleKey: 'sport', subtitleKey: 'subtitle_sport' },
    ],
    [
      { titleKey: 'share', subtitleKey: 'subtitle_share' },
      { titleKey: 'social', subtitleKey: 'subtitle_social' },
    ],
  ];

  return (
    <Section>
      <div className="flex flex-col">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center mb-12 text-black">
          {t('title')}
        </h2>

        <div className="flex flex-col justify-center items-center sm:gap-16 gap-8">
          {featureRows.map((row, rowIndex) => (
            <motion.div
              key={rowIndex}
              className="flex flex-col sm:flex-row justify-center items-stretch sm:gap-16 gap-8"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              {row.map((feature, index) => (
                <motion.div key={index} variants={item} className="h-full">
                  <FeatureCard
                    titleKey={feature.titleKey}
                    subtitleKey={feature.subtitleKey}
                  />
                </motion.div>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
