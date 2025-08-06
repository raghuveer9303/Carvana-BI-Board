// Debug component to show API configuration
import React from 'react';

export const ApiConfigDebug: React.FC = () => {
  const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
  const isDev = import.meta.env.DEV;
  const mode = import.meta.env.MODE;
  
  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '10px', 
      right: '10px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px', 
      borderRadius: '4px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h4>API Config Debug</h4>
      <div>Base URL: <strong>{baseURL}</strong></div>
      <div>Full URL: <strong>{window.location.origin + baseURL}</strong></div>
      <div>Mode: <strong>{mode}</strong></div>
      <div>Is Dev: <strong>{isDev ? 'Yes' : 'No'}</strong></div>
      <div>Location: <strong>{window.location.href}</strong></div>
    </div>
  );
};

export default ApiConfigDebug;
