import React, { useState, useEffect, useRef } from 'react';
import { X, Check, ChevronDown, Sparkles, PhoneCall } from 'lucide-react';
import { AuthUser } from '../pages/Login';

interface BookCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
  user?: AuthUser | null;
  onBookingCreated?: () => void;
}

export const BookCallModal: React.FC<BookCallModalProps> = ({
  isOpen,
  onClose,
  initialService = '',
  user,
  onBookingCreated,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });

  useEffect(() => {
    if (isOpen) {
      setPhoneError('');
      setFormData((prev) => ({
        ...prev,
        name: user?.name || prev.name || '',
        email: user?.email || prev.email || '',
        service: initialService || prev.service || '',
      }));
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isOpen, initialService, user]);

  if (!isOpen) return null;

  // Hardware-accelerated 60fps tilt using direct DOM ref + requestAnimationFrame (zero React re-renders)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (cardRef.current) {
        cardRef.current.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(0)`;
      }
    });
  };

  const handleMouseLeave = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: digitsOnly }));
      if (phoneError && digitsOnly.length === 10) {
        setPhoneError('');
      }
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(formData.phone)) {
      setPhoneError('Phone number must be exactly 10 digits.');
      return;
    }
    setPhoneError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: user?.id || null,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setPhoneError(errData.error || 'Failed to submit booking. Please check your details.');
        setSubmitting(false);
        return;
      }
      if (onBookingCreated) {
        onBookingCreated();
      }
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
        setFormData({
          name: user?.name || '',
          email: user?.email || '',
          phone: '',
          service: '',
          message: '',
        });
      }, 2500);
    } catch (err) {
      console.error('Failed to store booking:', err);
      setPhoneError('Network error while saving booking. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5">
      <style>{`
        @keyframes smoothFloat3D {
          0%, 100% {
            transform: translate3d(0, 0px, 0);
          }
          50% {
            transform: translate3d(0, -8px, 0);
          }
        }
        @keyframes shineSweepSmooth {
          0% { transform: translate3d(-120%, 0, 0) skewX(-20deg); }
          100% { transform: translate3d(240%, 0, 0) skewX(-20deg); }
        }
        .book-modal-float-outer {
          animation: smoothFloat3D 4.5s ease-in-out infinite;
          will-change: transform;
        }
        .book-modal-tilt-inner {
          transition: transform 0.15s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform;
          transform: perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0);
        }
        .shine-effect-smooth::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 40%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.32), transparent);
          animation: shineSweepSmooth 3.5s ease-in-out infinite;
          will-change: transform;
          pointer-events: none;
        }
      `}</style>

      {/* Lightweight GPU-friendly Backdrop */}
      <div
        className="absolute inset-0 bg-black/65 transition-opacity"
        onClick={onClose}
      />

      {/* Outer Wrapper handles vertical 3D floating (never conflicts with inner tilt) */}
      <div className="relative w-full max-w-2xl book-modal-float-outer z-10">
        {/* Inner Wrapper handles smooth 60fps mouse tilt via ref */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="book-modal-tilt-inner p-[3px] rounded-2xl bg-gradient-to-r from-[#C266E5] via-[#9333EA] to-[#EC4899] shadow-[0_20px_50px_rgba(160,32,240,0.45)]"
        >
          {/* Modal Content */}
          <div className="relative bg-white dark:bg-brand-card rounded-[14px] w-full overflow-hidden font-sans flex flex-col max-h-[90dvh]">
            {/* Header - 3D Purple Gradient Background with Moving Shine & Close Button */}
            <div className="relative overflow-hidden shine-effect-smooth bg-gradient-to-r from-[#B845E8] via-[#C266E5] to-[#9333EA] px-5 py-4 md:px-7 md:py-5 flex justify-between items-start shrink-0 border-b-4 border-purple-700/40">
              <div className="relative z-10 max-w-[85%]">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-medium mb-1.5">
                  <Sparkles size={12} />
                  <span>24-Hour Priority Response</span>
                </div>
                <h3 className="text-lg md:text-2xl font-bold text-white leading-snug drop-shadow-sm">
                  Ready for a Tech Upgrade? Schedule Your Call Now
                </h3>
              </div>

              <button
                onClick={onClose}
                className="relative z-10 bg-white hover:bg-gray-100 text-brand-black p-2 rounded-lg transition-transform duration-150 shadow-[0_4px_0_#d1d5db] active:translate-y-[3px] active:shadow-none"
                aria-label="Close modal"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 md:p-6 overflow-y-auto space-y-4">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 mb-1 shadow-md">
                    <Check size={34} />
                  </div>
                  <h4 className="text-2xl font-bold text-brand-black dark:text-white">
                    Request Sent!
                  </h4>
                  <p className="text-brand-gray dark:text-gray-400 font-light max-w-sm">
                    Your booking has been saved to our database. We will get back to you shortly to confirm the schedule.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-[#515151] dark:text-gray-300 text-sm md:text-base font-light">
                    Fill out the form below and we&apos;ll respond within 24 hours.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-3.5 md:space-y-4">
                    {/* Row 1: Name & Email ID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 md:gap-4">
                      <div className="space-y-1">
                        <label className="text-xs md:text-sm font-bold text-brand-black dark:text-white block">
                          Name
                        </label>
                        <input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          type="text"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-brand-dark dark:text-white focus:bg-white focus:border-[#C266E5] focus:ring-2 focus:ring-[#C266E5]/25 outline-none transition-colors placeholder-gray-400 text-sm"
                          placeholder="John"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs md:text-sm font-bold text-brand-black dark:text-white block">
                          Email ID
                        </label>
                        <input
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          type="email"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-brand-dark dark:text-white focus:bg-white focus:border-[#C266E5] focus:ring-2 focus:ring-[#C266E5]/25 outline-none transition-colors placeholder-gray-400 text-sm"
                          placeholder="johnabc@gmail.com"
                        />
                      </div>
                    </div>

                    {/* Phone Number - Full Width */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs md:text-sm font-bold text-brand-black dark:text-white block">
                          Phone Number <span className="text-xs font-normal text-gray-500">(10 digits)</span>
                        </label>
                        <span
                          className={`text-xs font-mono tabular-nums ${
                            formData.phone.length === 10
                              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                              : 'text-gray-400 dark:text-gray-500'
                          }`}
                        >
                          {formData.phone.length}/10
                        </span>
                      </div>
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        minLength={10}
                        pattern="[0-9]{10}"
                        title="Please enter a valid 10-digit phone number"
                        className={`w-full px-3.5 py-2.5 rounded-lg border ${
                          phoneError
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/25'
                            : 'border-gray-300 dark:border-gray-600 focus:border-[#C266E5] focus:ring-[#C266E5]/25'
                        } bg-gray-50 dark:bg-brand-dark dark:text-white focus:bg-white focus:ring-2 outline-none transition-colors placeholder-gray-400 text-sm font-mono tabular-nums`}
                        placeholder="9877654789"
                      />
                      {phoneError && (
                        <p className="text-xs text-red-600 dark:text-red-400 font-medium pt-0.5">
                          {phoneError}
                        </p>
                      )}
                    </div>

                    {/* Service Needed - Full Width */}
                    <div className="space-y-1">
                      <label className="text-xs md:text-sm font-bold text-brand-black dark:text-white block">
                        Service Needed
                      </label>
                      <div className="relative">
                        <select
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          required
                          className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-brand-dark dark:text-white focus:bg-white focus:border-[#C266E5] focus:ring-2 focus:ring-[#C266E5]/25 outline-none transition-colors appearance-none cursor-pointer text-sm text-gray-700 dark:text-gray-200"
                        >
                          <option value="" disabled>
                            Select a service
                          </option>
                          <option value="Laptops & Desktops">Laptops & Desktops</option>
                          <option value="Peripherals & Accessories">Peripherals & Accessories</option>
                          <option value="Custom Builds">Custom Builds</option>
                          <option value="Electronic Components">Electronic Components</option>
                          <option value="Servers & Equipment">Servers & Equipment</option>
                          <option value="Operating Systems & Office Suites">
                            Operating Systems & Office Suites
                          </option>
                          <option value="Antivirus & Security Software">
                            Antivirus & Security Software
                          </option>
                          <option value="Business Management Software">
                            Business Management Software
                          </option>
                          <option value="Custom Software Development">
                            Custom Software Development
                          </option>
                          <option value="Cloud Solutions">Cloud Solutions</option>
                          <option value="Hardware Services">Hardware Services</option>
                          <option value="Software Services">Software Services</option>
                          <option value="Consulting">Consulting</option>
                          <option value="Other">Other</option>
                        </select>
                        <ChevronDown
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-500 pointer-events-none"
                          size={18}
                        />
                      </div>
                    </div>

                    {/* Message - Full Width */}
                    <div className="space-y-1">
                      <label className="text-xs md:text-sm font-bold text-brand-black dark:text-white block">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={2}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-brand-dark dark:text-white focus:bg-white focus:border-[#C266E5] focus:ring-2 focus:ring-[#C266E5]/25 outline-none transition-colors placeholder-gray-400 text-sm resize-none"
                        placeholder="Write your message"
                      />
                    </div>

                    {/* 3D Extruded Moving Button */}
                    <div className="pt-1">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="relative overflow-hidden shine-effect-smooth w-full bg-gradient-to-r from-[#C266E5] via-[#A020F0] to-[#C266E5] hover:from-[#b24ed9] hover:to-[#8e19d6] text-white font-semibold py-3 md:py-3.5 rounded-xl transition-transform duration-150 shadow-[0_5px_0_#6b21a8,0_10px_20px_rgba(160,32,240,0.35)] hover:translate-y-[1px] active:translate-y-[4px] active:shadow-[0_1px_0_#6b21a8] text-sm md:text-base disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        <PhoneCall size={18} />
                        <span>{submitting ? 'Booking Your Call...' : 'Book a call'}</span>
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};