import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface LoginPageProps {
  onAuthSuccess: (user: AuthUser, token: string) => void;
  navigate: (path: string) => void;
  redirectMessage?: string;
}

export const Login: React.FC<LoginPageProps> = ({ onAuthSuccess, navigate, redirectMessage }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [copiedField, setCopiedField] = useState<'email' | 'password' | null>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  // Google Strong Password Rule Checks
  const passwordChecks = {
    minLength: password.length >= 8,
    hasLetters: /[A-Z]/.test(password) && /[a-z]/.test(password),
    hasNumbers: /[0-9]/.test(password),
    hasSymbols: /[^A-Za-z0-9\s]/.test(password),
  };

  const isStrongPassword =
    passwordChecks.minLength &&
    passwordChecks.hasLetters &&
    passwordChecks.hasNumbers &&
    passwordChecks.hasSymbols;

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  const switchMode = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setError('');
    setSuccessMsg('');
  };

  const handleCopy = (text: string, field: 'email' | 'password') => {
    navigator.clipboard?.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const handleFillPermanent = () => {
    setMode('login');
    setEmail('saatwik12@gmail.com');
    setPassword('Saatwikss12#');
    setError('');
    setSuccessMsg('Permanent credentials filled! Click Login to continue.');
  };

  const handleMouseMove3D = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave3D = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (mode === 'signup') {
      if (!isStrongPassword) {
        setError(
          'Please follow the Strong Password rules: Use 8 or more characters with a mix of uppercase & lowercase letters, numbers & symbols.'
        );
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please enter the same password twice to create your account.');
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint = mode === 'signup' ? '/api/auth/signup' : '/api/auth/login';
      const payload =
        mode === 'signup'
          ? { name: name.trim(), email: email.trim(), password, confirmPassword }
          : { email: email.trim(), password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Authentication failed. Please check your details.');
        setLoading(false);
        return;
      }

      if (mode === 'signup') {
        // Do NOT directly log in the user after creating an account!
        // Switch them to the Login tab and ask them to enter their credentials again.
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setMode('login');
        setSuccessMsg(
          'Account created successfully! Please enter your Email ID and Password below to login.'
        );
        setLoading(false);
        return;
      }

      setSuccessMsg('Logged in successfully! Redirecting...');
      setTimeout(() => {
        onAuthSuccess(data.user, data.token);
      }, 400);
    } catch (_err) {
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 flex items-center justify-center bg-gray-50 dark:bg-brand-dark px-4 md:px-8 font-sans transition-colors duration-300 overflow-hidden">
      <style>{`
        @keyframes float3D {
          0%, 100% {
            transform: translateY(0px) rotateX(2deg) rotateY(-4deg);
          }
          50% {
            transform: translateY(-14px) rotateX(-3deg) rotateY(5deg);
          }
        }
        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 20px 50px -10px rgba(160, 32, 240, 0.45), 0 0 25px rgba(194, 102, 229, 0.35);
          }
          50% {
            box-shadow: 0 30px 65px -5px rgba(160, 32, 240, 0.7), 0 0 40px rgba(234, 76, 137, 0.5);
          }
        }
        @keyframes orbitOrb {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(18px, -18px) scale(1.15);
          }
        }
        .card-3d-float {
          animation: float3D 4.5s ease-in-out infinite, pulseGlow 4.5s ease-in-out infinite;
          transform-style: preserve-3d;
        }
        .orb-float {
          animation: orbitOrb 6s ease-in-out infinite;
        }
      `}</style>

      <div className="w-full max-w-5xl mx-auto">
        {/* Redirect Notice Banner */}
        {redirectMessage && (
          <div className="max-w-md mx-auto lg:max-w-none mb-6 p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 flex items-start gap-3 text-purple-900 dark:text-purple-200 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle size={20} className="text-[#A020F0] shrink-0 mt-0.5" />
            <p className="text-sm font-medium leading-relaxed">{redirectMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Login / Create Account Form */}
          <div className="lg:col-span-7 w-full max-w-md mx-auto lg:max-w-none">
            <div className="bg-white dark:bg-brand-card rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-300">
              {/* Top Mode Switcher Tabs */}
              <div className="grid grid-cols-2 bg-gray-100 dark:bg-gray-900/60 p-1.5 m-5 mb-0 rounded-xl">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className={`py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                    mode === 'login'
                      ? 'bg-white dark:bg-brand-card text-[#A020F0] shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-brand-black dark:hover:text-white'
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className={`py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-white dark:bg-brand-card text-[#A020F0] shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-brand-black dark:hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <div className="p-6 md:p-8">
                <div className="text-center mb-6">
                  <h1 className="text-2xl md:text-3xl font-semibold text-brand-black dark:text-white mb-2">
                    {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
                  </h1>
                  <p className="text-sm text-brand-gray dark:text-gray-400 font-light">
                    {mode === 'login'
                      ? 'Sign in with your Email ID and Password to access all services'
                      : 'Sign up with your Name, Email ID, and Password to get started'}
                  </p>
                </div>

                {error && (
                  <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 flex items-center gap-2.5 text-red-600 dark:text-red-300 text-sm">
                    <AlertCircle size={18} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="mb-5 p-3.5 rounded-xl bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800/60 flex items-center gap-2.5 text-green-700 dark:text-green-300 text-sm">
                    <CheckCircle2 size={18} className="shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'signup' && (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                        Name
                      </label>
                      <div className="relative">
                        <UserIcon
                          size={18}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your full name"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-brand-dark text-brand-black dark:text-white placeholder-gray-400 text-sm focus:border-[#A020F0] focus:ring-2 focus:ring-[#A020F0]/20 focus:bg-white dark:focus:bg-brand-dark outline-none transition-all"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                      Email ID
                    </label>
                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-brand-dark text-brand-black dark:text-white placeholder-gray-400 text-sm focus:border-[#A020F0] focus:ring-2 focus:ring-[#A020F0]/20 focus:bg-white dark:focus:bg-brand-dark outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                      Password
                    </label>
                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={mode === 'signup' ? 8 : 6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={
                          mode === 'signup'
                            ? 'Create a strong password (min 8 chars)'
                            : 'Enter your password'
                        }
                        className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-brand-dark text-brand-black dark:text-white placeholder-gray-400 text-sm focus:border-[#A020F0] focus:ring-2 focus:ring-[#A020F0]/20 focus:bg-white dark:focus:bg-brand-dark outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    {/* Highlighted Strong Password Rules in Create Account mode */}
                    {mode === 'signup' && (
                      <div className="mt-3 p-4 rounded-xl bg-gradient-to-r from-purple-50 via-fuchsia-50 to-purple-50 dark:from-purple-950/50 dark:via-fuchsia-950/40 dark:to-purple-950/50 border-2 border-[#A020F0]/40 dark:border-purple-500/50 shadow-sm">
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="flex items-center gap-2.5">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#A020F0] text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                              <ShieldCheck size={14} />
                              Strong Password
                            </span>
                            {password.length > 0 && (
                              isStrongPassword ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-green-100 dark:bg-green-950/70 border border-green-300 dark:border-green-700 text-xs font-bold text-green-600 dark:text-green-400">
                                  <CheckCircle2 size={13} />
                                  Strong
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-red-100 dark:bg-red-950/70 border border-red-300 dark:border-red-700 text-xs font-bold text-red-600 dark:text-red-400">
                                  <AlertCircle size={13} />
                                  Weak
                                </span>
                              )
                            )}
                          </div>
                        </div>

                        <p className="text-xs font-semibold text-purple-950 dark:text-purple-100 mb-2.5 bg-amber-200/70 dark:bg-amber-500/20 px-2.5 py-1.5 rounded-lg border border-amber-300/80 dark:border-amber-400/30">
                          Use 8 or more characters with a mix of letters (uppercase &amp; lowercase),
                          numbers &amp; symbols.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                          <div
                            className={`flex items-center gap-1.5 font-medium ${
                              passwordChecks.minLength
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-600 dark:text-gray-300'
                            }`}
                          >
                            <Check
                              size={14}
                              className={
                                passwordChecks.minLength
                                  ? 'text-green-600 dark:text-green-400 shrink-0'
                                  : 'text-gray-400 shrink-0'
                              }
                            />
                            <span>At least 8 characters</span>
                          </div>

                          <div
                            className={`flex items-center gap-1.5 font-medium ${
                              passwordChecks.hasLetters
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-600 dark:text-gray-300'
                            }`}
                          >
                            <Check
                              size={14}
                              className={
                                passwordChecks.hasLetters
                                  ? 'text-green-600 dark:text-green-400 shrink-0'
                                  : 'text-gray-400 shrink-0'
                              }
                            />
                            <span>Upper &amp; lowercase letters (A-z)</span>
                          </div>

                          <div
                            className={`flex items-center gap-1.5 font-medium ${
                              passwordChecks.hasNumbers
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-600 dark:text-gray-300'
                            }`}
                          >
                            <Check
                              size={14}
                              className={
                                passwordChecks.hasNumbers
                                  ? 'text-green-600 dark:text-green-400 shrink-0'
                                  : 'text-gray-400 shrink-0'
                              }
                            />
                            <span>At least 1 number (0-9)</span>
                          </div>

                          <div
                            className={`flex items-center gap-1.5 font-medium ${
                              passwordChecks.hasSymbols
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-600 dark:text-gray-300'
                            }`}
                          >
                            <Check
                              size={14}
                              className={
                                passwordChecks.hasSymbols
                                  ? 'text-green-600 dark:text-green-400 shrink-0'
                                  : 'text-gray-400 shrink-0'
                              }
                            />
                            <span>At least 1 symbol (!@#$%^&amp;*)</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {mode === 'signup' && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                          Confirm Password
                        </label>
                        {confirmPassword.length > 0 && (
                          passwordsMatch ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400">
                              <CheckCircle2 size={13} />
                              Passwords match
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400">
                              <AlertCircle size={13} />
                              Passwords do not match
                            </span>
                          )
                        )}
                      </div>
                      <div className="relative">
                        <Lock
                          size={18}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          minLength={8}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter your password to confirm"
                          className={`w-full pl-10 pr-11 py-3 rounded-xl border bg-gray-50/60 dark:bg-brand-dark text-brand-black dark:text-white placeholder-gray-400 text-sm focus:bg-white dark:focus:bg-brand-dark outline-none transition-all ${
                            confirmPassword.length > 0
                              ? passwordsMatch
                                ? 'border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                                : 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                              : 'border-gray-200 dark:border-gray-700 focus:border-[#A020F0] focus:ring-2 focus:ring-[#A020F0]/20'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
                          aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3.5 px-6 rounded-xl bg-[linear-gradient(90deg,#C266E5_0%,#A74CE9_75%,#8C32EC_100%)] hover:opacity-95 text-white font-semibold text-sm md:text-base shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    <span>
                      {loading
                        ? mode === 'login'
                          ? 'Logging in...'
                          : 'Creating Account...'
                        : mode === 'login'
                        ? 'Login'
                        : 'Sign Up'}
                    </span>
                    {!loading && <ArrowRight size={18} />}
                  </button>
                </form>

                {/* Bottom Switch Option */}
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
                  {mode === 'login' ? (
                    <p className="text-sm text-brand-gray dark:text-gray-400">
                      Don&apos;t have an account?{' '}
                      <button
                        type="button"
                        onClick={() => switchMode('signup')}
                        className="text-[#A020F0] dark:text-purple-400 font-semibold hover:underline ml-1 cursor-pointer"
                      >
                        Create Account (Sign Up)
                      </button>
                    </p>
                  ) : (
                    <p className="text-sm text-brand-gray dark:text-gray-400">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => switchMode('login')}
                        className="text-[#A020F0] dark:text-purple-400 font-semibold hover:underline ml-1 cursor-pointer"
                      >
                        Login here
                      </button>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Highlighted 3D Moving Permanent Login Credentials Card */}
          <div
            className="lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none"
            style={{ perspective: '1200px' }}
          >
            <div
              onMouseMove={handleMouseMove3D}
              onMouseLeave={handleMouseLeave3D}
              style={{
                transform:
                  tilt.rotateX !== 0 || tilt.rotateY !== 0
                    ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(1.03, 1.03, 1.03)`
                    : undefined,
                transition: 'transform 0.2s ease-out',
              }}
              className="card-3d-float relative rounded-3xl p-[3px] bg-gradient-to-br from-[#EA4C89] via-[#A020F0] to-[#6366F1] cursor-pointer"
            >
              {/* Decorative Floating 3D Glow Orbs */}
              <div className="orb-float absolute -top-6 -right-6 w-24 h-24 rounded-full bg-fuchsia-500/40 blur-xl pointer-events-none" />
              <div className="orb-float absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-purple-600/40 blur-xl pointer-events-none" />

              {/* Inner 3D Card Surface */}
              <div className="relative rounded-[21px] bg-gradient-to-br from-[#1b0b2e] via-[#271044] to-[#140824] p-6 md:p-8 text-white overflow-hidden">
                {/* Highlight Shimmer Overlay */}
                <div className="absolute -top-24 -left-24 w-52 h-52 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

                {/* Header Badge */}
                <div className="flex items-center justify-between mb-5">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#EA4C89] to-[#A020F0] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-purple-500/30">
                    <Sparkles size={14} className="animate-spin" />
                    Permanent Login ID
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-purple-300 shadow-inner">
                    <KeyRound size={20} />
                  </div>
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-tight">
                  Instant Access Credentials
                </h2>
                <p className="text-xs md:text-sm text-purple-200/80 mb-6 font-light leading-relaxed">
                  Use this permanent Login ID &amp; Password anytime to sign in and unlock all
                  services and call bookings.
                </p>

                {/* Highlighted 3D Credential Boxes */}
                <div className="space-y-4">
                  {/* Email Box */}
                  <div className="group/box relative rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-purple-400/40 p-4 transition-all duration-300 shadow-[0_10px_25px_rgba(0,0,0,0.35)] hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-pink-300">
                        Email ID
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy('saatwik12@gmail.com', 'email')}
                        className="text-xs text-purple-200 hover:text-white flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                      >
                        {copiedField === 'email' ? (
                          <>
                            <Check size={12} className="text-green-400" />
                            <span className="text-green-300">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="font-mono text-base md:text-lg font-bold text-amber-300 tracking-wide select-all break-all drop-shadow">
                      saatwik12@gmail.com
                    </p>
                  </div>

                  {/* Password Box */}
                  <div className="group/box relative rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-purple-400/40 p-4 transition-all duration-300 shadow-[0_10px_25px_rgba(0,0,0,0.35)] hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-pink-300">
                        Password
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy('Saatwikss12#', 'password')}
                        className="text-xs text-purple-200 hover:text-white flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                      >
                        {copiedField === 'password' ? (
                          <>
                            <Check size={12} className="text-green-400" />
                            <span className="text-green-300">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="font-mono text-base md:text-lg font-bold text-emerald-300 tracking-wide select-all drop-shadow">
                      Saatwikss12#
                    </p>
                  </div>
                </div>

                {/* One-Click Auto-Fill Button */}
                <button
                  type="button"
                  onClick={handleFillPermanent}
                  className="w-full mt-6 py-3 px-4 rounded-xl bg-gradient-to-r from-[#EA4C89] via-[#C266E5] to-[#8C32EC] hover:opacity-95 text-white font-semibold text-sm shadow-lg shadow-purple-900/50 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles size={16} />
                  <span>Use Permanent Credentials</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-sm text-brand-gray dark:text-gray-400 hover:text-[#A020F0] dark:hover:text-purple-400 transition-colors cursor-pointer"
          >
            &larr; Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
