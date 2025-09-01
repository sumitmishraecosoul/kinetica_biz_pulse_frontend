'use client';

import { useState } from 'react';
import { authAPI } from '../services/api';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authAPI.signin({ email, password });
      const { token, refreshToken } = res.data?.data || {};
      if (!token) throw new Error('No token received');
      
      localStorage.setItem('auth_token', token);
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }
      localStorage.setItem('user_email', email);
      
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white p-6 rounded shadow space-y-4">
        <h1 className="text-xl font-semibold">Sign in</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input className="w-full border rounded px-3 py-2" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input className="w-full border rounded px-3 py-2" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60" type="submit">
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        
        {/* Bypass Login Button */}
        
        
        <p className="text-sm text-gray-600 text-center">
          No account?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline">Sign up</Link>
        </p>
      </form>
    </div>
  );
}


