'use client';

import { useEffect, useState } from 'react';
import { dashboardAPI } from '../services/api';

interface BusinessAreaMetrics {
  businessArea: string;
  cases: {
    ytdNo: number;
    lyVarNo: number;
    lyVarPercent: number;
  };
  gSales: {
    ytdNo: number;
    lyVarNo: number;
    lyVarPercent: number;
  };
  fGP: {
    ytdNo: number;
    lyVarNo: number;
    lyVarPercent: number;
  };
}

interface BusinessAreaDetailedCardsProps {
  selectedBusinessArea?: string;
  selectedPeriod?: string;
  selectedMonth?: string;
  selectedChannel?: string; // Add selectedChannel prop
  onDrillDown?: (businessArea: string) => void;
}

export default function BusinessAreaDetailedCards({ 
  selectedBusinessArea, 
  selectedPeriod = 'YTD',
  selectedMonth = 'All',
  selectedChannel = 'All', // Add default value
  onDrillDown 
}: BusinessAreaDetailedCardsProps) {
  const [metrics, setMetrics] = useState<BusinessAreaMetrics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const params: any = {};
        
        // Add period filter
        if (selectedPeriod && selectedPeriod !== 'YTD') {
          params.period = selectedPeriod;
        }
        
        // Add month filter
        if (selectedMonth && selectedMonth !== 'All') {
          params.month = selectedMonth;
        }
        
        // Add channel filter
        if (selectedChannel && selectedChannel !== 'All') {
          params.channel = selectedChannel;
        }
        
        const response = await dashboardAPI.getBusinessAreaDetailed(params);
        console.log('Business Area Metrics Response:', response.data);
        setMetrics(response.data.data || []);
      } catch (error) {
        console.error('Error fetching business area detailed metrics:', error);
        setMetrics([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [selectedPeriod, selectedMonth, selectedChannel]); // Refetch when filters change

  // Filter metrics if a specific business area is selected
  const displayMetrics = selectedBusinessArea && selectedBusinessArea !== 'All' 
    ? metrics.filter(m => m.businessArea === selectedBusinessArea)
    : metrics;

  const formatNumber = (value: number, metric: string) => {
    if (metric === 'cases') {
      return value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : 
             value >= 1000 ? `${(value / 1000).toFixed(1)}K` : 
             value.toLocaleString();
    } else {
      // For gSales and fGP, format as currency with proper commas
      if (value >= 1000000) {
        return `€${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `€${(value / 1000).toFixed(1)}K`;
      } else {
        return `€${value.toLocaleString()}`;
      }
    }
  };

  const formatVariance = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue >= 1000000) {
      return `${value >= 0 ? '+' : ''}${(value / 1000000).toFixed(1)}M`;
    } else if (absValue >= 1000) {
      return `${value >= 0 ? '+' : ''}${(value / 1000).toFixed(1)}K`;
    } else {
      return `${value >= 0 ? '+' : ''}${value.toLocaleString()}`;
    }
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="h-6 bg-gray-200 rounded-lg w-32 mb-6 animate-pulse"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((k) => (
                      <div key={k} className="text-center">
                        <div className="h-5 bg-gray-200 rounded w-12 animate-pulse mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-8 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Debug: Log the metrics to see what we're getting
  console.log('Display Metrics:', displayMetrics);
  console.log('Current Filters:', { selectedPeriod, selectedMonth, selectedBusinessArea, selectedChannel });

  return (
    <div className="grid grid-cols-1 gap-6">
      {displayMetrics.map((metric) => (
        <div 
          key={metric.businessArea} 
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 cursor-pointer hover:shadow-xl hover:border-blue-200 transition-all duration-200 transform hover:-translate-y-1"
          onClick={() => onDrillDown?.(metric.businessArea)}
        >
          {/* Business Area Header */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-1 leading-tight">
              {metric.businessArea}
            </h3>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="space-y-4">
            {/* Header Row with Column Labels */}
            <div className="grid grid-cols-4 gap-2 text-xs font-medium text-gray-500 mb-3">
              <div className="text-center">Metric</div>
              <div className="text-center">YTD No.</div>
              <div className="text-center">LY Var No.</div>
              <div className="text-center">LY Var %</div>
            </div>

            {/* Cases Row */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="grid grid-cols-4 gap-2 items-center">
                <div className="text-sm font-semibold text-gray-700">Cases</div>
                <div className="text-center">
                  <div className="text-base font-bold text-gray-900">
                    {formatNumber(metric.cases.ytdNo, 'cases')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    {metric.cases.lyVarNo >= 0 ? (
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className={`text-base font-bold ${metric.cases.lyVarNo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.abs(metric.cases.lyVarNo) >= 1000000 ? `${(Math.abs(metric.cases.lyVarNo) / 1000000).toFixed(1)}M` :
                       Math.abs(metric.cases.lyVarNo) >= 1000 ? `${(Math.abs(metric.cases.lyVarNo) / 1000).toFixed(1)}K` :
                       Math.abs(metric.cases.lyVarNo).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    {metric.cases.lyVarPercent >= 0 ? (
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className={`text-base font-bold ${metric.cases.lyVarPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.abs(metric.cases.lyVarPercent).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* gSales Row */}
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="grid grid-cols-4 gap-2 items-center">
                <div className="text-sm font-semibold text-blue-700">gSales</div>
                <div className="text-center">
                  <div className="text-base font-bold text-gray-900">
                    {formatNumber(metric.gSales.ytdNo, 'gSales')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    {metric.gSales.lyVarNo >= 0 ? (
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className={`text-base font-bold ${metric.gSales.lyVarNo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.abs(metric.gSales.lyVarNo) >= 1000000 ? `€${(Math.abs(metric.gSales.lyVarNo) / 1000000).toFixed(1)}M` :
                       Math.abs(metric.gSales.lyVarNo) >= 1000 ? `€${(Math.abs(metric.gSales.lyVarNo) / 1000).toFixed(1)}K` :
                       `€${Math.abs(metric.gSales.lyVarNo).toLocaleString()}`}
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    {metric.gSales.lyVarPercent >= 0 ? (
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className={`text-base font-bold ${metric.gSales.lyVarPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.abs(metric.gSales.lyVarPercent).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* fGP Row */}
            <div className="bg-green-50 rounded-lg p-3">
              <div className="grid grid-cols-4 gap-2 items-center">
                <div className="text-sm font-semibold text-green-700">fGP</div>
                <div className="text-center">
                  <div className="text-base font-bold text-gray-900">
                    {formatNumber(metric.fGP.ytdNo, 'fGP')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    {metric.fGP.lyVarNo >= 0 ? (
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className={`text-base font-bold ${metric.fGP.lyVarNo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.abs(metric.fGP.lyVarNo) >= 1000000 ? `€${(Math.abs(metric.fGP.lyVarNo) / 1000000).toFixed(1)}M` :
                       Math.abs(metric.fGP.lyVarNo) >= 1000 ? `€${(Math.abs(metric.fGP.lyVarNo) / 1000).toFixed(1)}K` :
                       `€${Math.abs(metric.fGP.lyVarNo).toLocaleString()}`}
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    {metric.fGP.lyVarPercent >= 0 ? (
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className={`text-base font-bold ${metric.fGP.lyVarPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.abs(metric.fGP.lyVarPercent).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
