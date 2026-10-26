import React from 'react';
import { Cpu, Lightbulb, HeadphonesIcon } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const features = [
    {
      id: '01',
      icon: <Cpu size={24} />,
      title: 'Premium Hardware',
      description: 'Reliable electronic components from leading brands to power your operations.',
      image: '/assets/aistudio/WhatsApp_Image_2026-10-23_at_10.39.19_PM__2__b28918a2.jpeg'
    },
    {
      id: '02',
      icon: <Lightbulb size={24} />,
      title: 'Innovative Software',
      description: 'Customized software solutions and essential applications to streamline your workflows.',
      image: '/assets/aistudio/why_keyboard.jpg'
    },
    {
      id: '03',
      icon: <HeadphonesIcon size={24} />,
      title: 'Expert Support',
      description: 'Dedicated support to ensure your technology runs smoothly and efficiently.',
      image: '/assets/aistudio/why_wire.jpg'
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-white dark:bg-brand-dark transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
           <h2 className="text-3xl md:text-4xl font-semibold text-brand-black dark:text-white mb-4">Why Choose Us</h2>
           <p className="text-brand-gray dark:text-gray-400 font-light text-base md:text-lg">
             At Ambitiouspedia, We combine innovation and expertise to deliver results that matter. Our team works alongside yours to deliver reliable systems.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature) => {
            const hasImage = !!feature.image;
            
            return (
              <div 
                key={feature.id} 
                className="bg-brand-light dark:bg-brand-card p-6 md:p-8 rounded-2xl border border-transparent dark:border-gray-800 hover:shadow-xl transition-all duration-300 group relative overflow-hidden flex flex-col h-full min-h-[280px] md:min-h-[300px]"
              >
                {/* Background Image Always Visible */}
                {hasImage && (
                  <div className="absolute inset-0 z-0 opacity-100 transition-opacity duration-500">
                      <img 
                          src={feature.image} 
                          alt={feature.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-black/45 group-hover:bg-black/35 transition-colors duration-300"></div>
                  </div>
                )}

                <div className="relative z-10 flex flex-col h-full">
                    <div className="mb-4 md:mb-6">
                       <span className={`text-4xl md:text-5xl font-light transition-colors duration-300 ${hasImage ? 'text-white/80 drop-shadow-md' : 'text-gray-300 dark:text-gray-700'}`}>
                          {feature.id}
                       </span>
                    </div>
                    
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 md:mb-6 transition-all duration-300 group-hover:scale-110 ${hasImage ? 'bg-white text-purple-600 shadow-md' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'}`}>
                      {feature.icon}
                    </div>
                    
                    <h3 className={`text-xl font-semibold mb-3 transition-colors duration-300 ${hasImage ? 'text-white drop-shadow-lg' : 'text-brand-black dark:text-white'}`}>
                      {feature.title}
                    </h3>
                    <p className={`text-sm leading-relaxed font-light transition-colors duration-300 ${hasImage ? 'text-white/90 drop-shadow-lg' : 'text-brand-gray dark:text-gray-400'}`}>
                      {feature.description}
                    </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};