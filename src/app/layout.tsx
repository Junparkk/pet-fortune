import type { Metadata } from 'next'
import { Noto_Sans_KR, Geist } from 'next/font/google'
import './globals.css'
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-noto-sans-kr',
})

export const metadata: Metadata = {
  title: '오늘의 멍냥운세',
  description: '우리 강아지, 고양이 오늘의 운세를 확인해보세요!',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: '오늘의 멍냥운세',
    description: '우리 강아지, 고양이 오늘의 운세를 확인해보세요!',
    images: [{ url: '/logo.png', width: 600, height: 600 }],
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary',
    title: '오늘의 멍냥운세',
    description: '우리 강아지, 고양이 오늘의 운세를 확인해보세요!',
    images: ['/logo.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={cn("font-sans", geist.variable)}>
      <body className={`${notoSansKR.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
