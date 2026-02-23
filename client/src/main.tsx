import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { BondCalculatorProvider } from '@/context/BondCalculatorProvider';

import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BondCalculatorProvider>
      <App />
    </BondCalculatorProvider>
  </StrictMode>,
);
