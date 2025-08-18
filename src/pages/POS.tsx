import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { 
  ShoppingCart, 
  Search, 
  Scan, 
  Plus, 
  Minus, 
  X,
  CreditCard,
  Banknote,
  Split
} from 'lucide-react';
import { Product, OrderItem } from '../types';

const POS: React.FC = () => {
  const { products, addOrder } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'split'>('cash');

  const categories = ['All', ...new Set(products.map(p => p.category))];
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode.includes(searchTerm);
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory && product.currentStock > 0;
  });

  const handleBarcodeInput = (barcode: string) => {
    const product = products.find(p => p.barcode === barcode);
    if (product && product.currentStock > 0) {
      addToCart(product);
      setBarcodeInput('');
    }
  };

  const handleBarcodeKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && barcodeInput) {
      handleBarcodeInput(barcodeInput);
    }
  };

  const addToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      if (existingItem.quantity < product.currentStock) {
        setCartItems(items => 
          items.map(item => 
            item.productId === product.id 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      }
    } else {
      const newItem: OrderItem = {
        productId: product.id,
        product,
        quantity: 1,
        price: product.sellPrice,
        discount: 0
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems(items => items.filter(item => item.productId !== productId));
    } else {
      const product = products.find(p => p.id === productId);
      if (product && newQuantity <= product.currentStock) {
        setCartItems(items => 
          items.map(item => 
            item.productId === productId 
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
      }
    }
  };

  const removeFromCart = (productId: string) => {
    setCartItems(items => items.filter(item => item.productId !== productId));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalDiscount = cartItems.reduce((sum, item) => sum + (item.discount * item.quantity), 0);
  const tax = (subtotal - totalDiscount) * 0.15; // 15% tax
  const total = subtotal - totalDiscount + tax;

  const handleCheckout = async () => {
    if (cartItems.length === 0 || !user) return;

    try {
      await addOrder({
        items: cartItems,
        subtotal,
        tax,
        discount: totalDiscount,
        total,
        paymentMethod,
        cashierId: user.id,
        cashier: user,
        status: 'completed'
      });

      // Clear cart
      setCartItems([]);
      setSearchTerm('');
      setBarcodeInput('');
      
      alert('Order completed successfully!');
    } catch {
      alert('Failed to complete order');
    }
  };

  return (
    <div className="h-full flex gap-6">
      {/* Product Selection - Left Side */}
      <div className="flex-1 space-y-6">
        {/* Search and Barcode */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div className="relative">
              <Scan className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Scan barcode or enter manually..."
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyPress={handleBarcodeKeyPress}
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
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

        {/* Products Grid */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                {product.imageUrl && (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-24 object-cover rounded mb-2"
                  />
                )}
                <h3 className="font-medium text-sm">{product.name}</h3>
                <p className="text-xs text-gray-600">{product.brand}</p>
                <p className="text-lg font-bold text-purple-600">
                  Rs. {product.sellPrice.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Stock: {product.currentStock}</p>
              </button>
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No products found</p>
            </div>
          )}
        </div>
      </div>

      {/* Cart - Right Side */}
      <div className="w-96 bg-white rounded-lg shadow-sm border flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Cart ({cartItems.length})
          </h2>
        </div>

        {/* Cart Items */}
        <div className="flex-1 p-6 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Your cart is empty</p>
              <p className="text-sm">Add products to start an order</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.productId} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  {item.product.imageUrl && (
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate">{item.product.name}</h4>
                    <p className="text-xs text-gray-600">{item.product.brand}</p>
                    <p className="text-sm font-semibold">Rs. {item.price.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Checkout Section */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t">
            {/* Payment Method */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Payment Method</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`flex-1 flex items-center justify-center p-2 rounded ${
                    paymentMethod === 'cash'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Banknote size={16} className="mr-1" />
                  Cash
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 flex items-center justify-center p-2 rounded ${
                    paymentMethod === 'card'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <CreditCard size={16} className="mr-1" />
                  Card
                </button>
                <button
                  onClick={() => setPaymentMethod('split')}
                  className={`flex-1 flex items-center justify-center p-2 rounded ${
                    paymentMethod === 'split'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Split size={16} className="mr-1" />
                  Split
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (15%):</span>
                <span>Rs. {tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Discount:</span>
                <span>Rs. {totalDiscount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Complete Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default POS;