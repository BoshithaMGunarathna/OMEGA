const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.cjs'),
      webSecurity: !isDev // Disable web security only in development
    },
    show: false,
    titleBarStyle: 'default'
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();    // Open DevTools in development
  } else {
    const indexPath = path.join(__dirname, '../dist/index.html');// In production, load the built React app
    console.log('Loading production build from:', indexPath);
    mainWindow.loadFile(indexPath);
    
    // Optional: Open DevTools in production for debugging
    // Remove this line for final release
    mainWindow.webContents.openDevTools();
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    console.log('Electron window loaded successfully');
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle navigation errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.log('Failed to load:', errorCode, errorDescription, validatedURL);
    
    // In production, try alternative paths
    if (!isDev && errorCode === -6) { // FILE_NOT_FOUND
      console.log('Trying alternative path...');
      const altPath = path.join(__dirname, 'dist/index.html');
      console.log('Alternative path:', altPath);
      mainWindow.loadFile(altPath);
    }
    
    // Try to reload after a delay if it's a network error in development
    if (isDev && (errorCode === -102 || errorCode === -105)) {
      setTimeout(() => {
        console.log('Retrying to load...');
        mainWindow.loadURL('http://localhost:5173');
      }, 2000);
    }
  });

  // Log when page finishes loading
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Page finished loading');
  });

  // Log console messages from renderer
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`Renderer console [${level}]:`, message);
  });

  // Handle certificate errors (for development)
  mainWindow.webContents.on('certificate-error', (event, url, error, certificate, callback) => {
    if (isDev) {
      event.preventDefault();
      callback(true);
    } else {
      callback(false);
    }
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  console.log('Electron app ready, creating window...');
  console.log('App path:', app.getAppPath());
  console.log('Resource path:', process.resourcesPath);
  console.log('Current working directory:', process.cwd());
  console.log('__dirname:', __dirname);
  
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
  });
});

// Handle app protocol for better routing in production
app.setAsDefaultProtocolClient('beautypos');

// IPC handlers for barcode scanner integration
ipcMain.handle('scan-barcode', async () => {
  console.log('Barcode scan requested');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('3614272049376'); // Sample barcode
    }, 1000);
  });
});

// Handle print receipt
ipcMain.handle('print-receipt', async (event, receiptData) => {
  console.log('Printing receipt:', receiptData);
  return { success: true };
});

// Handle cash drawer open
ipcMain.handle('open-cash-drawer', async () => {
  console.log('Opening cash drawer');
  return { success: true };
});

// Add debugging IPC handler
ipcMain.handle('get-app-info', async () => {
  return {
    appPath: app.getAppPath(),
    resourcesPath: process.resourcesPath,
    cwd: process.cwd(),
    dirname: __dirname,
    isDev: isDev
  };
});