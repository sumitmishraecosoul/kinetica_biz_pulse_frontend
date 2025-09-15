'use client';

import { SummaryRowData } from '../../services/summaryCalculationService';

interface TrendTableProps {
  data: any[];
  title?: string;
  loading?: boolean;
  periodLabel?: string;
}

export default function TrendTable({ data, title = "Trend by Month", loading = false, periodLabel = "YTD" }: TrendTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading trend data...</span>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
        <div className="text-center py-8 text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num === 0) return '0';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const formatCurrency = (num: number) => {
    if (num === 0) return '0';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const formatPercentage = (num: number) => {
    if (num === 0) return '0.0%';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(num) + '%';
  };

  const formatVariance = (num: number) => {
    if (num === 0) return '0';
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(num));
    return num < 0 ? `(${formatted})` : formatted;
  };

  const formatVariancePercent = (num: number) => {
    if (num === 0) return '0.0%';
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(Math.abs(num)) + '%';
    return num < 0 ? `-${formatted}` : formatted;
  };

  const isTotalRow = (name: string) => {
    return name === 'Total' || name === 'Business Areas Total' || name === 'Channels Total' || name === 'Brands Total' || name === 'Customers Total' || name === 'Private Label';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Month
              </th>
              
              {/* Cases */}
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={4}>
                Cases
              </th>
              
              {/* gSales */}
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={4}>
                gSales (€'000)
              </th>
              
              {/* fGP */}
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={4}>
                fGP (€'000)
              </th>
              
              {/* fGP %} */}
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={3}>
                fGP %
              </th>
              
              {/* 2024 Full Month */}
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={3}>
                2024 Full Month
              </th>
            </tr>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {/* Month column */}
              </th>
              
              {/* Cases sub-headers */}
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                2025 No.
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                2024 No.
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Var No.
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Var %
              </th>
              
              {/* gSales sub-headers */}
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                2025 €'000
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                2024 €'000
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Var €'000
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Var %
              </th>
              
              {/* fGP sub-headers */}
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                2025 €'000
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                2024 €'000
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Var €'000
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Var %
              </th>
              
              {/* fGP % sub-headers */}
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                2025 %
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                2024 %
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Var %
              </th>
              
              {/* 2024 Full Month sub-headers */}
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                gSales
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                FGP
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                FGP %
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr key={index} className={isTotalRow(row.name) ? 'bg-gray-50 font-semibold' : 'hover:bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {row.name}
                </td>
                
                {/* Cases */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatNumber(row.cases?.ytd || 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatNumber(row.cases?.ly || 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <span className={row.cases?.lyVar < 0 ? 'text-red-600' : 'text-green-600'}>
                    {formatVariance(row.cases?.lyVar || 0)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <span className={row.cases?.lyVarPercent < 0 ? 'text-red-600' : 'text-green-600'}>
                    {formatVariancePercent(row.cases?.lyVarPercent || 0)}
                  </span>
                </td>
                
                {/* gSales */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatCurrency(row.gSales?.ytd || 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatCurrency(row.gSales?.ly || 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <span className={row.gSales?.lyVar < 0 ? 'text-red-600' : 'text-green-600'}>
                    {formatVariance(row.gSales?.lyVar || 0)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <span className={row.gSales?.lyVarPercent < 0 ? 'text-red-600' : 'text-green-600'}>
                    {formatVariancePercent(row.gSales?.lyVarPercent || 0)}
                  </span>
                </td>
                
                {/* fGP */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatCurrency(row.fGP?.ytd || 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatCurrency(row.fGP?.ly || 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <span className={row.fGP?.lyVar < 0 ? 'text-red-600' : 'text-green-600'}>
                    {formatVariance(row.fGP?.lyVar || 0)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <span className={row.fGP?.lyVarPercent < 0 ? 'text-red-600' : 'text-green-600'}>
                    {formatVariancePercent(row.fGP?.lyVarPercent || 0)}
                  </span>
                </td>
                
                {/* fGP %} */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatPercentage(row.fGPPercent?.ytd || 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatPercentage(row.fGPPercent?.ly || 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <span className={row.fGPPercent?.lyVar < 0 ? 'text-red-600' : 'text-green-600'}>
                    {formatVariancePercent(row.fGPPercent?.lyVar || 0)}
                  </span>
                </td>
                
                {/* 2024 Full Month */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatCurrency(row.fullMonth2024?.gSales || 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatCurrency(row.fullMonth2024?.fGP || 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatPercentage(row.fullMonth2024?.fGPPercent || 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
