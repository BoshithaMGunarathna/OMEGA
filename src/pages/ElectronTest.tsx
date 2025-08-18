import React, { useState, useEffect } from 'react';

// Define the UpdateStatus type for the merged interface
type UpdateStatus = {
    type: 'checking' | 'available' | 'downloading' | 'downloaded' | 'not-available' | 'error';
    message: string;
    version?: string;
    progress?: number;
    error?: string;
};

// Merged Window interface declaration that includes ALL electronAPI methods
declare global {
  interface Window {
    electronAPI?: {
      // Hardware/POS methods (original methods from this file)
      scanBarcode: () => Promise<string>;
      printReceipt: (data: { items: string[]; total: string }) => Promise<void>;
      openCashDrawer: () => Promise<void>;
      
      // Update-related methods (from UpdateNotification component)
      onUpdateStatus: (callback: (status: UpdateStatus) => void) => void;
      removeUpdateStatusListener: () => void;
      checkForUpdates: () => Promise<void>;
      downloadUpdate: () => Promise<void>;
      restartAndInstall: () => Promise<void>;
    };
    electronTest?: {
      ping: () => string;
    };
  }
}

const ElectronTest = () => {
  const [isElectron, setIsElectron] = useState(false);
  const [apiTest, setApiTest] = useState('');
  const [scanResult, setScanResult] = useState('');

  useEffect(() => {
    // Check if running in Electron
    if (window.electronAPI) {
      setIsElectron(true);
      // Test the API
      if (window.electronTest) {
        setApiTest(window.electronTest.ping());
      }
    }
  }, []);

  const handleScanBarcode = async () => {
    if (window.electronAPI) {
      try {
        const result = await window.electronAPI.scanBarcode();
        setScanResult(result);
      } catch (error) {
        console.error('Barcode scan error:', error);
        setScanResult('Error: ' + (error instanceof Error ? error.message : String(error)));
      }
    }
  };

  const handlePrintReceipt = async () => {
    if (window.electronAPI) {
      try {
        const result = await window.electronAPI.printReceipt({
          items: ['Test Item 1', 'Test Item 2'],
          total: '$29.99'
        });
        console.log('Print result:', result);
      } catch (error) {
        console.error('Print error:', error);
      }
    }
  };

  const handleOpenDrawer = async () => {
    if (window.electronAPI) {
      try {
        const result = await window.electronAPI.openCashDrawer();
        console.log('Drawer result:', result);
      } catch (error) {
        console.error('Drawer error:', error);
      }
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Electron API Test</h2>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <p className="font-semibold">Environment:</p>
          <p className={isElectron ? 'text-green-600' : 'text-red-600'}>
            {isElectron ? '✅ Running in Electron' : '❌ Running in Browser'}
          </p>
          {apiTest && (
            <p className="text-sm text-gray-600">
              API Test: {apiTest}
            </p>
          )}
        </div>

        {isElectron && (
          <>
            <button
              onClick={handleScanBarcode}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Test Barcode Scanner
            </button>
            
            {scanResult && (
              <div className="p-2 bg-green-100 border border-green-300 rounded">
                <p className="text-green-800">Scan Result: {scanResult}</p>
              </div>
            )}

            <button
              onClick={handlePrintReceipt}
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Test Receipt Printer
            </button>

            <button
              onClick={handleOpenDrawer}
              className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Test Cash Drawer
            </button>
          </>
        )}

        <div className="text-xs text-gray-500">
          <p>Check browser console for detailed logs</p>
          <p>User Agent: {navigator.userAgent.includes('Electron') ? 'Electron' : 'Browser'}</p>
        </div>
      </div>
    </div>
  );
};

export default ElectronTest;