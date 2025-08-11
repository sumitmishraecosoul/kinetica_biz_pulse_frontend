
'use client';

import Link from 'next/link';

export default function DashboardHeader() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-gray-900 font-['Pacifico']">
              logo
            </Link>
            <nav className="flex space-x-6">
              <Link href="/dashboard" className="text-blue-600 font-medium whitespace-nowrap">
                Dashboard
              </Link>
              <Link href="/dashboard/customers" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
                Customer Analysis
              </Link>
              <Link href="/dashboard/brands" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
                Brand Analysis
              </Link>
              <Link href="/dashboard/categories" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
                Category Analysis
              </Link>
              <Link href="/dashboard/reports" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
                Reports
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900">
              <i className="ri-notification-line text-lg"></i>
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900">
              <i className="ri-user-line text-lg"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
