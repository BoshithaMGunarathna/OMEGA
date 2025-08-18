import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, AlertCircle, CheckCircle, X } from 'lucide-react';

// Define the type locally (the global declaration is now in ElectronTest.tsx)
type UpdateStatus = {
    type: 'checking' | 'available' | 'downloading' | 'downloaded' | 'not-available' | 'error';
    message: string;
    version?: string;
    progress?: number;
    error?: string;
};

// Remove the declare global block - it's now in ElectronTest.tsx

const UpdateNotification: React.FC = () => {
    const [updateStatus, setUpdateStatus] = useState<UpdateStatus | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        // Listen for update status from main process
        if (window.electronAPI) {
            window.electronAPI.onUpdateStatus((status: UpdateStatus) => {
                setUpdateStatus(status);
                setIsVisible(true);
                setIsChecking(false);
            });

            return () => {
                window.electronAPI?.removeUpdateStatusListener();
            };
        }
    }, []);

    const handleCheckForUpdates = async () => {
        if (!window.electronAPI) return;

        setIsChecking(true);
        setIsVisible(true);
        setUpdateStatus({ type: 'checking', message: 'Checking for updates...' });

        try {
            await window.electronAPI.checkForUpdates();
        } catch (error) {
            setUpdateStatus({
                type: 'error',
                message: 'Failed to check for updates',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            setIsChecking(false);
        }
    };

    const handleDownloadUpdate = async () => {
        if (!window.electronAPI) return;

        try {
            await window.electronAPI.downloadUpdate();
        } catch (error) {
            setUpdateStatus({
                type: 'error',
                message: 'Failed to download update',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    const handleRestartAndInstall = async () => {
        if (!window.electronAPI) return;

        try {
            await window.electronAPI.restartAndInstall();
        } catch (error) {
            console.error('Failed to restart and install:', error);
        }
    };

    const dismissNotification = () => {
        setIsVisible(false);
        setTimeout(() => setUpdateStatus(null), 300);
    };

    const getStatusIcon = () => {
        if (!updateStatus) return null;

        switch (updateStatus.type) {
            case 'checking':
                return <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />;
            case 'available':
                return <Download className="w-5 h-5 text-green-500" />;
            case 'downloading':
                return <Download className="w-5 h-5 animate-pulse text-blue-500" />;
            case 'downloaded':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'not-available':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'error':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            default:
                return null;
        }
    };

    const getStatusColor = () => {
        if (!updateStatus) return 'bg-gray-100';

        switch (updateStatus.type) {
            case 'checking':
            case 'downloading':
                return 'bg-blue-50 border-blue-200';
            case 'available':
            case 'downloaded':
                return 'bg-green-50 border-green-200';
            case 'not-available':
                return 'bg-green-50 border-green-200';
            case 'error':
                return 'bg-red-50 border-red-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50">
            {/* Manual Check Button */}
            <div className="mb-2">
                <button
                    onClick={handleCheckForUpdates}
                    disabled={isChecking}
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                    <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
                    {isChecking ? 'Checking...' : 'Check for Updates'}
                </button>
            </div>

            {/* Update Notification */}
            {isVisible && updateStatus && (
                <div className={`
          transform transition-all duration-300 ease-in-out
          ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
          max-w-sm w-full bg-white rounded-lg shadow-lg border-2 ${getStatusColor()}
        `}>
                    <div className="p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                                {getStatusIcon()}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">
                                    {updateStatus.message}
                                </p>

                                {updateStatus.version && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Version: {updateStatus.version}
                                    </p>
                                )}

                                {updateStatus.progress !== undefined && (
                                    <div className="mt-2">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${updateStatus.progress}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {Math.round(updateStatus.progress)}% complete
                                        </p>
                                    </div>
                                )}

                                {updateStatus.error && (
                                    <p className="text-xs text-red-600 mt-1">
                                        {updateStatus.error}
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={dismissNotification}
                                className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-3 flex gap-2">
                            {updateStatus.type === 'available' && (
                                <button
                                    onClick={handleDownloadUpdate}
                                    className="flex-1 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                                >
                                    Download Now
                                </button>
                            )}

                            {updateStatus.type === 'downloaded' && (
                                <button
                                    onClick={handleRestartAndInstall}
                                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Restart & Install
                                </button>
                            )}

                            {(updateStatus.type === 'not-available' || updateStatus.type === 'error') && (
                                <button
                                    onClick={dismissNotification}
                                    className="flex-1 px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors"
                                >
                                    OK
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateNotification;