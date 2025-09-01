'use client';

import { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import Pagination from './Pagination';

interface DrillDownModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  data: any;
  filters?: any;
}

interface DrillDownData {
  data: any[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
    totalPages: number;
    currentPage: number;
  };
}

export default function DrillDownModal({ isOpen, onClose, type, data, filters }: DrillDownModalProps) {
  const [drillDownData, setDrillDownData] = useState<DrillDownData>({
    data: [],
    pagination: {
      total: 0,
      limit: 20,
      offset: 0,
      hasMore: false,
      totalPages: 0,
      currentPage: 1
    }
  });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  useEffect(() => {
    if (isOpen && type && data) {
      fetchDrillDownData();
    }
  }, [isOpen, type, data, currentPage, itemsPerPage]);

  const fetchDrillDownData = async () => {
    try {
      setLoading(true);
      
      const params = {
        ...filters,
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage
      };

      let response;
      switch (type) {
        case 'skus':
          response = await dashboardAPI.getTopPerformers({
            ...params,
            dimension: 'ProdConcat',
            metric: 'gSales'
          });
          break;
        case 'customers':
          response = await dashboardAPI.getTopPerformers({
            ...params,
            dimension: 'Customer',
            metric: 'gSales'
          });
          break;
        case 'brands':
          response = await dashboardAPI.getTopPerformers({
            ...params,
            dimension: 'Brand',
            metric: 'gSales'
          });
          break;
        case 'categories':
          response = await dashboardAPI.getTopPerformers({
            ...params,
            dimension: 'Category',
            metric: 'gSales'
          });
          break;
        case 'channels':
          response = await dashboardAPI.getTopPerformers({
            ...params,
            dimension: 'Channel',
            metric: 'gSales'
          });
          break;
        default:
          response = await dashboardAPI.getTopPerformers(params);
      }

      setDrillDownData(response.data.data);
    } catch (error) {
      console.error('Error fetching drill-down data:', error);
      setDrillDownData({
        data: [],
        pagination: {
          total: 0,
          limit: itemsPerPage,
          offset: 0,
          hasMore: false,
          totalPages: 0,
          currentPage: 1
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const getModalTitle = () => {
    switch (type) {
      case 'skus': return 'Top SKUs';
      case 'customers': return 'Top Customers';
      case 'brands': return 'Brand Performance';
      case 'categories': return 'Category Performance';
      case 'channels': return 'Channel Performance';
      case 'brand-share': return 'Brand Share Analysis';
      case 'customer-detail': return 'Customer Details';
      case 'brand-detail': return 'Brand Details';
      case 'sku-detail': return 'SKU Details';
      default: return 'Detailed View';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const renderTable = () => {
    if (drillDownData.data.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No data available
        </div>
      );
    }

    const columns = getTableColumns();
    
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {drillDownData.data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.render ? column.render(item[column.key]) : item[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const getTableColumns = () => {
    switch (type) {
      case 'skus':
        return [
          { key: 'name', header: 'SKU Name', render: null },
          { key: 'value', header: 'Revenue', render: (value: number) => formatCurrency(value) },
          { key: 'growth', header: 'Growth', render: (value: number) => (
            <span className={value > 0 ? 'text-green-600' : 'text-red-600'}>
              {formatPercentage(value)}
            </span>
          )},
          { key: 'category', header: 'Category', render: null }
        ];
      case 'customers':
        return [
          { key: 'name', header: 'Customer', render: null },
          { key: 'value', header: 'Revenue', render: (value: number) => formatCurrency(value) },
          { key: 'growth', header: 'Growth', render: (value: number) => (
            <span className={value > 0 ? 'text-green-600' : 'text-red-600'}>
              {formatPercentage(value)}
            </span>
          )},
          { key: 'category', header: 'Channel', render: null }
        ];
      case 'brands':
        return [
          { key: 'name', header: 'Brand', render: null },
          { key: 'value', header: 'Revenue', render: (value: number) => formatCurrency(value) },
          { key: 'growth', header: 'Growth', render: (value: number) => (
            <span className={value > 0 ? 'text-green-600' : 'text-red-600'}>
              {formatPercentage(value)}
            </span>
          )},
          { key: 'category', header: 'Business Area', render: null }
        ];
      default:
        return [
          { key: 'name', header: 'Name', render: null },
          { key: 'value', header: 'Value', render: (value: number) => formatCurrency(value) },
          { key: 'growth', header: 'Growth', render: (value: number) => (
            <span className={value > 0 ? 'text-green-600' : 'text-red-600'}>
              {formatPercentage(value)}
            </span>
          )}
        ];
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {getModalTitle()}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading...</p>
              </div>
            ) : (
              <>
                {renderTable()}
                
                {drillDownData.pagination.totalPages > 1 && (
                  <div className="mt-4">
                    <Pagination
                      currentPage={drillDownData.pagination.currentPage}
                      totalPages={drillDownData.pagination.totalPages}
                      totalItems={drillDownData.pagination.total}
                      itemsPerPage={drillDownData.pagination.limit}
                      onPageChange={(page) => setCurrentPage(page)}
                      onItemsPerPageChange={(limit) => {
                        setItemsPerPage(limit);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}






