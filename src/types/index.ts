export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Manager' | 'Cashier';
  lastLogin?: Date;
}

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  brand: string;
  category: string;
  costPrice: number;
  sellPrice: number;
  unit: string;
  minStock: number;
  currentStock: number;
  reorderPoint: number;
  supplier?: string;
  imageUrl?: string;
  variants?: string[];
  lastRestockDate?: Date;
}

export interface StockMovement {
  id: string;
  productId: string;
  quantity: number;
  type: 'sale' | 'restock' | 'adjustment' | 'return';
  reference?: string;
  timestamp: Date;
  actorId: string;
  source: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  discount: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  tax: number;
  discount: number;
  paymentMethod: 'cash' | 'card' | 'split';
  cashierId: string;
  cashier: User;
  timestamp: Date;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email?: string;
  notes?: string;
}

export interface RestockEvent {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  supplierId?: string;
  supplier?: Supplier;
  manualBy?: string;
  timestamp: Date;
  notes?: string;
  type: 'manual' | 'supplier' | 'transfer';
}

export interface Shift {
  id: string;
  employeeId: string;
  employee: User;
  startTime: Date;
  endTime?: Date;
  totalSales?: number;
  ordersCount?: number;
}

export interface SalesMetrics {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: Array<{
    product: Product;
    quantity: number;
    revenue: number;
  }>;
  salesByHour: Array<{
    hour: number;
    sales: number;
    orders: number;
  }>;
  salesByDay: Array<{
    date: string;
    sales: number;
    orders: number;
  }>;
  forecastData: Array<{
    productId: string;
    productName: string;
    predictedSales: number;
    recommendedReorder: number;
    confidence: number;
  }>;
}