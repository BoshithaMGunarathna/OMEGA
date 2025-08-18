/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { 
  RotateCcw, 
  Plus, 
  Package, 
  Truck,
  User,
  Calendar,
  Search
} from 'lucide-react';
import { format } from 'date-fns';
import { RestockEvent } from '../types';

const Restock: React.FC = () => {
  const { products, restockEvents, addRestockEvent, suppliers } = useData();
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [restockType, setRestockType] = useState<'manual' | 'supplier'>('manual');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = restockEvents.filter(event =>
    event.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.supplier?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const RestockModal = ({ onClose }: { onClose: () => void }) => {
    const [formData, setFormData] = useState({
      productId: '',
      quantity: 0,
      supplierId: '',
      notes: '',
      type: restockType as 'manual' | 'supplier'
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      const product = products.find(p => p.id === formData.productId);
      const supplier = suppliers.find(s => s.id === formData.supplierId);
      
      if (!product) return;

      await addRestockEvent({
        productId: formData.productId,
        product,
        quantity: formData.quantity,
        supplierId: formData.type === 'supplier' ? formData.supplierId : undefined,
        supplier: formData.type === 'supplier' ? supplier : undefined,
        manualBy: formData.type === 'manual' ? user?.name : undefined,
        notes: formData.notes,
        type: formData.type
      });
      
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-lg">
          <h2 className="text-xl font-semibold mb-6">Add Restock Event</h2>
          
          {/* Restock Type Selection */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Restock Type</p>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => {
                  setRestockType('manual');
                  setFormData({ ...formData, type: 'manual', supplierId: '' });
                }}
                className={`flex-1 flex items-center justify-center p-3 rounded-lg border ${
                  restockType === 'manual'
                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <User className="w-5 h-5 mr-2" />
                Manual Restock
              </button>
              <button
                type="button"
                onClick={() => {
                  setRestockType('supplier');
                  setFormData({ ...formData, type: 'supplier' });
                }}
                className={`flex-1 flex items-center justify-center p-3 rounded-lg border ${
                  restockType === 'supplier'
                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Truck className="w-5 h-5 mr-2" />
                Supplier Delivery
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product</label>
              <select
                required
                value={formData.productId}
                onChange={(e) => setFormData({...formData, productId: e.target.value})}
                className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select a product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {product.brand} (Current: {product.currentStock})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                required
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})}
                className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {restockType === 'supplier' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Supplier</label>
                <select
                  required={restockType === 'supplier'}
                  value={formData.supplierId}
                  onChange={(e) => setFormData({...formData, supplierId: e.target.value})}
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a supplier</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={3}
                className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Additional notes about this restock..."
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Add Restock
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const getRestockIcon = (type: string) => {
    switch (type) {
      case 'manual':
        return <User className="w-4 h-4 text-blue-600" />;
      case 'supplier':
        return <Truck className="w-4 h-4 text-green-600" />;
      default:
        return <Package className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRestockColor = (type: string) => {
    switch (type) {
      case 'manual':
        return 'bg-blue-100 text-blue-800';
      case 'supplier':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Restock Management</h1>
          <p className="text-gray-600">Track inventory restocking events</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Restock
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <RotateCcw className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">{restockEvents.length}</p>
              <p className="text-gray-600">Total Restocks</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <User className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">
                {restockEvents.filter(e => e.type === 'manual').length}
              </p>
              <p className="text-gray-600">Manual Restocks</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Truck className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">
                {restockEvents.filter(e => e.type === 'supplier').length}
              </p>
              <p className="text-gray-600">Supplier Deliveries</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">
                {restockEvents.reduce((sum, event) => sum + event.quantity, 0)}
              </p>
              <p className="text-gray-600">Total Units</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search restock events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Restock Events Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-900">
                          {format(event.timestamp, 'MMM dd, yyyy')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {format(event.timestamp, 'HH:mm')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {event.product.imageUrl && (
                        <img 
                          src={event.product.imageUrl} 
                          alt={event.product.name}
                          className="w-10 h-10 rounded object-cover mr-3"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {event.product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {event.product.brand}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600">
                      +{event.quantity}
                    </div>
                    <div className="text-sm text-gray-500">
                      {event.product.unit}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getRestockColor(event.type)}`}>
                      {getRestockIcon(event.type)}
                      <span className="ml-1">
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {event.type === 'supplier' 
                        ? event.supplier?.name
                        : event.manualBy
                      }
                    </div>
                    {event.type === 'supplier' && event.supplier?.contact && (
                      <div className="text-sm text-gray-500">
                        {event.supplier.contact}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {event.notes || '-'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Restock Modal */}
      {showAddModal && (
        <RestockModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
};

export default Restock;