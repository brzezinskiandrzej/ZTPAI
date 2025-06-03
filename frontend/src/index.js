import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from "./context/AuthContext"; 
import SessionIndicator from "./components/SessionIndicator";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <SessionIndicator /> 
    </AuthProvider>
    
  </React.StrictMode>
);


reportWebVitals();
