import { Product, User, Order, StockMovement, Supplier, RestockEvent, Shift, SalesMetrics } from '../types';

// Users
export const users: User[] = [
  {
    id: '1',
    name: 'Sarah Williams',
    email: 'sarah@beautypos.com',
    role: 'Owner',
    lastLogin: new Date('2025-01-02T10:30:00')
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael@beautypos.com',
    role: 'Manager',
    lastLogin: new Date('2025-01-02T09:15:00')
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    email: 'emma@beautypos.com',
    role: 'Cashier',
    lastLogin: new Date('2025-01-02T08:45:00')
  }
];

// Suppliers
export const suppliers: Supplier[] = [
  {
    id: '1',
    name: 'Beauty Wholesale Ltd',
    contact: '+94 11 234 5678',
    email: 'orders@beautywholesale.lk',
    notes: 'Main supplier for international brands'
  },
  {
    id: '2',
    name: 'Local Cosmetics Co',
    contact: '+94 77 123 4567',
    email: 'sales@localcosmetics.lk',
    notes: 'Local brands and organic products'
  },
  {
    id: '3',
    name: 'Premium Beauty Imports',
    contact: '+94 11 987 6543',
    email: 'info@premiumbeauty.lk',
    notes: 'High-end luxury products'
  }
];

// Products
export const products: Product[] = [
  {
    id: '1',
    sku: 'LOR-001',
    barcode: '3614272049376',
    name: "L'Oréal Paris True Match Foundation",
    brand: "L'Oréal",
    category: 'Foundation',
    costPrice: 2800,
    sellPrice: 3500,
    unit: 'bottle',
    minStock: 10,
    currentStock: 15,
    reorderPoint: 12,
    supplier: 'Beauty Wholesale Ltd',
    imageUrl: 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg',
    variants: ['Fair', 'Medium', 'Dark'],
    lastRestockDate: new Date('2024-12-15')
  },
  {
    id: '2',
    sku: 'MAC-001',
    barcode: '773602042104',
    name: 'MAC Ruby Woo Lipstick',
    brand: 'MAC',
    category: 'Lipstick',
    costPrice: 4200,
    sellPrice: 5500,
    unit: 'piece',
    minStock: 8,
    currentStock: 5,
    reorderPoint: 10,
    supplier: 'Premium Beauty Imports',
    imageUrl: 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg',
    lastRestockDate: new Date('2024-12-10')
  },
  {
    id: '3',
    sku: 'NYX-001',
    barcode: '800897832865',
    name: 'NYX Professional Makeup Setting Spray',
    brand: 'NYX',
    category: 'Setting Spray',
    costPrice: 1800,
    sellPrice: 2400,
    unit: 'bottle',
    minStock: 12,
    currentStock: 8,
    reorderPoint: 15,
    supplier: 'Beauty Wholesale Ltd',
    imageUrl: 'https://images.pexels.com/photos/3373725/pexels-photo-3373725.jpeg',
    lastRestockDate: new Date('2024-12-20')
  },
  {
    id: '4',
    sku: 'REV-001',
    barcode: '309975518085',
    name: 'Revlon ColorStay 24HR Foundation',
    brand: 'Revlon',
    category: 'Foundation',
    costPrice: 2200,
    sellPrice: 2900,
    unit: 'bottle',
    minStock: 15,
    currentStock: 22,
    reorderPoint: 18,
    supplier: 'Local Cosmetics Co',
    imageUrl: 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg',
    variants: ['Ivory', 'Buff', 'Sand'],
    lastRestockDate: new Date('2024-12-25')
  },
  {
    id: '5',
    sku: 'MAY-001',
    barcode: '041554433292',
    name: 'Maybelline Great Lash Mascara',
    brand: 'Maybelline',
    category: 'Mascara',
    costPrice: 1200,
    sellPrice: 1650,
    unit: 'tube',
    minStock: 20,
    currentStock: 18,
    reorderPoint: 25,
    supplier: 'Beauty Wholesale Ltd',
    imageUrl: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg',
    lastRestockDate: new Date('2025-01-01')
  },
  {
    id: '6',
    sku: 'CG-001',
    barcode: '022700025626',
    name: 'CoverGirl Clean Pressed Powder',
    brand: 'CoverGirl',
    category: 'Powder',
    costPrice: 1500,
    sellPrice: 2100,
    unit: 'compact',
    minStock: 10,
    currentStock: 7,
    reorderPoint: 12,
    supplier: 'Local Cosmetics Co',
    imageUrl: 'https://images.pexels.com/photos/3785104/pexels-photo-3785104.jpeg',
    lastRestockDate: new Date('2024-12-18')
  }
];

