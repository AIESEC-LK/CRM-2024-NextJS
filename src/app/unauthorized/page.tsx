import Link from 'next/link'
import { Button } from '../components/ui/button'

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-[#1c2536] flex flex-col">
      {/* Header matching the original design */}
      {/* <header className="bg-[#1c2536] border-b border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white w-8 h-8 rounded flex items-center justify-center text-lg font-bold">
              A
            </div>
            <h1 className="text-white text-xl font-medium">AIESEC Sri Lanka Partners CRM</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-yellow-500 text-[#1c2536] w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold">
              Y
            </div>
            <span className="text-white">Yasanjith Rajapathirane</span>
            <Button variant="destructive" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </header> */}

      {/* Unauthorized Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <h2 className="text-3xl font-bold text-[#1c2536] mb-4">Unauthorized Access</h2>
          <p className="text-gray-600 mb-6">
            Sorry, you don't have permission to access the CRM of AIESEC Sri Lanka. Please log in with appropriate credentials or contact your MCVP.
          </p>
          <div className="flex flex-col space-y-4">
            {/* <Button
              asChild
              className="bg-[#ff7b7b] hover:bg-[#ff6b6b] text-white font-medium"
            >
              <Link href="/login">
                Log In
              </Link>
            </Button> */}
             <Button
              variant="outline"
              className="border-[#1c2536] text-[#1c2536] hover:bg-[#1c2536] hover:text-white"
              asChild
            >
              <Link href="/">Go to Dashboard</Link>
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

