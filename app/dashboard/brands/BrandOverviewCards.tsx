'use client';

interface BrandOverviewCardsProps {
  selectedBusinessArea: string;
  selectedBrand: string;
  onDrillDown: (data: any) => void;
}

export default function BrandOverviewCards({ selectedBusinessArea, selectedBrand, onDrillDown }: BrandOverviewCardsProps) {
  const overviewData = [
    {
      title: 'Total Revenue',
      value: '€12.4M',
      change: '+8.2%',
      trend: 'up',
      detail: 'vs last period',
      icon: 'ri-money-euro-circle-line',
      color: 'blue'
    },
    {
      title: 'Average Margin',
      value: '28.7%',
      change: '+2.1%',
      trend: 'up',
      detail: 'weighted average',
      icon: 'ri-percent-line',
      color: 'green'
    },
    {
      title: 'Active SKUs',
      value: '1,247',
      change: '+15',
      trend: 'up',
      detail: 'this period',
      icon: 'ri-box-3-line',
      color: 'purple'
    },
    {
      title: 'Market Share',
      value: '23.5%',
      change: '+0.8%',
      trend: 'up',
      detail: 'estimated',
      icon: 'ri-pie-chart-line',
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500 text-blue-600',
      green: 'bg-green-500 text-green-600',
      purple: 'bg-purple-500 text-purple-600',
      orange: 'bg-orange-500 text-orange-600'
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {overviewData.map((item, index) => (
        <div 
          key={index} 
          className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onDrillDown({ type: 'overview', data: item })}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-full ${getColorClasses(item.color).split(' ')[0]}/10 flex items-center justify-center`}>
              <i className={`${item.icon} text-xl ${getColorClasses(item.color).split(' ')[1]}`}></i>
            </div>
            <button className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600">
              <i className="ri-more-2-line"></i>
            </button>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{item.title}</h3>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-gray-900">{item.value}</span>
              <span className={`text-sm font-medium flex items-center ${
                item.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <i className={`${item.trend === 'up' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'} mr-1`}></i>
                {item.change}
              </span>
            </div>
            <p className="text-xs text-gray-500">{item.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}