// src/electron.d.ts
import { UpdateStatus } from './UpdateNotification';

declare global {
  interface Window {
    electronAPI?: {
      // Update-related methods
      onUpdateStatus: (callback: (status: UpdateStatus) => void) => void;
      removeUpdateStatusListener: () => void;
      checkForUpdates: () => Promise<void>;
      downloadUpdate: () => Promise<void>;
      restartAndInstall: () => Promise<void>;

      // POS-related methods
      scanBarcode: () => Promise<string>;
      printReceipt: (data: { items: string[]; total: string }) => Promise<void>;
      openCashDrawer: () => Promise<void>;
    };
  }
}