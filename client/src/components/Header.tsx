import React, { useState } from 'react';
import { Wifi, Edit2, Laptop, Smartphone, Tablet } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ThemeToggle } from './ThemeToggle';
import { DeviceNameModal } from './DeviceNameModal';

export const Header: React.FC = () => {
  const { deviceName, isConnected, currentDevice } = useApp();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const renderDeviceIcon = () => {
    if (!currentDevice) return <Laptop className="icon" />;
    switch (currentDevice.type) {
      case 'mobile':
        return <Smartphone className="icon" />;
      case 'tablet':
        return <Tablet className="icon" />;
      default:
        return <Laptop className="icon" />;
    }
  };

  return (
    <header className="app-header">
      <div className="logo-container">
        <div className="logo-icon-bg">
          <Wifi className="logo-icon" />
        </div>
        <div className="logo-text">
          <h1>NearFlux</h1>
          <span className="logo-tagline">Local Direct File Sharing</span>
        </div>
      </div>

      <div className="header-actions">
        <div className="connection-pill" title={isConnected ? 'Connected to local network' : 'Offline'}>
          <span className={`status-dot ${isConnected ? 'online' : 'offline'}`}></span>
          <span className="status-text">{isConnected ? 'Online' : 'Disconnected'}</span>
        </div>

        <button className="device-badge" onClick={() => setIsEditModalOpen(true)} title="Edit Device Name">
          {renderDeviceIcon()}
          <span className="device-name-text">{deviceName}</span>
          <Edit2 className="edit-icon" size={14} />
        </button>

        <ThemeToggle />
      </div>

      <DeviceNameModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
    </header>
  );
};