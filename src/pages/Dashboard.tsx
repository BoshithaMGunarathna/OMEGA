import React from 'react';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  AlertTriangle,
  DollarSign,
  Users
} from 'lucide-react';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const { products, orders, salesMetrics, shifts } = useData();
  const { user } = useAuth();

  const lowStockProducts = products.filter(p => p.currentStock <= p.reorderPoint);
  const todayOrders = orders.filter(o => 
    format(o.timestamp, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );
  const todaySales = todayOrders.reduce((sum, order) => sum + order.total, 0);
  const activeShifts = shifts.filter(s => !s.endTime);

  const stats = [
    {
      title: 'Today\'s Sales',
      value: `Rs. ${todaySales.toLocaleString()}`,
      subtitle: `${todayOrders.length} orders`,
      icon: DollarSign,
      color: 'text-green-600 bg-green-100'
    },
    {
      title: 'Total Products',
      value: products.length.toString(),
      subtitle: `${lowStockProducts.length} low stock`,
      icon: Package,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'Active Shifts',
      value: activeShifts.length.toString(),
      subtitle: 'employees working',
      icon: Users,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      title: 'Low Stock Alerts',
      value: lowStockProducts.length.toString(),
      subtitle: 'need restocking',
      icon: AlertTriangle,
      color: 'text-red-600 bg-red-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-purple-100">Here's what's happening in your cosmetics shop today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.subtitle}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Recent Orders
            </h2>
          </div>
          <div className="p-6">
            {todayOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                <div>
                  <p className="font-medium">{order.id}</p>
                  <p className="text-sm text-gray-600">
                    {format(order.timestamp, 'HH:mm')} • {order.cashier.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">Rs. {order.total.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{order.items.length} items</p>
                </div>
              </div>
            ))}
            {todayOrders.length === 0 && (
              <p className="text-gray-500 text-center py-8">No orders today yet</p>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
              Low Stock Alerts
            </h2>
          </div>
          <div className="p-6">
            {lowStockProducts.slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                <div className="flex items-center">
                  {product.imageUrl && (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-10 h-10 rounded object-cover mr-3"
                    />
                  )}
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.brand}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">{product.currentStock} left</p>
                  <p className="text-sm text-gray-600">Min: {product.reorderPoint}</p>
                </div>
              </div>
            ))}
            {lowStockProducts.length === 0 && (
              <p className="text-gray-500 text-center py-8">All products are well stocked!</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {user && ['Owner', 'Manager', 'Cashier'].includes(user.role) && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <ShoppingCart className="w-8 h-8 text-purple-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium">Start POS</p>
                  <p className="text-sm text-gray-600">Process new sale</p>
                </div>
              </button>
              
              {user.role !== 'Cashier' && (
                <>
                  <button className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <Package className="w-8 h-8 text-blue-600 mr-3" />
                    <div className="text-left">
                      <p className="font-medium">Add Product</p>
                      <p className="text-sm text-gray-600">New inventory item</p>
                    </div>
                  </button>
                  
                  <button className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                    <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
                    <div className="text-left">
                      <p className="font-medium">View Analytics</p>
                      <p className="text-sm text-gray-600">Sales insights</p>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;