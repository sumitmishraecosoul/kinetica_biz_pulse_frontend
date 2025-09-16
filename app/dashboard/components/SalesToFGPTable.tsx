'use client';

interface SalesToFGPTableProps {
  data: any[];
  title?: string;
  loading?: boolean;
  periodLabel?: string;
  currentYear?: number;
  previousYear?: number;
}

export default function SalesToFGPTable({ data, title = "Sales to fGP", loading = false, periodLabel = "YTD", currentYear = 2025, previousYear = 2024 }: SalesToFGPTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading sales data...</span>
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

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      
      <div className="overflow-x-auto min-w-full">
        <table className="min-w-full divide-y divide-gray-200" style={{ minWidth: '1200px' }}>
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300">
                {/* Item column */}
              </th>
              
              {/* Current Year */}
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300" colSpan={3}>
                {currentYear}
              </th>
              
              {/* Previous Year */}
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300" colSpan={3}>
                {previousYear}
              </th>
              
              {/* Variance */}
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300" colSpan={3}>
                Variance
              </th>
              
              {/* Var % Sales */}
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Var % Sales
              </th>
            </tr>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300">
                {/* Item column */}
              </th>
              
              {/* Current Year sub-headers */}
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                No.
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                €'000
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300">
                % sales
              </th>
              
              {/* Previous Year sub-headers */}
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                No.
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                €'000
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300">
                % sales
              </th>
              
              {/* Variance sub-headers */}
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                No.
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                €'000
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300">
                % Var
              </th>
              
              {/* Var % Sales */}
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {/* Var % Sales column */}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr key={index} className={row.isBold ? 'bg-gray-50 font-bold' : 'hover:bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r-2 border-gray-300">
                  {row.name}
                </td>
                
                {/* Current Year */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {row.name === 'Cases' ? formatNumber(row.valueCurrent) : ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {row.name !== 'Cases' ? formatCurrency(row.valueCurrent) : ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right border-r-2 border-gray-300">
                  {formatPercentage(row.percentSalesCurrent)}
                </td>
                
                {/* Previous Year */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {row.name === 'Cases' ? formatNumber(row.valuePrevious) : ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {row.name !== 'Cases' ? formatCurrency(row.valuePrevious) : ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right border-r-2 border-gray-300">
                  {formatPercentage(row.percentSalesPrevious)}
                </td>
                
                {/* Variance */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  {row.name === 'Cases' ? (
                    <span className={row.variance < 0 ? 'text-red-600' : 'text-green-600'}>
                      {formatVariance(row.variance)}
                    </span>
                  ) : ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  {row.name !== 'Cases' ? (
                    <span className={row.variance < 0 ? 'text-red-600' : 'text-green-600'}>
                      {formatVariance(row.variance)}
                    </span>
                  ) : ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right border-r-2 border-gray-300">
                  <span className={row.variancePercent < 0 ? 'text-red-600' : 'text-green-600'}>
                    {formatVariancePercent(row.variancePercent)}
                  </span>
                </td>
                
                {/* Var % Sales */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  {row.name === 'fGP' ? (
                    <span className={row.percentSalesVar < 0 ? 'text-red-600' : 'text-green-600'}>
                      {formatVariancePercent(row.percentSalesVar)}
                    </span>
                  ) : (
                    <span className={row.percentSalesVar < 0 ? 'text-red-600' : 'text-green-600'}>
                      {formatVariancePercent(row.percentSalesVar)}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
