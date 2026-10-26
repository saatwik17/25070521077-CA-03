import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Chatbot } from './components/Chatbot';
import { BookCallModal } from './components/BookCallModal';

// Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { Contact } from './pages/Contact';
import { Login, AuthUser } from './pages/Login';
import { Profile } from './pages/Profile';
import { MyBookings } from './pages/MyBookings';

type PendingAction =
  | { type: 'navigate'; path: string }
  | { type: 'bookCall'; serviceName: string; category?: 'hardware' | 'software' }
  | null;

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [navKey, setNavKey] = useState(0);
  const [bookingsRefreshKey, setBookingsRefreshKey] = useState(0);

  // Authenticated User State
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const savedUser = localStorage.getItem('ambitiouspedia_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [redirectMessage, setRedirectMessage] = useState<string>('');

  // Verify stored token on startup
  useEffect(() => {
    const token = localStorage.getItem('ambitiouspedia_token');
    if (!token) return;
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Invalid session');
        return res.json();
      })
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('ambitiouspedia_user', JSON.stringify(data.user));
        }
      })
      .catch(() => {
        localStorage.removeItem('ambitiouspedia_token');
        localStorage.removeItem('ambitiouspedia_user');
        setUser(null);
      });
  }, []);

  // Theme state: defaults to 'light' mode
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Simple Router Logic
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const rawNavigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    setNavKey((prev) => prev + 1);
    if (!path.startsWith('/services/')) {
      window.scrollTo(0, 0);
    }
  };

  const navigate = (path: string) => {
    // Gate /services and /my-bookings behind login if user is not logged in
    if ((path === '/services' || path.startsWith('/services/') || path === '/my-bookings') && !user) {
      setPendingAction({ type: 'navigate', path });
      if (path === '/services/hardware') {
        setRedirectMessage('Please login or create an account to explore our Hardware Services.');
      } else if (path === '/services/software') {
        setRedirectMessage('Please login or create an account to explore our Software Services.');
      } else if (path === '/my-bookings') {
        setRedirectMessage('Please login or create an account to view and track your service bookings.');
      } else {
        setRedirectMessage('Please login or create an account to explore our services.');
      }
      rawNavigate('/login');
      return;
    }
    if (path !== '/login') {
      setRedirectMessage('');
    }
    rawNavigate(path);
  };

  const handleOpenModal = (serviceName: string = '', category?: 'hardware' | 'software') => {
    // Gate Book a Call & Get a Service behind login if user is not logged in
    if (!user) {
      setPendingAction({ type: 'bookCall', serviceName, category });
      setRedirectMessage(
        serviceName
          ? `Please login or create an account to access "${serviceName}".`
          : 'Please login or create an account to book a call.'
      );
      rawNavigate('/login');
      return;
    }
    if (category) {
      rawNavigate(`/services/${category}`);
      return;
    }
    setSelectedService(serviceName);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService('');
  };

  const handleAuthSuccess = (loggedInUser: AuthUser, token: string) => {
    setUser(loggedInUser);
    localStorage.setItem('ambitiouspedia_user', JSON.stringify(loggedInUser));
    localStorage.setItem('ambitiouspedia_token', token);
    setRedirectMessage('');

    if (pendingAction) {
      const action = pendingAction;
      setPendingAction(null);
      if (action.type === 'navigate') {
        rawNavigate(action.path);
      } else if (action.type === 'bookCall') {
        if (action.category) {
          rawNavigate(`/services/${action.category}`);
        } else {
          rawNavigate('/services');
          setSelectedService(action.serviceName);
          setIsModalOpen(true);
        }
      }
    } else if (
      currentPath === '/services/hardware' ||
      currentPath === '/services/software' ||
      currentPath === '/services' ||
      currentPath === '/my-bookings'
    ) {
      rawNavigate(currentPath);
    } else {
      rawNavigate('/services');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setPendingAction(null);
    localStorage.removeItem('ambitiouspedia_user');
    localStorage.removeItem('ambitiouspedia_token');
    rawNavigate('/');
  };

  const handleUpdateUser = (updatedUser: AuthUser, newToken: string) => {
    setUser(updatedUser);
    localStorage.setItem('ambitiouspedia_user', JSON.stringify(updatedUser));
    localStorage.setItem('ambitiouspedia_token', newToken);
  };

  // Normalize path to ignore trailing slashes
  const normalizedPath =
    currentPath.endsWith('/') && currentPath.length > 1
      ? currentPath.slice(0, -1)
      : currentPath;

  const servicesInitialTab: 'hardware' | 'software' | undefined =
    normalizedPath === '/services/software'
      ? 'software'
      : normalizedPath === '/services/hardware'
      ? 'hardware'
      : undefined;

  // Route Matching
  let content;

  if (normalizedPath === '/login') {
    content = (
      <Login
        onAuthSuccess={handleAuthSuccess}
        navigate={navigate}
        redirectMessage={redirectMessage}
      />
    );
  } else if (normalizedPath === '/profile') {
    if (!user) {
      content = (
        <Login
          onAuthSuccess={handleAuthSuccess}
          navigate={navigate}
          redirectMessage="Please login to view and edit your account credentials."
        />
      );
    } else {
      content = (
        <Profile
          user={user}
          onUpdateUser={handleUpdateUser}
          navigate={navigate}
        />
      );
    }
  } else if (normalizedPath === '/my-bookings') {
    if (!user) {
      content = (
        <Login
          onAuthSuccess={handleAuthSuccess}
          navigate={navigate}
          redirectMessage="Please login or create an account to view and track your service bookings."
        />
      );
    } else {
      content = (
        <MyBookings
          user={user}
          onBookCall={(svc) => handleOpenModal(svc)}
          navigate={navigate}
          refreshTrigger={bookingsRefreshKey}
        />
      );
    }
  } else if (normalizedPath === '/' || normalizedPath === '') {
    content = <Home onBookCall={handleOpenModal} navigate={navigate} />;
  } else if (normalizedPath === '/about') {
    content = <About onBookCall={() => handleOpenModal()} navigate={navigate} />;
  } else if (normalizedPath === '/services' || normalizedPath.startsWith('/services/')) {
    if (!user) {
      content = (
        <Login
          onAuthSuccess={handleAuthSuccess}
          navigate={navigate}
          redirectMessage={
            redirectMessage ||
            (normalizedPath === '/services/hardware'
              ? 'Please login or create an account to explore our Hardware Services.'
              : normalizedPath === '/services/software'
              ? 'Please login or create an account to explore our Software Services.'
              : 'Please login or create an account to explore our services.')
          }
        />
      );
    } else {
      content = (
        <Services
          onBookCall={handleOpenModal}
          navigate={navigate}
          initialTab={servicesInitialTab}
          navKey={navKey}
        />
      );
    }
  } else if (normalizedPath === '/contact') {
    content = (
      <Contact
        onBookCall={() => handleOpenModal()}
        navigate={navigate}
        user={user}
        onBookingCreated={() => setBookingsRefreshKey((prev) => prev + 1)}
      />
    );
  } else {
    content = <Home onBookCall={handleOpenModal} navigate={navigate} />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark text-brand-black dark:text-white font-sans selection:bg-purple-100 selection:text-purple-900 flex flex-col">
      <Navbar
        onBookCall={() => handleOpenModal()}
        navigate={navigate}
        currentPath={normalizedPath}
        theme={theme}
        onToggleTheme={toggleTheme}
        user={user}
        onLogout={handleLogout}
      />

      <main className="flex-grow">{content}</main>

      <Footer navigate={navigate} />
      <Chatbot />
      <BookCallModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialService={selectedService}
        user={user}
        onBookingCreated={() => setBookingsRefreshKey((prev) => prev + 1)}
      />
    </div>
  );
}

export default App;