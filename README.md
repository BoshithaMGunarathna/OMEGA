# BeautyPOS - Cosmetics Shop POS System

A comprehensive React + Electron point-of-sale system designed specifically for cosmetics shops, featuring offline capability, inventory management, and analytics.

## Features

### 🛍️ Point of Sale
- Fast product lookup by barcode or search
- Support for barcode scanners (keyboard-wedge mode ready)
- Add/remove items with quantity and discount management
- Multiple payment methods (cash, card, split)
- Real-time cart management with stock validation

### 📦 Inventory Management
- Complete product CRUD operations
- Stock level tracking with low-stock alerts
- Restock logging (manual and supplier deliveries)
- Category-based product organization
- Barcode-based product identification

### 📊 Analytics & Reporting
- Daily/monthly sales aggregation
- Sales trends by product, brand, and category
- Hourly sales patterns analysis
- Top-performing products tracking
- AI-powered sales forecasting (demo with dummy data)

### 👥 Employee Management
- Role-based access control (Owner, Manager, Cashier)
- Shift management with clock-in/out functionality
- Employee performance tracking
- Sales attribution by cashier

### 🏪 Multi-Role Support
- **Owner**: Full access to all features
- **Manager**: Product, inventory, and staff management
- **Cashier**: POS operations and order history

### 💾 Offline-First Design
- Local dummy data storage ready for MongoDB integration
- Designed for offline POS operations
- Easy API swap architecture for backend integration

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Desktop**: Electron for Windows packaging
- **Charts**: Recharts for analytics visualization
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Date Handling**: date-fns

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. For Electron development:
   ```bash
   npm run electron
   ```

### Building for Production

1. Build the web application:
   ```bash
   npm run build
   ```

2. Build Electron app:
   ```bash
   npm run dist
   ```

## Demo Users

The application includes demo users with different roles:

| Email | Role | Password |
|-------|------|----------|
| sarah@beautypos.com | Owner | password123 |
| michael@beautypos.com | Manager | password123 |
| emma@beautypos.com | Cashier | password123 |

## Architecture

### Data Layer
All data operations are handled through the `useData` hook located in `src/hooks/useData.ts`. This hook currently uses dummy data but is designed to easily swap to MongoDB API calls.

### Authentication
Authentication is managed through the `useAuth` hook in `src/hooks/useAuth.ts` with JWT-ready architecture.

### File Structure
```
src/
├── components/     # Reusable UI components
├── pages/         # Main application pages
├── hooks/         # Custom React hooks
├── data/          # Dummy data for development
├── types/         # TypeScript type definitions
└── App.tsx        # Main application component
```

## Barcode Scanner Integration

The system supports barcode scanners in keyboard-wedge mode:

1. **Keyboard Wedge Mode**: Scanners that act as keyboard input work out of the box
2. **Serial/USB Mode**: Ready for integration via Electron IPC (see `public/electron.js`)

### Recommended Scanner Models
- Honeywell Voyager 1200g
- Symbol LS2208
- Datalogic QuickScan Lite QW2100

## Hardware Integration

The system is prepared for additional hardware integration:

### Receipt Printers
- ESC/POS compatible printers
- Integration ready in `public/electron.js`

### Cash Drawers
- Standard RJ11/RJ12 cash drawers
- Command sending capability implemented

## Future Database Integration

The current dummy data structure is designed to easily integrate with MongoDB:

### Data Models
- **Users**: Employee/user management
- **Products**: Inventory items with full details
- **Orders**: Complete transaction records
- **StockMovements**: Inventory change tracking
- **RestockEvents**: Supplier and manual restocks
- **Shifts**: Employee time tracking

### API Integration Points
All database operations are centralized in the `useData` hook, making it easy to replace with actual API calls to your MongoDB backend.

## Development Guidelines

### Adding New Features
1. Create types in `src/types/index.ts`
2. Add dummy data in `src/data/dummyData.ts`
3. Implement data operations in `src/hooks/useData.ts`
4. Create UI components and pages

### Code Organization
- Keep components under 200 lines
- Use proper TypeScript types
- Follow the established file structure
- Maintain separation of concerns

## Production Deployment

### Windows Installer
The application can be packaged as a Windows installer:
```bash
npm run dist
```

This creates a `.exe` installer in the `electron-dist` folder.

### System Requirements
- Windows 10 or higher
- 4GB RAM minimum
- 500MB disk space

## Troubleshooting

### Common Issues

1. **Electron app won't start**: Ensure all dependencies are installed
2. **Barcode scanner not working**: Check if scanner is in keyboard-wedge mode
3. **Build fails**: Clear node_modules and reinstall dependencies

### Development Mode
Use `npm run electron` for development with hot reload and DevTools.

## Contributing

1. Follow the existing code style
2. Add proper TypeScript types
3. Update dummy data when adding new features
4. Test both web and Electron modes

## License

This project is licensed for demonstration purposes. Please ensure compliance with all dependencies' licenses for production use.

---

**Note**: This is a frontend-only implementation with dummy data. For production use, integrate with your preferred backend API and database solution.