
'use client';

import { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api';

interface CustomerOverviewCardsProps {
  selectedPeriod: string;
  selectedChannel: string;
  selectedCustomer: string;
  selectedBusinessArea: string;
  onDrillDown: (data: any) => void;
}

export default function CustomerOverviewCards({ 
  selectedPeriod, 
  selectedChannel, 
  selectedCustomer,
  selectedBusinessArea,
  onDrillDown 
}: CustomerOverviewCardsProps) {
  const [overviewData, setOverviewData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          period: selectedPeriod,
          channel: selectedChannel,
          customer: selectedCustomer,
          businessArea: selectedBusinessArea,
        };

        const response = await dashboardAPI.getCustomerOverview(params);
        setOverviewData(response.data.data);
      } catch (err: any) {
        console.error('Error fetching customer overview:', err);
        setError('Failed to load customer overview data');
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, [selectedPeriod, selectedChannel, selectedCustomer, selectedBusinessArea]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !overviewData) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-red-600 text-center">{error || 'No data available'}</p>
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Customers',
      data: overviewData.totalCustomers,
      icon: 'ri-group-line',
      color: 'blue'
    },
    {
      title: 'Customer Revenue',
      data: overviewData.customerRevenue,
      icon: 'ri-money-euro-circle-line',
      color: 'green'
    },
    {
      title: 'Avg Customer Value',
      data: overviewData.avgCustomerValue,
      icon: 'ri-price-tag-3-line',
      color: 'purple'
    },
    {
      title: 'Customer Retention',
      data: overviewData.customerRetention,
      icon: 'ri-heart-line',
      color: 'red'
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
      data: card.data.details,
      period: selectedPeriod,
      channel: selectedChannel
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
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
              <span className="text-2xl font-bold text-gray-900">{card.data.value}</span>
              <span className={`text-sm font-medium ${
                card.data.changePercent > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {card.data.changePercent > 0 ? '+' : ''}{card.data.changePercent}%
              </span>
            </div>
            <p className="text-sm text-gray-500">
              {card.data.change} vs previous period
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
