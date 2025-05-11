'use client';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { JSX } from 'react';

import { Section } from '@/app/components/ui/Section';

export function Galerie(): JSX.Element {
  const t = useTranslations('gallery');

  return (
    <Section>
      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center mb-12 text-black">
        {t('title')}
      </h2>
      <div className=" flex flex-col lg:flex-row items-start gap-8  bg-white justify-center">
        <div className="flex items-end relative justify-center w-full lg:w-auto">
          <motion.div
            className="h-[300px] w-[140px] sm:h-[400px] sm:w-[175px] bg-yellow-400 z-10 rounded-2xl flex justify-center items-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            tel 1
          </motion.div>
          <motion.div
            className="h-[320px] w-[140px] sm:h-[500px] sm:w-[175px] bg-red-500 -translate-x-6 sm:-translate-x-10 z-20 rounded-2xl flex justify-center items-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            tel 2
          </motion.div>
        </div>

        <div className="flex items-end relative justify-center w-full lg:w-auto">
          <motion.div
            className="h-[350px] w-full sm:h-[500px] sm:w-[500px] bg-purple-600 rounded-2xl flex justify-center items-center z-10"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            ordi
          </motion.div>
          <motion.div
            className="h-[300px] w-[140px] sm:h-[400px] sm:w-[175px] bg-blue-400 rounded-2xl flex justify-center items-center z-20 -translate-x-10 translate-y-5 sm:-translate-x-30 sm:translate-y-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.8 }}
            viewport={{ once: true, amount: 0.1 }}
          >
            téléphone
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
