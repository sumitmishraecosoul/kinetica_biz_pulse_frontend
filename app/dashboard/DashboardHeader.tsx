
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { authAPI } from '../services/api';

export default function DashboardHeader() {
  const [userEmail, setUserEmail] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('user_email');
      setUserEmail(email || '');
    }
  }, []);

  const handleLogout = () => {
    authAPI.logout();
  };

  const isActiveTab = (path: string) => {
    console.log('Checking path:', path, 'Current pathname:', pathname);
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.includes(path);
  };

  return (
    <header className="shadow-sm" style={{ backgroundColor: '#0B2639' }}>
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6 ml-8">
            <Link href="/" className="flex items-center space-x-8">
              <img src="/assets/ThriveLogo.svg" alt="Thrive Brands" className="h-14 w-auto" />
              <img src="/assets/Kiinetica_Sports_Logo_white.png" alt="Kinetica Sports" className="h-12 w-auto" />
            </Link>
          </div>
          
          <nav className="flex space-x-3 flex-1 justify-center">
              <Link 
                href="/dashboard" 
                className={`text-sm font-medium whitespace-nowrap pb-1 ${
                  isActiveTab('/dashboard') && pathname === '/dashboard'
                    ? 'text-white border-b-2 border-blue-400' 
                    : 'text-white hover:text-gray-200'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/dashboard/business-analysis" 
                className={`text-sm font-medium whitespace-nowrap pb-1 ${
                  pathname === '/dashboard/business-analysis'
                    ? 'text-white border-b-2 border-blue-400' 
                    : 'text-white hover:text-gray-200'
                }`}
              >
                Business
              </Link>
              <Link 
                href="/dashboard/customers" 
                className={`text-sm font-medium whitespace-nowrap pb-1 ${
                  pathname === '/dashboard/customers'
                    ? 'text-white border-b-2 border-blue-400' 
                    : 'text-white hover:text-gray-200'
                }`}
              >
                Customer
              </Link>
              <Link 
                href="/dashboard/brands" 
                className={`text-sm font-medium whitespace-nowrap pb-1 ${
                  pathname === '/dashboard/brands'
                    ? 'text-white border-b-2 border-blue-400' 
                    : 'text-white hover:text-gray-200'
                }`}
              >
                Brand
              </Link>
              <Link 
                href="/dashboard/categories" 
                className={`text-sm font-medium whitespace-nowrap pb-1 ${
                  pathname === '/dashboard/categories'
                    ? 'text-white border-b-2 border-blue-400' 
                    : 'text-white hover:text-gray-200'
                }`}
              >
                Category
              </Link>
              <Link 
                href="/dashboard/reports" 
                className={`text-sm font-medium whitespace-nowrap pb-1 ${
                  pathname === '/dashboard/reports'
                    ? 'text-white border-b-2 border-blue-200' 
                    : 'text-white hover:text-gray-200'
                }`}
              >
                Reports
              </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button className="w-8 h-8 flex items-center justify-center text-white hover:text-gray-200">
              <i className="ri-notification-line text-lg"></i>
            </button>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-white">{userEmail}</span>
              <button className="w-8 h-8 flex items-center justify-center text-white hover:text-gray-200">
                <i className="ri-user-line text-lg"></i>
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
