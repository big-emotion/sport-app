'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React from 'react';

import { Button } from '../ui/Button';
import { Section } from '../ui/Section';

export function Header(): React.ReactElement {
  const t = useTranslations('header');

  return (
    <Section className="pt-24 lg:pt-32">
      <div className="relative">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold">Sport-App</h1>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <motion.div
            className="max-w-xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <motion.h2
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              {t('title')}
            </motion.h2>
            <motion.p
              className="mt-6 text-lg text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              {t('subtitle')}
            </motion.p>
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <Button size="lg">{t('cta')}</Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative lg:ml-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              type: 'spring',
              stiffness: 100,
            }}
          >
            <div className="relative w-full max-w-[366px] mx-auto">
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{
                  repeat: Infinity,
                  repeatType: 'reverse',
                  duration: 2,
                  ease: 'easeInOut',
                }}
              >
                <Image
                  src="/images/app-preview.png"
                  alt={t('app_preview_alt')}
                  width={350}
                  height={750}
                  priority
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
