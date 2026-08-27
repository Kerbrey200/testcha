import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'СтройМенеджер 2026 — Қурилишни бошқариш ва таъминот тизими',
  description: 'Ўзбекистон қурилиш бошқармалари ва таъминот ташкилотлари учун ягона автоматлаштирилган тизим.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="uz" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if (typeof window !== 'undefined') {
                    // Pre-emptively make fetch configurable if possible
                    var proto = window.constructor ? window.constructor.prototype : Object.getPrototypeOf(window);
                    if (proto) {
                      var desc = Object.getOwnPropertyDescriptor(proto, 'fetch');
                      if (desc && !desc.set && desc.configurable) {
                        var _fetch = desc.get ? desc.get.call(window) : window.fetch;
                        Object.defineProperty(proto, 'fetch', {
                          get: function() { return _fetch; },
                          set: function(v) { _fetch = v; },
                          configurable: true,
                          enumerable: true
                        });
                      }
                    }
                  }
                } catch(e) {}

                // Global suppression for extension injection error
                if (typeof window !== 'undefined') {
                  window.addEventListener('error', function(e) {
                    if (e && (
                      (e.message && (e.message.indexOf('fetch') !== -1 || e.message.indexOf('Window') !== -1)) ||
                      (e.error && e.error.message && (e.error.message.indexOf('fetch') !== -1 || e.error.message.indexOf('Window') !== -1))
                    )) {
                      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                      if (e.stopPropagation) e.stopPropagation();
                      if (e.preventDefault) e.preventDefault();
                      return true;
                    }
                  }, true);

                  window.addEventListener('unhandledrejection', function(e) {
                    if (e && e.reason && e.reason.message && e.reason.message.indexOf('fetch') !== -1) {
                      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                      if (e.preventDefault) e.preventDefault();
                    }
                  }, true);
                }
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
