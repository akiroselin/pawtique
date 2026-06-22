import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PawTique · 为每一只宠物定制独一无二的纪念',
  description: '欧洲高端宠物纪念品定制平台 · 实时互动配置 · 手工艺人作品',
  keywords: ['宠物纪念', 'pet memorial', '定制肖像', '羊毛毡', '3D打印', '手工艺品'],
  authors: [{ name: 'PawTique Studio' }],
  openGraph: {
    title: 'PawTique · Pet Memorial Studio',
    description: '为每一只宠物定制独一无二的纪念',
    type: 'website',
    locale: 'en_GB',
  },
};

export const viewport: Viewport = {
  themeColor: '#FFD84D',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Caveat:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-cream text-ink min-h-screen">{children}</body>
    </html>
  );
}