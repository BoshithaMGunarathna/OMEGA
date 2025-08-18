import React, { ReactNode } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  ShoppingCart,
  Package,
  TrendingUp,
  Users,
  RotateCcw,
  History,
  LogOut,
  User,
  Home,

} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigationItems = [
    { path: '/', icon: Home, label: 'Dashboard', roles: ['Owner', 'Manager', 'Cashier'] },
    { path: '/pos', icon: ShoppingCart, label: 'POS', roles: ['Owner', 'Manager', 'Cashier'] },
    { path: '/products', icon: Package, label: 'Products', roles: ['Owner', 'Manager'] },
    { path: '/restock', icon: RotateCcw, label: 'Restock', roles: ['Owner', 'Manager'] },
    { path: '/orders', icon: History, label: 'Orders', roles: ['Owner', 'Manager', 'Cashier'] },
    { path: '/employees', icon: Users, label: 'Employees', roles: ['Owner', 'Manager'] },
    { path: '/analytics', icon: TrendingUp, label: 'Analytics', roles: ['Owner', 'Manager'] },
  ];

  const visibleItems = navigationItems.filter(item =>
    user && item.roles.includes(user.role)
  );

  return (

    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-purple-600">BeautyPOS</h1>
          <p className="text-sm text-gray-600">Cosmetics Shop</p>
        </div>

        {/* User Info */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <User size={16} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-600">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${isActive
                        ? 'bg-purple-100 text-purple-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Settings and Logout */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 w-full transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {visibleItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;