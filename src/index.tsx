import React from 'react';
import ReactDOM from 'react-dom/client';
import { MetaMaskSDKProvider } from '@metamask/sdk-react';
import App from './App';
import './App.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <MetaMaskSDKProvider
      debug={false}
      sdkOptions={{
        dappMetadata: {
          name: "1zn0z DAO",
          url: window.location.href,
        },
        infuraAPIKey: process.env.REACT_APP_INFURA_PROJECT_ID || '',
      }}
    >
      <App />
    </MetaMaskSDKProvider>
  </React.StrictMode>
);
