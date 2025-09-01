'use client';

import { useState } from 'react';
import { authAPI } from '../services/api';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roles, setRoles] = useState('user');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const rolesArray = roles
        .split(',')
        .map(r => r.trim())
        .filter(Boolean);
      const res = await authAPI.signup({ email, password, roles: rolesArray });
      const { token, refreshToken } = res.data?.data || {};
      if (!token) throw new Error('No token returned');
      
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
        <h1 className="text-xl font-semibold">Sign up</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input className="w-full border rounded px-3 py-2" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input className="w-full border rounded px-3 py-2" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Roles (comma-separated)</label>
          <input className="w-full border rounded px-3 py-2" type="text" value={roles} onChange={e => setRoles(e.target.value)} placeholder="user, business:food, channel:roi" />
        </div>
        <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60" type="submit">
          {loading ? 'Signing up...' : 'Sign up'}
        </button>
        
        {/* Bypass Login Button */}
        
        
        <p className="text-sm text-gray-600 text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">Sign in</Link>
        </p>
      </form>
    </div>
  );
}


