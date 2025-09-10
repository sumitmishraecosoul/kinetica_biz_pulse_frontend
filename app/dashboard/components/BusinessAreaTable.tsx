'use client';

interface BusinessAreaData {
  businessArea: string;
  cases: {
    ytd: number;
    lyVar: number;
    lyVarPercent: number;
  };
  gSales: {
    ytd: number;
    lyVar: number;
    lyVarPercent: number;
  };
  fGP: {
    ytd: number;
    lyVar: number;
    lyVarPercent: number;
  };
  fGPPercent: {
    ytd: number;
    lyVar: number;
  };
  fGPFY24: {
    ytd: number;
    cyVLy: number;
  };
}

interface BusinessAreaTableProps {
  data: BusinessAreaData[];
  loading?: boolean;
}

export default function BusinessAreaTable({ data, loading = false }: BusinessAreaTableProps) {
  const formatNumber = (num: number, isPercent = false) => {
    if (isPercent) {
      return `${num.toFixed(1)}%`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}`;
    }
    return num.toFixed(0);
  };

  const formatVariance = (num: number, isPercent = false) => {
    if (isPercent) {
      return num >= 0 ? `${num.toFixed(1)}%` : `(${Math.abs(num).toFixed(1)}%)`;
    }
    return num >= 0 ? num.toFixed(0) : `(${Math.abs(num).toFixed(0)})`;
  };

  const getVarianceColor = (num: number) => {
    return num < 0 ? 'text-red-600' : 'text-gray-900';
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
                    Business Area
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
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Business Area</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Business Area
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cases
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                gSales (€'000)
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                fGP (€'000)
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                fGP %
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                fGP FY24 (€'000)
              </th>
            </tr>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {/* Empty header for business area column */}
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                YTD No.
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                YTD €'000
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                YTD €'000
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                YTD %
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                YTD €'000
              </th>
            </tr>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {/* Empty header for business area column */}
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                LY Var No.
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                LY Var €'000
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                LY Var €'000
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                LY Var %
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                CY v LY %
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.businessArea}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                  <div className="space-y-1">
                    <div>{formatNumber(item.cases.ytd)}</div>
                    <div className={`text-xs ${getVarianceColor(item.cases.lyVar)}`}>
                      {formatVariance(item.cases.lyVar)}
                    </div>
                    <div className={`text-xs ${getVarianceColor(item.cases.lyVarPercent)}`}>
                      {formatVariance(item.cases.lyVarPercent, true)}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                  <div className="space-y-1">
                    <div>{formatNumber(item.gSales.ytd)}</div>
                    <div className={`text-xs ${getVarianceColor(item.gSales.lyVar)}`}>
                      {formatVariance(item.gSales.lyVar)}
                    </div>
                    <div className={`text-xs ${getVarianceColor(item.gSales.lyVarPercent)}`}>
                      {formatVariance(item.gSales.lyVarPercent, true)}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                  <div className="space-y-1">
                    <div>{formatNumber(item.fGP.ytd)}</div>
                    <div className={`text-xs ${getVarianceColor(item.fGP.lyVar)}`}>
                      {formatVariance(item.fGP.lyVar)}
                    </div>
                    <div className={`text-xs ${getVarianceColor(item.fGP.lyVarPercent)}`}>
                      {formatVariance(item.fGP.lyVarPercent, true)}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                  <div className="space-y-1">
                    <div>{formatNumber(item.fGPPercent.ytd, true)}</div>
                    <div className={`text-xs ${getVarianceColor(item.fGPPercent.lyVar)}`}>
                      {formatVariance(item.fGPPercent.lyVar, true)}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                  <div className="space-y-1">
                    <div>{formatNumber(item.fGPFY24.ytd)}</div>
                    <div className={`text-xs ${getVarianceColor(item.fGPFY24.cyVLy)}`}>
                      {formatVariance(item.fGPFY24.cyVLy, true)}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
