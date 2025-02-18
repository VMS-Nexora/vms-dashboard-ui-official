import { ConfigProvider } from 'antd';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ConfigProvider
      theme={{ token: { colorPrimary: '#646CFF', fontSize: 13 } }}>
      <App />
    </ConfigProvider>
  </BrowserRouter>
);
