import './bootstrap';
import '../css/app.css';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
const appName = 'LMS';
createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
  setup({ el, App, props }) {
    const root = createRoot(el);
    root.render(
      <ThemeProvider>
        <ToastProvider>
          <App {...props} />
        </ToastProvider>
      </ThemeProvider>
    );
  },
  progress: {
    color: '#000000',
  },
})