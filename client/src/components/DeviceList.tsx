import React from 'react';
import { Radar, CheckSquare, Square } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DeviceCard } from './DeviceCard';
import { Device } from '../types/index.js';

export const DeviceList: React.FC = () => {
  const {
    nearbyDevices,
    selectedTargetDevices,
    toggleTargetDevice,
    selectAllTargetDevices,
    clearTargetDevices,
  } = useApp();

  const allSelected =
    nearbyDevices.length > 0 && selectedTargetDevices.length === nearbyDevices.length;

  const handleToggleSelectAll = () => {
    if (allSelected) {
      clearTargetDevices();
    } else {
      selectAllTargetDevices();
    }
  };

  return (
    <section className="section-card devices-section">
      <div className="section-header">
        <div>
          <h2>Nearby Devices</h2>
          <span className="subtitle">Select one or more devices to send files to</span>
        </div>
        {nearbyDevices.length > 0 && (
          <button className="btn text-btn" onClick={handleToggleSelectAll}>
            {allSelected ? <CheckSquare size={16} /> : <Square size={16} />}
            {allSelected ? 'Deselect All' : 'Select All'}
          </button>
        )}
      </div>

      {nearbyDevices.length === 0 ? (
        <div className="empty-state">
          <div className="radar-pulse">
            <Radar size={40} className="pulse-icon" />
          </div>
          <p className="empty-title">Searching for nearby devices...</p>
          <p className="empty-desc">
            Open <strong>NearFlux</strong> on other devices on the same Wi-Fi network.
          </p>
        </div>
      ) : (
        <div className="device-grid">
          {nearbyDevices.map((device: Device) => {
            const isSelected = selectedTargetDevices.some((d) => d.id === device.id);
            return (
              <DeviceCard
                key={device.id}
                device={device}
                isSelected={isSelected}
                onSelect={toggleTargetDevice}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};