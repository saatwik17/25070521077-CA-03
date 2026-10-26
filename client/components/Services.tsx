import React, { useState } from 'react';
import { servicesData } from '../data/services';
import { ArrowUpRight } from 'lucide-react';

interface ServicesProps {
    onGetService: (serviceName: string, category?: 'hardware' | 'software') => void;
    navigate: (path: string) => void;
    hideHeader?: boolean;
}

export const Services: React.FC<ServicesProps> = ({ onGetService, navigate, hideHeader = false }) => {
  const [activeTab, setActiveTab] = useState<'hardware' | 'software'>('hardware');

  return (
    <section id="services" className="py-12 md:py-20 bg-white dark:bg-brand-dark transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Header */}
        {!hideHeader && (
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-brand-black dark:text-white mb-4">
              Our Services
            </h2>
            <p className="text-brand-gray dark:text-gray-300 text-base md:text-lg font-light">
              At Ambitiouspedia Tech & Services, we are providing top-quality products from renowned manufactures, ensuring performance, durability and compatibility.
            </p>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex justify-center mb-10 md:mb-16">
          <div className="bg-white dark:bg-brand-card p-1.5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 inline-flex flex-wrap justify-center gap-2 md:gap-0">
            <button
              onClick={() => setActiveTab('hardware')}
              className={`px-6 md:px-8 py-2 md:py-3 text-sm md:text-base font-medium transition-all duration-300 rounded-md md:rounded-none ${
                activeTab === 'hardware' 
                  ? 'bg-purple-600 text-white shadow-sm border border-purple-600 md:rounded-l-md' 
                  : 'text-brand-gray dark:text-gray-300 hover:text-purple-600 border border-transparent'
              }`}
            >
              Hardware Services
            </button>
            <button
              onClick={() => setActiveTab('software')}
              className={`px-6 md:px-8 py-2 md:py-3 text-sm md:text-base font-medium transition-all duration-300 rounded-md md:rounded-none ${
                activeTab === 'software' 
                  ? 'bg-purple-600 text-white shadow-sm border border-purple-600 md:rounded-r-md' 
                  : 'text-brand-gray dark:text-gray-300 hover:text-purple-600 border border-transparent'
              }`}
            >
              Software Services
            </button>
          </div>
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 md:gap-8">
          {servicesData[activeTab].map((service: any, index: number) => {
            const linkHref = `/services/${activeTab}`;
            const IconComponent = service.icon;

            // Layout Logic (Applied to both Hardware and Software):
            // First 2 items: 50% width each (span 3 of 6 columns)
            // Next 3 items: 33% width each (span 2 of 6 columns)
            let colSpanClass = "";
            if (index < 2) {
                colSpanClass = "md:col-span-3";
            } else {
                colSpanClass = "md:col-span-2";
            }

            return (
              <div 
                key={service.id}
                onClick={() => navigate(linkHref)}
                className={`group cursor-pointer relative overflow-hidden bg-white dark:bg-brand-card p-6 md:p-8 rounded-xl transition-all duration-300 flex flex-col h-full border border-gray-200 dark:border-gray-800 hover:border-transparent hover:shadow-2xl ${colSpanClass}`}
              >
                {/* Background Image Always Visible */}
                <div className="absolute inset-0 z-0 opacity-100 transition-opacity duration-500">
                    <img 
                        src={service.image} 
                        alt={service.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-black/45 group-hover:bg-black/35 transition-colors duration-300"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                    {/* Top Row: Icon and Arrow */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#A020F0] flex items-center justify-center text-white shadow-md transition-colors duration-300 group-hover:bg-white group-hover:text-[#A020F0]">
                            {IconComponent && <IconComponent size={24} className="md:w-7 md:h-7" />}
                        </div>
                        <ArrowUpRight className="text-white transition-colors transform group-hover:translate-x-1 group-hover:-translate-y-1 drop-shadow-md" size={24} />
                    </div>

                    {/* Text Content */}
                    <div className="flex flex-col flex-grow">
                        <h3 className="text-lg md:text-xl font-semibold text-white mb-3 transition-colors drop-shadow-lg">
                          {service.title}
                        </h3>
                        <p className="text-white/90 text-sm leading-relaxed mb-6 line-clamp-3 font-light transition-colors drop-shadow-lg">
                           {service.description}
                        </p>
                    </div>
                    
                    {/* Button */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); onGetService(service.title, activeTab); }}
                      className="w-full py-3 bg-[linear-gradient(90deg,#C266E5_0%,#A74CE9_75%,#8C32EC_100%)] text-white rounded-lg font-medium transition-all shadow-md mt-auto group-hover:bg-none group-hover:bg-white group-hover:text-[#A020F0] group-hover:shadow-lg text-sm md:text-base"
                    >
                      Get a Service
                    </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};