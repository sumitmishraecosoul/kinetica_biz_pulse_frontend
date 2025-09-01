
'use client';

import { useEffect, useState } from 'react';
import { dashboardAPI } from '../../services/api';

interface TopCustomersSectionProps {
  selectedPeriod: string;
  selectedChannel: string;
  selectedBusinessArea: string;
  onDrillDown: (data: any) => void;
}

export default function TopCustomersSection({
  selectedPeriod,
  selectedChannel,
  selectedBusinessArea,
  onDrillDown
}: TopCustomersSectionProps) {
  const [topCustomers, setTopCustomers] = useState<any[]>([]);
  const [atRiskCustomers, setAtRiskCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params: any = {
          period: selectedPeriod,
          businessArea: selectedBusinessArea !== 'All' ? selectedBusinessArea : undefined,
          channel: selectedChannel !== 'All' ? selectedChannel : undefined,
          dimension: 'Customer',
          metric: 'gSales',
          limit: 10,
        };
        const [topRes, riskRes] = await Promise.all([
          dashboardAPI.getTopPerformers(params),
          dashboardAPI.getRisk({ ...params, metric: undefined })
        ]);
        const top = (topRes.data.data || []).map((item: any, idx: number) => ({
          rank: idx + 1,
          name: item.name,
          channel: selectedChannel === 'All' ? '' : selectedChannel,
          revenue: item.value,
          margin: undefined as number | undefined,
          growth: item.growth,
          orders: undefined as number | undefined,
          avgOrderValue: undefined as number | undefined,
          status: item.growth > 10 ? 'growing' : item.growth < 0 ? 'declining' : 'stable',
        }));
        setTopCustomers(top);
        const risks = (riskRes.data.data || []).slice(0, 3).map((r: any) => ({
          name: r.name,
          channel: selectedChannel === 'All' ? '' : selectedChannel,
          revenue: r.value,
          decline: r.trend < 0 ? Number(r.trend.toFixed(1)) : 0,
          lastOrder: '-',
          riskLevel: r.riskLevel,
        }));
        setAtRiskCustomers(risks);
      } catch (e) {
        setTopCustomers([]);
        setAtRiskCustomers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedPeriod, selectedChannel, selectedBusinessArea]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'growing':
        return 'text-green-600 bg-green-50';
      case 'stable':
        return 'text-blue-600 bg-blue-50';
      case 'declining':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleCustomerClick = (customer: any, type: string) => {
    onDrillDown({
      type: `customer-${type}`,
      title: `${customer.name} Analysis`,
      data: customer,
      period: selectedPeriod
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Top 10 Customers</h3>
            <p className="text-sm text-gray-500 mt-1">Ranked by revenue performance</p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <i className="ri-download-line"></i>
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <i className="ri-more-2-line"></i>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {topCustomers.map((customer, index) => (
            <div
              key={index}
              onClick={() => handleCustomerClick(customer, 'detail')}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors duration-200 group"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                  {customer.rank}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                    {customer.name}
                  </h4>
                  {customer.channel && <p className="text-sm text-gray-500">{customer.channel}</p>}
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <div className="font-medium text-gray-900">{formatCurrency(customer.revenue)}</div>
                  {customer.orders && <div className="text-sm text-gray-500">{customer.orders} orders</div>}
                </div>
                
                {typeof customer.margin === 'number' && (
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{customer.margin.toFixed(1)}%</div>
                    <div className="text-sm text-gray-500">margin</div>
                  </div>
                )}
                
                <div className="text-right">
                  <div className={`font-medium ${customer.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {customer.growth > 0 ? '+' : ''}{customer.growth}%
                  </div>
                  <div className="text-sm text-gray-500">growth</div>
                </div>
                
                {customer.status && (
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                    {customer.status}
                  </div>
                )}
                
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-arrow-right-s-line text-gray-400 group-hover:text-gray-600 transition-colors duration-200"></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">At-Risk Customers</h3>
            <p className="text-sm text-gray-500 mt-1">Require immediate attention</p>
          </div>
          <div className="w-6 h-6 flex items-center justify-center text-red-500">
            <i className="ri-alert-line"></i>
          </div>
        </div>

        <div className="space-y-4">
          {atRiskCustomers.map((customer, index) => (
            <div
              key={index}
              onClick={() => handleCustomerClick(customer, 'risk')}
              className={`p-4 rounded-lg border cursor-pointer transition-colors duration-200 hover:bg-gray-50 ${getRiskColor(customer.riskLevel)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{customer.name}</h4>
                <span className="text-xs font-medium uppercase tracking-wider">
                  {customer.riskLevel} risk
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{customer.channel}</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Revenue:</span>
                  <span className="font-medium">{formatCurrency(customer.revenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Decline:</span>
                  <span className="font-medium text-red-600">{customer.decline}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last order:</span>
                  <span className="font-medium">{customer.lastOrder}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 font-medium whitespace-nowrap">
          View All At-Risk Customers
        </button>
      </div>
    </div>
  );
}
