
'use client';

interface BusinessAreaCardProps {
  area: {
    name: string;
    revenue: number;
    cost: number;
    volume: number;
    margin: number;
    growth: number;
    brands: string[];
  };
  isSelected: boolean;
  onClick: () => void;
}

export default function BusinessAreaCard({ area, isSelected, onClick }: BusinessAreaCardProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `€${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `€${(amount / 1000).toFixed(0)}K`;
    }
    return `€${amount.toFixed(0)}`;
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const getBusinessAreaColor = (name: string) => {
    const colors = {
      'Food': 'bg-blue-600',
      'Household': 'bg-gray-400',
      'Brillo & KMPL': 'bg-gray-400',
      'Kinetica': 'bg-gray-400'
    };
    return colors[name as keyof typeof colors] || 'bg-gray-400';
  };

  return (
    <div
      className={`p-4 rounded-t-lg border cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3 mb-3">
        <div className={`w-3 h-3 rounded-full ${getBusinessAreaColor(area.name)}`}></div>
        <h3 className="font-semibold text-gray-900">{area.name}</h3>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Revenue:</span>
          <span className="font-medium">{formatCurrency(area.revenue)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Growth:</span>
          <span className={`font-medium ${area.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatPercentage(area.growth)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Margin:</span>
          <span className="font-medium">{area.margin.toFixed(1)}%</span>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">{area.brands.length} brands</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {area.brands.slice(0, 2).map((brand, index) => (
            <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded-md">
              {brand}
            </span>
          ))}
          {area.brands.length > 2 && (
            <span className="text-xs text-gray-500">+{area.brands.length - 2} more</span>
          )}
        </div>
      </div>
    </div>
  );
}
