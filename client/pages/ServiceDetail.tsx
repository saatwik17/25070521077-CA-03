import React from 'react';
import { servicesData } from '../data/services';
import { Button } from '../components/Button';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { CTA } from '../components/CTA';

interface ServiceDetailProps {
  onBookCall: (serviceName: string) => void;
  category: string;
  id: string;
  navigate: (path: string) => void;
}

export const ServiceDetail: React.FC<ServiceDetailProps> = ({ onBookCall, category, id, navigate }) => {
  // Find the service data safely
  // Ensure category is a valid key, otherwise categoryData is undefined
  const categoryData = (servicesData as any)[category];
  const service = categoryData?.find((s: any) => s.id === id);

  // If service is not found, render a 404 state instead of auto-navigating to prevent loops
  if (!service) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-white dark:bg-brand-dark text-center px-4">
        <h1 className="text-3xl font-semibold text-brand-black dark:text-white mb-4">Service Not Found</h1>
        <p className="text-brand-gray dark:text-gray-400 mb-8 font-light">The service you are looking for does not exist.</p>
        <Button onClick={() => navigate('/services')}>View All Services</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark transition-colors duration-300">
      
      {/* Service Hero */}
      <div className="relative pt-32 pb-20 overflow-hidden bg-brand-light dark:bg-brand-darker">
         <div className="absolute top-0 right-0 w-full h-full opacity-10 dark:opacity-20 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
         </div>
         
         <div className="container mx-auto px-4 md:px-8 relative z-10">
            <div className="max-w-4xl">
               <span className="text-purple-600 dark:text-purple-400 font-semibold tracking-widest uppercase text-sm mb-4 block">
                 {category === 'hardware' ? 'Hardware Solutions' : 'Software Solutions'}
               </span>
               <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-brand-black dark:text-white mb-6 leading-tight">
                 {service.title}
               </h1>
               <p className="text-xl text-brand-gray dark:text-gray-300 leading-relaxed max-w-2xl mb-8 font-light">
                 {service.description}
               </p>
               <Button onClick={() => onBookCall(service.title)} className="px-8 py-4 text-lg">
                 Book Now
               </Button>
            </div>
         </div>
      </div>

      {/* Details Section */}
      <div className="py-20">
         <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
               
               <div className="flex-1 w-full perspective-1000">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl dark:shadow-purple-900/20 transform transition-transform duration-500 hover:rotate-y-3">
                     <img src={service.image} alt={service.title} className="w-full h-auto object-cover aspect-video" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
               </div>

               <div className="flex-1 space-y-8">
                  <h2 className="text-3xl font-semibold text-brand-black dark:text-white">Why Choose Our {service.title}?</h2>
                  <p className="text-lg text-brand-gray dark:text-gray-300 leading-relaxed font-light">
                    {service.details}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {service.features.map((feature: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-brand-card rounded-xl border border-gray-100 dark:border-gray-700">
                           <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                              <CheckCircle2 size={16} />
                           </div>
                           <span className="font-semibold text-brand-black dark:text-white">{feature}</span>
                        </div>
                     ))}
                  </div>

                  <div className="pt-4">
                    <Button variant="outline" onClick={() => onBookCall(service.title)}>
                      Get a Quote <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
               </div>

            </div>
         </div>
      </div>

      <CTA onBookCall={() => onBookCall(service.title)} navigate={navigate} />
    </div>
  );
};