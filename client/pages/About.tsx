import React, { useState } from 'react';
import { CTA } from '../components/CTA';

interface PageProps {
  onBookCall: () => void;
  navigate: (path: string) => void;
}

export const About: React.FC<PageProps> = ({ onBookCall, navigate }) => {
  const [isStatsHovered, setIsStatsHovered] = useState(false);

  const initialStats = [
    { id: 1, value: '10+', label: 'Clients' },
    { id: 2, value: '00+', label: 'Hardware Services' },
    { id: 3, value: '01+', label: 'Software Services' },
    { id: 4, value: '24/7', label: 'Expert Support' },
  ];

  const hoverStats = [
    { id: 1, value: '50+', label: 'Clients' },
    { id: 2, value: '15+', label: 'Hardware Services' },
    { id: 3, value: '35+', label: 'Software Services' },
    { id: 4, value: '24/7', label: 'Expert Support' },
  ];

  const currentStats = isStatsHovered ? hoverStats : initialStats;

  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark transition-colors duration-300 font-sans text-brand-black dark:text-white">
      
      {/* 1. Header Section */}
      <div className="pt-32 pb-12 px-4 container mx-auto text-center">
         <h1 className="text-3xl md:text-5xl font-medium mb-8 max-w-4xl mx-auto leading-tight">
           Our Journey of Purpose and the Vision That Guides Us
         </h1>
         <p className="text-brand-gray dark:text-gray-300 max-w-4xl mx-auto leading-relaxed text-lg font-light">
           Through years of innovation, learning, and growth, our mission has remained constant to serve with excellence, lead with purpose, and create value that endures. Our journey has shaped not only who we are but also how we continue to make a difference every project and partnership.
         </p>
      </div>

      {/* 2. Hero Image */}
      <div className="container mx-auto px-4 md:px-8 mb-24">
         <div className="w-full h-[300px] md:h-[500px] rounded-3xl overflow-hidden shadow-lg">
           <img 
             src="/assets/aistudio/WhatsApp_Image_2026-10-23_at_10.39.18_PM_e5a8a292.jpeg" 
             alt="Team Collaboration" 
             className="w-full h-full object-cover"
           />
         </div>
      </div>

      {/* 3. Know About Us Section */}
      <div className="container mx-auto px-4 md:px-8 mb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
           {/* Text Content */}
           <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-brand-black dark:text-white mb-2">Know About Us</h2>
              
              <p className="text-lg text-brand-gray dark:text-gray-300 leading-relaxed font-light">
                Founded with a vision to bridge the technology gap for businesses and individuals, Ambitiouspedia Tech & Services has grown to be a trusted provider of high-quality IT solutions. We started small, driven by a passion for technology and a commitment to customer satisfaction. Over the years, we've expanded our offerings, built strong partnerships with leading brands, and honed our expertise in both hardware and software. Our journey is defined by continuous learning, adaptation, and a relentless pursuit of excellence.
              </p>
           </div>
           
           {/* Image Card */}
           <div className="relative rounded-2xl overflow-hidden h-[400px] shadow-xl group">
              <img 
                src="/assets/aistudio/WhatsApp_Image_2026-10-23_at_10.39.18_PM__1__1ea176d2.jpeg" 
                alt="Our Journey" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black/10 flex flex-col items-center justify-center text-center p-6 transition-colors duration-300 group-hover:bg-black/5">
                 <h3 className="text-3xl font-semibold text-white mb-2"></h3>
                 <p className="text-white/90 text-sm md:text-base font-medium max-w-xs">
                   
                 </p>
              </div>
           </div>
        </div>
      </div>

      {/* 4. Stats Section (New Banner Design) */}
      <div className="container mx-auto px-4 md:px-8 mb-24">
         <div 
            className={`group w-full rounded-2xl transition-all duration-500 ease-in-out cursor-default shadow-sm hover:shadow-xl ${
                isStatsHovered 
                ? 'bg-[#BF6CEB]' 
                : 'bg-[#F8F4F8] dark:bg-[#1E1E1E]'
            }`}
            onMouseEnter={() => setIsStatsHovered(true)}
            onMouseLeave={() => setIsStatsHovered(false)}
         >
            <div className="flex flex-col md:flex-row justify-between items-center py-12 md:py-16 px-4 md:px-24 gap-10 md:gap-0">
               {currentStats.map((stat) => (
                  <div key={stat.id} className="flex flex-col items-center justify-center gap-2 md:gap-4 text-center min-w-[150px]">
                     <span className={`text-5xl md:text-6xl font-medium transition-colors duration-300 leading-tight ${
                        isStatsHovered 
                            ? 'text-white' 
                            : 'text-[#8A0BD4] dark:text-[#BF6CEB]'
                     }`}>
                        {stat.value}
                     </span>
                     <span className={`text-xl md:text-2xl font-light transition-colors duration-300 leading-tight ${
                        isStatsHovered
                            ? 'text-white'
                            : 'text-[#515151] dark:text-gray-300'
                     }`}>
                        {stat.label}
                     </span>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* 5. Mission & Values Cards */}
      <div className="container mx-auto px-4 md:px-8 mb-24">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            
            {/* Card 1: Our Mission & Vision Image */}
            <div className="relative rounded-2xl overflow-hidden h-full min-h-[400px] shadow-lg group">
                <img 
                  src="/assets/aistudio/WhatsApp_Image_2026-10-23_at_10.39.18_PM__2__46662353.jpeg" 
                  alt="Our Mission"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center transition-colors duration-300 group-hover:bg-black/5">
                    <h3 className="text-2xl font-semibold text-white text-center px-4 leading-snug">
                    
                    </h3>
                </div>
            </div>

            {/* Card 2: Innovation */}
            <div className="bg-brand-light dark:bg-brand-card p-10 rounded-2xl flex flex-col items-start justify-between border border-transparent dark:border-gray-800 hover:shadow-lg transition-shadow h-full">
                <div>
                    <h3 className="text-3xl font-medium text-brand-black dark:text-white mb-6 tracking-tight">Innovation</h3>
                    <p className="text-lg text-brand-gray dark:text-gray-400 leading-relaxed font-light">
                       We embrace innovation as a core part of our identity — continuously researching, experimenting, and adopting new technologies that empower us to deliver exceptional results and lasting value.
                    </p>
                </div>
            </div>

            {/* Card 3: Customer Focus */}
            <div className="bg-brand-light dark:bg-brand-card p-10 rounded-2xl flex flex-col items-start justify-between border border-transparent dark:border-gray-800 hover:shadow-lg transition-shadow h-full">
                <div>
                    <h3 className="text-3xl font-medium text-brand-black dark:text-white mb-6 tracking-tight">Customer Focus</h3>
                    <p className="text-lg text-brand-gray dark:text-gray-400 leading-relaxed font-light">
                       We put our clients at the heart of everything we do understanding their goals, challenges, and aspirations to deliver tailored solutions that not only meet but consistently exceed expectations.
                    </p>
                </div>
            </div>

            {/* Card 4: Integrity */}
            <div className="bg-brand-light dark:bg-brand-card p-10 rounded-2xl flex flex-col items-start justify-between border border-transparent dark:border-gray-800 hover:shadow-lg transition-shadow h-full">
                <div>
                    <h3 className="text-3xl font-medium text-brand-black dark:text-white mb-6 tracking-tight">Integrity</h3>
                    <p className="text-lg text-brand-gray dark:text-gray-400 leading-relaxed font-light">
                       We believe that true success is built on a foundation of trust. That’s why we operate with complete honesty, transparency, and unwavering integrity in every action we take.
                    </p>
                </div>
            </div>

         </div>
      </div>
      
      <CTA onBookCall={onBookCall} navigate={navigate} />
    </div>
  );
};