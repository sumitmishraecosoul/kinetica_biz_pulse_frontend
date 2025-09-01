'use client';

import { useEffect, useState } from 'react';
import { dashboardAPI } from '../../services/api';
import Pagination from '../../components/Pagination';
import DrillDownModal from '../../components/DrillDownModal';

interface TopPerformersSectionProps {
  selectedBusinessArea: string;
  selectedBrand: string;
  onDrillDown: (data: any) => void;
}

interface PaginatedData {
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

export default function TopPerformersSection({ selectedBusinessArea, selectedBrand, onDrillDown }: TopPerformersSectionProps) {
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [topCustomers, setTopCustomers] = useState<any[]>([]);
  const [brandShare, setBrandShare] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalData, setModalData] = useState<any>(null);
  
  // Pagination states
  const [productsPagination, setProductsPagination] = useState<PaginatedData['pagination']>({
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false,
    totalPages: 0,
    currentPage: 1
  });
  const [customersPagination, setCustomersPagination] = useState<PaginatedData['pagination']>({
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false,
    totalPages: 0,
    currentPage: 1
  });

  const handleDrillDown = (type: string, data: any) => {
    setModalType(type);
    setModalData(data);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType('');
    setModalData(null);
  };

  const fetchTopProducts = async (page: number = 1, limit: number = 20) => {
    try {
      const paramsBase: any = {
        businessArea: selectedBusinessArea !== 'All' ? selectedBusinessArea : undefined,
        brand: selectedBrand !== 'All' ? selectedBrand : undefined,
        dimension: 'ProdConcat',
        metric: 'gSales',
        limit,
        offset: (page - 1) * limit
      };
      
      const response = await dashboardAPI.getTopPerformers(paramsBase);
      const result = response.data.data as PaginatedData;
      
      setTopProducts((result.data || []).map((p: any) => ({
        sku: p.name,
        name: p.name,
        revenue: p.value,
        margin: undefined,
        units: undefined,
        rateOfSale: undefined,
        trend: p.growth > 0 ? 'up' : p.growth < 0 ? 'down' : 'stable',
        risk: p.growth < 0 ? 'high' : p.value < 10000 ? 'medium' : 'low',
      })));
      setProductsPagination(result.pagination);
    } catch (error) {
      console.error('Error fetching top products:', error);
      setTopProducts([]);
    }
  };

