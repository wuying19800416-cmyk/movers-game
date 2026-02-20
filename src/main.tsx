
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import './styles/mobile-scroll.css'
import App from './App.tsx'
// import { Test } from './Test'

import { ErrorBoundary } from './components/ErrorBoundary';



console.log('Main.tsx executing...');

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('Root element not found');

  console.log('Root element found, mounting React...');
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
  console.log('React failed to mount immediately if you see this? No, render is async-ish but setup is sync.');
} catch (e) {
  console.error('Fatal error during startup:', e);
  document.body.innerHTML += `<div style="color:red; background:white; padding:20px;">Startup Error: ${e}</div>`;
}
