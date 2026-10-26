import React from 'react';
import { Linkedin, X } from 'lucide-react';
import { servicesData } from '../data/services';
import { Logo } from './Logo';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  
  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    navigate(href);
  };

  return (
    <footer className="bg-[#18181b] text-white pt-20 pb-10 border-t border-gray-800 font-sans">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <div className="mb-6">
              <Logo light />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs font-light">
              Your trusted partner for comprehensive Hardware & Software solutions and services
            </p>
            
            <div className="pt-2">
                <h5 className="text-white text-base font-medium mb-4">Connect with us</h5>
                <div className="flex gap-4">
                  {/* X (Twitter) */}
                  <a href="#" className="w-9 h-9 bg-white text-black rounded flex items-center justify-center hover:bg-gray-200 transition-colors">
                     <X size={20} strokeWidth={2.5} />
                  </a>
                  {/* LinkedIn */}
                  <a href="#" className="w-9 h-9 bg-white text-black rounded flex items-center justify-center hover:bg-gray-200 transition-colors">
                     <Linkedin size={20} className="fill-current stroke-none" />
                  </a>
                </div>
            </div>
          </div>

          {/* Column 2: Hardware Services */}
          <div>
            <h4 className="text-lg font-semibold mb-8 text-white">
              <a
                href="/services/hardware"
                onClick={(e) => handleLinkClick(e, '/services/hardware')}
                className="hover:text-purple-400 transition-colors"
              >
                Hardware Services
              </a>
            </h4>
            <ul className="space-y-4 text-gray-400 text-sm font-light">
              {servicesData.hardware.slice(0, 5).map(service => {
                const href = '/services/hardware';
                return (
                  <li key={service.id}>
                    <a href={href} onClick={(e) => handleLinkClick(e, href)} className="hover:text-purple-400 hover:translate-x-1 transition-all inline-block">
                      {service.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 3: Software Services */}
          <div>
            <h4 className="text-lg font-semibold mb-8 text-white">
              <a
                href="/services/software"
                onClick={(e) => handleLinkClick(e, '/services/software')}
                className="hover:text-purple-400 transition-colors"
              >
                Software Services
              </a>
            </h4>
            <ul className="space-y-4 text-gray-400 text-sm font-light">
              {servicesData.software.slice(0, 5).map(service => {
                const href = '/services/software';
                return (
                  <li key={service.id}>
                    <a href={href} onClick={(e) => handleLinkClick(e, href)} className="hover:text-purple-400 hover:translate-x-1 transition-all inline-block">
                      {service.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 4: Company (Replaces Contact Us) */}
          <div>
            <h4 className="text-lg font-semibold mb-8 text-white">Company</h4>
            <ul className="space-y-4 text-gray-400 text-sm font-light">
                <li>
                    <a href="/about" onClick={(e) => handleLinkClick(e, '/about')} className="hover:text-purple-400 hover:translate-x-1 transition-all inline-block">
                      About Us
                    </a>
                </li>
                <li>
                    <a href="/services" onClick={(e) => handleLinkClick(e, '/services')} className="hover:text-purple-400 hover:translate-x-1 transition-all inline-block">
                      Service
                    </a>
                </li>
                <li>
                    <a href="/contact" onClick={(e) => handleLinkClick(e, '/contact')} className="hover:text-purple-400 hover:translate-x-1 transition-all inline-block">
                      Contact
                    </a>
                </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-light">
          <p>&copy; 2025 ambitiouspedia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};