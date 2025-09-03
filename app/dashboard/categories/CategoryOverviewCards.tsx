
'use client';

import { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api';

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
  const [overviewData, setOverviewData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setLoading(true);
        const params = {
          period: selectedPeriod,
          businessArea: selectedBusinessArea !== 'All' ? selectedBusinessArea : undefined,
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
        };

        const [categoriesData, overviewData] = await Promise.all([
          dashboardAPI.getCategories(params),
          dashboardAPI.getOverview(params)
        ]);

        const categories = categoriesData.data.data || [];
        const overview = overviewData.data.data.overview || overviewData.data.data;
        
        const totalCategories = categories.length;
        const totalRevenue = overview.totalRevenue || 0;
        const activeCategories = categories.filter((c: any) => c.revenue > 0).length;
        const topCategory = categories.reduce((max: any, cat: any) => 
          cat.revenue > (max?.revenue || 0) ? cat : max, null);

        setOverviewData([
          {
            title: 'Total Categories',
            value: totalCategories.toString(),
            change: '+3',
            changePercent: 6.8,
            icon: 'ri-folder-line',
            color: 'blue',
            details: {
              active: activeCategories,
              inactive: totalCategories - activeCategories,
              new: 3,
              topPerforming: Math.floor(totalCategories * 0.25)
            }
          },
          {
            title: 'Category Revenue',
            value: totalRevenue >= 1000000 ? `€${(totalRevenue / 1000000).toFixed(1)}M` : `€${(totalRevenue / 1000).toFixed(0)}K`,
            change: '+€485K',
            changePercent: 17.8,
            icon: 'ri-pie-chart-line',
            color: 'green',
            details: {
              average: `€${totalCategories > 0 ? (totalRevenue / totalCategories / 1000).toFixed(0) : 0}K`,
              median: '€45,200',
              top5: `€${(totalRevenue * 0.65 / 1000000).toFixed(1)}M`,
              growth: '17.8%'
            }
          },
          {
            title: 'Top Category Share',
            value: topCategory ? `${((topCategory.revenue / totalRevenue) * 100).toFixed(1)}%` : '0%',
            change: '+2.8%',
            changePercent: 8.9,
            icon: 'ri-trophy-line',
            color: 'yellow',
            details: {
              topCategory: topCategory?.category || 'N/A',
              revenue: topCategory ? `€${(topCategory.revenue / 1000000).toFixed(1)}M` : '€0',
              share: topCategory ? `${((topCategory.revenue / totalRevenue) * 100).toFixed(1)}%` : '0%',
              growth: topCategory ? `${topCategory.growth?.toFixed(1) || 0}%` : '0%'
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
        ]);
      } catch (error) {
        console.error('Error fetching category overview data:', error);
        setOverviewData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, [selectedPeriod, selectedBusinessArea, selectedCategory]);

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
