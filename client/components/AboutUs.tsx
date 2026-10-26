import React from 'react';
import { ArrowUpRight, Zap, Users, Shield } from 'lucide-react';
import { Button } from './Button';

export const AboutUs: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  
  const keyValues = [
    {
      id: '01',
      icon: <Zap size={28} />,
      title: 'Innovation',
      description: 'Constantly seeking and integrating the latest technological advancements.'
    },
    {
      id: '02',
      icon: <Users size={28} />,
      title: 'Customer Focus',
      description: 'Prioritizing client needs and delivering solutions that exceed expectations.'
    },
    {
      id: '03',
      icon: <Shield size={28} />,
      title: 'Integrity',
      description: 'Operating with honesty, transparency, and the highest ethical standards.'
    },
  ];

  return (
    <section id="about" className="py-20 bg-brand-light dark:bg-brand-dark transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Flex container for Side-by-Side layout on Large screens */}
        <div className="flex flex-col xl:flex-row gap-12 lg:gap-16 items-start">
            
            {/* Left Side: Text Content */}
            <div className="w-full xl:w-5/12 shrink-0 flex flex-col items-start xl:sticky xl:top-32">
                <div className="inline-block px-4 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 mb-8">
                   <span className="text-brand-gray dark:text-gray-400 text-xs font-medium uppercase tracking-wider">About Us</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-brand-black dark:text-white leading-tight mb-10">
                    We deliver cutting-edge IT solutions with <span className="text-[#bf5af2]">expertise</span> in <span className="text-[#bf5af2]">hardware and software</span>, driven by innovation and client success.
                </h2>
                
                <Button 
                    onClick={() => navigate('/about')} 
                    className="bg-[#bf5af2] hover:bg-[#a64ce0] text-white border-none px-8 py-3.5 rounded-xl shadow-lg hover:shadow-purple-500/20"
                >
                    Know more <ArrowUpRight className="ml-2 w-5 h-5" />
                </Button>
            </div>

            {/* Right Side: Cards Grid */}
            <div className="w-full xl:w-7/12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {keyValues.map((value) => (
                    <div 
                      key={value.id} 
                      className="bg-white dark:bg-brand-card p-6 lg:p-8 rounded-2xl shadow-sm border border-transparent dark:border-gray-800 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group flex flex-col justify-between min-h-[300px] md:min-h-[420px]"
                    >
                      <div className="flex flex-col h-full">
                        <p className="text-xs font-semibold text-gray-400 mb-10 uppercase tracking-widest">Key Values/{value.id}</p>
                        
                        <div className="mt-auto mb-auto">
                            <div className="w-14 h-14 bg-[#bf5af2] rounded-2xl flex items-center justify-center text-white mb-8 shadow-md group-hover:scale-110 transition-transform duration-500">
                                {value.icon}
                            </div>
                            
                            <h3 className="text-2xl font-medium text-brand-black dark:text-white mb-4">{value.title}</h3>
                            <p className="text-brand-gray dark:text-gray-400 leading-relaxed text-base font-light">
                                {value.description}
                            </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            </div>

        </div>

      </div>
    </section>
  );
};