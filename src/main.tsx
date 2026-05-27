import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App'; // Rectified to use exact named module extraction
import './index.css'; // Global cinematic styling architecture line variables

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
