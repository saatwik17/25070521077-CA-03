import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  Wrench,
  Code2,
  Plus,
  Search,
  Edit3,
  Trash2,
  Save,
  X,
  ArrowRight,
  RefreshCw,
  FileText,
  IndianRupee,
  ShieldCheck,
} from 'lucide-react';
import { AuthUser } from './Login';
import { Button } from '../components/Button';

export interface BookingRecord {
  _id: string;
  userId: string | null;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

interface MyBookingsProps {
  user: AuthUser;
  onBookCall: (serviceName?: string) => void;
  navigate: (path: string) => void;
  refreshTrigger?: number;
}

interface ServiceMeta {
  category: 'Hardware' | 'Software' | 'Consultation';
  price: string;
  numericPrice: number;
  turnaround: string;
  warranty: string;
}

const SERVICE_CATALOG: Record<string, ServiceMeta> = {
  'Laptops & Desktops': {
    category: 'Hardware',
    price: '₹42,999',
    numericPrice: 42999,
    turnaround: '2–3 Business Days',
    warranty: '3-Year Onsite Warranty',
  },
  'Peripherals & Accessories': {
    category: 'Hardware',
    price: '₹3,499',
    numericPrice: 3499,
    turnaround: '24–48 Hours',
    warranty: '1-Year Replacement Guarantee',
  },
  'Custom Builds': {
    category: 'Hardware',
    price: '₹89,999',
    numericPrice: 89999,
    turnaround: '4–5 Business Days',
    warranty: '3-Year Component & Labor Warranty',
  },
  'Electronic Components': {
    category: 'Hardware',
    price: '₹1,999',
    numericPrice: 1999,
    turnaround: '2–4 Business Days',
    warranty: 'ISO Certified Batch Assurance',
  },
  'Servers & Equipment': {
    category: 'Hardware',
    price: '₹1,45,000',
    numericPrice: 145000,
    turnaround: '5–7 Business Days',
    warranty: '5-Year 24/7 Mission-Critical SLA',
  },
  'Hardware Services': {
    category: 'Hardware',
    price: '₹14,999',
    numericPrice: 14999,
    turnaround: '2–3 Business Days',
    warranty: '1-Year Service Warranty',
  },
  'Operating Systems & Office Suites': {
    category: 'Software',
    price: '₹6,499',
    numericPrice: 6499,
    turnaround: 'Same-Day Activation',
    warranty: 'Official OEM Volume License',
  },
  'Antivirus & Security Software': {
    category: 'Software',
    price: '₹2,999',
    numericPrice: 2999,
    turnaround: 'Instant Deployment',
    warranty: '24/7 Threat Monitoring SLA',
  },
  'Business Management Software': {
    category: 'Software',
    price: '₹24,999',
    numericPrice: 24999,
    turnaround: '3–5 Business Days',
    warranty: '1-Year Support & Cloud Sync',
  },
  'Custom Software Development': {
    category: 'Software',
    price: '₹49,999',
    numericPrice: 49999,
    turnaround: '2–4 Weeks Agile Sprint',
    warranty: '6-Month Free Maintenance',
  },
  'Cloud Solutions': {
    category: 'Software',
    price: '₹14,999',
    numericPrice: 14999,
    turnaround: '2–3 Business Days',
    warranty: '99.99% Uptime SLA Architecture',
  },
  'Software Services': {
    category: 'Software',
    price: '₹12,999',
    numericPrice: 12999,
    turnaround: '2–3 Business Days',
    warranty: '1-Year Technical Support',
  },
  Consulting: {
    category: 'Consultation',
    price: '₹2,499',
    numericPrice: 2499,
    turnaround: 'Within 24 Hours',
    warranty: 'Dedicated Solutions Architect',
  },
};

const ALL_SERVICE_OPTIONS = [
  'Laptops & Desktops',
  'Peripherals & Accessories',
  'Custom Builds',
  'Electronic Components',
  'Servers & Equipment',
  'Operating Systems & Office Suites',
  'Antivirus & Security Software',
  'Business Management Software',
  'Custom Software Development',
  'Cloud Solutions',
  'Hardware Services',
  'Software Services',
  'Consulting',
  'Other',
];

const STATUS_STEPS = ['Pending', 'Confirmed', 'In Progress', 'Completed'];

function normalizeStatus(raw?: string): string {
  if (!raw) return 'Pending';
  const s = String(raw).trim().toLowerCase();
  if (s === 'completed' || s === 'complete' || s === 'done' || s === 'delivered' || s === 'finished') {
    return 'Completed';
  }
  if (
    s === 'in progress' ||
    s === 'in-progress' ||
    s === 'inprogress' ||
    s === 'processing' ||
    s === 'active' ||
    s === 'ongoing' ||
    s === 'working'
  ) {
    return 'In Progress';
  }
  if (s === 'confirmed' || s === 'confirm' || s === 'approved' || s === 'accepted' || s === 'scheduled') {
    return 'Confirmed';
  }
  if (s === 'cancelled' || s === 'canceled' || s === 'rejected') {
    return 'Cancelled';
  }
  if (s === 'pending' || s === 'new' || s === 'open' || s === 'waiting') {
    return 'Pending';
  }
  return String(raw).trim();
}

function getServiceMeta(serviceName: string): ServiceMeta {
  return (
    SERVICE_CATALOG[serviceName] || {
      category: 'Consultation',
      price: '₹4,999',
      numericPrice: 4999,
      turnaround: '1–2 Business Days',
      warranty: 'Standard Support Coverage',
    }
  );
}

// Smooth 60fps 3D Tilt Card Wrapper using direct DOM ref + requestAnimationFrame
const TiltBookingCard: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -2.2;
    const rotateY = ((x - centerX) / centerX) * 2.2;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (cardRef.current) {
        cardRef.current.style.transform = `perspective(1100px) rotateX(${rotateX.toFixed(
          2
        )}deg) rotateY(${rotateY.toFixed(2)}deg) translate3d(0, -2px, 0)`;
      }
    });
  };

  const handleMouseLeave = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (cardRef.current) {
      cardRef.current.style.transform =
        'perspective(1100px) rotateX(0deg) rotateY(0deg) translate3d(0, 0px, 0)';
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform',
      }}
      className={className}
    >
      {children}
    </div>
  );
};

