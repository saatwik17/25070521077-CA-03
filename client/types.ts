import { LucideIcon } from 'lucide-react';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon?: LucideIcon; 
  image: string;
  details: string;
  features: string[];
  action?: 'switch-to-software' | 'switch-to-hardware';
}

export interface Testimonial {
  id: number;
  text: string;
  author: string;
  role: string;
  company: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface KeyValue {
  id: string;
  number: string;
  title: string;
  description: string;
}