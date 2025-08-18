import { useState, useEffect } from 'react';
import { 
  products as dummyProducts, 
  orders as dummyOrders, 
  stockMovements as dummyStockMovements,
  restockEvents as dummyRestockEvents,
  shifts as dummyShifts,
  salesMetrics as dummySalesMetrics,
  suppliers as dummySuppliers,
  users as dummyUsers
} from '../data/dummyData';
import { Product, Order, StockMovement, RestockEvent, Shift, SalesMetrics, Supplier, User } from '../types';

// This hook simulates API calls and will be replaced with real MongoDB calls later
export const useData = () => {
  const [products, setProducts] = useState<Product[]>(dummyProducts);
  const [orders, setOrders] = useState<Order[]>(dummyOrders);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(dummyStockMovements);
  const [restockEvents, setRestockEvents] = useState<RestockEvent[]>(dummyRestockEvents);
  const [shifts, setShifts] = useState<Shift[]>(dummyShifts);
  const [salesMetrics] = useState<SalesMetrics>(dummySalesMetrics);
  const [suppliers] = useState<Supplier[]>(dummySuppliers);
  const [users] = useState<User[]>(dummyUsers);

  // Products CRUD
  const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
    const newProduct = { ...product, id: Date.now().toString() };
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product | null> => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    return products.find(p => p.id === id) || null;
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    setProducts(prev => prev.filter(p => p.id !== id));
    return true;
  };

  // Orders
  const addOrder = async (order: Omit<Order, 'id' | 'timestamp'>): Promise<Order> => {
    const newOrder: Order = {
      ...order,
      id: `ORD-${Date.now()}`,
      timestamp: new Date()
    };
    setOrders(prev => [newOrder, ...prev]);
    
    // Update stock levels
    newOrder.items.forEach(item => {
      setProducts(prev => prev.map(p => 
        p.id === item.productId 
          ? { ...p, currentStock: p.currentStock - item.quantity }
          : p
      ));
      
      // Add stock movement
      const movement: StockMovement = {
        id: Date.now().toString() + Math.random(),
        productId: item.productId,
        quantity: -item.quantity,
        type: 'sale',
        reference: newOrder.id,
        timestamp: new Date(),
        actorId: order.cashierId,
        source: 'POS Sale'
      };
      setStockMovements(prev => [movement, ...prev]);
    });
    
    return newOrder;
  };

  // Restock
  const addRestockEvent = async (restock: Omit<RestockEvent, 'id' | 'timestamp'>): Promise<RestockEvent> => {
    const newRestock: RestockEvent = {
      ...restock,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setRestockEvents(prev => [newRestock, ...prev]);
    
    // Update stock level
    setProducts(prev => prev.map(p => 
      p.id === restock.productId 
        ? { ...p, currentStock: p.currentStock + restock.quantity, lastRestockDate: new Date() }
        : p
    ));
    
    // Add stock movement
    const movement: StockMovement = {
      id: Date.now().toString() + Math.random(),
      productId: restock.productId,
      quantity: restock.quantity,
      type: 'restock',
      reference: newRestock.id,
      timestamp: new Date(),
      actorId: '1', // Default to owner
      source: restock.type === 'supplier' ? 'Supplier Delivery' : 'Manual Restock',
      notes: restock.notes
    };
    setStockMovements(prev => [movement, ...prev]);
    
    return newRestock;
  };

  // Shifts
  const startShift = async (employeeId: string): Promise<Shift> => {
    const newShift: Shift = {
      id: Date.now().toString(),
      employeeId,
      employee: users.find(u => u.id === employeeId)!,
      startTime: new Date(),
      totalSales: 0,
      ordersCount: 0
    };
    setShifts(prev => [newShift, ...prev]);
    return newShift;
  };

  const endShift = async (shiftId: string): Promise<Shift | null> => {
    const shift = shifts.find(s => s.id === shiftId);
    if (!shift) return null;
    
    const updatedShift = { ...shift, endTime: new Date() };
    setShifts(prev => prev.map(s => s.id === shiftId ? updatedShift : s));
    return updatedShift;
  };

  return {
    // Data
    products,
    orders,
    stockMovements,
    restockEvents,
    shifts,
    salesMetrics,
    suppliers,
    users,
    
    // Methods
    addProduct,
    updateProduct,
    deleteProduct,
    addOrder,
    addRestockEvent,
    startShift,
    endShift
  };
};