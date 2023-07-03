import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { LocalContextProvider } from './context/BodyContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <LocalContextProvider>
      <App />
    </LocalContextProvider>
  </React.StrictMode>
);

