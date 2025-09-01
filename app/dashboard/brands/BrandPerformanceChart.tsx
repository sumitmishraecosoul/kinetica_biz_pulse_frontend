
'use client';

import { useEffect, useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';
import { dashboardAPI } from '../../services/api';

interface BrandPerformanceChartProps {
  selectedBusinessArea: string;
  selectedBrand: string;
  selectedPeriod: string;
  selectedMetric: string;
  onDrillDown: (data: any) => void;
}

export default function BrandPerformanceChart({ selectedBusinessArea, selectedBrand, selectedPeriod, selectedMetric, onDrillDown }: BrandPerformanceChartProps) {
  const [chartType, setChartType] = useState('area');
  const [trendRevenue, setTrendRevenue] = useState<any[]>([]);
  const [trendCases, setTrendCases] = useState<any[]>([]);
  const [trendGP, setTrendGP] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoading(true);
        const baseParams: any = {
          period: selectedPeriod,
          businessArea: selectedBusinessArea !== 'All' ? selectedBusinessArea : undefined,
          brand: selectedBrand !== 'All' ? selectedBrand : undefined,
        };
        const [rev, cas, gp] = await Promise.all([
          dashboardAPI.getTrend({ ...baseParams, metric: 'gSales' }),
          dashboardAPI.getTrend({ ...baseParams, metric: 'Cases' }),
          dashboardAPI.getTrend({ ...baseParams, metric: 'fGP' })
        ]);
        setTrendRevenue(rev.data.data || []);
        setTrendCases(cas.data.data || []);
        setTrendGP(gp.data.data || []);
      } catch (e) {
        setTrendRevenue([]);
        setTrendCases([]);
        setTrendGP([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, [selectedBusinessArea, selectedBrand, selectedPeriod]);

  const monthlyData = useMemo(() => {
    const months = Array.from(new Set([...(trendRevenue || []).map((d: any) => d.period)]));
    return months.map((m) => {
      const r = (trendRevenue || []).find((d: any) => d.period === m);
      const c = (trendCases || []).find((d: any) => d.period === m);
      const g = (trendGP || []).find((d: any) => d.period === m);
      const revenue = r?.value || 0;
      const units = c?.value || 0;
      const gp = g?.value || 0;
      const margin = revenue > 0 ? (gp / revenue) * 100 : 0;
      const growth = r?.changePercent || 0;
      return { month: m, revenue, units, margin: Number(margin.toFixed(1)), growth: Number(growth?.toFixed?.(1) || 0) };
    });
  }, [trendRevenue, trendCases, trendGP]);

  const formatValue = (value: number) => {
    if (selectedMetric === 'revenue') {
      return `€${(value / 1000).toFixed(0)}K`;
    } else if (selectedMetric === 'margin' || selectedMetric === 'growth') {
      return `${value.toFixed(1)}%`;
    } else if (selectedMetric === 'units') {
      return `${(value / 1000).toFixed(1)}K`;
    } else {
      return `${value}`;
    }
  };

  const getMetricValue = (item: any) => item[selectedMetric];

  const renderChart = () => {
    const commonProps = {
      data: monthlyData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'bar':
        return (
           <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatValue} />
             <Tooltip formatter={(value: any) => [formatValue(value), selectedMetric]} />
             <Bar dataKey={selectedMetric} fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'line':
        return (
           <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatValue} />
             <Tooltip formatter={(value: any) => [formatValue(value), selectedMetric]} />
             <Line type="monotone" dataKey={selectedMetric} stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6' }} />
          </LineChart>
        );
      default:
        return (
           <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatValue} />
            <Tooltip formatter={(value: any) => [formatValue(value), selectedMetric]} />
            <Area type="monotone" dataKey={selectedMetric} stroke="#3B82F6" fill="url(#colorGradient)" />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
          </AreaChart>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Brand Performance Trend</h3>
          <p className="text-sm text-gray-500 capitalize">{selectedMetric} over time</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button 
              className={`px-3 py-1 rounded-md text-sm whitespace-nowrap ${chartType === 'area' ? 'bg-white shadow-sm' : ''}`}
              onClick={() => setChartType('area')}
            >
              Area
            </button>
            <button 
              className={`px-3 py-1 rounded-md text-sm whitespace-nowrap ${chartType === 'bar' ? 'bg-white shadow-sm' : ''}`}
              onClick={() => setChartType('bar')}
            >
              Bar
            </button>
            <button 
              className={`px-3 py-1 rounded-md text-sm whitespace-nowrap ${chartType === 'line' ? 'bg-white shadow-sm' : ''}`}
              onClick={() => setChartType('line')}
            >
              Line
            </button>
          </div>
          <button 
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 border border-gray-300 rounded"
            onClick={() => onDrillDown({ type: 'chart', data: monthlyData })}
          >
            <i className="ri-fullscreen-line"></i>
          </button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t">
        <div className="text-center">
          <p className="text-xs text-gray-500">Best Month</p>
          <p className="font-semibold">{[...monthlyData].sort((a,b) => (getMetricValue(b) - getMetricValue(a)))[0]?.month || '-'}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Avg Growth</p>
          <p className="font-semibold text-green-600">{(() => {
            const vals = monthlyData.map(d => d.growth).filter(v => Number.isFinite(v));
            const avg = vals.length ? vals.reduce((a,b)=>a+b,0)/vals.length : 0;
            const sign = avg >= 0 ? '+' : '';
            return `${sign}${avg.toFixed(1)}%`;
          })()}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Peak Value</p>
          <p className="font-semibold">{formatValue(Math.max(...monthlyData.map(getMetricValue)))}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Trend</p>
          <p className={`font-semibold ${((monthlyData[monthlyData.length-1]?.growth||0) >= 0) ? 'text-green-600' : 'text-red-600'}`}>
            <i className={`ri-trending-${((monthlyData[monthlyData.length-1]?.growth||0) >= 0) ? 'up' : 'down'}-line mr-1`}></i>
            {((monthlyData[monthlyData.length-1]?.growth||0) >= 0) ? 'Rising' : 'Falling'}
          </p>
        </div>
      </div>
    </div>
  );
}
