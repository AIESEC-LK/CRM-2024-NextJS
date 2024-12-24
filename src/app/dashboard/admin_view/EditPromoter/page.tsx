'use client'

import { useState } from 'react'
import { Label } from '@/app/components/ui/label'
import { Input } from '@/app/components/ui/input'
import ProgressBar from '@/app/components/ui/progress'
import ListGroup from '@/app/components/ui/list_groups'
import ToastNotification from '@/app/components/ui/toast'
import styles from "./styles.module.css"

export default function AdminEditPromoter() {
  const [progressBar] = useState({
    text: 'Promoter',
    color: 'green',
    width: '100%',
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded">
              A
            </div>
            <h1 className="text-xl font-medium">AIESEC Sri Lanka Partners CRM</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-yellow-500 rounded-full w-8 h-8 flex items-center justify-center text-white">
              Y
            </div>
            <span>Yasanjith Rajapathirane</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {/* Partnership Title */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-medium">Ruhuna - Cambridge College of British English - Horana Partnership</h2>
            <p className="text-sm text-muted-foreground">for IGTe</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded">
              Acc Management
            </button>
            <button className="bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 rounded">
              End Partnership
            </button>
            <button className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded">
              Delete Partnership
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-gray-100 rounded-lg shadow-lg p-4 mb-6">
          <ProgressBar
            text={progressBar.text}
            color={progressBar.color}
            width={progressBar.width}
          />
        </div>

        {/* Active Stage */}
        <div className="bg-gray-100 rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Active Stage - Promoter</h3>
          <ToastNotification
            message="Promoter stage end date- 2024-11-25"
            onClose={() => {}}
          />
        </div>

        {/* Product Selection */}
        <div className="bg-gray-100 rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Overwrite Product of The Partnership</h3>
          <select className="w-full p-2 border rounded mb-4">
            <option>Select a Product</option>
          </select>
          <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded">
            SWAP PRODUCT
          </button>
        </div>

        {/* Partnership Details */}
        <div className="bg-gray-100 rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Overwrite Partnership Details</h3>
          <select className="w-full p-2 border rounded mb-6">
            <option>Select An Stage</option>
          </select>
          <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded mb-6">
            OVERWRITE STAGE
          </button>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label>Prospect Due Date</Label>
              <Input
                type="date"
                defaultValue="2024-09-01"
                className={`w-full mt-2 ${styles.mr4}`}
              />
            </div>
            <div>
              <Label>Prospect Final Due Date</Label>
              <Input
                type="date"
                defaultValue="2024-09-02"
                className={`w-full mt-2 ${styles.mr4}`}
              />
            </div>
            <div>
              <Label>Lead Due Date</Label>
              <Input
                type="date"
                defaultValue="2024-10-02"
                className={`w-full mt-2 ${styles.mr4}`}
              />
            </div>
            <div>
              <Label>Lead Final Due Date</Label>
              <Input
                type="date"
                defaultValue="2024-10-03"
                className={`w-full mt-2 ${styles.mr4}`}
              />
            </div>
            <div>
              <Label>Promoter End Date</Label>
              <Input
                type="date"
                defaultValue="2024-11-25"
                className={`w-full mt-2 ${styles.mr4}`}
              />
            </div>
          </div>
          <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded mt-6">
            OVERWRITE DATES
          </button>
        </div>

        {/* Prospect Stage */}
        <div className="bg-gray-100 rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Prospect Stage</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label>Remark by entity members</Label>
              <p className="text-sm text-muted-foreground mt-2">Arranged a company meeting</p>
            </div>
            <div>
              <Label>Proof Document</Label>
              <img 
                src="/placeholder.svg?height=200&width=400" 
                alt="Chat Screenshot"
                className="mt-2 rounded-lg border"
              />
            </div>
          </div>
        </div>

        {/* Lead Stage */}
        <div className="bg-gray-100 rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Lead Stage</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label>MOU start date</Label>
              <p className="text-sm text-blue-500 mt-2">2024-07-28</p>
            </div>
            <div>
              <Label>MOU end date</Label>
              <p className="text-sm text-blue-500 mt-2">2025-07-27</p>
            </div>
          </div>
          
          <div className="mt-4">
            <Label>MOU</Label>
            <button className="flex items-center gap-2 mt-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded">
              <img src="/pdf_icon.png" alt="PDF" className="w-6 h-6" />
              VIEW PDF
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-6">
            <div>
              <Label>Category</Label>
              <p className="text-sm text-green-500 mt-2">Monetary</p>
              <p className="text-xs text-green-600">The submitted MOU is approved by an admin</p>
            </div>
            <div>
              <Label>Amount</Label>
              <p className="text-sm text-blue-500 mt-2">60000</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      {/* <footer className="text-center text-sm text-muted-foreground py-4 border-t">
        <p>© AIESEC Sri Lanka 2019 - 2022</p>
        <p>Powered by TheAITeam</p>
      </footer> */}
    </div>
  )
}

