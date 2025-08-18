import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Package,
  Calendar,
  Target
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format, subDays } from 'date-fns';

const Analytics: React.FC = () => {
  const { salesMetrics, products, orders } = useData();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6'];

  // Calculate metrics based on time range
  const getRangeData = (days: number) => {
    const cutoffDate = subDays(new Date(), days);
    const rangeOrders = orders.filter(order => order.timestamp >= cutoffDate);
    const totalSales = rangeOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = rangeOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    
    return { totalSales, totalOrders, averageOrderValue, rangeOrders };
  };

  const currentData = getRangeData(timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90);

  // Category sales data for pie chart
  const categoryData = products.reduce((acc, product) => {
    const category = product.category;
    const productOrders = currentData.rangeOrders.filter(order => 
      order.items.some(item => item.productId === product.id)
    );
    const sales = productOrders.reduce((sum, order) => 
      sum + order.items
        .filter(item => item.productId === product.id)
        .reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0), 0
    );
    
    acc[category] = (acc[category] || 0) + sales;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));

  // Top performing products
  const productPerformance = products.map(product => {
    const productOrders = currentData.rangeOrders.filter(order => 
      order.items.some(item => item.productId === product.id)
    );
    const quantity = productOrders.reduce((sum, order) => 
      sum + order.items
        .filter(item => item.productId === product.id)
        .reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );
    const revenue = productOrders.reduce((sum, order) => 
      sum + order.items
        .filter(item => item.productId === product.id)
        .reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0), 0
    );
    
    return { product, quantity, revenue };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Sales insights and forecasting</p>
        </div>
        
        <div className="flex space-x-2">
          {[
            { value: '7d', label: '7 Days' },
            { value: '30d', label: '30 Days' },
            { value: '90d', label: '90 Days' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setTimeRange(option.value as any)}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                timeRange === option.value
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">
                Rs. {currentData.totalSales.toLocaleString()}
              </p>
              <p className="text-xs text-green-600">+12.5% vs prev period</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{currentData.totalOrders}</p>
              <p className="text-xs text-blue-600">+8.3% vs prev period</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Order Value</p>
              <p className="text-2xl font-bold text-gray-900">
                Rs. {Math.round(currentData.averageOrderValue).toLocaleString()}
              </p>
              <p className="text-xs text-purple-600">+3.8% vs prev period</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(p => p.currentStock <= p.reorderPoint).length}
              </p>
              <p className="text-xs text-red-600">Needs attention</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Package className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Sales Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesMetrics.salesByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => format(new Date(value), 'MMM dd')}
              />
              <YAxis tickFormatter={(value) => `Rs. ${(value / 1000).toFixed(0)}k`} />
              <Tooltip 
                formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, 'Sales']}
                labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
              />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stroke="#8B5CF6" 
                fill="#8B5CF6" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sales by Category */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `Rs. ${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Sales Pattern */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Hourly Sales Pattern</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesMetrics.salesByHour}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="hour" 
                tickFormatter={(value) => `${value}:00`}
              />
              <YAxis tickFormatter={(value) => `Rs. ${(value / 1000).toFixed(0)}k`} />
              <Tooltip 
                formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, 'Sales']}
                labelFormatter={(value) => `${value}:00`}
              />
              <Bar dataKey="sales" fill="#EC4899" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Top Performing Products</h3>
          <div className="space-y-4">
            {productPerformance.map((item, index) => (
              <div key={item.product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-semibold text-sm">#{index + 1}</span>
                  </div>
                  {item.product.imageUrl && (
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.name}
                      className="w-10 h-10 rounded object-cover mr-3"
                    />
                  )}
                  <div>
                    <p className="font-medium text-sm">{item.product.name}</p>
                    <p className="text-xs text-gray-600">{item.product.brand}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">Rs. {item.revenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">{item.quantity} sold</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Forecast Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Sales Forecast (Next 2 Months)
        </h3>
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg mb-4">
          <p className="text-sm text-gray-700 mb-2">
            <strong>AI-Powered Predictions:</strong> Based on historical sales data, seasonal trends, and current stock levels.
          </p>
          <p className="text-xs text-gray-600">
            Note: This is a demo using dummy forecasting data. In production, this would use machine learning models.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {salesMetrics.forecastData.map((item) => (
            <div key={item.productId} className="border rounded-lg p-4">
              <h4 className="font-medium text-sm mb-2">{item.productName}</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Predicted Sales:</span>
                  <span className="font-semibold">{item.predictedSales} units</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Recommended Reorder:</span>
                  <span className="font-semibold text-purple-600">{item.recommendedReorder} units</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Confidence:</span>
                  <span className={`font-semibold ${
                    item.confidence >= 0.8 ? 'text-green-600' : 
                    item.confidence >= 0.6 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {(item.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      item.confidence >= 0.8 ? 'bg-green-500' : 
                      item.confidence >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${item.confidence * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;