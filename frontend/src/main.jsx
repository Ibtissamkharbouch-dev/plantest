import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { StudentProvider } from './context/StudentContext.jsx';
import { AdminProvider } from './context/AdminContext.jsx';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AdminProvider>
        <StudentProvider>
          <App />
        </StudentProvider>
      </AdminProvider>
    </BrowserRouter>
  </React.StrictMode>
);
