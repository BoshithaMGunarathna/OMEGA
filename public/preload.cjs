const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload script starting...');

try {
  // Expose protected methods that allow the renderer process to use
  // the ipcRenderer without exposing the entire object
  contextBridge.exposeInMainWorld('electronAPI', {
    scanBarcode: () => ipcRenderer.invoke('scan-barcode'),
    printReceipt: (data) => ipcRenderer.invoke('print-receipt', data),
    openCashDrawer: () => ipcRenderer.invoke('open-cash-drawer'),
    
    // Debug function
    getAppInfo: () => ipcRenderer.invoke('get-app-info'),
    
    // Platform detection
    platform: process.platform,
    
    // Version info
    versions: {
      node: process.versions.node,
      chrome: process.versions.chrome,
      electron: process.versions.electron
    }
  });

  console.log('Preload script loaded successfully');
} catch (error) {
  console.error('Error in preload script:', error);
}