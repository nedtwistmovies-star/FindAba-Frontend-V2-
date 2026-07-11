import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useStore } from '../store/useStore';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic Validation
    if (!name.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const { error: signUpError } = await signUp(email, password, name, phone);
      if (signUpError) {
        if (signUpError.message?.toLowerCase().includes('already registered') || 
            signUpError.message?.toLowerCase().includes('already exists') ||
            signUpError.message?.toLowerCase().includes('taken')) {
          setError('This email is already registered with FindAba OS. Would you like to sign in instead?');
        } else {
          setError(signUpError.message || 'Registration failed. Please check your details.');
        }
      } else {
        navigate('/onboarding');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4 py-12 relative">
      <div className="absolute top-6 left-6">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl mt-12 sm:mt-0">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-zinc-950 text-xl shadow-lg shadow-emerald-500/30">
            FA
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Join FindAba OS</h1>
            <p className="text-xs text-zinc-400">Create your city account today</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={name || ''}
                onChange={(e) => setName(e.target.value)}
                placeholder="Chinedu Okafor"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 pl-11 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                value={email || ''}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 pl-11 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
              <input
                type="tel"
                value={phone || ''}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 803 000 0000"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 pl-11 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password || ''}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 pl-11 pr-11 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-zinc-400 hover:text-white transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all mt-2"
          >
            <span>{loading ? 'Creating account...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-zinc-400">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-emerald-400 font-semibold hover:underline"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};
