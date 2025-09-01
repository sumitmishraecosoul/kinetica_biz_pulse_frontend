'use client';

import { useEffect, useState } from 'react';
import { dashboardAPI } from '../../services/api';

interface BrandOverviewCardsProps {
  selectedBusinessArea: string;
  selectedBrand: string;
  selectedPeriod: string;
  onDrillDown: (data: any) => void;
}

interface CardItem {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  detail: string;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

export default function BrandOverviewCards({ selectedBusinessArea, selectedBrand, selectedPeriod, onDrillDown }: BrandOverviewCardsProps) {
  const [cards, setCards] = useState<CardItem[]>([ 
    { title: 'Total Revenue', value: '€0', change: '0%', trend: 'stable', detail: '', icon: 'ri-money-euro-circle-line', color: 'blue' },
    { title: 'Average Margin', value: '0.0%', change: '0%', trend: 'stable', detail: '', icon: 'ri-percent-line', color: 'green' },
    { title: 'Total Cases', value: '0', change: '0%', trend: 'stable', detail: '', icon: 'ri-box-3-line', color: 'purple' },
    { title: 'Growth Rate', value: '0.0%', change: '0%', trend: 'stable', detail: '', icon: 'ri-line-chart-line', color: 'orange' }
  ]);

  useEffect(() => {
    const fetchAggregates = async () => {
      try {
        const params: any = {
          period: selectedPeriod,
          businessArea: selectedBusinessArea !== 'All' ? selectedBusinessArea : undefined,
          brand: selectedBrand !== 'All' ? selectedBrand : undefined,
        };
        const res = await dashboardAPI.getAggregates?.(params) || await dashboardAPI.getOverview(params);
        const data = res.data.data.overview ? res.data.data.overview : res.data.data;
        const totalRevenue = data.totalRevenue ?? 0;
        const avgMargin = data.avgMargin ?? (data.margin ?? 0);
        const totalCases = data.totalCases ?? 0;
        const growthRate = data.growthRate ?? 0;

        const formatCurrency = (amount: number) => {
          if (amount >= 1_000_000) return `€${(amount / 1_000_000).toFixed(1)}M`;
          if (amount >= 1_000) return `€${(amount / 1_000).toFixed(0)}K`;
          return `€${amount.toFixed(0)}`;
        };

        setCards([
          { title: 'Total Revenue', value: formatCurrency(totalRevenue), change: '', trend: 'stable', detail: '', icon: 'ri-money-euro-circle-line', color: 'blue' },
          { title: 'Average Margin', value: `${avgMargin.toFixed(1)}%`, change: '', trend: 'stable', detail: '', icon: 'ri-percent-line', color: 'green' },
          { title: 'Total Cases', value: new Intl.NumberFormat('en-IE').format(totalCases), change: '', trend: 'stable', detail: '', icon: 'ri-box-3-line', color: 'purple' },
          { title: 'Growth Rate', value: `${(growthRate as number).toFixed(1)}%`, change: '', trend: 'stable', detail: '', icon: 'ri-line-chart-line', color: 'orange' },
        ]);
      } catch (e) {
        // keep defaults
      }
    };
    fetchAggregates();
  }, [selectedBusinessArea, selectedBrand, selectedPeriod]);

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
      {cards.map((item, index) => (
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
            </div>
            {item.detail && <p className="text-xs text-gray-500">{item.detail}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}