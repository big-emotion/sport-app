import { useTranslations } from 'next-intl';
import { JSX } from 'react';

interface FeatureCardProps {
  titleKey: string;
  subtitleKey: string;
}

export function FeatureCard({
  titleKey,
  subtitleKey,
}: FeatureCardProps): JSX.Element {
  const t = useTranslations('features');

  return (
    <div
      className="bg-white rounded-3xl text-center flex flex-col
    items-center justify-center gap-3 py-12 px-6 h-full w-full
    max-w-[300px]"
    >
      <div className="bg-yellow-400 w-20 h-20">img</div>
      <h3 className="font-bold text-2xl text-black">{t(titleKey)}</h3>
      <p className="text-base text-gray-700">{t(subtitleKey)}</p>
    </div>
  );
}
