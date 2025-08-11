
'use client';

interface CategoryOverviewCardsProps {
  selectedPeriod: string;
  selectedBusinessArea: string;
  selectedCategory: string;
  onDrillDown: (data: any) => void;
}

export default function CategoryOverviewCards({ 
  selectedPeriod, 
  selectedBusinessArea, 
  selectedCategory,
  onDrillDown 
}: CategoryOverviewCardsProps) {
  const overviewData = [
    {
      title: 'Total Categories',
      value: '47',
      change: '+3',
      changePercent: 6.8,
      icon: 'ri-folder-line',
      color: 'blue',
      details: {
        active: 47,
        inactive: 8,
        new: 3,
        topPerforming: 12
      }
    },
    {
      title: 'Category Revenue',
      value: '€3.2M',
      change: '+€485K',
      changePercent: 17.8,
      icon: 'ri-pie-chart-line',
      color: 'green',
      details: {
        average: '€68,085',
        median: '€45,200',
        top5: '€2.1M',
        growth: '17.8%'
      }
    },
    {
      title: 'Top Category Share',
      value: '34.2%',
      change: '+2.8%',
      changePercent: 8.9,
      icon: 'ri-trophy-line',
      color: 'yellow',
      details: {
        topCategory: 'Snacks',
        revenue: '€1.1M',
        share: '34.2%',
        growth: '12.5%'
      }
    },
    {
      title: 'Category Diversity',
      value: '0.76',
      change: '+0.05',
      changePercent: 7.0,
      icon: 'ri-gallery-line',
      color: 'purple',
      details: {
        herfindahl: 0.76,
        evenness: 0.82,
        concentration: 'Medium',
        balance: 'Good'
      }
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200'
    };
    return colors[color as keyof typeof colors];
  };

  const handleCardClick = (card: any) => {
    onDrillDown({
      type: 'category-overview',
      title: card.title,
      data: card.details,
      period: selectedPeriod,
      businessArea: selectedBusinessArea
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

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Click for details</span>
              <i className="ri-external-link-line"></i>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
