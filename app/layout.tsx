import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from './components/ThemeProvider'
import ServiceWorkerRegister from './components/ServiceWorkerRegister'

export const metadata: Metadata = {
  title: 'NotaClínica',
  description: 'IA para médicos que quieren enfocarse en sus pacientes, no en el papeleo',
}

// Runs before paint to set data-theme + theme-color, avoiding a flash of
// the wrong theme on load (especially important inside the Capacitor webview).
const themeInitScript = `
(function(){
  try {
    var path = window.location.pathname;
    var t = localStorage.getItem('theme') || 'system';
    // Las páginas públicas de marketing son siempre claras; el modo oscuro queda para la app.
    var lightOnly = path === '/' || path.indexOf('/promo') === 0;
    var dark = lightOnly ? false : (t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches));
    var d = document.documentElement;
    d.dataset.theme = dark ? 'dark' : 'light';
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', dark ? '#0F172A' : '#2563EB');
    if (window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform()) {
      d.classList.add('native');
    }
  } catch (e) {}
})();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" style={{ overflowX: 'hidden' }}>
      <head>
        <meta name="google-site-verification" content="7g9IbVDFemLPuNlQwek2nNAaxMtah7f6jOCac3LIiY0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563EB" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="NotaClínica" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        {/* Placed after the theme-color meta so the script can update it. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body style={{ overflowX: 'hidden', maxWidth: '100vw' }}>
        <ThemeProvider>{children}</ThemeProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}