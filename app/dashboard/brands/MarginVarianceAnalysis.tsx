'use client';

import { useEffect, useState } from 'react';
import { dashboardAPI } from '../../services/api';

interface MarginVarianceAnalysisProps {
  selectedBusinessArea: string;
  selectedBrand: string;
}

interface VarianceDriver {
  driver: string;
  value: number;
  description: string;
  icon: string;
  color: string;
}

export default function MarginVarianceAnalysis({ selectedBusinessArea, selectedBrand }: MarginVarianceAnalysisProps) {
  const [varianceData, setVarianceData] = useState<VarianceDriver[]>([]);
  const [totalImpact, setTotalImpact] = useState(0);
  const [loading, setLoading] = useState(true);

  // Helper function to validate and format percentage values
  const validateAndFormatPercentage = (value: number): number => {
    // Clamp values to realistic business ranges (-50% to +50%)
    const clamped = Math.max(-50, Math.min(50, value));
    // Round to 1 decimal place
    return Math.round(clamped * 10) / 10;
  };

  // Helper function to get appropriate icon and description based on value
  const getDriverIconAndDescription = (driver: string, value: number) => {
    const isPositive = value >= 0;
    
    switch (driver) {
      case 'Volume Impact':
        return {
          icon: isPositive ? 'ri-arrow-up-circle-fill' : 'ri-arrow-down-circle-fill',
          description: isPositive ? 'Higher sales volume' : 'Lower sales volume'
        };
      case 'Price Changes':
        return {
          icon: isPositive ? 'ri-arrow-up-circle-fill' : 'ri-arrow-down-circle-fill',
          description: isPositive ? 'Price optimization' : 'Price pressure'
        };
      case 'Cost Impact':
        return {
          icon: isPositive ? 'ri-arrow-down-circle-fill' : 'ri-arrow-up-circle-fill',
          description: isPositive ? 'Cost reduction' : 'Cost increases'
        };
      case 'Mix Impact':
        return {
          icon: isPositive ? 'ri-arrow-up-circle-fill' : 'ri-arrow-down-circle-fill',
          description: isPositive ? 'Favorable product mix' : 'Unfavorable product mix'
        };
      default:
        return {
          icon: isPositive ? 'ri-arrow-up-circle-fill' : 'ri-arrow-down-circle-fill',
          description: 'Impact on margin'
        };
    }
  };

  useEffect(() => {
    const fetchVarianceData = async () => {
      try {
        setLoading(true);
        const params: any = {
          businessArea: selectedBusinessArea !== 'All' ? selectedBusinessArea : undefined,
          brand: selectedBrand !== 'All' ? selectedBrand : undefined,
        };
        
        const response = await dashboardAPI.getVariance(params);
        const data = response.data.data;
        
        // Validate and format the variance data
        const validatedData = {
          volumeVariance: validateAndFormatPercentage(data.volumeVariance || 0),
          priceVariance: validateAndFormatPercentage(data.priceVariance || 0),
          costVariance: validateAndFormatPercentage(data.costVariance || 0),
          mixVariance: validateAndFormatPercentage(data.mixVariance || 0),
          totalVariance: validateAndFormatPercentage(data.totalVariance || 0)
        };
        
        // Convert API data to component format with proper validation
        const drivers: VarianceDriver[] = [
          {
            driver: 'Volume Impact',
            value: validatedData.volumeVariance,
            description: getDriverIconAndDescription('Volume Impact', validatedData.volumeVariance).description,
            icon: getDriverIconAndDescription('Volume Impact', validatedData.volumeVariance).icon,
            color: validatedData.volumeVariance >= 0 ? 'text-green-600' : 'text-red-600'
          },
          {
            driver: 'Price Changes',
            value: validatedData.priceVariance,
            description: getDriverIconAndDescription('Price Changes', validatedData.priceVariance).description,
            icon: getDriverIconAndDescription('Price Changes', validatedData.priceVariance).icon,
            color: validatedData.priceVariance >= 0 ? 'text-green-600' : 'text-red-600'
          },
          {
            driver: 'Cost Impact',
            value: validatedData.costVariance,
            description: getDriverIconAndDescription('Cost Impact', validatedData.costVariance).description,
            icon: getDriverIconAndDescription('Cost Impact', validatedData.costVariance).icon,
            color: validatedData.costVariance >= 0 ? 'text-green-600' : 'text-red-600'
          },
          {
            driver: 'Mix Impact',
            value: validatedData.mixVariance,
            description: getDriverIconAndDescription('Mix Impact', validatedData.mixVariance).description,
            icon: getDriverIconAndDescription('Mix Impact', validatedData.mixVariance).icon,
            color: validatedData.mixVariance >= 0 ? 'text-green-600' : 'text-red-600'
          }
        ];
        
        setVarianceData(drivers);
        setTotalImpact(validatedData.totalVariance);
      } catch (error) {
        console.error('Error fetching variance data:', error);
        // Fallback to empty data
        setVarianceData([]);
        setTotalImpact(0);
      } finally {
        setLoading(false);
      }
    };

    fetchVarianceData();
  }, [selectedBusinessArea, selectedBrand]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Margin Variance Analysis</h3>
            <p className="text-sm text-gray-500">Period-over-period drivers</p>
          </div>
          <div className="text-right">
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-1 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Margin Variance Analysis</h3>
          <p className="text-sm text-gray-500">Period-over-period drivers</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Net Impact</p>
          <p className={`text-lg font-bold ${totalImpact > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalImpact > 0 ? '+' : ''}{totalImpact.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {varianceData.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <i className={`${item.icon} text-lg ${item.color}`}></i>
              <div>
                <p className="font-medium text-gray-900">{item.driver}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-bold ${item.color}`}>
                {item.value > 0 ? '+' : ''}{item.value.toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <i className="ri-lightbulb-line text-blue-600 text-lg mt-0.5"></i>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Key Insights</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Volume growth driving positive margin impact</li>
                <li>• Raw material inflation remains key risk</li>
                <li>• Review promotional strategy effectiveness</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md text-sm whitespace-nowrap">
          <i className="ri-file-excel-line mr-2"></i>Export Detailed Analysis
        </button>
      </div>
    </div>
  );
}