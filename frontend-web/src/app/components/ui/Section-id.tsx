// src/app/components/ui/Section-id.ts
export const SECTION_IDS = {
  HEADER: 'header',
  FEATURE: 'feature',
  TESTIMONIAL: 'testimonial',
  GALERIE: 'galerie',
  ADVANTAGES: 'advantages',
  NEWSLETTER: 'newsletter',
  FAQ: 'faq',
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];
