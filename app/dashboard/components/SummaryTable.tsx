'use client';

import { SummaryRowData } from '../../services/summaryCalculationService';

interface SummaryTableProps {
  title: string;
  data: SummaryRowData[];
  loading?: boolean;
  periodLabel?: string; // "YTD" or month name like "Jun"
}

export default function SummaryTable({ 
  title, 
  data, 
  loading = false, 
  periodLabel = "YTD" 
}: SummaryTableProps) {
  const formatNumber = (num: number | undefined | null, isPercent = false) => {
    // Handle undefined, null, or NaN values
    if (num === undefined || num === null || isNaN(num)) {
      return isPercent ? '0.0%' : '0';
    }
    
    if (isPercent) {
      return `${num.toFixed(1)}%`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}`;
    }
    return num.toFixed(0);
  };

  const formatVariance = (num: number | undefined | null, isPercent = false) => {
    // Handle undefined, null, or NaN values
    if (num === undefined || num === null || isNaN(num)) {
      return isPercent ? '0.0%' : '0';
    }
    
    if (isPercent) {
      return num >= 0 ? `${num.toFixed(1)}%` : `(${Math.abs(num).toFixed(1)}%)`;
    }
    return num >= 0 ? num.toFixed(0) : `(${Math.abs(num).toFixed(0)})`;
  };

  const getVarianceColor = (num: number | undefined | null) => {
    if (num === undefined || num === null || isNaN(num)) {
      return 'text-gray-900';
    }
    return num < 0 ? 'text-red-600' : 'text-gray-900';
  };

  const isTotalRow = (name: string) => {
    return name === 'Total' || name === 'Total Household' || 
           name === 'Grocery & Wholesale ROI' || name === 'Grocery & Wholesale UK & NI';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-3 bg-gray-50 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {title}
                  </th>
                  <th className="px-4 py-3 bg-gray-50 border-b border-gray-200 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cases
                  </th>
                  <th className="px-4 py-3 bg-gray-50 border-b border-gray-200 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    gSales (€'000)
                  </th>
                  <th className="px-4 py-3 bg-gray-50 border-b border-gray-200 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    fGP (€'000)
                  </th>
                  <th className="px-4 py-3 bg-gray-50 border-b border-gray-200 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    fGP %
                  </th>
                  <th className="px-4 py-3 bg-gray-50 border-b border-gray-200 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    fGP FY24 (€'000)
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3 border-b border-gray-200">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="px-4 py-3 border-b border-gray-200 text-center">
                        <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            {/* Main header row */}
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                {title}
              </th>
              <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase tracking-wider" colSpan={4}>
                Cases
              </th>
              <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase tracking-wider" colSpan={4}>
                gSales (€'000)
              </th>
              <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase tracking-wider" colSpan={3}>
                fGP (€'000)
              </th>
              <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase tracking-wider" colSpan={2}>
                fGP %
              </th>
              <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase tracking-wider" colSpan={2}>
                fGP FY24 (€'000)
              </th>
            </tr>
            {/* Sub-header row 1 */}
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-3 py-1 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                {/* Empty header for name column */}
              </th>
              {/* Cases sub-headers */}
              <th className="border border-gray-300 px-3 py-1 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                {periodLabel}
              </th>
              <th className="border border-gray-300 px-3 py-1 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                LY
              </th>
              <th className="border border-gray-300 px-3 py-1 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                LY Var
              </th>
              <th className="border border-gray-300 px-3 py-1 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                LY Var %
              </th>
              {/* gSales sub-headers */}
              <th className="border border-gray-300 px-3 py-1 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                {periodLabel}
              </th>
              <th className="border border-gray-300 px-3 py-1 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                LY
              </th>
              <th className="border border-gray-300 px-3 py-1 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                LY Var
              </th>
              <th className="border border-gray-300 px-3 py-1 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                LY Var %
              </th>
              {/* fGP sub-headers */}
              <th className="border border-gray-300 px-3 py-1 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                {periodLabel}
              </th>
              <th className="border border-gray-300 px-3 py-1 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                LY Var
              </th>
              <th className="border border-gray-300 px-3 py-1 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                LY Var %
              </th>
              {/* fGP % sub-headers */}
              <th className="border border-gray-300 px-3 py-1 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                {periodLabel}
              </th>
              <th className="border border-gray-300 px-3 py-1 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                LY Var
              </th>
              {/* fGP FY24 sub-headers */}
              <th className="border border-gray-300 px-3 py-1 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                {periodLabel}
              </th>
              <th className="border border-gray-300 px-3 py-1 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                CY v LY
              </th>
            </tr>
            {/* Sub-header row 2 - Units */}
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-3 py-1 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                {/* Empty header for name column */}
              </th>
              {/* Cases units */}
              <th className="border border-gray-300 px-3 py-1 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                No.
              </th>
              <th className="border border-gray-300 px-3 py-1 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                No.
              </th>
              <th className="border border-gray-300 px-3 py-1 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                No.
              </th>
              <th className="border border-gray-300 px-3 py-1 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                %
              </th>
              {/* gSales units */}
              <th className="border border-gray-300 px-3 py-1 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                €'000
              </th>
              <th className="border border-gray-300 px-3 py-1 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                €'000
              </th>
              <th className="border border-gray-300 px-3 py-1 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                €'000
              </th>
              <th className="border border-gray-300 px-3 py-1 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                %
              </th>
              {/* fGP units */}
              <th className="border border-gray-300 px-3 py-1 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                €'000
              </th>
              <th className="border border-gray-300 px-3 py-1 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                €'000
              </th>
              <th className="border border-gray-300 px-3 py-1 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                %
              </th>
              {/* fGP % units */}
              <th className="border border-gray-300 px-3 py-1 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                %
              </th>
              <th className="border border-gray-300 px-3 py-1 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                %
              </th>
              {/* fGP FY24 units */}
              <th className="border border-gray-300 px-3 py-1 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                €'000
              </th>
              <th className="border border-gray-300 px-3 py-1 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                %
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b border-gray-300">
                <td className={`border border-gray-300 px-3 py-2 text-sm ${
                  isTotalRow(item.name) ? 'font-bold text-gray-900' : 'text-gray-900'
                }`}>
                  {item.name}
                </td>
                {/* Cases columns */}
                <td className="border border-gray-300 px-3 py-2 text-sm text-gray-900 text-center">
                  {formatNumber(item.cases?.ytd)}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-sm text-gray-900 text-center">
                  {formatNumber(item.cases?.ly)}
                </td>
                <td className={`border border-gray-300 px-3 py-2 text-sm text-center ${getVarianceColor(item.cases?.lyVar)}`}>
                  {formatVariance(item.cases?.lyVar)}
                </td>
                <td className={`border border-gray-300 px-3 py-2 text-sm text-center ${getVarianceColor(item.cases?.lyVarPercent)}`}>
                  {formatVariance(item.cases?.lyVarPercent, true)}
                </td>
                {/* gSales columns */}
                <td className="border border-gray-300 px-3 py-2 text-sm text-gray-900 text-center">
                  {formatNumber(item.gSales?.ytd)}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-sm text-gray-900 text-center">
                  {formatNumber(item.gSales?.ly)}
                </td>
                <td className={`border border-gray-300 px-3 py-2 text-sm text-center ${getVarianceColor(item.gSales?.lyVar)}`}>
                  {formatVariance(item.gSales?.lyVar)}
                </td>
                <td className={`border border-gray-300 px-3 py-2 text-sm text-center ${getVarianceColor(item.gSales?.lyVarPercent)}`}>
                  {formatVariance(item.gSales?.lyVarPercent, true)}
                </td>
                {/* fGP columns */}
                <td className="border border-gray-300 px-3 py-2 text-sm text-gray-900 text-center">
                  {formatNumber(item.fGP?.ytd)}
                </td>
                <td className={`border border-gray-300 px-3 py-2 text-sm text-center ${getVarianceColor(item.fGP?.lyVar)}`}>
                  {formatVariance(item.fGP?.lyVar)}
                </td>
                <td className={`border border-gray-300 px-3 py-2 text-sm text-center ${getVarianceColor(item.fGP?.lyVarPercent)}`}>
                  {formatVariance(item.fGP?.lyVarPercent, true)}
                </td>
                {/* fGP % columns */}
                <td className="border border-gray-300 px-3 py-2 text-sm text-gray-900 text-center">
                  {formatNumber(item.fGPPercent?.ytd, true)}
                </td>
                <td className={`border border-gray-300 px-3 py-2 text-sm text-center ${getVarianceColor(item.fGPPercent?.lyVar)}`}>
                  {formatVariance(item.fGPPercent?.lyVar, true)}
                </td>
                {/* fGP FY24 columns */}
                <td className="border border-gray-300 px-3 py-2 text-sm text-gray-900 text-center">
                  {formatNumber(item.fGPFY24?.ytd)}
                </td>
                <td className={`border border-gray-300 px-3 py-2 text-sm text-center ${getVarianceColor(item.fGPFY24?.cyVLy)}`}>
                  {formatVariance(item.fGPFY24?.cyVLy, true)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}