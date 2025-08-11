
'use client';

interface CustomerOverviewCardsProps {
  selectedPeriod: string;
  selectedChannel: string;
  selectedCustomer: string;
  onDrillDown: (data: any) => void;
}

export default function CustomerOverviewCards({ 
  selectedPeriod, 
  selectedChannel, 
  selectedCustomer,
  onDrillDown 
}: CustomerOverviewCardsProps) {
  const overviewData = [
    {
      title: 'Total Customers',
      value: '147',
      change: '+12',
      changePercent: 8.9,
      icon: 'ri-group-line',
      color: 'blue',
      details: {
        active: 147,
        inactive: 23,
        new: 12,
        topSegment: 'Grocery ROI (45)'
      }
    },
    {
      title: 'Customer Revenue',
      value: '€2.4M',
      change: '+€340K',
      changePercent: 16.5,
      icon: 'ri-money-euro-circle-line',
      color: 'green',
      details: {
        average: '€16,327',
        median: '€8,500',
        top10: '€1.8M',
        growth: '16.5%'
      }
    },
    {
      title: 'Avg Customer Value',
      value: '€16,327',
      change: '+€1,247',
      changePercent: 8.3,
      icon: 'ri-price-tag-3-line',
      color: 'purple',
      details: {
        highest: '€89,500',
        lowest: '€850',
        target: '€18,000',
        onTrack: 89
      }
    },
    {
      title: 'Customer Retention',
      value: '87.3%',
      change: '+2.1%',
      changePercent: 2.5,
      icon: 'ri-heart-line',
      color: 'red',
      details: {
        retained: 128,
        lost: 19,
        recovered: 8,
        atRisk: 15
      }
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      red: 'bg-red-50 text-red-600 border-red-200'
    };
    return colors[color as keyof typeof colors];
  };

  const handleCardClick = (card: any) => {
    onDrillDown({
      type: 'customer-overview',
      title: card.title,
      data: card.details,
      period: selectedPeriod,
      channel: selectedChannel
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {overviewData.map((card, index) => (
        <div
          key={index}
          onClick={() => handleCardClick(card)}
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 ${getColorClasses(card.color)} group-hover:scale-110 transition-transform duration-200`}>
              <i className={`${card.icon} text-xl`}></i>
            </div>
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-arrow-right-s-line text-gray-400 group-hover:text-gray-600 transition-colors duration-200"></i>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-gray-900">{card.value}</span>
              <span className={`text-sm font-medium ${
                card.changePercent > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {card.changePercent > 0 ? '+' : ''}{card.changePercent}%
              </span>
            </div>
            <p className="text-sm text-gray-500">
              {card.change} vs previous period
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
