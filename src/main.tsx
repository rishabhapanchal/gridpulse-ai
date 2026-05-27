import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App'; // Targets the root App.tsx sibling
import './index.css'; // Targets the root index.css sibling

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
