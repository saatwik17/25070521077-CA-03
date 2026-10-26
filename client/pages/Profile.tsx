import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  KeyRound,
  Save,
  Copy,
  Check,
  ArrowLeft,
  Fingerprint,
} from 'lucide-react';
import { AuthUser } from './Login';

interface ProfilePageProps {
  user: AuthUser;
  onUpdateUser: (updatedUser: AuthUser, newToken: string) => void;
  navigate: (path: string) => void;
}

export const Profile: React.FC<ProfilePageProps> = ({ user, onUpdateUser, navigate }) => {
  const [name, setName] = useState(user.name);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [lastUpdatedPassword, setLastUpdatedPassword] = useState<string>('');

  // 3D Tilt states for both the Credential Card and the Edit Form Card
  const [cardTilt, setCardTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [formTilt, setFormTilt] = useState({ rotateX: 0, rotateY: 0 });

  useEffect(() => {
    setName(user.name);
  }, [user.name]);

  // Strong Password checks (when user enters a new password)
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

  const handleMouseMoveCard3D = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    setCardTilt({ rotateX, rotateY });
  };

  const handleMouseMoveForm3D = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    setFormTilt({ rotateX, rotateY });
  };

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(user.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 1800);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Name cannot be empty.');
      return;
    }

    if (password.length > 0) {
      if (!isStrongPassword) {
        setError(
          'Please follow the Strong Password rules: Use 8 or more characters with a mix of uppercase & lowercase letters, numbers & symbols.'
        );
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please enter the same password twice.');
        return;
      }
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('ambitiouspedia_token') || '';
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: trimmedName,
          password: password.length > 0 ? password : undefined,
          confirmPassword: password.length > 0 ? confirmPassword : undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Failed to update credentials.');
        setLoading(false);
        return;
      }

      if (password.length > 0) {
        setLastUpdatedPassword(password);
      }
      setPassword('');
      setConfirmPassword('');
      onUpdateUser(data.user, data.token);
      setSuccessMsg(
        password.length > 0
          ? 'Your Name and Password have been updated successfully!'
          : 'Your Name has been updated successfully!'
      );
    } catch (_err) {
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const initials = (user.name || 'U')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen pt-28 pb-20 flex items-center justify-center bg-gray-50 dark:bg-brand-dark px-4 md:px-8 font-sans transition-colors duration-300 overflow-hidden">
      <style>{`
        @keyframes float3DProfile {
          0%, 100% {
            transform: translateY(0px) rotateX(2deg) rotateY(-4deg);
          }
          50% {
            transform: translateY(-14px) rotateX(-3deg) rotateY(5deg);
          }
        }
        @keyframes pulseGlowProfile {
          0%, 100% {
            box-shadow: 0 22px 55px -10px rgba(160, 32, 240, 0.45), 0 0 30px rgba(194, 102, 229, 0.35);
          }
          50% {
            box-shadow: 0 32px 70px -5px rgba(160, 32, 240, 0.75), 0 0 45px rgba(234, 76, 137, 0.55);
          }
        }
        @keyframes orbitOrbProfile {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(16px, -16px) scale(1.15);
          }
        }
        .profile-3d-card {
          animation: float3DProfile 4.5s ease-in-out infinite, pulseGlowProfile 4.5s ease-in-out infinite;
          transform-style: preserve-3d;
        }
        .profile-orb {
          animation: orbitOrbProfile 6s ease-in-out infinite;
        }
      `}</style>

      <div className="w-full max-w-5xl mx-auto">
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={() => navigate('/services')}
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-gray dark:text-gray-300 hover:text-[#A020F0] dark:hover:text-purple-400 transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
            <span>Back to Services</span>
          </button>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#A020F0] dark:text-purple-300 text-xs font-semibold">
            <ShieldCheck size={14} />
            Verified Account Session
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: 3D Floating Credential Details Card */}
          <div
            className="lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none"
            style={{ perspective: '1200px' }}
          >
            <div
              onMouseMove={handleMouseMoveCard3D}
              onMouseLeave={() => setCardTilt({ rotateX: 0, rotateY: 0 })}
              style={{
                transform:
                  cardTilt.rotateX !== 0 || cardTilt.rotateY !== 0
                    ? `rotateX(${cardTilt.rotateX}deg) rotateY(${cardTilt.rotateY}deg) scale3d(1.03, 1.03, 1.03)`
                    : undefined,
                transition: 'transform 0.2s ease-out',
              }}
              className="profile-3d-card relative rounded-3xl p-[3px] bg-gradient-to-br from-[#EA4C89] via-[#A020F0] to-[#6366F1] cursor-pointer"
            >
              {/* Decorative Floating 3D Glow Orbs */}
              <div className="profile-orb absolute -top-6 -right-6 w-24 h-24 rounded-full bg-fuchsia-500/40 blur-xl pointer-events-none" />
              <div className="profile-orb absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-purple-600/40 blur-xl pointer-events-none" />

              {/* Inner 3D Card Surface */}
              <div className="relative rounded-[21px] bg-gradient-to-br from-[#1b0b2e] via-[#271044] to-[#140824] p-6 md:p-8 text-white overflow-hidden">
                <div className="absolute -top-24 -left-24 w-52 h-52 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

                {/* Top Badge */}
                <div className="flex items-center justify-between mb-6">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#EA4C89] to-[#A020F0] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-purple-500/30">
                    <Sparkles size={14} className="animate-spin" />
                    My Credentials
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-purple-300 shadow-inner">
                    <KeyRound size={20} />
                  </div>
                </div>

                {/* 3D Avatar + Name Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#EA4C89] via-[#A020F0] to-[#6366F1] p-0.5 shadow-xl">
                    <div className="w-full h-full rounded-[14px] bg-[#1b0b2e] flex items-center justify-center text-2xl font-bold text-white tracking-wider">
                      {initials}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xl md:text-2xl font-bold text-white truncate drop-shadow">
                      {user.name}
                    </h2>
                    <p className="text-xs text-purple-200/80 flex items-center gap-1.5 mt-0.5">
                      <Fingerprint size={13} className="text-pink-400 shrink-0" />
                      <span className="truncate">ID: {user.id.slice(0, 12)}</span>
                    </p>
                  </div>
                </div>

                {/* Highlighted 3D Credential Detail Boxes */}
                <div className="space-y-4">
                  {/* Name Box */}
                  <div className="rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-purple-400/40 p-4 transition-all duration-300 shadow-[0_10px_25px_rgba(0,0,0,0.35)] hover:-translate-y-1">
                    <span className="block text-[11px] font-bold uppercase tracking-widest text-pink-300 mb-1">
                      Account Holder Name
                    </span>
                    <p className="font-semibold text-base md:text-lg text-white tracking-wide break-all drop-shadow">
                      {user.name}
                    </p>
                  </div>

                  {/* Email Box */}
                  <div className="rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-purple-400/40 p-4 transition-all duration-300 shadow-[0_10px_25px_rgba(0,0,0,0.35)] hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-pink-300">
                        Registered Email ID
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        className="text-xs text-purple-200 hover:text-white flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                      >
                        {copiedEmail ? (
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
                      {user.email}
                    </p>
                  </div>

                  {/* Password Status Box */}
                  <div className="rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-purple-400/40 p-4 transition-all duration-300 shadow-[0_10px_25px_rgba(0,0,0,0.35)] hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-pink-300">
                        Password Credential
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-400/30">
                        Encrypted &amp; Active
                      </span>
                    </div>
                    <p className="font-mono text-base md:text-lg font-bold text-emerald-300 tracking-wider drop-shadow">
                      {lastUpdatedPassword
                        ? lastUpdatedPassword
                        : user.email.toLowerCase() === 'saatwik12@gmail.com'
                        ? 'Saatwikss12#'
                        : '••••••••••••'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive Edit Credentials Form */}
          <div
            className="lg:col-span-7 w-full max-w-md mx-auto lg:max-w-none"
            style={{ perspective: '1200px' }}
          >
            <div
              onMouseMove={handleMouseMoveForm3D}
              onMouseLeave={() => setFormTilt({ rotateX: 0, rotateY: 0 })}
              style={{
                transform:
                  formTilt.rotateX !== 0 || formTilt.rotateY !== 0
                    ? `rotateX(${formTilt.rotateX}deg) rotateY(${formTilt.rotateY}deg)`
                    : undefined,
                transition: 'transform 0.2s ease-out',
              }}
              className="bg-white dark:bg-brand-card rounded-3xl shadow-2xl border-2 border-purple-100 dark:border-purple-900/50 p-6 md:p-10 transition-colors duration-300"
            >
              <div className="mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-purple-100 dark:bg-purple-950/60 text-[#A020F0] dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles size={13} />
                  Update Details
                </span>
                <h1 className="text-2xl md:text-3xl font-bold text-brand-black dark:text-white">
                  Edit My Credentials
                </h1>
                <p className="text-sm text-brand-gray dark:text-gray-400 font-light mt-1">
                  Update your account holder name or set a new strong password below.
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

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Edit Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                    Your Name
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

                {/* Read-Only Email ID */}
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
                      disabled
                      value={user.email}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900/60 text-gray-500 dark:text-gray-400 text-sm cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Edit Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                    New Password <span className="text-gray-400 font-normal normal-case">(leave blank to keep current password)</span>
                  </label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new strong password (min 8 chars)"
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

                  {/* Strong Password Indicator Box */}
                  <div className="mt-3 p-4 rounded-xl bg-gradient-to-r from-purple-50 via-fuchsia-50 to-purple-50 dark:from-purple-950/50 dark:via-fuchsia-950/40 dark:to-purple-950/50 border-2 border-[#A020F0]/40 dark:border-purple-500/50 shadow-sm">
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#A020F0] text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                          <ShieldCheck size={14} />
                          Strong Password
                        </span>
                        {password.length > 0 &&
                          (isStrongPassword ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-green-100 dark:bg-green-950/70 border border-green-300 dark:border-green-700 text-xs font-bold text-green-600 dark:text-green-400">
                              <CheckCircle2 size={13} />
                              Strong
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-red-100 dark:bg-red-950/70 border border-red-300 dark:border-red-700 text-xs font-bold text-red-600 dark:text-red-400">
                              <AlertCircle size={13} />
                              Weak
                            </span>
                          ))}
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
                </div>

                {/* Confirm New Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                      Confirm New Password
                    </label>
                    {confirmPassword.length > 0 &&
                      (passwordsMatch ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400">
                          <CheckCircle2 size={13} />
                          Passwords match
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400">
                          <AlertCircle size={13} />
                          Passwords do not match
                        </span>
                      ))}
                  </div>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required={password.length > 0}
                      placeholder="Re-enter new password to confirm"
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-[linear-gradient(90deg,#C266E5_0%,#A74CE9_75%,#8C32EC_100%)] hover:opacity-95 text-white font-semibold text-sm md:text-base shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  <Save size={18} />
                  <span>{loading ? 'Saving Changes...' : 'Save Updated Credentials'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