  const fetchTopCustomers = async (page: number = 1, limit: number = 20) => {
    try {
      const paramsBase: any = {
        businessArea: selectedBusinessArea !== 'All' ? selectedBusinessArea : undefined,
        brand: selectedBrand !== 'All' ? selectedBrand : undefined,
        dimension: 'Customer',
        metric: 'gSales',
        limit,
        offset: (page - 1) * limit
      };
      
      const response = await dashboardAPI.getTopPerformers(paramsBase);
      const result = response.data.data as PaginatedData;
      
      setTopCustomers((result.data || []).map((c: any) => ({
        customer: c.name,
        channel: '',
        revenue: c.value,
        margin: undefined,
        share: 0,
        growth: c.growth,
      })));
      setCustomersPagination(result.pagination);
    } catch (error) {
      console.error('Error fetching top customers:', error);
      setTopCustomers([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch top products and customers with pagination
        await Promise.all([
          fetchTopProducts(1, 20),
          fetchTopCustomers(1, 20)
        ]);
        
        // Fetch brand share (no pagination needed for this)
        const paramsBase: any = {
          businessArea: selectedBusinessArea !== 'All' ? selectedBusinessArea : undefined,
          brand: selectedBrand !== 'All' ? selectedBrand : undefined,
          dimension: 'Brand',
          metric: 'gSales',
          limit: 50
        };
        
        const brandRes = await dashboardAPI.getTopPerformers(paramsBase);
        const brands = (brandRes.data.data as PaginatedData).data || [];
        const total = brands.reduce((s: number, b: any) => s + (b.value || 0), 0) || 1;
        setBrandShare(
          brands
            .slice(0, 5)
            .map((b: any) => ({
              brand: b.name,
              businessArea: selectedBusinessArea,
              revenue: b.value,
              share: Number(((b.value / total) * 100).toFixed(1)),
              margin: undefined,
              growth: b.growth,
            }))
        );
      } catch (e) {
        console.error('Error fetching data:', e);
        setTopProducts([]);
        setTopCustomers([]);
        setBrandShare([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedBusinessArea, selectedBrand]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-green-600 bg-green-50';
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top SKUs</h3>
            <button 
              className="text-blue-600 hover:text-blue-800 text-sm whitespace-nowrap"
              onClick={() => handleDrillDown('skus', { businessArea: selectedBusinessArea, brand: selectedBrand })}
            >
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            {topProducts.map((sku, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                   onClick={() => onDrillDown({ type: 'sku-detail', data: sku })}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{sku.name || '-'}</p>
                    <p className="text-xs text-gray-500">{sku.sku || ''}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getRiskColor(sku.risk)}`}>
                    {sku.risk} risk
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-gray-500">Revenue</p>
                    <p className="font-medium">{formatCurrency(sku.revenue)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Margin</p>
                    <p className="font-medium">{typeof sku.margin === 'number' ? `${sku.margin}%` : '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">ROS</p>
                    <p className={`font-medium flex items-center ${sku.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {sku.growth || 0}
                      <i className={`ml-1 ${sku.growth > 0 ? 'ri-arrow-up-line' : 'ri-arrow-down-line'}`}></i>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {productsPagination.totalPages > 1 && (
            <div className="mt-4">
              <Pagination
                currentPage={productsPagination.currentPage}
                totalPages={productsPagination.totalPages}
                totalItems={productsPagination.total}
                itemsPerPage={productsPagination.limit}
                onPageChange={(page) => fetchTopProducts(page, productsPagination.limit)}
                onItemsPerPageChange={(limit) => fetchTopProducts(1, limit)}
              />
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Customers</h3>
            <button 
              className="text-blue-600 hover:text-blue-800 text-sm whitespace-nowrap"
              onClick={() => handleDrillDown('customers', { businessArea: selectedBusinessArea, brand: selectedBrand })}
            >
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            {topCustomers.map((customer, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                   onClick={() => onDrillDown({ type: 'customer-detail', data: customer })}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{customer.customer}</p>
                    {customer.channel && <p className="text-xs text-gray-500">{customer.channel}</p>}
                  </div>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {customer.share ? `${customer.share}% share` : ''}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-gray-500">Revenue</p>
                    <p className="font-medium">{formatCurrency(customer.revenue)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Growth</p>
                    <p className={`font-medium ${customer.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>{customer.growth > 0 ? '+' : ''}{customer.growth}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {customersPagination.totalPages > 1 && (
            <div className="mt-4">
              <Pagination
                currentPage={customersPagination.currentPage}
                totalPages={customersPagination.totalPages}
                totalItems={customersPagination.total}
                itemsPerPage={customersPagination.limit}
                onPageChange={(page) => fetchTopCustomers(page, customersPagination.limit)}
                onItemsPerPageChange={(limit) => fetchTopCustomers(1, limit)}
              />
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Brand Share Analysis</h3>
            <button 
              className="text-blue-600 hover:text-blue-800 text-sm whitespace-nowrap"
              onClick={() => handleDrillDown('brands', { businessArea: selectedBusinessArea, brand: selectedBrand })}
            >
              View Details
            </button>
          </div>
          
          <div className="space-y-3">
            {brandShare.map((brand, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                   onClick={() => onDrillDown({ type: 'brand-detail', data: brand })}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{brand.brand}</p>
                    <p className="text-xs text-gray-500">{brand.businessArea}</p>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{brand.share}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${brand.share}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{formatCurrency(brand.revenue)}</span>
                  <span className={`${brand.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>{brand.growth > 0 ? '+' : ''}{brand.growth}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <DrillDownModal
        isOpen={modalOpen}
        onClose={closeModal}
        type={modalType}
        data={modalData}
        filters={{ businessArea: selectedBusinessArea, brand: selectedBrand }}
      />
    </div>
  );
}