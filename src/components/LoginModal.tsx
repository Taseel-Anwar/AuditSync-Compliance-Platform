import React, { useState } from 'react';
import { Chrome, LayoutGrid, X } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('taseelb6060@gmail.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.user) {
        onLoginSuccess(data.user.email);
      }
      onClose();
    } catch {
      onLoginSuccess(email);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <main className="w-full max-w-[420px] mx-auto bg-white border border-[#C6C6CD] rounded-xl card-elevation p-8 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AuditSync</h1>
          <p className="text-sm text-[#45464D] mt-2">Enterprise Risk Management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SSO Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => {
                onLoginSuccess('taseelb6060@gmail.com');
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 bg-white border border-[#C6C6CD] text-[#45464D] text-sm font-medium py-2.5 px-4 rounded-lg hover:bg-[#F2F4F6] transition-colors"
            >
              <Chrome className="w-4 h-4 text-slate-700" />
              <span>Continue with Google</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onLoginSuccess('taseelb6060@gmail.com');
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 bg-white border border-[#C6C6CD] text-[#45464D] text-sm font-medium py-2.5 px-4 rounded-lg hover:bg-[#F2F4F6] transition-colors"
            >
              <LayoutGrid className="w-4 h-4 text-slate-700" />
              <span>Continue with Microsoft</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-grow h-px bg-[#C6C6CD]"></div>
            <span className="text-xs text-[#76777D] font-medium uppercase">or</span>
            <div className="flex-grow h-px bg-[#C6C6CD]"></div>
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-900" htmlFor="login-email">
                Work Email
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-white border border-[#C6C6CD] rounded-lg px-4 py-2 text-sm text-slate-900 placeholder:text-[#76777D] input-ring transition-shadow"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-medium text-slate-900" htmlFor="login-password">
                  Password
                </label>
                <a href="#" onClick={(e) => e.preventDefault()} className="text-xs text-[#3980F4] hover:underline">
                  Forgot?
                </a>
              </div>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-[#C6C6CD] rounded-lg px-4 py-2 text-sm text-slate-900 placeholder:text-[#76777D] input-ring transition-shadow"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors shadow-xs"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#45464D] leading-relaxed">
          By continuing, you agree to our{' '}
          <a href="#" className="text-[#3980F4] hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-[#3980F4] hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </main>
    </div>
  );
};
