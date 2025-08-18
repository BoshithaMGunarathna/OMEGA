import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { Product } from '../types';

const Products: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...new Set(products.map(p => p.category))];
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockProducts = filteredProducts.filter(p => p.currentStock <= p.reorderPoint);

  const ProductModal = ({ product, onClose }: { product?: Product; onClose: () => void }) => {
    const [formData, setFormData] = useState({
      sku: product?.sku || '',
      barcode: product?.barcode || '',
      name: product?.name || '',
      brand: product?.brand || '',
      category: product?.category || '',
      costPrice: product?.costPrice || 0,
      sellPrice: product?.sellPrice || 0,
      unit: product?.unit || 'piece',
      minStock: product?.minStock || 0,
      currentStock: product?.currentStock || 0,
      reorderPoint: product?.reorderPoint || 0,
      supplier: product?.supplier || '',
      imageUrl: product?.imageUrl || ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (product) {
        await updateProduct(product.id, formData);
      } else {
        await addProduct(formData);
      }
      
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-96 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-6">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">SKU</label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Barcode</label>
                <input
                  type="text"
                  required
                  value={formData.barcode}
                  onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Brand</label>
                <input
                  type="text"
                  required
                  value={formData.brand}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Unit</label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="piece">Piece</option>
                  <option value="bottle">Bottle</option>
                  <option value="tube">Tube</option>
                  <option value="compact">Compact</option>
                  <option value="set">Set</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Cost Price (Rs.)</label>
                <input
                  type="number"
                  required
                  value={formData.costPrice}
                  onChange={(e) => setFormData({...formData, costPrice: Number(e.target.value)})}
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Sell Price (Rs.)</label>
                <input
                  type="number"
                  required
                  value={formData.sellPrice}
                  onChange={(e) => setFormData({...formData, sellPrice: Number(e.target.value)})}
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Stock</label>
                <input
                  type="number"
                  required
                  value={formData.currentStock}
                  onChange={(e) => setFormData({...formData, currentStock: Number(e.target.value)})}
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Min Stock</label>
                <input
                  type="number"
                  required
                  value={formData.minStock}
                  onChange={(e) => setFormData({...formData, minStock: Number(e.target.value)})}
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Reorder Point</label>
                <input
                  type="number"
                  required
                  value={formData.reorderPoint}
                  onChange={(e) => setFormData({...formData, reorderPoint: Number(e.target.value)})}
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Supplier</label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                {product ? 'Update' : 'Add'} Product
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">{products.length}</p>
              <p className="text-gray-600">Total Products</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">{lowStockProducts.length}</p>
              <p className="text-gray-600">Low Stock</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold">Rs</span>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold">
                {products.reduce((sum, p) => sum + (p.sellPrice * p.currentStock), 0).toLocaleString()}
              </p>
              <p className="text-gray-600">Stock Value</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold">#</span>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold">{categories.length - 1}</p>
              <p className="text-gray-600">Categories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div className="flex space-x-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU/Barcode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {product.imageUrl && (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-12 h-12 rounded object-cover mr-4"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.sku}</div>
                    <div className="text-sm text-gray-500">{product.barcode}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <span className={product.currentStock <= product.reorderPoint ? 'text-red-600 font-medium' : ''}>
                        {product.currentStock}
                      </span>
                      <span className="text-gray-500"> / {product.reorderPoint}</span>
                    </div>
                    {product.currentStock <= product.reorderPoint && (
                      <div className="flex items-center text-xs text-red-600">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Low Stock
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Rs. {product.sellPrice.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Cost: Rs. {product.costPrice.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this product?')) {
                            deleteProduct(product.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <ProductModal onClose={() => setShowAddModal(false)} />
      )}
      
      {editingProduct && (
        <ProductModal 
          product={editingProduct} 
          onClose={() => setEditingProduct(null)} 
        />
      )}
    </div>
  );
};

export default Products;