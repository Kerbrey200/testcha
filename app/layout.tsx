import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'СтройМенеджер 2026 — Қурилишни бошқариш ва таъминот тизими',
  description: 'Ўзбекистон қурилиш бошқармалари ва таъминот ташкилотлари учун ягона автоматлаштирилган тизим.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark bg-[#0F1115] text-white">
      <body suppressHydrationWarning className="bg-[#0F1115] text-white font-sans antialiased">{children}</body>
    </html>
  );
}