// Sample Orders
export const orders: Order[] = [
  {
    id: 'ORD-2025-001',
    items: [
      {
        productId: '1',
        product: products[0],
        quantity: 2,
        price: 3500,
        discount: 0
      },
      {
        productId: '5',
        product: products[4],
        quantity: 1,
        price: 1650,
        discount: 0
      }
    ],
    subtotal: 8650,
    tax: 1298,
    discount: 0,
    total: 9948,
    paymentMethod: 'card',
    cashierId: '3',
    cashier: users[2],
    timestamp: new Date('2025-01-02T14:30:00'),
    status: 'completed'
  },
  {
    id: 'ORD-2025-002',
    items: [
      {
        productId: '2',
        product: products[1],
        quantity: 1,
        price: 5500,
        discount: 275
      }
    ],
    subtotal: 5225,
    tax: 784,
    discount: 275,
    total: 6009,
    paymentMethod: 'cash',
    cashierId: '2',
    cashier: users[1],
    timestamp: new Date('2025-01-02T15:45:00'),
    status: 'completed'
  }
];

// Stock Movements
export const stockMovements: StockMovement[] = [
  {
    id: '1',
    productId: '1',
    quantity: -2,
    type: 'sale',
    reference: 'ORD-2025-001',
    timestamp: new Date('2025-01-02T14:30:00'),
    actorId: '3',
    source: 'POS Sale'
  },
  {
    id: '2',
    productId: '5',
    quantity: -1,
    type: 'sale',
    reference: 'ORD-2025-001',
    timestamp: new Date('2025-01-02T14:30:00'),
    actorId: '3',
    source: 'POS Sale'
  },
  {
    id: '3',
    productId: '1',
    quantity: 20,
    type: 'restock',
    reference: 'REST-001',
    timestamp: new Date('2024-12-15T10:00:00'),
    actorId: '1',
    source: 'Supplier Delivery',
    notes: 'Monthly restock from Beauty Wholesale'
  }
];

// Restock Events
export const restockEvents: RestockEvent[] = [
  {
    id: '1',
    productId: '1',
    product: products[0],
    quantity: 20,
    supplierId: '1',
    supplier: suppliers[0],
    timestamp: new Date('2024-12-15T10:00:00'),
    notes: 'Monthly delivery - all variants restocked',
    type: 'supplier'
  },
  {
    id: '2',
    productId: '4',
    product: products[3],
    quantity: 15,
    manualBy: 'Sarah Williams',
    timestamp: new Date('2024-12-25T16:30:00'),
    notes: 'Manual restock after Colombo trip',
    type: 'manual'
  },
  {
    id: '3',
    productId: '5',
    product: products[4],
    quantity: 25,
    supplierId: '1',
    supplier: suppliers[0],
    timestamp: new Date('2025-01-01T09:15:00'),
    notes: 'New year stock preparation',
    type: 'supplier'
  }
];

// Shifts
export const shifts: Shift[] = [
  {
    id: '1',
    employeeId: '3',
    employee: users[2],
    startTime: new Date('2025-01-02T08:00:00'),
    endTime: new Date('2025-01-02T16:00:00'),
    totalSales: 15750,
    ordersCount: 8
  },
  {
    id: '2',
    employeeId: '2',
    employee: users[1],
    startTime: new Date('2025-01-02T16:00:00'),
    // Current shift - no end time
    totalSales: 6500,
    ordersCount: 3
  }
];

// Analytics Data
export const salesMetrics: SalesMetrics = {
  totalSales: 125000,
  totalOrders: 245,
  averageOrderValue: 5102,
  topProducts: [
    {
      product: products[0],
      quantity: 45,
      revenue: 157500
    },
    {
      product: products[1],
      quantity: 32,
      revenue: 176000
    },
    {
      product: products[4],
      quantity: 78,
      revenue: 128700
    }
  ],
  salesByHour: [
    { hour: 8, sales: 5200, orders: 3 },
    { hour: 9, sales: 8400, orders: 5 },
    { hour: 10, sales: 12300, orders: 7 },
    { hour: 11, sales: 15600, orders: 9 },
    { hour: 12, sales: 18900, orders: 11 },
    { hour: 13, sales: 14200, orders: 8 },
    { hour: 14, sales: 16800, orders: 10 },
    { hour: 15, sales: 13500, orders: 8 },
    { hour: 16, sales: 11200, orders: 6 },
    { hour: 17, sales: 9800, orders: 5 }
  ],
  salesByDay: [
    { date: '2024-12-26', sales: 45000, orders: 25 },
    { date: '2024-12-27', sales: 52000, orders: 28 },
    { date: '2024-12-28', sales: 38000, orders: 22 },
    { date: '2024-12-29', sales: 41000, orders: 24 },
    { date: '2024-12-30', sales: 48000, orders: 27 },
    { date: '2024-12-31', sales: 62000, orders: 35 },
    { date: '2025-01-01', sales: 35000, orders: 20 },
    { date: '2025-01-02', sales: 28000, orders: 18 }
  ],
  forecastData: [
    {
      productId: '1',
      productName: "L'Oréal Paris True Match Foundation",
      predictedSales: 28,
      recommendedReorder: 25,
      confidence: 0.85
    },
    {
      productId: '2',
      productName: 'MAC Ruby Woo Lipstick',
      predictedSales: 15,
      recommendedReorder: 20,
      confidence: 0.78
    },
    {
      productId: '3',
      productName: 'NYX Professional Makeup Setting Spray',
      predictedSales: 22,
      recommendedReorder: 30,
      confidence: 0.82
    }
  ]
};