import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Star, Pause, Play, Quote } from 'lucide-react';

interface TestimonialItem {
  text: string;
  subText: string;
  author: string;
  role: string;
  category: string;
  rating: number;
}

const testimonials: TestimonialItem[] = [
  {
    text: "Delivered beyond Expectations",
    subText: "Ambitiouspedia gave our startup the digital face it needed. Their custom software platform scaled effortlessly and we've grown 3x since the launch!",
    author: "Sneha Reddy",
    role: "Founder of Healthlink",
    category: "Custom Software",
    rating: 5,
  },
  {
    text: "40% Productivity Boost Instantly",
    subText: "The enterprise workstations and laptops provided were top-notch. Pre-configured systems meant zero downtime for our 60-person engineering team.",
    author: "Vikram Malhotra",
    role: "CTO at FinEdge Analytics",
    category: "Laptops & Desktops",
    rating: 5,
  },
  {
    text: "Seamless Cloud Migration",
    subText: "Migrating our legacy database to AWS with Ambitiouspedia cut our monthly server bills by 35% while achieving 99.99% uptime.",
    author: "Ananya Iyer",
    role: "VP of Engineering, CloudNine Retail",
    category: "Cloud Solutions",
    rating: 5,
  },
  {
    text: "Best Custom Liquid-Cooled Rigs",
    subText: "Our 3D rendering studio needed extreme GPU workstations. Their custom builds run whisper-quiet under 24/7 heavy Unreal Engine workloads.",
    author: "Rohan Deshmukh",
    role: "Creative Director, PixelForge Studios",
    category: "Custom Builds",
    rating: 5,
  },
  {
    text: "Bulletproof Enterprise Security",
    subText: "After deploying their endpoint security and firewall suite across 150 devices, we passed our ISO 27001 audit on the very first attempt.",
    author: "Meera Krishnan",
    role: "CISO at SecurePay India",
    category: "Antivirus & Security",
    rating: 5,
  },
  {
    text: "ERP That Transformed Our Inventory",
    subText: "Their Business Management Software unified our billing, GST invoicing, and multi-warehouse inventory into one fast dashboard.",
    author: "Arjun Kapoor",
    role: "Managing Director, Apex Logistics",
    category: "Business Software",
    rating: 5,
  },
  {
    text: "Rock-Solid Server Room Setup",
    subText: "From rack servers to Cisco switches and UPS backup, the entire on-premise data center was commissioned in just 5 days.",
    author: "Karthik Nair",
    role: "IT Head, MedCare Hospitals",
    category: "Servers & Equipment",
    rating: 5,
  },
  {
    text: "Genuine Components for Our IoT Lab",
    subText: "Finding authentic microcontrollers and sensors in bulk was a nightmare until we partnered with Ambitiouspedia. 100% reliable supply chain.",
    author: "Dr. Priya Sharma",
    role: "Lead Researcher, RoboTech Labs",
    category: "Electronic Components",
    rating: 5,
  },
  {
    text: "Hassle-Free Microsoft 365 Licensing",
    subText: "Instant volume licensing and smooth email migration for 200+ employees without a single lost email. Outstanding technical support!",
    author: "Siddharth Verma",
    role: "Operations Head, Horizon EdTech",
    category: "OS & Office Suites",
    rating: 5,
  },
];

const bgImage = "/assets/aistudio/Property_1_Default__2__5d4513ad.png";

