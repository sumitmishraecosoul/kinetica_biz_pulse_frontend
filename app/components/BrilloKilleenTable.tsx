'use client';

import React from 'react';

interface BrilloKilleenRowData {
  name: string;
  isTotal: boolean;
  children?: BrilloKilleenRowData[];
  cases?: {
    ytd: number;
    ly: number;
    lyVar: number;
    lyVarPercent: number;
  };
  gSales?: {
    ytd: number;
    ly: number;
    lyVar: number;
    lyVarPercent: number;
  };
  fGP?: {
    ytd: number;
    ly: number;
    lyVar: number;
    lyVarPercent: number;
  };
  fGPPercent?: {
    ytd: number;
    ly: number;
    lyVar: number;
  };
}

interface BrilloKilleenTableProps {
  data: BrilloKilleenRowData[];
  isLoading: boolean;
}

const formatNumber = (num: number): string => {
  if (num === 0) return '0';
  return new Intl.NumberFormat('en-US').format(Math.round(num));
};

const formatVariance = (num: number): string => {
  if (num === 0) return '0';
  const absNum = Math.abs(num);
  const formattedNum = new Intl.NumberFormat('en-US').format(Math.round(absNum));
  return num >= 0 ? formattedNum : `(${formattedNum})`;
};

const formatPercent = (num: number): string => {
  if (num === 0) return '0.0%';
  const absNum = Math.abs(num);
  const formatted = num >= 0 ? `${num.toFixed(1)}%` : `(${absNum.toFixed(1)}%)`;
  return formatted;
};

const BrilloKilleenTable: React.FC<BrilloKilleenTableProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const renderRow = (row: BrilloKilleenRowData, level: number = 0) => {
    const indentClass = level === 0 ? 'font-semibold' : level === 1 ? 'font-medium pl-4' : 'pl-8';
    const isTotalRow = row.isTotal;
    const totalClass = isTotalRow ? 'bg-gray-50 font-bold' : '';

    return (
      <React.Fragment key={row.name}>
        <tr className={`${totalClass} border-b border-gray-200`}>
          <td className={`px-4 py-3 text-sm ${indentClass} ${isTotalRow ? 'text-gray-900' : 'text-gray-700'}`}>
            {row.name}
          </td>
          
          {/* Cases Column */}
          <td className="px-4 py-3 text-sm text-right text-gray-600">
            {row.cases ? formatNumber(row.cases.ytd) : '-'}
          </td>
          <td className="px-4 py-3 text-sm text-right text-gray-600">
            {row.cases ? formatNumber(row.cases.ly) : '-'}
          </td>
          <td className={`px-4 py-3 text-sm text-right ${row.cases && row.cases.lyVar < 0 ? 'text-red-600' : 'text-green-600'}`}>
            {row.cases ? formatVariance(row.cases.lyVar) : '-'}
          </td>
          <td className={`px-4 py-3 text-sm text-right ${row.cases && row.cases.lyVarPercent < 0 ? 'text-red-600' : 'text-green-600'}`}>
            {row.cases ? formatPercent(row.cases.lyVarPercent) : '-'}
          </td>
          
          {/* gSales Column */}
          <td className="px-4 py-3 text-sm text-right text-gray-600">
            {row.gSales ? `€${formatNumber(row.gSales.ytd)}` : '-'}
          </td>
          <td className="px-4 py-3 text-sm text-right text-gray-600">
            {row.gSales ? `€${formatNumber(row.gSales.ly)}` : '-'}
          </td>
          <td className={`px-4 py-3 text-sm text-right ${row.gSales && row.gSales.lyVar < 0 ? 'text-red-600' : 'text-green-600'}`}>
            {row.gSales ? `€${formatVariance(row.gSales.lyVar)}` : '-'}
          </td>
          <td className={`px-4 py-3 text-sm text-right ${row.gSales && row.gSales.lyVarPercent < 0 ? 'text-red-600' : 'text-green-600'}`}>
            {row.gSales ? formatPercent(row.gSales.lyVarPercent) : '-'}
          </td>
          
          {/* fGP Column */}
          <td className="px-4 py-3 text-sm text-right text-gray-600">
            {row.fGP ? `€${formatNumber(row.fGP.ytd)}` : '-'}
          </td>
          <td className="px-4 py-3 text-sm text-right text-gray-600">
            {row.fGP ? `€${formatNumber(row.fGP.ly)}` : '-'}
          </td>
          <td className={`px-4 py-3 text-sm text-right ${row.fGP && row.fGP.lyVar < 0 ? 'text-red-600' : 'text-green-600'}`}>
            {row.fGP ? `€${formatVariance(row.fGP.lyVar)}` : '-'}
          </td>
          <td className={`px-4 py-3 text-sm text-right ${row.fGP && row.fGP.lyVarPercent < 0 ? 'text-red-600' : 'text-green-600'}`}>
            {row.fGP ? formatPercent(row.fGP.lyVarPercent) : '-'}
          </td>
          
          {/* fGP % Column */}
          <td className="px-4 py-3 text-sm text-right text-gray-600">
            {row.fGPPercent ? `${row.fGPPercent.ytd.toFixed(1)}%` : '-'}
          </td>
          <td className="px-4 py-3 text-sm text-right text-gray-600">
            {row.fGPPercent ? `${row.fGPPercent.ly.toFixed(1)}%` : '-'}
          </td>
          <td className={`px-4 py-3 text-sm text-right ${row.fGPPercent && row.fGPPercent.lyVar < 0 ? 'text-red-600' : 'text-green-600'}`}>
            {row.fGPPercent ? formatPercent(row.fGPPercent.lyVar) : '-'}
          </td>
        </tr>
        
        {/* Render children if they exist */}
        {row.children && row.children.map(child => renderRow(child, level + 1))}
      </React.Fragment>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Channel / Customer
              </th>
              
              {/* Cases Header */}
              <th colSpan={4} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200">
                Cases
              </th>
              
              {/* gSales Header */}
              <th colSpan={4} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200">
                gSales (€'000)
              </th>
              
              {/* fGP Header */}
              <th colSpan={4} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200">
                fGP (€'000)
              </th>
              
              {/* fGP % Header */}
              <th colSpan={3} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200">
                fGP %
              </th>
            </tr>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {/* Empty for row names */}
              </th>
              
              {/* Cases sub-headers */}
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200">
                YTD
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                LY
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                LY Var
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                LY Var %
              </th>
              
              {/* gSales sub-headers */}
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200">
                YTD
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                LY
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                LY Var
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                LY Var %
              </th>
              
              {/* fGP sub-headers */}
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200">
                YTD
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                LY
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                LY Var
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                LY Var %
              </th>
              
              {/* fGP % sub-headers */}
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200">
                YTD
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                LY
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                LY Var
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map(row => renderRow(row))}
          </tbody>
        </table>
      </div>
      
      {/* Notes */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-600">
          - Samples and sell off of stressed stock are excluded.
        </p>
      </div>
    </div>
  );
};

export default BrilloKilleenTable;