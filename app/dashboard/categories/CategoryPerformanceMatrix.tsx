
'use client';

import { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api';

interface CategoryPerformanceMatrixProps {
  selectedPeriod: string;
  selectedBusinessArea: string;
  selectedChannel: string;
  onDrillDown: (data: any) => void;
}

export default function CategoryPerformanceMatrix({
  selectedPeriod,
  selectedBusinessArea,
  selectedChannel,
  onDrillDown
}: CategoryPerformanceMatrixProps) {
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const params = {
          period: selectedPeriod,
          businessArea: selectedBusinessArea !== 'All' ? selectedBusinessArea : undefined,
          channel: selectedChannel !== 'All' ? selectedChannel : undefined,
        };

        const response = await dashboardAPI.getCategories(params);
        const categories = response.data.data || [];
        
        // Calculate total revenue for market share
        const totalRevenue = categories.reduce((sum: number, cat: any) => sum + (cat.revenue || 0), 0);
        
        // Map and enhance category data
        const enhancedData = categories.map((cat: any) => ({
          category: cat.category || 'Unknown',
          businessArea: cat.businessArea || 'Unknown',
          revenue: cat.revenue || 0,
          margin: cat.margin || 0,
          growth: cat.growth || 0,
          marketShare: totalRevenue > 0 ? ((cat.revenue || 0) / totalRevenue) * 100 : 0,
          performance: cat.performance || (cat.growth > 10 ? 'high' : cat.growth < 0 ? 'low' : 'medium'),
          trend: cat.growth > 5 ? 'up' : cat.growth < -5 ? 'down' : 'stable',
          subCategories: cat.subCategories || 0
        })).sort((a: any, b: any) => b.revenue - a.revenue);

        setCategoryData(enhancedData);
      } catch (error) {
        console.error('Error fetching category data:', error);
        setCategoryData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [selectedPeriod, selectedBusinessArea, selectedChannel]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'high':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getBusinessAreaColor = (area: string) => {
    switch (area) {
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

  const handleCategoryClick = (category: any) => {
    onDrillDown({
      type: 'category-performance',
      title: `${category.category} Performance Analysis`,
      data: category,
      period: selectedPeriod
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Category Performance Matrix</h3>
          <p className="text-sm text-gray-500 mt-1">Revenue and growth analysis by category</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <i className="ri-filter-line"></i>
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <i className="ri-more-2-line"></i>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Margin %</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Growth %</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Share %</th>
              <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="h-4 bg-gray-200 rounded w-16 ml-auto mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-12 ml-auto"></div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="h-4 bg-gray-200 rounded w-12 ml-auto mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-16 ml-auto"></div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="h-4 bg-gray-200 rounded w-12 ml-auto"></div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="h-4 bg-gray-200 rounded w-12 ml-auto"></div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="h-6 bg-gray-200 rounded w-16 mx-auto"></div>
                  </td>
                </tr>
              ))
            ) : categoryData.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 px-4 text-center text-gray-500">
                  No category data available
                </td>
              </tr>
            ) : (
              categoryData.map((category, index) => (
              <tr
                key={index}
                onClick={() => handleCategoryClick(category)}
                className="hover:bg-gray-50 cursor-pointer transition-colors duration-200 group"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getBusinessAreaColor(category.businessArea)}`}></div>
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        {category.category}
                      </div>
                      <div className="text-sm text-gray-500">
                        {category.businessArea} • {category.subCategories} sub-categories
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="font-medium text-gray-900">{formatCurrency(category.revenue)}</div>
                  <div className="text-sm text-gray-500">
                    {((category.revenue / 3290000) * 100).toFixed(1)}% of total
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="font-medium text-gray-900">{category.margin.toFixed(1)}%</div>
                  <div className="text-sm text-gray-500">
                    vs avg 29.2%
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className={`font-medium flex items-center justify-end space-x-1 ${
                    category.growth > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <span>{category.growth > 0 ? '+' : ''}{category.growth.toFixed(1)}%</span>
                    <i className={`ri-arrow-${category.trend === 'up' ? 'up' : category.trend === 'down' ? 'down' : 'right'}-line text-xs`}></i>
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="font-medium text-gray-900">{category.marketShare.toFixed(1)}%</div>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPerformanceColor(category.performance)}`}>
                    {category.performance}
                  </span>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>High Performance</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Medium Performance</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Low Performance</span>
            </div>
          </div>
          <span>Click rows for detailed analysis</span>
        </div>
      </div>
    </div>
  );
}
