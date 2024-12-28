import './globals.css';
import './api_new/autonamation/update_cutomer_to_promoter.tsx';
import './api_new/autonamation/delete_expired_prospects.tsx';
import './api_new/autonamation/move_pending_prospect_to_prospect.tsx';

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