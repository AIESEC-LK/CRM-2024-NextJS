'use client'

import { useState } from 'react'
import { Label } from '@/app/components/ui/label'
import { Input } from '@/app/components/ui/input'
import ProgressBar from '@/app/components/ui/progress'
import ListGroup from '@/app/components/ui/list_groups'
import ToastNotification from '@/app/components/ui/toast'
import styles from "./styles.module.css";

export default function AdminProspectView() {
  const [progressBar] = useState({
    text: 'Prospect',
    color: 'yellow',
    width: '30%',
  })

  return (
    <div className="container mx-auto pt-0">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">AIESEC Sri Lanka Partners CRM</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-yellow-500 rounded-full w-8 h-8 flex items-center justify-center text-white">
            Y
          </div>
          <span>Yasanjith Rajapathirane</span>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Kandy - Abhiru Bookshop Partnership</h2>
        <p className="text-gray-600">for Events</p>
        <div className="flex gap-4 mt-4">
          <button className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded">
            End Partnership
          </button>
          <button className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded">
            Delete Partnership
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="w-full bg-gray-100 rounded overflow-hidden shadow-lg p-4">
          <ProgressBar
            text={progressBar.text}
            color={progressBar.color}
            width={progressBar.width}
          />
        </div>

        <div className="w-full bg-gray-100 rounded overflow-hidden shadow-lg">
          <div className="px-14 py-14">
            <h3 className="text-2xl font-bold mb-6 ml-4">Active Stage - Prospect</h3>
            <ToastNotification
              message="Due date to go to the lead stage - 2024-11-26"
              onClose={() => {}}
            />
          </div>
        </div>

        <div className="w-full bg-gray-100 rounded overflow-hidden shadow-lg">
          <div className="px-14 py-14">
            <h3 className="text-2xl font-bold mb-6 ml-4">Overwrite Product of The Partnership</h3>
            <select className="w-full ml-4 mt-5 mb-4">
              <option value="">Select a Product</option>
            </select>
            <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded ml-4">
              SWAP PRODUCT
            </button>
          </div>
        </div>

        <div className="w-full bg-gray-100 rounded overflow-hidden shadow-lg">
          <div className="px-14 py-14">
            <h3 className="text-2xl font-bold mb-6 ml-4">Overwrite Partnership Details</h3>
            <div className="grid grid-cols-2 gap-4 pl-4 pr-4">
              <div>
                <Label htmlFor="prospect-due">Prospect Due Date</Label>
                <Input
                  id="prospect-due"
                  type="date"
                  defaultValue="2024-11-26"
                  className={`w-full mt-5 ${styles.mr4} mb-4`}
                />
              </div>
              <div>
                <Label htmlFor="prospect-final">Prospect Final Due Date</Label>
                <Input
                  id="prospect-final"
                  type="date"
                  defaultValue="2024-11-27"
                  className={`w-full mt-5 ${styles.mr4} mb-4`}
                />
              </div>
              <div>
                <Label htmlFor="lead-due">Lead Due Date</Label>
                <Input
                  id="lead-due"
                  type="date"
                  defaultValue="2024-12-27"
                  className={`w-full mt-5 ${styles.mr4} mb-4`}
                />
              </div>
              <div>
                <Label htmlFor="lead-final">Lead Final Due Date</Label>
                <Input
                  id="lead-final"
                  type="date"
                  defaultValue="2024-12-28"
                  className={`w-full mt-5 ${styles.mr4} mb-4`}
                />
              </div>
            </div>
            <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded ml-4 mt-4">
              OVERWRITE DATES
            </button>
          </div>
        </div>
      </div>

      {/* <div className="text-center text-gray-600 mt-8">
        <p>© AIESEC Sri Lanka 2019 - 2022</p>
        <p>Powered by TheAITeam</p>
      </div> */}
    </div>
  )
}

