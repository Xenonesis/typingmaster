import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext'

// Add preloading for critical resources
const addPreloadLinks = () => {
  const fontLinks = [
    '/fonts/font.woff2', // Update with actual font paths if available
  ];

  fontLinks.forEach(href => {
    if (document.querySelector(`link[href="${href}"]`)) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Execute preloading
if (typeof window !== 'undefined') {
  addPreloadLinks();
}

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
); 