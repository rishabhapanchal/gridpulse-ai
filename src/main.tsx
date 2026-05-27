import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App'; // Destructured match to bind flawlessly with named export
import './index.css'; // Global ambient layout architecture stylesheets

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
