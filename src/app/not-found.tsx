import Link from 'next/link'
import { Button } from '../app/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#1c2536] flex flex-col">
     

      {/* 404 Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <h2 className="text-3xl font-bold text-[#1c2536] mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-6">
             Sorry, the page you are looking for doesn&#39;t exist or has been moved. Please check the URL or navigate back to the dashboard.
          </p>
          <div className="flex flex-col space-y-4">
            
            <Button
              variant="outline"
              className="border-[#1c2536] text-[#1c2536] hover:bg-[#1c2536] hover:text-white"
              asChild
            >
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1c2536] border-t border-gray-800 px-4 py-3 text-center text-white text-sm">
      <p>© AIESEC Sri Lanka 2024 - 2025</p>
    <p>Powered by The Dev Team of AIESEC Sri Lanka</p>
      </footer>
    </div>
  )
}

