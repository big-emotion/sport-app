import React from 'react';

import Advantages from '@/app/components/sections/Advantages';
import Faq from '@/app/components/sections/Faq';
import { Feature } from '@/app/components/sections/Feature';
import Footer from '@/app/components/sections/Footer';
import { Galerie } from '@/app/components/sections/Galerie';
import { Header } from '@/app/components/sections/Header';
import Newsletter from '@/app/components/sections/Newsletter';
import { Testimonial } from '@/app/components/sections/Testimonial';

export default async function Home(): Promise<React.ReactNode> {
  return (
    <div>
      <Header />
      <Feature />
      <Testimonial />
      <Galerie />
      <Advantages />
      <Newsletter />
      <Faq />
      <Footer />
    </div>
  );
}
