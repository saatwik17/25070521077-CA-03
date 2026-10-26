import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Sun, Moon, User, LogOut } from 'lucide-react';
import { Button } from './Button';
import { NavLink } from '../types';
import { Logo } from './Logo';
import { AuthUser } from '../pages/Login';

const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About us', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'My Bookings', href: '/my-bookings' },
  { label: 'Contact', href: '/contact' },
];

interface NavbarProps {
  onBookCall: () => void;
  navigate: (path: string) => void;
  currentPath: string;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  user?: AuthUser | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onBookCall,
  navigate,
  currentPath,
  theme = 'light',
  onToggleTheme,
  user,
  onLogout,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    setIsOpen(false);
    navigate(href);
  };

  // Home hero and Contact page have a dark image background behind the navbar at the top
  const isDarkHeroRoute = currentPath === '/' || currentPath === '' || currentPath === '/contact';

  // Ensure navbar is NOT transparent when menu is open or on regular content pages
  const isTransparent = isDarkHeroRoute && !scrolled && !isOpen;

  const textColorClass = isTransparent
    ? 'text-white hover:text-purple-300'
    : 'text-brand-gray dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400';

  const activeColorClass = isTransparent
    ? 'text-purple-300'
    : 'text-purple-600 dark:text-purple-400 font-semibold';

  // Navbar background logic
  const navBackgroundClass = isOpen
    ? 'bg-white dark:bg-brand-dark shadow-sm py-2'
    : scrolled
    ? 'bg-white/95 dark:bg-brand-dark/95 backdrop-blur-md shadow-md py-2 border-b border-gray-100 dark:border-gray-800'
    : isDarkHeroRoute
    ? 'bg-transparent py-4'
    : 'bg-white/90 dark:bg-brand-dark/90 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 py-3';

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${navBackgroundClass}`}>
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center relative z-50">
        {/* Logo */}
        <div className="flex items-center">
          <a
            href="/"
            onClick={(e) => handleNavClick(e, '/')}
            className="hover:opacity-90 transition-opacity"
          >
            <Logo light={isTransparent} />
          </a>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-5 xl:gap-7">
          <ul className="flex gap-6 xl:gap-8 items-center">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`font-medium transition-colors text-base relative group ${
                    currentPath === link.href ? activeColorClass : textColorClass
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-current transition-all duration-300 ${
                      currentPath === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  ></span>
                </a>
              </li>
            ))}
          </ul>

          {/* Theme Toggle Button */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className={`p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center cursor-pointer ${
                isTransparent
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-purple-50 hover:bg-purple-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-purple-700 dark:text-purple-300'
              }`}
            >
              {theme === 'dark' ? (
                <Sun size={19} className="text-amber-400" />
              ) : (
                <Moon size={19} className="text-[#A020F0]" />
              )}
            </button>
          )}

          {/* Login / User Icon */}
          {user ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                  currentPath === '/profile'
                    ? 'bg-[#A020F0] text-white shadow-md'
                    : isTransparent
                    ? 'bg-white/15 hover:bg-white/25 text-white'
                    : 'bg-purple-50 hover:bg-purple-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-purple-700 dark:text-purple-300'
                }`}
                title="View & Edit My Credentials"
              >
                <User
                  size={18}
                  className={
                    currentPath === '/profile'
                      ? 'text-white shrink-0'
                      : 'text-[#A020F0] dark:text-purple-400 shrink-0'
                  }
                />
                <span className="max-w-[110px] truncate">{user.name}</span>
              </button>
              {onLogout && (
                <button
                  onClick={onLogout}
                  aria-label="Logout"
                  title="Logout"
                  className={`p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center cursor-pointer ${
                    isTransparent
                      ? 'bg-white/10 hover:bg-red-500/80 text-white'
                      : 'bg-gray-100 hover:bg-red-50 dark:bg-gray-800 dark:hover:bg-red-950/50 text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400'
                  }`}
                >
                  <LogOut size={18} />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              aria-label="Login or Sign Up"
              title="Login / Sign Up"
              className={`p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center cursor-pointer ${
                currentPath === '/login'
                  ? 'bg-[#A020F0] text-white shadow-md'
                  : isTransparent
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-purple-50 hover:bg-purple-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-[#A020F0] dark:text-purple-300'
              }`}
            >
              <User size={19} />
            </button>
          )}

          {/* Book a Call Button */}
          <Button
            variant="primary"
            onClick={onBookCall}
            className="px-6 py-2.5 text-sm md:text-base shadow-lg hover:shadow-purple-500/50"
          >
            Book a call
          </Button>
        </div>

        {/* Mobile Controls */}
        <div className="lg:hidden flex items-center gap-2">
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              aria-label="Toggle theme"
              className={`p-2 rounded-lg transition-colors ${
                isTransparent ? 'text-white' : 'text-brand-black dark:text-white'
              }`}
            >
              {theme === 'dark' ? (
                <Sun size={20} className="text-amber-400" />
              ) : (
                <Moon size={20} className="text-purple-600" />
              )}
            </button>
          )}

          {/* Mobile Login / User Icon */}
          <button
            onClick={() => {
              setIsOpen(false);
              navigate(user ? '/profile' : '/login');
            }}
            aria-label={user ? `View credentials for ${user.name}` : 'Login'}
            title={user ? `${user.name} (My Credentials)` : 'Login / Sign Up'}
            className={`p-2 rounded-lg transition-colors ${
              isTransparent ? 'text-white' : 'text-[#A020F0] dark:text-purple-400'
            }`}
          >
            <User size={22} />
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 focus:outline-none ${
              isTransparent ? 'text-white' : 'text-brand-black dark:text-white'
            }`}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden fixed inset-0 h-[100dvh] bg-white dark:bg-brand-dark z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col p-6 pt-28 gap-6 h-full overflow-y-auto">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`text-xl font-semibold border-b border-gray-100 dark:border-gray-800 pb-4 hover:text-purple-600 dark:hover:text-purple-400 ${
                currentPath === link.href
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-brand-black dark:text-gray-200'
              }`}
            >
              {link.label}
            </a>
          ))}
          <div className="mt-2 flex flex-col gap-3">
            {user ? (
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-purple-50 dark:bg-gray-800 text-purple-800 dark:text-purple-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/profile');
                  }}
                  className="flex items-center gap-2.5 truncate text-left hover:opacity-85 transition-opacity cursor-pointer"
                >
                  <User size={18} className="text-[#A020F0] shrink-0" />
                  <div className="truncate">
                    <p className="text-sm font-semibold truncate">{user.name}</p>
                    <p className="text-xs opacity-75 truncate">{user.email}</p>
                  </div>
                </button>
                {onLogout && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onLogout();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 text-xs font-semibold flex items-center gap-1"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/login');
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-purple-50 dark:bg-gray-800 text-purple-700 dark:text-purple-300 font-semibold text-sm"
              >
                <span>Login / Create Account</span>
                <User size={18} />
              </button>
            )}

            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-purple-50 dark:bg-gray-800 text-purple-700 dark:text-purple-300 font-medium text-sm"
              >
                <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
                {theme === 'dark' ? (
                  <Sun size={18} className="text-amber-400" />
                ) : (
                  <Moon size={18} />
                )}
              </button>
            )}
            <Button
              fullWidth
              variant="primary"
              onClick={() => {
                setIsOpen(false);
                onBookCall();
              }}
              className="shadow-none"
            >
              <span className="mr-2">Book a call</span>
              <Phone size={18} />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};