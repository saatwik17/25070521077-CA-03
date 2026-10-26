import React, { useState, useEffect } from 'react';
import { CTA } from '../components/CTA';
import { ArrowUpRight, CheckCircle2, ShieldCheck, Truck, Tag } from 'lucide-react';
import { servicesData } from '../data/services';

interface ServicesPageProps {
  onBookCall: (serviceName?: string) => void;
  navigate: (path: string) => void;
  initialTab?: 'hardware' | 'software';
  navKey?: number;
}

export const Services: React.FC<ServicesPageProps> = ({ onBookCall, navigate, initialTab, navKey }) => {
  const [activeTab, setActiveTab] = useState<'hardware' | 'software'>(initialTab || 'hardware');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
      const el = document.getElementById('service-tabs-section');
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [initialTab, navKey]);

  const handleTabChange = (tab: 'hardware' | 'software') => {
    setActiveTab(tab);
    window.history.replaceState({}, '', `/services/${tab}`);
  };

  const currentList = servicesData[activeTab];

  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark font-sans transition-colors duration-300">
      
      {/* 
         Header & Hero Section
      */}
      <div className="container mx-auto px-4 md:px-8 pt-32 pb-12">
        <div className="rounded-[3rem] p-8 md:p-12 lg:p-16 bg-white dark:bg-brand-card/30 relative">
            
            {/* Header Content */}
            <div className="text-center max-w-4xl mx-auto mb-12">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-8 text-brand-black dark:text-white font-sans tracking-tight">
                Explore Our Services
                </h1>
                <p className="text-brand-gray dark:text-gray-300 max-w-3xl mx-auto leading-relaxed text-lg font-light mb-8">
                Delivering customized, high-quality solutions that align with your business goals and drive measurable results. We offer end-to-end solutions that ensure efficiency, growth, and long-term success
                </p>
                {/* Pink Separator Line */}
                <div className="w-12 h-1 bg-[#EA4C89] mx-auto rounded-full"></div>
            </div>

            {/* Hero Image */}
            <div className="w-full rounded-[2rem] overflow-hidden shadow-2xl">
                <img 
                src="/assets/aistudio/WhatsApp_Image_2026-10-23_at_10.39.19_PM_e632a183.jpeg" 
                alt="Service Highlights" 
                className="w-full h-[300px] md:h-[500px] object-cover"
                />
            </div>
        </div>
      </div>

      {/* Sub Text */}
      <div id="service-tabs-section" className="container mx-auto px-4 md:px-8 text-center mb-12 scroll-mt-28">
        <p className="text-brand-gray dark:text-gray-300 max-w-3xl mx-auto text-lg font-light">
          At Ambitiouspedia Tech & Services, we are providing top-quality products from renowned manufacturers, ensuring performance, durability and compatibility.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-16 px-4">
        <div className="inline-flex border border-purple-300 dark:border-purple-900 rounded-lg p-1 bg-white dark:bg-brand-card">
          <button
            onClick={() => handleTabChange('hardware')}
            className={`px-6 py-2 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'hardware' 
                ? 'bg-[#bc61f5] text-white' 
                : 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/10'
            }`}
          >
            Hardware Services
          </button>
          <button
            onClick={() => handleTabChange('software')}
            className={`px-6 py-2 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'software' 
                ? 'bg-[#bc61f5] text-white' 
                : 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/10'
            }`}
          >
            Software Services
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-4 md:px-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentList.map((service: any) => {
             const IconComponent = service.icon;
             return (
                <div 
                  key={service.id} 
                  onClick={() => onBookCall(service.title)}
                  className="group cursor-pointer relative overflow-hidden bg-white dark:bg-brand-card rounded-2xl transition-all duration-300 flex flex-col h-full border border-gray-200 dark:border-gray-800 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-2xl hover:-translate-y-1"
                >
                   {/* Top Image Section */}
                   <div className="relative h-56 w-full overflow-hidden shrink-0">
                       <img 
                           src={service.image} 
                           alt={service.title} 
                           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                       />
                       {/* Subtle Overlay */}
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent transition-all duration-500"></div>
                       
                       {/* Floating Icon */}
                       <div className="absolute top-4 left-4 w-12 h-12 rounded-xl bg-white/95 dark:bg-brand-dark/95 backdrop-blur-sm flex items-center justify-center text-[#A020F0] shadow-md">
                           {IconComponent && <IconComponent size={24} />}
                       </div>

                       {/* Top-Right Price Badge */}
                       <div className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#EA4C89] to-[#A020F0] text-white text-xs font-bold tracking-wide shadow-lg flex items-center gap-1.5">
                           <Tag size={13} />
                           <span>Starts at {service.price}</span>
                       </div>

                       {/* Category Tag on Bottom Left of Image */}
                       <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                         <span className="text-[11px] uppercase tracking-widest font-semibold bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/15">
                           {activeTab === 'hardware' ? 'Enterprise Hardware' : 'Enterprise Software'}
                         </span>
                       </div>
                   </div>

                   {/* Content Section */}
                   <div className="p-6 md:p-7 flex flex-col flex-grow">
                       <div className="flex justify-between items-start mb-2.5">
                           <h3 className="text-xl font-bold text-brand-black dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                             {service.title}
                           </h3>
                           <ArrowUpRight className="text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors transform group-hover:translate-x-1 group-hover:-translate-y-1 shrink-0 ml-2" size={20} />
                       </div>
                       
                       {/* Short Summary */}
                       <p className="text-sm text-purple-700 dark:text-purple-300 font-medium leading-relaxed mb-3">
                         {service.description}
                       </p>

                       {/* Comprehensive Details */}
                       <p className="text-xs md:text-sm text-brand-gray dark:text-gray-300 leading-relaxed mb-5 font-light">
                         {service.details}
                       </p>

                       {/* Key Features & Included Specs */}
                       {Array.isArray(service.features) && service.features.length > 0 && (
                         <div className="mb-5 p-4 rounded-xl bg-purple-50/60 dark:bg-gray-900/60 border border-purple-100 dark:border-gray-800">
                           <p className="text-xs font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300 mb-2.5">
                             Included Specifications &amp; Features
                           </p>
                           <ul className="space-y-2">
                             {service.features.map((feat: string, i: number) => (
                               <li key={i} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                                 <CheckCircle2 size={14} className="text-[#A020F0] dark:text-purple-400 shrink-0 mt-0.5" />
                                 <span>{feat}</span>
                               </li>
                             ))}
                           </ul>
                         </div>
                       )}

                       {/* Warranty & Delivery Metadata */}
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5 text-xs">
                         {service.warranty && (
                           <div className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 border border-gray-200/70 dark:border-gray-700">
                             <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                             <span className="truncate font-medium" title={service.warranty}>{service.warranty}</span>
                           </div>
                         )}
                         {service.delivery && (
                           <div className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 border border-gray-200/70 dark:border-gray-700">
                             <Truck size={14} className="text-purple-600 dark:text-purple-400 shrink-0" />
                             <span className="truncate font-medium" title={service.delivery}>{service.delivery}</span>
                           </div>
                         )}
                       </div>

                       {/* Highlighted Price Box */}
                       <div className="mt-auto mb-4 p-3.5 rounded-xl bg-gradient-to-r from-purple-50 via-fuchsia-50 to-purple-50 dark:from-purple-950/40 dark:via-fuchsia-950/30 dark:to-purple-950/40 border border-purple-200 dark:border-purple-800/70 flex items-center justify-between">
                         <div>
                           <span className="block text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-300">
                             Estimated Pricing
                           </span>
                           <span className="text-xl md:text-2xl font-extrabold text-brand-black dark:text-white">
                             {service.price}
                           </span>
                           <span className="block text-[11px] text-gray-500 dark:text-gray-400">
                             {service.priceNote}
                           </span>
                         </div>
                         <span className="px-2.5 py-1 rounded-md bg-purple-600/10 dark:bg-purple-400/10 text-purple-700 dark:text-purple-300 text-xs font-semibold">
                           GST Invoice
                         </span>
                       </div>
                       
                       {/* Button */}
                       <button 
                         onClick={(e) => { e.stopPropagation(); onBookCall(`${service.title} (${service.price})`); }}
                         className="w-full py-3.5 bg-[linear-gradient(90deg,#C266E5_0%,#A74CE9_75%,#8C32EC_100%)] text-white rounded-xl font-semibold transition-all hover:opacity-95 hover:shadow-lg hover:shadow-purple-500/25 cursor-pointer"
                       >
                         Get a Service &amp; Book Now
                       </button>
                   </div>
                </div>
             );
          })}
          
          {/* Navigation Card (6th item) */}
          <div 
             onClick={() => handleTabChange(activeTab === 'hardware' ? 'software' : 'hardware')}
             className="relative rounded-2xl overflow-hidden h-full min-h-[400px] cursor-pointer group shadow-sm border border-gray-200 dark:border-gray-800"
          >
             <img 
               src={
                 activeTab === 'hardware'
                   ? '/assets/aistudio/WhatsApp_Image_2026-10-23_at_10.39.20_PM__2__a9662843.jpeg'
                   : '/assets/aistudio/WhatsApp_Image_2026-10-23_at_10.39.20_PM_dd66ca71.jpeg'
               } 
               alt="Explore Other" 
               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
             />
             {/* Updated overlay: Reduced opacity to bg-black/20 for clearer HD image */}
             <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center p-6 text-center">
                 <div className="flex items-center gap-2 text-white drop-shadow-md">
                    <span className="text-xl font-semibold">
                      Explore {activeTab === 'hardware' ? 'Software' : 'Hardware'} Services
                    </span>
                    <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                 </div>
             </div>
          </div>
        </div>
      </div>

      <CTA onBookCall={() => onBookCall()} navigate={navigate} />
    </div>
  );
};