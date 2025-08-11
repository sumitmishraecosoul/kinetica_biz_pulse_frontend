
'use client';

interface ChannelCardProps {
  channel: {
    name: string;
    revenue: number;
    cost: number;
    volume: number;
    margin: number;
    growth: number;
    customers: string[];
    region: string;
  };
  isSelected: boolean;
  onClick: () => void;
}

export default function ChannelCard({ channel, isSelected, onClick }: ChannelCardProps) {
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

  return (
    <div
      className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-900">{channel.name}</h3>
        <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
          {channel.region}
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-3">
        <div>
          <p className="text-xs text-gray-500">Revenue</p>
          <p className="font-medium">{formatCurrency(channel.revenue)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Customers</p>
          <p className="font-medium">{channel.customers.length}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Growth</p>
          <p className={`font-medium ${channel.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatPercentage(channel.growth)}
          </p>
        </div>
      </div>
      
      <div className="text-xs text-gray-500">
        Key: {channel.customers.slice(0, 2).join(', ')}
        {channel.customers.length > 2 && ` +${channel.customers.length - 2} more`}
      </div>
    </div>
  );
}
