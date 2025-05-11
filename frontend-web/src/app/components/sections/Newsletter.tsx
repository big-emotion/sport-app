'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import React, { JSX, useState } from 'react';
import { z } from 'zod';

import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { Section } from '@/app/components/ui/Section';

import { Button } from '../ui/Button';

export default function Newsletter(): JSX.Element {
  const t = useTranslations('newsletter');

  const NewsletterSchema = z.object({
    email: z.string().email(t('invalid')),
  });

  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');

    const result = NewsletterSchema.safeParse({ email });

    if (!result.success) {
      const message = result.error.format().email?._errors[0];
      setError(message ?? 'Erreur inconnue');

      return;
    }

    setError(null);
    setIsModalOpen(true);
  };

  const confirmSubscription = () => {};

  const cancelSubscription = () => {
    setIsModalOpen(false);
  };

  return (
    <Section>
      <motion.h2
        className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center mb-12 text-black"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        viewport={{ once: true }}
      >
        {t('title')}
      </motion.h2>

      <div className="flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="w-full max-w-md bg-white flex flex-col gap-6"
        >
          <p className="text-lg text-gray-600 text-center">{t('subtitle')}</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <motion.input
              name="email"
              whileFocus={{ scale: 1.02 }}
              placeholder={t('placeholder')}
              required
              className="flex-1 px-6 py-3 rounded-lg border border-gray-300 focus:outline-none text-black"
            />
            {typeof error === 'string' && error.length > 0 && (
              <p className="text-sm text-red-500 px-2">{error}</p>
            )}
            <motion.div
              className="self-end"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className="py-3 px-5" type="submit" size="md">
                {t('button')}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={confirmSubscription}
        onCancel={cancelSubscription}
      />
    </Section>
  );
}
