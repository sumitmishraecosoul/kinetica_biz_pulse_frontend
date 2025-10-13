'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { authAPI } from '../services/api';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate form
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Attempting login with:', { email: formData.email });
      const res = await authAPI.signin({ email: formData.email, password: formData.password });
      const { token, refreshToken } = res.data?.data || {};
      
      if (!token) throw new Error('No token received');
      
      localStorage.setItem('auth_token', token);
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }
      localStorage.setItem('user_email', formData.email);
      
      console.log('Login successful, redirecting...');
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || err.message || 'Login failed. Please check your credentials.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/dashboard_login_bg.svg)',
          filter: 'brightness(0.6) contrast(1.1)'
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/85 via-gray-800/75 to-gray-900/85" />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left Panel - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center px-8 py-16">
          <div className="text-center">
            {/* Logo */}
            <div className="mb-8">
              <Image
                src="/vectorai_logo.svg"
                alt="Kinetica Biz-Pulse Logo"
                width={350}
                height={150}
                className="object-contain mx-auto"
              />
            </div>
            
            {/* Welcome Message */}
            <h2 className="text-5xl font-light text-white leading-tight">
              Welcome Back.
            </h2>
          </div>
        </div>
        
        {/* Right Panel - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-start pl-4 py-12">
          <div className="w-full max-w-md">
            {/* Login Form Card */}
            <div className="backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl" style={{ backgroundColor: 'rgba(11, 38, 57, 0.8)' }}>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold text-white mb-2">
                  Enter your email to sign in.
                </h3>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-500/20 border border-red-400/50 text-red-200 px-4 py-3 rounded-lg text-sm backdrop-blur-sm">
                    {error}
                  </div>
                )}
                
                {/* Email Field */}
                <div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-white/90 rounded-xl border-0 focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all duration-200"
                    style={{ color: '#A28750' }}
                    placeholder="email@domain.com"
                  />
                </div>
                
                {/* Password Field */}
                <div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-white/90 rounded-xl border-0 focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all duration-200"
                    style={{ color: '#A28750' }}
                    placeholder="password"
                  />
                </div>
                
                {/* Continue Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full text-white py-4 px-6 rounded-xl font-semibold focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                  style={{ backgroundColor: '#DCBA87' }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing In...
                    </div>
                  ) : (
                    'Continue'
                  )}
                </button>
              </form>
              
              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="text-white/80 text-sm">
                  New Account?{' '}
                  <button
                    onClick={() => router.push('/signup')}
                    className="text-white font-semibold hover:text-orange-300 transition-colors duration-200"
                  >
                    Sign Up Now.
                  </button>
                </p>
              </div>
              
              {/* Terms and Privacy */}
              <div className="mt-8 text-center">
                <p className="text-white/60 text-xs leading-relaxed">
                  By clicking continue, you agree to our{' '}
                  <button className="text-white/80 hover:text-white transition-colors duration-200">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button className="text-white/80 hover:text-white transition-colors duration-200">
                    Privacy Policy
                  </button>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
