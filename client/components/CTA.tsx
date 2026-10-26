import React from 'react';
import { Button } from './Button';

interface CTAProps {
  onBookCall: () => void;
  navigate?: (path: string) => void;
}

export const CTA: React.FC<CTAProps> = ({ onBookCall }) => {
  return (
    <section className="py-12 md:py-20 bg-white dark:bg-brand-dark transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8">
        <div className="group relative rounded-[1.75rem] md:rounded-[2rem] overflow-hidden bg-[#c06aec] px-6 py-16 md:py-24 text-center shadow-lg cursor-default transition-all duration-300 hover:shadow-xl">
          
          {/* Background Pattern matching uploaded Ready to Take design */}
          <div className="absolute inset-0 z-0 pointer-events-none">
             <img 
               src="/assets/aistudio/cta_pattern_bg.png" 
               alt="Background Pattern" 
               className="w-full h-full object-cover transition-transform duration-[2500ms] ease-in-out group-hover:scale-105" 
             />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl md:text-4xl lg:text-[44px] font-normal text-white mb-8 md:mb-10 tracking-tight leading-[1.25]">
              Ready to Take Your Business to the<br className="hidden md:block"/> Next Level?
            </h2>
            
            <Button 
              variant="white" 
              onClick={onBookCall} 
              className="px-7 py-3 md:px-8 md:py-3.5 text-base md:text-lg text-[#8A0BD4] font-normal rounded-lg bg-white hover:bg-white/95 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              Book a call
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};