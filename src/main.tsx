import { ConfigProvider } from 'antd';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { TenantProvider } from './contexts/tenant/TenantProvider.tsx';
import './index.css';
import { VMSProvider } from './contexts/vms/VMSProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ConfigProvider
      theme={{ token: { colorPrimary: '#646CFF', fontSize: 14 } }}>
      <VMSProvider>
        <TenantProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </TenantProvider>
      </VMSProvider>
    </ConfigProvider>
  </BrowserRouter>
);
