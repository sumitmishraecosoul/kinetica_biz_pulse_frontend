
'use client';

interface PerformanceRow {
  businessArea: string;
  brand?: string;
  category?: string;
  subCategory?: string;
  channel: string;
  customer: string;
  revenue: number;
  margin: number; // percentage
  volume: number;
}

interface DataTableProps {
  data: PerformanceRow[];
  loading?: boolean;
  selectedPeriod: string;
  selectedBusinessArea: string;
  selectedChannel: string;
  selectedMonth: string;
}

export default function DataTable({ data, loading = false, selectedPeriod, selectedBusinessArea, selectedChannel, selectedMonth }: DataTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatPercentage = (value: number) => {
    const num = Number.isFinite(value) ? value : 0;
    return `${num.toFixed(1)}%`;
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-IE').format(value || 0);
  };

  const getBusinessAreaColor = (businessArea: string) => {
    switch (businessArea) {
      case 'Food':
        return 'bg-blue-500';
      case 'Household':
        return 'bg-green-500';
      case 'Brillo':
        return 'bg-yellow-500';
      case 'Kinetica':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-gray-600">Loading performance data...</div>
    );
  }

  const rows = Array.isArray(data) ? data : [];

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium">Performance Data</h3>
        <div className="text-xs text-gray-500">
          Period: {selectedPeriod} • Business: {selectedBusinessArea} • Channel: {selectedChannel} • Month: {selectedMonth}
        </div>
      </div>

      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Area</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sub-Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channel</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Margin %</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${getBusinessAreaColor(row.businessArea)}`}></div>
                  {row.businessArea || '-'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.brand || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.category || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.subCategory || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.channel || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.customer || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">{formatCurrency(row.revenue)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{formatPercentage(row.margin)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{formatNumber(row.volume)}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={9} className="px-6 py-8 text-center text-sm text-gray-500">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
