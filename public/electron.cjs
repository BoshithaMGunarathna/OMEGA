const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

// Configure auto-updater
autoUpdater.checkForUpdatesAndNotify();
autoUpdater.autoDownload = false; // Don't auto-download, ask user first
autoUpdater.autoInstallOnAppQuit = true;

// Auto-updater event handlers
autoUpdater.on('checking-for-update', () => {
  console.log('Checking for update...');
  if (mainWindow) {
    mainWindow.webContents.send('update-status', { 
      type: 'checking',
      message: 'Checking for updates...' 
    });
  }
});

autoUpdater.on('update-available', (info) => {
  console.log('Update available:', info);
  if (mainWindow) {
    mainWindow.webContents.send('update-status', { 
      type: 'available',
      message: `Update available: v${info.version}`,
      version: info.version,
      releaseNotes: info.releaseNotes
    });
  }
  
  // Show dialog asking user if they want to download
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Update Available',
    message: `A new version (v${info.version}) is available. Do you want to download it now?`,
    detail: 'The update will be downloaded in the background. You can continue using the app.',
    buttons: ['Download Now', 'Later'],
    defaultId: 0
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.downloadUpdate();
    }
  });
});

autoUpdater.on('update-not-available', (info) => {
  console.log('Update not available:', info);
  if (mainWindow) {
    mainWindow.webContents.send('update-status', { 
      type: 'not-available',
      message: 'You are running the latest version' 
    });
  }
});

autoUpdater.on('error', (err) => {
  console.log('Auto-updater error:', err);
  if (mainWindow) {
    mainWindow.webContents.send('update-status', { 
      type: 'error',
      message: 'Error checking for updates',
      error: err.message 
    });
  }
});

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  console.log(log_message);
  
  if (mainWindow) {
    mainWindow.webContents.send('update-status', { 
      type: 'downloading',
      message: `Downloading update... ${Math.round(progressObj.percent)}%`,
      progress: progressObj.percent
    });
  }
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('Update downloaded:', info);
  if (mainWindow) {
    mainWindow.webContents.send('update-status', { 
      type: 'downloaded',
      message: 'Update downloaded. Restart to apply.',
      version: info.version
    });
  }

  // Show dialog asking user to restart
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Update Ready',
    message: 'Update has been downloaded. Restart the application to apply the update.',
    buttons: ['Restart Now', 'Later'],
    defaultId: 0
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});

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
    // mainWindow.webContents.openDevTools();
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    console.log('Electron window loaded successfully');
    
    // Check for updates after window is shown (only in production)
    if (!isDev) {
      setTimeout(() => {
        autoUpdater.checkForUpdatesAndNotify();
      }, 3000); // Wait 3 seconds before checking
    }
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
    isDev: isDev,
    version: app.getVersion()
  };
});

// Auto-updater IPC handlers
ipcMain.handle('check-for-updates', async () => {
  if (!isDev) {
    return autoUpdater.checkForUpdates();
  }
  return { message: 'Updates disabled in development mode' };
});

ipcMain.handle('download-update', async () => {
  if (!isDev) {
    return autoUpdater.downloadUpdate();
  }
  return { message: 'Updates disabled in development mode' };
});

ipcMain.handle('restart-and-install', async () => {
  if (!isDev) {
    autoUpdater.quitAndInstall();
  }
  return { message: 'Updates disabled in development mode' };
});