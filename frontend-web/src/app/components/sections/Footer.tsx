'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { JSX } from 'react';
import { Section } from '../ui/Section';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import { isMobile } from '@/utils/mobile';

export default function Footer(): JSX.Element {
  const t = useTranslations('footer');

  return (
    <footer>
      <Section className="pt-6 pb-2 sm:pb-4">
        <motion.div
          className="flex flex-col items-center gap-4 w-full"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="w-full border-t border-gray-300" />
          <motion.div
            className="w-full pt-3 flex md:flex-row justify-center md:justify-between items-center text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="flex flex-col md:flex-row md:flex-grow gap-2 md:gap-0 md:w-full md:justify-between">
              <LanguageSwitcher className="hidden md:flex" />
              <div className="font-bold text-xl text-gray-800">
                {t('copyright')} {t('title')}
              </div>
              <div className="text-gray-600">
                <p>{t('legal')}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Section>
    </footer>
  );
}