export const Testimonials: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [manualOffset, setManualOffset] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Duplicate list for seamless infinite loop
  const movingTestimonials = [...testimonials, ...testimonials];

  const handlePrev = () => {
    setManualOffset((prev) => prev + 380);
  };

  const handleNext = () => {
    setManualOffset((prev) => prev - 380);
  };

  useEffect(() => {
    if (manualOffset !== 0) {
      const timer = setTimeout(() => setManualOffset(0), 600);
      return () => clearTimeout(timer);
    }
  }, [manualOffset]);

  return (
    <section className="py-20 bg-white dark:bg-brand-dark transition-colors duration-300 overflow-hidden">
      <style>{`
        @keyframes testimonialMarquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @keyframes testimonialCardFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        .testimonial-marquee-track {
          display: flex;
          width: max-content;
          animation: testimonialMarquee 42s linear infinite;
        }
        .testimonial-marquee-track.paused {
          animation-play-state: paused;
        }
        .testimonial-card-3d {
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease;
          transform-style: preserve-3d;
        }
        .testimonial-card-3d:hover {
          transform: translateY(-10px) scale(1.02) rotateX(3deg) rotateY(-3deg);
          box-shadow: 0 25px 50px -12px rgba(160, 32, 240, 0.35);
        }
      `}</style>

      <div className="container mx-auto px-4 md:px-8">
        {/* Header Layout: Left Heading, Right Description + Arrows */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-14 gap-10 lg:gap-20">
          {/* Left: Heading */}
          <div className="lg:w-5/12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-[#A020F0] dark:text-purple-300 text-xs font-semibold mb-4">
              <span className="w-2 h-2 rounded-full bg-[#A020F0] animate-ping" />
              <span>Trusted by 500+ Businesses</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-brand-black dark:text-white leading-tight">
              What Clients Say <br /> About Us
            </h2>
          </div>

          {/* Right: Description & Navigation */}
          <div className="lg:w-7/12 flex flex-col items-start">
            <p className="text-brand-gray dark:text-gray-400 text-base md:text-lg leading-relaxed mb-8 font-light">
              We take pride in the trust our clients place in us. Every testimonial is a reflection of the value we create—helping businesses optimize operations, embrace innovation, and achieve measurable growth through smart hardware and software solutions.
            </p>

            <div className="flex items-center gap-4">
              <button
                onClick={handlePrev}
                aria-label="Previous testimonials"
                className="w-12 h-12 rounded-lg bg-[#A020F0] hover:bg-purple-700 text-white flex items-center justify-center transition-all duration-300 shadow-[0_4px_0_#6b21a8] hover:translate-y-[1px] active:translate-y-[3px] active:shadow-none"
              >
                <ArrowLeft size={22} />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next testimonials"
                className="w-12 h-12 rounded-lg bg-[#A020F0] hover:bg-purple-700 text-white flex items-center justify-center transition-all duration-300 shadow-[0_4px_0_#6b21a8] hover:translate-y-[1px] active:translate-y-[3px] active:shadow-none"
              >
                <ArrowRight size={22} />
              </button>
              <button
                onClick={() => setIsPaused((prev) => !prev)}
                aria-label={isPaused ? 'Play moving testimonials' : 'Pause moving testimonials'}
                className="px-4 h-12 rounded-lg border border-purple-300 dark:border-purple-700 text-brand-black dark:text-white hover:bg-purple-50 dark:hover:bg-purple-900/20 flex items-center gap-2 text-sm font-medium transition-all"
              >
                {isPaused ? <Play size={16} className="text-[#A020F0]" /> : <Pause size={16} className="text-[#A020F0]" />}
                <span>{isPaused ? 'Resume Motion' : 'Pause Motion'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Moving Marquee Stream */}
      <div
        ref={scrollContainerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative w-full py-4"
        style={{ perspective: '1200px' }}
      >
        {/* Left & Right Subtle Edge Fade Gradients */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-28 bg-gradient-to-r from-white dark:from-brand-dark to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-28 bg-gradient-to-l from-white dark:from-brand-dark to-transparent z-20" />

        <div
          style={{
            transform: manualOffset ? `translateX(${manualOffset}px)` : undefined,
            transition: manualOffset ? 'transform 0.5s ease-out' : undefined,
          }}
        >
          <div className={`testimonial-marquee-track gap-6 md:gap-8 px-4 ${isPaused ? 'paused' : ''}`}>
            {movingTestimonials.map((t, i) => (
              <div
                key={i}
                className="testimonial-card-3d w-[320px] sm:w-[370px] md:w-[410px] shrink-0 bg-brand-light dark:bg-brand-card p-7 md:p-9 rounded-2xl relative group border border-purple-100/80 dark:border-gray-800 overflow-hidden flex flex-col justify-between"
              >
                {/* Background Image Logic: Shown on hover */}
                <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <img
                    src={bgImage}
                    alt={t.author}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/55 to-purple-950/60" />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  {/* Top Bar: Category Badge & Stars */}
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/40 text-[#A020F0] dark:text-purple-300 group-hover:bg-white/20 group-hover:text-white transition-colors">
                      {t.category}
                    </span>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: t.rating }).map((_, idx) => (
                        <Star key={idx} size={14} fill="currentColor" />
                      ))}
                    </div>
                  </div>

                  {/* Quote Title */}
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <h4 className="text-xl md:text-2xl font-semibold text-brand-black dark:text-white group-hover:text-white transition-colors duration-300 leading-snug">
                      &ldquo;{t.text}&rdquo;
                    </h4>
                    <Quote
                      size={28}
                      className="text-purple-300 dark:text-purple-800 group-hover:text-purple-300 shrink-0 opacity-60"
                    />
                  </div>

                  {/* Review Body */}
                  <p className="text-brand-gray dark:text-gray-300 mb-8 text-sm md:text-base leading-relaxed font-light group-hover:text-gray-100 transition-colors duration-300">
                    {t.subText}
                  </p>

                  {/* Author Footer */}
                  <div className="mt-auto pt-4 border-t border-gray-200/70 dark:border-gray-700/60 group-hover:border-white/20 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C266E5] to-[#7e22ce] text-white font-bold flex items-center justify-center text-sm shadow-md shrink-0">
                      {t.author
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-base text-brand-black dark:text-white group-hover:text-white transition-colors duration-300">
                        {t.author}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-light group-hover:text-gray-200 transition-colors duration-300">
                        {t.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};