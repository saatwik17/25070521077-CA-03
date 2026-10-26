import React from 'react';
import { Hero } from '../components/Hero';
import { AboutUs } from '../components/AboutUs';
import { Services } from '../components/Services';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { Testimonials } from '../components/Testimonials';
import { CTA } from '../components/CTA';

interface HomeProps {
  onBookCall: (serviceName?: string, category?: 'hardware' | 'software') => void;
  navigate: (path: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onBookCall, navigate }) => {
  return (
    <>
      <Hero onBookCall={() => onBookCall()} navigate={navigate} />
      <AboutUs navigate={navigate} />
      <Services onGetService={(serviceName, category) => onBookCall(serviceName, category)} navigate={navigate} /> 
      <WhyChooseUs />
      <Testimonials />
      <CTA onBookCall={() => onBookCall()} navigate={navigate} />
    </>
  );
};