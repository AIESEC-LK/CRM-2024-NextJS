import './globals.css';
import { AuthProvider } from "@/app/context/AuthContext";
import Script from 'next/script';
import { startCustomerToPromoterCron } from "@/utils/cron/updateCustomerToPromoter";

startCustomerToPromoterCron();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>AIESEC - Partner CRM</title>
      </head>
      <body>
        <AuthProvider>
          {children}
          </AuthProvider>
          <Script src="https://kit.fontawesome.com/d718882eec.js" crossOrigin="anonymous" strategy="lazyOnload" />
      </body>
    </html>
  )
}