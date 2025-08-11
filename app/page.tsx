
'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 font-['Pacifico']">logo</h1>
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Business Intelligence Portal</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Analyze your sales performance across business areas, channels, and customers with comprehensive reporting and filtering capabilities.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Portal Features</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="w-12 h-12 flex items-center justify-center bg-blue-500 text-white rounded-lg mb-4">
                  <i className="ri-pie-chart-line text-xl"></i>
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Business Area Analysis</h4>
                <p className="text-gray-600">Track performance across Food, Household, Brillo, and Kinetica divisions with detailed brand and category breakdowns.</p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <div className="w-12 h-12 flex items-center justify-center bg-green-500 text-white rounded-lg mb-4">
                  <i className="ri-store-line text-xl"></i>
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Channel Performance</h4>
                <p className="text-gray-600">Monitor sales across 7 key channels including Grocery, Wholesale, International, Online, and Sports segments.</p>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="w-12 h-12 flex items-center justify-center bg-purple-500 text-white rounded-lg mb-4">
                  <i className="ri-filter-line text-xl"></i>
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Advanced Filtering</h4>
                <p className="text-gray-600">Filter data by period, month, business area, and channel for detailed analysis and reporting.</p>
              </div>

              <div className="bg-orange-50 p-6 rounded-lg">
                <div className="w-12 h-12 flex items-center justify-center bg-orange-500 text-white rounded-lg mb-4">
                  <i className="ri-line-chart-line text-xl"></i>
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Performance Metrics</h4>
                <p className="text-gray-600">Track revenue, margins, units sold, and growth rates with comprehensive data visualization.</p>
              </div>
            </div>

            <div className="text-center">
              <Link 
                href="/dashboard" 
                className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                <i className="ri-dashboard-line mr-2"></i>
                Access Dashboard
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Data Structure</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Business Areas</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Food - Multiple brands and categories</li>
                  <li>• Household - Cleaning and home products</li>
                  <li>• Brillo - Kitchen cleaning solutions</li>
                  <li>• Kinetica - Sports nutrition products</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Sales Channels</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Grocery ROI & NI/UK</li>
                  <li>• Wholesale ROI & NI/UK</li>
                  <li>• International markets</li>
                  <li>• Online & Sports retail</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