export const MyBookings: React.FC<MyBookingsProps> = ({
  user,
  onBookCall,
  navigate,
  refreshTrigger = 0,
}) => {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<'all' | 'Hardware' | 'Software' | 'Completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Inline edit state (Clients can only edit their contact phone, service package, or notes — status is controlled by the owner/admin)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    service: '',
    phone: '',
    message: '',
  });
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null);

  const fetchBookings = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const params = new URLSearchParams();
        if (user?.email) params.set('email', user.email);
        if (user?.id) params.set('userId', user.id);
        params.set('_t', String(Date.now()));

        const res = await fetch(`/api/bookings?${params.toString()}`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          setBookings(Array.isArray(data.bookings) ? data.bookings : []);
        }
      } catch (error) {
        console.error('Error loading bookings:', error);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [user?.email, user?.id]
  );

  useEffect(() => {
    fetchBookings(false);
  }, [fetchBookings, refreshTrigger]);

  // Automatically poll MongoDB every 3 seconds and on tab focus so status changes
  // made in MongoDB Compass reflect on the website immediately
  useEffect(() => {
    const interval = setInterval(() => {
      fetchBookings(true);
    }, 3000);

    const handleFocus = () => fetchBookings(true);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchBookings(true);
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [fetchBookings]);

  const showToast = (msg: string) => {
    setFeedbackBanner(msg);
    setTimeout(() => {
      setFeedbackBanner((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const handleStartEdit = (booking: BookingRecord) => {
    setEditingId(booking._id);
    setEditForm({
      service: booking.service || 'General Inquiry',
      phone: booking.phone || '',
      message: booking.message || '',
    });
  };

  const handleSaveEdit = async (id: string) => {
    if (!/^\d{10}$/.test(editForm.phone)) {
      showToast('Please enter a valid 10-digit phone number.');
      return;
    }
    setSavingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        const data = await res.json();
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, ...editForm, ...(data.booking || {}) } : b))
        );
        setEditingId(null);
        showToast('Your booking request details have been updated.');
      }
    } catch (err) {
      console.error('Failed to update booking:', err);
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b._id !== id));
        setConfirmDeleteId(null);
        showToast('Booking cancelled and removed.');
      }
    } catch (err) {
      console.error('Failed to delete booking:', err);
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    const meta = getServiceMeta(b.service);
    const currentStatus = normalizeStatus(b.status);

    if (filterCategory === 'Hardware' && meta.category !== 'Hardware') return false;
    if (filterCategory === 'Software' && meta.category !== 'Software') return false;
    if (filterCategory === 'Completed' && currentStatus !== 'Completed') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.service.toLowerCase().includes(q) ||
        b.message.toLowerCase().includes(q) ||
        b._id.toLowerCase().includes(q) ||
        b.phone.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Summary metrics
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter((b) => {
    const st = normalizeStatus(b.status);
    return st !== 'Completed' && st !== 'Cancelled';
  }).length;
  const completedBookings = bookings.filter((b) => normalizeStatus(b.status) === 'Completed').length;
  const totalEstimatedValue = bookings
    .filter((b) => normalizeStatus(b.status) !== 'Cancelled')
    .reduce((sum, b) => sum + getServiceMeta(b.service).numericPrice, 0);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50/70 dark:bg-brand-dark transition-colors">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        {/* Top Breadcrumb & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="hover:text-[#A020F0] transition-colors cursor-pointer"
              >
                Home
              </button>
              <span aria-hidden="true">/</span>
              <button
                type="button"
                onClick={() => navigate('/services')}
                className="hover:text-[#A020F0] transition-colors cursor-pointer"
              >
                Services
              </button>
              <span aria-hidden="true">/</span>
              <span className="text-brand-black dark:text-white font-medium">My Bookings</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-brand-black dark:text-white tracking-tight">
              My Bookings &amp; Service Tracker
            </h1>
            <p className="text-brand-gray dark:text-gray-400 text-sm md:text-base mt-1.5">
              Track live engineering status, estimated quotes, and manage your scheduled hardware &amp; software service calls for{' '}
              <span className="font-semibold text-brand-black dark:text-white">{user.email}</span>.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => fetchBookings(false)}
              className="px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-brand-card text-brand-black dark:text-gray-200 hover:border-purple-400 text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
              title="Refresh latest status from server"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin text-[#A020F0]' : 'text-[#A020F0]'} />
              <span>Refresh Status</span>
            </button>

            <Button
              variant="primary"
              onClick={() => onBookCall()}
              className="px-5 py-2.5 text-sm shadow-md flex items-center gap-2 whitespace-nowrap"
            >
              <Plus size={17} />
              <span>New Service Booking</span>
            </Button>
          </div>
        </div>

        {/* Toast Feedback */}
        {feedbackBanner && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-purple-900 text-white text-sm font-medium flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={17} className="text-emerald-400 shrink-0" />
              <span>{feedbackBanner}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedbackBanner(null)}
              className="text-purple-200 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* 4-Column KPI Summary Strip (Tabular Numerals) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-brand-card p-5 rounded-xl border border-gray-200 dark:border-gray-800">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Service Requests</p>
            <p className="text-2xl md:text-3xl font-bold text-brand-black dark:text-white mt-1 font-mono tabular-nums">
              {totalBookings}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Submitted inquiries
            </p>
          </div>

          <div className="bg-white dark:bg-brand-card p-5 rounded-xl border border-gray-200 dark:border-gray-800">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Active / In Progress</p>
            <p className="text-2xl md:text-3xl font-bold text-[#A020F0] dark:text-purple-400 mt-1 font-mono tabular-nums">
              {activeBookings}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              24-hr priority engineering SLA
            </p>
          </div>

          <div className="bg-white dark:bg-brand-card p-5 rounded-xl border border-gray-200 dark:border-gray-800">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Completed Deliveries</p>
            <p className="text-2xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono tabular-nums">
              {completedBookings}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Verified &amp; warranty active
            </p>
          </div>

          <div className="bg-white dark:bg-brand-card p-5 rounded-xl border border-gray-200 dark:border-gray-800">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Estimated Project Value</p>
            <p className="text-2xl md:text-3xl font-bold text-brand-black dark:text-white mt-1 font-mono tabular-nums">
              ₹{totalEstimatedValue.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Starting base estimate
            </p>
          </div>
        </div>

        {/* Interactive Filter Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-1 p-1 bg-gray-200/75 dark:bg-gray-800 rounded-xl w-fit overflow-x-auto">
            {(
              [
                { id: 'all', label: 'All Bookings' },
                { id: 'Hardware', label: 'Hardware' },
                { id: 'Software', label: 'Software' },
                { id: 'Completed', label: 'Completed' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterCategory(tab.id)}
                className={`px-3.5 py-1.5 text-xs md:text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  filterCategory === tab.id
                    ? 'bg-white dark:bg-brand-card text-brand-black dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-brand-black dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search service, ID, or notes..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-brand-card text-sm text-brand-black dark:text-white focus:border-[#A020F0] outline-none transition-colors"
            />
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="h-52 rounded-2xl bg-white dark:bg-brand-card border border-gray-200 dark:border-gray-800 p-6 animate-pulse flex flex-col justify-between"
              >
                <div className="flex justify-between">
                  <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
                <div className="h-4 w-3/4 bg-gray-100 dark:bg-gray-800 rounded" />
                <div className="h-10 w-full bg-gray-100 dark:bg-gray-800 rounded" />
              </div>
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white dark:bg-brand-card rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center max-w-xl mx-auto my-8">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-[#A020F0] flex items-center justify-center mx-auto mb-4">
              <Calendar size={28} />
            </div>
            <h3 className="text-xl font-bold text-brand-black dark:text-white mb-2">
              No Service Bookings Found
            </h3>
            <p className="text-brand-gray dark:text-gray-400 text-sm mb-6">
              {searchQuery || filterCategory !== 'all'
                ? 'No bookings match your current filter. Try clearing the search or switching tabs.'
                : 'You have not scheduled a hardware or software consultation call yet. Book your first service call to track live progress here.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button variant="primary" onClick={() => onBookCall()} className="px-6 py-2.5 text-sm">
                Book Your First Service Call
              </Button>
              <button
                type="button"
                onClick={() => navigate('/services')}
                className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-brand-black dark:text-white hover:border-[#A020F0] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Browse Service Catalog</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredBookings.map((booking, index) => {
              const meta = getServiceMeta(booking.service);
              const currentStatus = normalizeStatus(booking.status);
              const stepIndex = Math.max(0, STATUS_STEPS.indexOf(currentStatus));
              const isEditing = editingId === booking._id;
              const formattedDate = new Date(booking.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              });
              const shortId = booking._id.slice(-6).toUpperCase();

              return (
                <TiltBookingCard
                  key={booking._id}
                  className="bg-white dark:bg-brand-card rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:border-purple-300 dark:hover:border-purple-800"
                >
                  {/* Top Row: Order Number, Service Name, Price & Edit Actions */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-gray-100 dark:border-gray-800">
                    <div>
                      {/* Unboxed clean metadata line */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1.5 font-mono tabular-nums">
                        <span className="font-semibold text-[#A020F0] dark:text-purple-400">
                          #{String(index + 1).padStart(2, '0')} · ORD-{shortId}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1 font-sans">
                          {meta.category === 'Hardware' ? (
                            <Wrench size={12} className="text-[#A020F0]" />
                          ) : (
                            <Code2 size={12} className="text-[#A020F0]" />
                          )}
                          {meta.category} Division
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>Booked {formattedDate}</span>
                        <span aria-hidden="true">·</span>
                        <span>Est. {meta.turnaround}</span>
                      </div>

                      <h2 className="text-xl md:text-2xl font-bold text-brand-black dark:text-white">
                        {booking.service || 'General IT Consultation'}
                      </h2>
                    </div>

                    {/* Right Side: Starting Estimate + Client Actions */}
                    <div className="flex flex-wrap items-center justify-between lg:justify-end gap-4">
                      <div className="text-left lg:text-right">
                        <span className="text-xs text-gray-400 dark:text-gray-500 block">
                          Estimated Package Price
                        </span>
                        <span className="text-xl font-bold text-brand-black dark:text-white font-mono tabular-nums flex items-center lg:justify-end gap-0.5">
                          {meta.price}
                          <span className="text-xs font-normal text-gray-500 ml-1">onwards</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {!isEditing && currentStatus !== 'Completed' && (
                          <button
                            type="button"
                            onClick={() => handleStartEdit(booking)}
                            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[#A020F0] text-xs font-medium text-brand-black dark:text-gray-200 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            <Edit3 size={14} className="text-[#A020F0]" />
                            <span>Edit Request</span>
                          </button>
                        )}

                        {confirmDeleteId === booking._id ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              disabled={deletingId === booking._id}
                              onClick={() => handleDeleteBooking(booking._id)}
                              className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
                            >
                              {deletingId === booking._id ? 'Removing...' : 'Confirm Cancel'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-brand-black dark:hover:text-white cursor-pointer"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(booking._id)}
                            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-red-300 hover:text-red-600 text-gray-500 dark:text-gray-400 transition-colors cursor-pointer"
                            title="Cancel Booking Request"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Client Request Edit Mode (Service, Phone & Notes only — Status is managed by Admin) */}
                  {isEditing ? (
                    <div className="py-5 space-y-4 border-b border-gray-100 dark:border-gray-800">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-brand-black dark:text-gray-200 block mb-1">
                            Service Package
                          </label>
                          <select
                            value={editForm.service}
                            onChange={(e) => setEditForm({ ...editForm, service: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-brand-dark text-sm text-brand-black dark:text-white outline-none focus:border-[#A020F0]"
                          >
                            {ALL_SERVICE_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-brand-black dark:text-gray-200 block mb-1">
                            Contact Phone Number (10 digits)
                          </label>
                          <input
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            minLength={10}
                            pattern="[0-9]{10}"
                            value={editForm.phone}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                phone: e.target.value.replace(/\D/g, '').slice(0, 10),
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-brand-dark text-sm text-brand-black dark:text-white outline-none focus:border-[#A020F0] font-mono tabular-nums"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-brand-black dark:text-gray-200 block mb-1">
                          Project Requirements / Notes
                        </label>
                        <textarea
                          rows={2}
                          value={editForm.message}
                          onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-brand-dark text-sm text-brand-black dark:text-white outline-none focus:border-[#A020F0] resize-none"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={savingId === booking._id}
                          onClick={() => handleSaveEdit(booking._id)}
                          className="px-4 py-2 rounded-lg bg-[#A020F0] hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <Save size={14} />
                          <span>{savingId === booking._id ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Details Grid */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b border-gray-100 dark:border-gray-800 text-sm">
                      <div className="md:col-span-2">
                        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-1 flex items-center gap-1.5">
                          <FileText size={13} className="text-[#A020F0]" />
                          <span>Requirement Specification &amp; Notes</span>
                        </p>
                        <p className="text-brand-gray dark:text-gray-300 leading-relaxed">
                          {booking.message
                            ? booking.message
                            : 'Standard consultation and requirement evaluation requested for ' +
                              booking.service +
                              '.'}
                        </p>
                      </div>

                      <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <Phone size={13} className="text-[#A020F0] shrink-0" />
                          <span className="font-mono tabular-nums">{booking.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail size={13} className="text-[#A020F0] shrink-0" />
                          <span className="truncate">{booking.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
                          <span>{meta.warranty}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Read-Only 4-Stage Order Status Pipeline (Updated by Admin / Service Team) */}
                  <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="grid grid-cols-4 gap-2 flex-1">
                      {STATUS_STEPS.map((step, i) => {
                        const isReached = stepIndex >= i;
                        const isCurrent = currentStatus === step;
                        return (
                          <div key={step} className="text-left select-none">
                            <div
                              className={`h-1.5 rounded-full transition-colors mb-1.5 ${
                                isReached
                                  ? step === 'Completed'
                                    ? 'bg-emerald-500'
                                    : 'bg-[#A020F0]'
                                  : 'bg-gray-200 dark:bg-gray-700'
                              }`}
                            />
                            <div className="flex items-center gap-1">
                              <span
                                className={`text-xs font-medium whitespace-nowrap truncate ${
                                  isCurrent
                                    ? 'text-[#A020F0] dark:text-purple-400 font-bold'
                                    : isReached
                                    ? 'text-brand-black dark:text-gray-200'
                                    : 'text-gray-400 dark:text-gray-500'
                                }`}
                              >
                                {i + 1}. {step}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 text-xs text-gray-500 dark:text-gray-400">
                      <Clock size={14} className="text-[#A020F0]" />
                      <span>
                        Current Status:{' '}
                        <strong className="text-brand-black dark:text-white font-semibold">
                          {currentStatus}
                        </strong>{' '}
                        (Updated by Service Team)
                      </span>
                    </div>
                  </div>
                </TiltBookingCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
