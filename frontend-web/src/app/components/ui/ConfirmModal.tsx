'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { JSX, useState } from 'react';

import { Button } from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
}: ConfirmModalProps): JSX.Element {
  const t = useTranslations('modal');
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
    onConfirm();
  };

  const handleClose = () => {
    setConfirmed(false);
    onCancel();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl w-full max-w-md text-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            {!confirmed ? (
              <>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-black">
                  {t('title')}
                </h2>
                <p className="text-gray-600 mb-6 text-sm md:text-base">
                  {t('subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    onClick={onCancel}
                    variant="secondary"
                    size="md"
                    className="w-full sm:w-auto"
                  >
                    {t('cancel')}
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    variant="primary"
                    size="md"
                    className="w-full sm:w-auto"
                  >
                    {t('confirm')}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl md:text-2xl font-semibold mb-4 text-black">
                  {t('confirm_title')}
                </h2>
                <p className="text-gray-600 mb-6 text-sm md:text-base">
                  {t('confirm_subtitle')}
                </p>
                <Button
                  onClick={handleClose}
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto"
                >
                  {t('close')}
                </Button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
