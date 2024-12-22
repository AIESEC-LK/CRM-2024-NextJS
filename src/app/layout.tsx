import './globals.css';
 import './api_new/autonamation/update_cutomer_to_promoter.tsx';

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
      <body>{children}</body>
    </html>
  )
}