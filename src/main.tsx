import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ApiKeyGate } from './components/ApiKeyGate.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApiKeyGate>
      <App />
    </ApiKeyGate>
  </StrictMode>,
);
