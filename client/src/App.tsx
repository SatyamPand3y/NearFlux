import React from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { FileDropzone } from './components/FileDropzone';
import { FileList } from './components/FileList';
import { DeviceList } from './components/DeviceList';
import { TransferProgress } from './components/TransferProgress';
import { TransferRequestModal } from './components/TransferRequestModal';

const MainContent: React.FC = () => {
  return (
    <div className="app-container">
      <Header />
      <FileDropzone />
      <FileList />
      <DeviceList />
      <TransferRequestModal />
      <TransferProgress />
      <footer className="app-footer">
        NearFlux — Direct, Private Local Network Transfers
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;