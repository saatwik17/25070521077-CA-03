import React from 'react';
import { Button } from './Button';

interface HeroProps {
  onBookCall: () => void;
  navigate: (path: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookCall, navigate }) => {
  
  const handleExploreServices = () => {
    navigate('/services');
  };

  return (
    <section id="home" className="relative min-h-[100dvh] md:min-h-[700px] md:h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
            {/* Updated Hero Image: Corporate team meeting with data analysis */}
            <img 
              src="/assets/aistudio/image_10b22688.png" 
              alt="Ambitious Pedia Team Strategy Meeting" 
              className="w-full h-full object-cover" 
            />
            {/* Dark Overlay - Reduced opacity to make image visible/HD, removed blur */}
            <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center pt-20 md:pt-0">
            <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 animate-in fade-in zoom-in duration-700">
              
              <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-white tracking-tight leading-[1.2] md:leading-[1.1]">
                Empower Your Business with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500 font-semibold">
                  Smart Technology Solutions
                </span>
              </h1>
              
              <p className="text-base md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed font-light opacity-90">
                We provide high-performance laptops, quality electronic components, and custom software tailored to your business needs.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center pt-6 md:pt-8">
                <Button 
                    onClick={handleExploreServices}
                    className="!bg-none !bg-transparent border border-white text-white hover:bg-white hover:text-brand-black px-6 py-3 md:px-8 md:py-4 text-sm md:text-base font-semibold rounded-lg shadow-none"
                >
                   Explore Services
                </Button>
                <Button 
                    onClick={onBookCall}
                    className="bg-[linear-gradient(90deg,#C266E5_0%,#A74CE9_75%,#8C32EC_100%)] hover:opacity-90 text-white border-transparent px-6 py-3 md:px-8 md:py-4 text-sm md:text-base font-semibold rounded-lg shadow-lg hover:shadow-purple-500/50"
                >
                  Book a call 
                </Button>
              </div>
            </div>
        </div>
    </section>
  );
};