'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { JSX, useState } from 'react';

import { Section } from '@/app/components/ui/Section';

interface FAQItem {
  questionKey: string;
  answerKey: string;
}

const faqData: FAQItem[] = [
  {
    questionKey: 'free',
    answerKey: 'free',
  },
  {
    questionKey: 'sports',
    answerKey: 'sports',
  },
  {
    questionKey: 'suggest',
    answerKey: 'suggest',
  },
  {
    questionKey: 'apps',
    answerKey: 'apps',
  },
];

export default function Faq(): JSX.Element {
  const t = useTranslations('faq');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section>
      <motion.h2
        className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center mb-12 text-black"
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {t('title')}
      </motion.h2>

      <div className="space-y-4 max-w-lg mx-auto">
        {faqData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="border-b overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left px-6 py-4 flex justify-between items-center bg-white text-black"
              >
                <span className="font-medium">
                  {t(`questions.${item.questionKey}`)}
                </span>
                <span>{openIndex === index ? '-' : '+'}</span>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4 }}
                    className="px-6 py-4 text-black overflow-hidden"
                  >
                    <div>{t(`answers.${item.answerKey}`)}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
