import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { LicenseInfo } from '@mui/x-license';

LicenseInfo.setLicenseKey('26cd17119418a8497fb23af31dc0ca52Tz1NVUktMTIzLEU9MzI1MzI3Mjk3MjUwMDAsUz1wcmVtaXVtLExNPXBlcnBldHVhbCxQVj1RMy0yMDI0LEtWPTI=');

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

