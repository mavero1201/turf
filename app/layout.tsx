import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TURF MVP',
  description: 'Upload an Excel file and calculate TURF cumulative reach results.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
