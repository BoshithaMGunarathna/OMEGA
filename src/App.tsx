import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import AuthProvider from './components/AuthProvider';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Products from './pages/Products';
import Restock from './pages/Restock';
import Orders from './pages/Orders';
import Employees from './pages/Employees';
import Analytics from './pages/Analytics';

const AppRoutes: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pos" element={<POS />} />
        <Route path="/products" element={
          user.role === 'Cashier' ? <Navigate to="/" /> : <Products />
        } />
        <Route path="/restock" element={
          user.role === 'Cashier' ? <Navigate to="/" /> : <Restock />
        } />
        <Route path="/orders" element={<Orders />} />
        <Route path="/employees" element={
          user.role === 'Cashier' ? <Navigate to="/" /> : <Employees />
        } />
        <Route path="/analytics" element={
          user.role === 'Cashier' ? <Navigate to="/" /> : <Analytics />
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;