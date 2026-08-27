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
              try {
                if (typeof window !== 'undefined') {
                  var origFetch = window.fetch;
                  try {
                    Object.defineProperty(window, 'fetch', {
                      value: origFetch,
                      writable: true,
                      configurable: true,
                      enumerable: true
                    });
                  } catch (err) {}

                  window.addEventListener('error', function(event) {
                    if (event && event.message && event.message.includes('fetch of #<Window>')) {
                      event.preventDefault();
                      event.stopPropagation();
                      return true;
                    }
                  }, true);
                }
              } catch (e) {}
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
